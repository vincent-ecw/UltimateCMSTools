<?php declare(strict_types=1);

namespace VincentBourgonje\UltimateCmsTools\Core;

final class GridColumnStyles
{
    /** Validate CSS values separately from Twig's HTML attribute escaping. */
    public function getStyles(mixed $config, ?string $resolvedMediaUrl = null): string
    {
        if (!\is_array($config)) {
            return '';
        }

        $styles = [];
        foreach (['padding' => 'padding', 'backgroundColor' => 'background-color'] as $key => $property) {
            $value = $config[$key] ?? null;
            if (!\is_string($value) || $value === '' || \strlen($value) > 256) {
                continue;
            }
            // Value tokens only: no declaration separators, URLs or CSS escapes.
            if (!preg_match('/^[a-zA-Z0-9#%.,() _+\-]+$/D', $value)
                || preg_match('/(?:url|expression|image-set)\s*\(/i', $value)) {
                continue;
            }
            $styles[] = $property . ': ' . $value . ';';
        }

        $mediaId = $config['backgroundMediaId'] ?? null;
        $url = $mediaId !== null && $mediaId !== ''
            ? $resolvedMediaUrl
            : ($config['backgroundMediaUrl'] ?? null);
        if (\is_string($url) && preg_match('~^(?:https?://|/(?!/))[^\s"\x27\\\\<>]+$~iD', $url)) {
            $mode = $config['backgroundMediaMode'] ?? 'cover';
            if (!\in_array($mode, ['cover', 'contain', 'auto'], true)) {
                $mode = 'cover';
            }
            $styles[] = 'background-image: url("' . $url . '");';
            $styles[] = 'background-size: ' . $mode . ';';
            $styles[] = 'background-position: center; background-repeat: no-repeat;';
        }

        return implode(' ', $styles);
    }
}
