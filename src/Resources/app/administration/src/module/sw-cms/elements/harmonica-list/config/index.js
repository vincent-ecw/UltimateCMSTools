import template from './sw-cms-el-config-harmonica-list.html.twig';
import './sw-cms-el-config-harmonica-list.scss';

Shopware.Component.register('sw-cms-el-config-harmonica-list', {
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
                { value: 'clean', label: this.$tc('sw-cms.elements.ultimateCmsTools.harmonicaList.config.themes.clean') || this.$tc('sw-cms.elements.harmonicaList.config.themes.clean') },
                { value: 'boxed', label: this.$tc('sw-cms.elements.ultimateCmsTools.harmonicaList.config.themes.boxed') || this.$tc('sw-cms.elements.harmonicaList.config.themes.boxed') },
                { value: 'pill-block', label: this.$tc('sw-cms.elements.ultimateCmsTools.harmonicaList.config.themes.pillBlock') || this.$tc('sw-cms.elements.harmonicaList.config.themes.pillBlock') },
                { value: 'editorial-numbered', label: this.$tc('sw-cms.elements.ultimateCmsTools.harmonicaList.config.themes.editorialNumbered') || this.$tc('sw-cms.elements.harmonicaList.config.themes.editorialNumbered') },
                { value: 'accent-line', label: this.$tc('sw-cms.elements.ultimateCmsTools.harmonicaList.config.themes.accentLine') || this.$tc('sw-cms.elements.harmonicaList.config.themes.accentLine') }
            ];
        },

        items() {
            if (!this.element?.config?.items?.value) {
                if (this.element?.config?.items) {
                    this.element.config.items.value = [];
                }
            }
            return this.element?.config?.items?.value || [];
        }
    },

    watch: {
        'element.config.items.value': {
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
            this.initElementConfig('harmonica-list');
        },

        onChange() {
            this.$emit('element-update', this.element);
        },

        onAddItem() {
            if (!this.element.config.items) {
                this.element.config.items = { source: 'static', value: [] };
            }
            this.element.config.items.value.push({
                icon: '',
                title: '',
                content: ''
            });
            this.onChange();
        },

        onRemoveItem(index) {
            this.element.config.items.value.splice(index, 1);
            this.onChange();
        },

        async onImageUpload(item, { targetId }) {
            const mediaEntity = await this.mediaRepository.get(targetId);
            item.mediaId = mediaEntity.id;
            item.mediaUrl = mediaEntity.url;
            this.onChange();
        },

        onImageSelect(item, mediaEntity) {
            item.mediaId = mediaEntity[0].id;
            item.mediaUrl = mediaEntity[0].url;
            this.onChange();
        },

        onImageRemove(item) {
            item.mediaId = null;
            item.mediaUrl = null;
            this.onChange();
        }
    }
});
