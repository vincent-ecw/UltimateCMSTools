<?php declare(strict_types=1);

namespace VincentBourgonje\UltimateCmsTools\Command;

use Shopware\Core\Framework\Context;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use VincentBourgonje\UltimateCmsTools\Core\GridMigration;

#[AsCommand(name: 'uct:grid:migrate', description: 'Preview, apply or restore selected legacy/early UCT grid block type conversions.')]
final class GridMigrationCommand extends Command
{
    public function __construct(private readonly GridMigration $migration)
    {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this->addOption('page', null, InputOption::VALUE_REQUIRED | InputOption::VALUE_IS_ARRAY, 'CMS page UUID; repeat for multiple pages.')
            ->addOption('all', null, InputOption::VALUE_NONE, 'Explicitly select all live CMS pages.')
            ->addOption('uct-only', null, InputOption::VALUE_NONE, 'Only select blocks with UCT column styling/order or stacked slot evidence.')
            ->addOption('dry-run', null, InputOption::VALUE_NONE, 'Preview only (also the default).')
            ->addOption('apply', null, InputOption::VALUE_NONE, 'Write the previewed type conversions.')
            ->addOption('backup', null, InputOption::VALUE_REQUIRED, 'New JSON backup path; required with --apply, never overwritten.')
            ->addOption('restore', null, InputOption::VALUE_REQUIRED, 'Read a previous backup and preview reversing its type conversions.');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        try {
            if ($input->getOption('apply') && $input->getOption('dry-run')) {
                throw new \InvalidArgumentException('--apply and --dry-run cannot be combined.');
            }
            $context = Context::createDefaultContext();
            $restore = $input->getOption('restore');
            if ($restore !== null) {
                if ($input->getOption('page') !== [] || $input->getOption('all') || $input->getOption('uct-only')) {
                    throw new \InvalidArgumentException('--restore cannot be combined with selection options.');
                }
                if (!\is_string($restore) || !stream_is_local($restore) || !is_file($restore)) {
                    throw new \InvalidArgumentException('Restore requires a local JSON backup file.');
                }
                $contents = file_get_contents($restore);
                if ($contents === false) {
                    throw new \InvalidArgumentException('Could not read the backup.');
                }
                $snapshot = json_decode($contents, true, 512, JSON_THROW_ON_ERROR);
                if (!\is_array($snapshot)) {
                    throw new \InvalidArgumentException('Malformed backup.');
                }
                $plan = $this->migration->restorePlan($snapshot);
            } else {
                $plan = $this->migration->plan($input->getOption('page'), $input->getOption('all'), $input->getOption('uct-only'), $context);
            }
            $io->table(['Page', 'Block', 'From', 'To', 'Evidence'], array_map(static fn (array $change) => [
                $change['pageId'], $change['blockId'], $change['from'], $change['to'], $change['evidence'],
            ], $plan['changes']));
            if ($plan['skipped'] !== []) {
                $io->table(['Skipped block', 'Reason'], array_map(static fn (array $row) => array_values($row), $plan['skipped']));
            }
            if (!$input->getOption('apply')) {
                $io->success(\count($plan['changes']) . ' conversion(s) previewed. No data changed. Apply requires --apply --backup=<new-path>.');
                return self::SUCCESS;
            }
            if ($plan['changes'] === []) {
                $io->success('No blocks require conversion.');
                return self::SUCCESS;
            }
            $backup = $input->getOption('backup');
            if (!\is_string($backup) || $backup === '') {
                throw new \InvalidArgumentException('--apply requires --backup=<new-path>.');
            }
            if (!stream_is_local($backup) || str_contains($backup, '://')) {
                throw new \InvalidArgumentException('Backup must be a local filesystem path.');
            }
            $json = json_encode([
                'schemaVersion' => 1,
                'createdAt' => (new \DateTimeImmutable())->format(\DateTimeInterface::ATOM),
                'changes' => $plan['changes'],
            ], JSON_PRETTY_PRINT | JSON_THROW_ON_ERROR) . "\n";
            $file = @fopen($backup, 'x');
            if ($file === false) {
                throw new \RuntimeException('Backup cannot be created, or already exists. No data changed.');
            }
            try {
                chmod($backup, 0600);
                if (fwrite($file, $json) !== \strlen($json) || !fflush($file) || !fsync($file)) {
                    throw new \RuntimeException('Could not write the complete backup. No data changed.');
                }
            } finally {
                fclose($file);
            }
            $this->migration->apply($plan['changes'], $context);
            $io->success(\count($plan['changes']) . ' block type(s) converted. Content, slots, IDs and custom fields preserved. Backup: ' . $backup);
            $io->note('Clear Shopware cache after applying conversions.');
            return self::SUCCESS;
        } catch (\Throwable $error) {
            $io->error($error->getMessage());
            return self::FAILURE;
        }
    }
}
