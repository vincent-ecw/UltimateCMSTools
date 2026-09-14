<?php declare(strict_types=1);

namespace VincentBourgonje\UltimateCmsTools\Twig;

use Twig\Extension\AbstractExtension;
use Twig\TwigFilter;

final class CmsSecurityExtension extends AbstractExtension
{
    public function getFilters(): array
    {
        return [
            new TwigFilter('uct_safe_url', self::safeUrl(...)),
            new TwigFilter('uct_css_length', self::safeCssLength(...)),
            new TwigFilter('uct_css_color', self::safeCssColor(...)),
            new TwigFilter('uct_css_url', self::safeCssUrl(...)),
            new TwigFilter('uct_bounded_int', self::boundedInt(...)),
        ];
    }

    public static function safeUrl(?string $value): string
    {
        $url = trim($value ?? '');
        if ($url === '' || preg_match('/[\x00-\x20\x7f\\\\]/', $url)) {
            return '';
        }

        if (str_starts_with($url, '//')) {
            $parts = parse_url('https:' . $url);
            return is_array($parts) && !empty($parts['host']) && !isset($parts['user']) && !isset($parts['pass']) ? $url : '';
        }

        if (preg_match('/^([a-z][a-z0-9+.-]*):/i', $url, $match)) {
            $scheme = strtolower($match[1]);
            if ($scheme === 'http' || $scheme === 'https') {
                $parts = parse_url($url);
                return is_array($parts) && !empty($parts['host']) && !isset($parts['user']) ? $url : '';
            }
            if ($scheme === 'mailto') {
                $address = explode('?', substr($url, 7), 2)[0];
                return filter_var($address, FILTER_VALIDATE_EMAIL) ? $url : '';
            }
            if ($scheme === 'tel') {
                return preg_match('/^\+?[0-9().-]+$/', substr($url, 4)) ? $url : '';
            }

            return '';
        }

        // A colon before the first path separator could be an obfuscated scheme.
        if (preg_match('/^[^\/?#]*:/', $url)) {
            return '';
        }

        return $url;
    }

    public static function safeCssLength(?string $value): string
    {
        $length = trim($value ?? '');
        if (!preg_match('/^([0-9]{1,4})(px|rem|vh|vw|%)?$/', $length, $match)) {
            return '';
        }

        $number = (int) $match[1];
        $unit = $match[2] ?? 'px';
        $maximum = match ($unit) {
            'px' => 2000,
            'rem' => 125,
            default => 100,
        };

        return $number <= $maximum ? $number . $unit : '';
    }

    public static function safeCssColor(?string $value): string
    {
        $color = trim($value ?? '');
        if (preg_match('/^#(?:[a-f0-9]{3}|[a-f0-9]{4}|[a-f0-9]{6}|[a-f0-9]{8})$/i', $color)) {
            return $color;
        }

        if (preg_match('/^rgba?\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})(?:\s*,\s*(?:0(?:\.[0-9]{1,3})?|1(?:\.0{1,3})?))?\s*\)$/i', $color, $matches)
            && (int) $matches[1] <= 255 && (int) $matches[2] <= 255 && (int) $matches[3] <= 255) {
            return $color;
        }

        return $color === 'transparent' ? $color : '';
    }

    public static function safeCssUrl(?string $value): string
    {
        $url = self::safeUrl($value);
        if ($url === '' || preg_match('/["\'();]/', $url)) {
            return '';
        }

        $scheme = parse_url($url, PHP_URL_SCHEME);
        return $scheme === null || (is_string($scheme) && in_array(strtolower($scheme), ['http', 'https'], true)) ? $url : '';
    }

    public static function boundedInt(mixed $value, int $minimum, int $maximum, int $fallback): int
    {
        if (!is_int($value) && (!is_string($value) || !preg_match('/^[0-9]{1,9}$/', $value))) {
            return $fallback;
        }

        return max($minimum, min($maximum, (int) $value));
    }
}
