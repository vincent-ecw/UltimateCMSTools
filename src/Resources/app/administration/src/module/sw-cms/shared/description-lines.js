export default {
    descriptionLines: {
        get() {
            const value = Number(this.element.config?.descriptionLines?.value);
            return Number.isInteger(value) && value >= 1 && value <= 20 ? value : 3;
        },
        set(value) {
            const number = Number(value);
            this.element.config.descriptionLines = {
                source: 'static',
                value: Number.isInteger(number) && number >= 1 && number <= 20 ? number : 3
            };
            this.$emit('element-update', this.element);
        }
    }
};
