import template from './uct-surrounding-text-preview.html.twig';
import './uct-surrounding-text-preview.scss';

let spacingRequest = null;

Shopware.Component.register('uct-surrounding-text-preview', {
    template,
    inject: ['systemConfigApiService'],
    props: {
        element: { type: Object, required: true },
        position: { type: String, required: true, validator: value => ['intro', 'outro'].includes(value) },
    },
    data() { return { spacing: 24 }; },
    computed: {
        sanitizedText() {
            const field = this.position === 'intro' ? 'uctIntroText' : 'uctOutroText';
            return this.$sanitize(this.element?.config?.[field]?.value || '');
        },
        hasText() {
            return Boolean(this.sanitizedText.replace(/<[^>]*>/g, '').replace(/&nbsp;|&#160;|\u00a0/g, '').trim())
                || /<img\b/i.test(this.sanitizedText);
        },
        spacingStyle() { return { '--uct-preview-text-spacing': this.spacing + 'px' }; },
    },
    created() {
        // Share concurrent requests from the intro/outro and other visible slots.
        if (!spacingRequest) {
            spacingRequest = this.systemConfigApiService.getValues('UltimateCmsTools.config')
                .catch(() => ({}))
                .finally(() => { spacingRequest = null; });
        }
        spacingRequest.then(values => {
            const raw = values['UltimateCmsTools.config.blockTextSpacing'];
            if (raw !== null && raw !== undefined && /^[0-9]+$/.test(String(raw))) {
                this.spacing = Math.min(Number(raw), 1000);
            }
        });
    },
});
