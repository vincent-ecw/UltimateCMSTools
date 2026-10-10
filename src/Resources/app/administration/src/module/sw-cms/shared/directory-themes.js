export default {
        theme: {
            get() { return this.element.config?.theme?.value ?? 'classic'; },
            set(value) {
                this.element.config.theme = { source: 'static', value };
                this.onChange();
            }
        },
        themeOptions() {
            return ['classic', 'badge', 'basic', 'playful', 'modern'].map(value => ({
                value,
                label: this.$tc('sw-cms.elements.ultimateCmsTools.subcategoryThemes.' + value)
            }));
        },
};
