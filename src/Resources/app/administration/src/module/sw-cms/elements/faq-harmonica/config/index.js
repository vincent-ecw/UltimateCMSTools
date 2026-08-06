import template from './sw-cms-el-config-faq-harmonica.html.twig';
import './sw-cms-el-config-faq-harmonica.scss';

Shopware.Component.register('sw-cms-el-config-faq-harmonica', {
    template,

    mixins: [
        Shopware.Mixin.getByName('cms-element')
    ],

    data() {
        return {
            activeTab: 'content',
        };
    },

    inject: ['repositoryFactory'],

    computed: {
        mediaRepository() {
            return this.repositoryFactory.create('media');
        },

        theme: {
            get() {
                return this.element?.config?.theme?.value || 'clean';
            },
            set(value) {
                if (!this.element.config.theme) {
                    this.element.config.theme = { source: 'static', value: 'clean' };
                }
                this.element.config.theme.value = value;
                this.onChange();
            }
        },

        themeOptions() {
            return [
                { value: 'clean', label: this.$tc('sw-cms.elements.ultimateCmsTools.faqHarmonica.config.themes.clean') || this.$tc('sw-cms.elements.faqHarmonica.config.themes.clean') },
                { value: 'boxed', label: this.$tc('sw-cms.elements.ultimateCmsTools.faqHarmonica.config.themes.boxed') || this.$tc('sw-cms.elements.faqHarmonica.config.themes.boxed') },
                { value: 'pill-block', label: this.$tc('sw-cms.elements.ultimateCmsTools.faqHarmonica.config.themes.pillBlock') || this.$tc('sw-cms.elements.faqHarmonica.config.themes.pillBlock') },
                { value: 'editorial-numbered', label: this.$tc('sw-cms.elements.ultimateCmsTools.faqHarmonica.config.themes.editorialNumbered') || this.$tc('sw-cms.elements.faqHarmonica.config.themes.editorialNumbered') },
                { value: 'accent-line', label: this.$tc('sw-cms.elements.ultimateCmsTools.faqHarmonica.config.themes.accentLine') || this.$tc('sw-cms.elements.faqHarmonica.config.themes.accentLine') }
            ];
        }
    },

    watch: {
        'element.config.faqs.value': {
            handler() {
                this.onChange();
            },
            deep: true
        }
    },

    created() {
        this.createdComponent();
    },

    methods: {
        createdComponent() {
            this.initElementConfig('faq-harmonica');
        },

        onChange() {
            this.$emit('element-update', this.element);
        },

        onAddFaq() {
            this.element.config.faqs.value.push({
                icon: '',
                title: '',
                content: ''
            });
            this.onChange();
        },

        onRemoveFaq(index) {
            this.element.config.faqs.value.splice(index, 1);
            this.onChange();
        },

        async onImageUpload(faq, { targetId }) {
            const mediaEntity = await this.mediaRepository.get(targetId);
            faq.mediaId = mediaEntity.id;
            faq.mediaUrl = mediaEntity.url;
            this.onChange();
        },

        onImageSelect(faq, mediaEntity) {
            faq.mediaId = mediaEntity[0].id;
            faq.mediaUrl = mediaEntity[0].url;
            this.onChange();
        },

        onImageRemove(faq) {
            faq.mediaId = null;
            faq.mediaUrl = null;
            this.onChange();
        }
    }
});
