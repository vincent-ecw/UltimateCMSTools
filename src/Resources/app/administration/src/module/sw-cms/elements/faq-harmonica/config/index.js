import template from './sw-cms-el-config-faq-harmonica.html.twig';
import './sw-cms-el-config-faq-harmonica.scss';

Shopware.Component.register('sw-cms-el-config-faq-harmonica', {
    template,

    mixins: [
        Shopware.Mixin.getByName('cms-element')
    ],

    data() {
        return {
        };
    },

    inject: ['repositoryFactory'],

    computed: {
        mediaRepository() {
            return this.repositoryFactory.create('media');
        }
    },

    watch: {
        'element.config.faqs.value': {
            handler() {
                this.$emit('element-update', this.element);
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

        onAddFaq() {
            this.element.config.faqs.value.push({
                icon: '',
                title: '',
                content: ''
            });
        },

        onRemoveFaq(index) {
            this.element.config.faqs.value.splice(index, 1);
        },

        async onImageUpload(faq, { targetId }) {
            const mediaEntity = await this.mediaRepository.get(targetId);
            faq.mediaId = mediaEntity.id;
            faq.mediaUrl = mediaEntity.url;
            this.$emit('element-update', this.element);
        },

        onImageSelect(faq, mediaEntity) {
            faq.mediaId = mediaEntity[0].id;
            faq.mediaUrl = mediaEntity[0].url;
            this.$emit('element-update', this.element);
        },

        onImageRemove(faq) {
            faq.mediaId = null;
            faq.mediaUrl = null;
            this.$emit('element-update', this.element);
        }
    }
});
