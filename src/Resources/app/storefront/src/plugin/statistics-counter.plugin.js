import Plugin from 'src/plugin-system/plugin.class';

export default class StatisticsCounterPlugin extends Plugin {
    static options = {
        duration: 1800,
    };

    init() {
        this.numberElements = this.el.querySelectorAll('.js-statistics-number');
        if (!this.numberElements.length) {
            return;
        }

        this._registerObserver();
    }

    _registerObserver() {
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries, obs) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        this._startAnimation();
                        obs.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.2,
            });

            observer.observe(this.el);
        } else {
            this._startAnimation();
        }
    }

    _startAnimation() {
        this.numberElements.forEach((el) => {
            const rawTarget = el.getAttribute('data-target-number') || el.innerText || '';
            const parsed = this._parseFormattedNumber(rawTarget);

            if (!parsed) {
                return;
            }

            this._animateNumber(el, parsed);
        });
    }

    _animateNumber(element, parsed) {
        const startTime = performance.now();
        const duration = this.options.duration;
        const targetVal = parsed.targetVal;

        const step = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const currentVal = targetVal * easeProgress;

            element.innerText = this._formatValue(currentVal, parsed);

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                element.innerText = this._formatValue(targetVal, parsed);
            }
        };

        requestAnimationFrame(step);
    }

    _parseFormattedNumber(str) {
        if (!str || typeof str !== 'string') {
            return null;
        }

        const trimmed = str.trim();
        const match = trimmed.match(/^([^0-9.-]*)([0-9.,\s]+)(.*)$/);
        if (!match) {
            return null;
        }

        const prefix = match[1] || '';
        const rawNumber = match[2] || '';
        const suffix = match[3] || '';

        let decimalChar = '';
        let thousandChar = '';

        if (rawNumber.includes(',') && rawNumber.includes('.')) {
            if (rawNumber.lastIndexOf(',') > rawNumber.lastIndexOf('.')) {
                thousandChar = '.';
                decimalChar = ',';
            } else {
                thousandChar = ',';
                decimalChar = '.';
            }
        } else if (rawNumber.includes(',')) {
            const parts = rawNumber.split(',');
            if (parts.length === 2 && parts[1].length <= 2) {
                decimalChar = ',';
            } else {
                thousandChar = ',';
            }
        } else if (rawNumber.includes('.')) {
            const parts = rawNumber.split('.');
            if (parts.length === 2 && parts[1].length <= 2) {
                decimalChar = '.';
            } else {
                thousandChar = '.';
            }
        }

        let decimals = 0;
        if (decimalChar) {
            const decimalPart = rawNumber.substring(rawNumber.lastIndexOf(decimalChar) + 1);
            decimals = decimalPart.length;
        }

        let sanitized = rawNumber;
        if (thousandChar) {
            sanitized = sanitized.split(thousandChar).join('');
        }
        if (decimalChar && decimalChar !== '.') {
            sanitized = sanitized.replace(decimalChar, '.');
        }

        const targetVal = parseFloat(sanitized);
        if (isNaN(targetVal)) {
            return null;
        }

        return {
            prefix,
            suffix,
            targetVal,
            decimals,
            decimalChar: decimalChar || '.',
            thousandChar,
        };
    }

    _formatValue(val, parsed) {
        const { prefix, suffix, decimals, decimalChar, thousandChar } = parsed;

        let formattedNum = val.toFixed(decimals);
        if (decimalChar && decimalChar !== '.') {
            formattedNum = formattedNum.replace('.', decimalChar);
        }

        if (thousandChar) {
            const parts = formattedNum.split(decimalChar || '.');
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandChar);
            formattedNum = parts.join(decimalChar || '.');
        }

        return `${prefix}${formattedNum}${suffix}`;
    }
}
