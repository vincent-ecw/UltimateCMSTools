import template from './sw-cms-slot.html.twig';

const supportedElements = ["button","category-header","common-slider","cta","custom-carousel","custom-code","custom-product-carousel","faq-harmonica","flexible-image-text","harmonica-list","icon-list","image-text-quartet","magazine-quote","manufacturer-carousel","manufacturer-grid","related-products","responsive-image","statistics","subcategory-carousel","subcategory-grid","uct-alert","uct-single-product"];

Shopware.Component.override('sw-cms-slot', {
    template,
    computed: {
        uctHasSurroundingText() { return supportedElements.includes(this.element?.type); },
    },
});
