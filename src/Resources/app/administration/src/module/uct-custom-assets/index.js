import 'ace-builds/src-noconflict/ace';
import 'ace-builds/src-noconflict/mode-css';
import 'ace-builds/src-noconflict/mode-javascript';
import template from './uct-custom-assets.html.twig';

Shopware.Component.register('uct-custom-assets', {
    template,
    inject: ['repositoryFactory', 'acl'],
    mixins: [Shopware.Mixin.getByName('notification')],
    data() {
        return { channels: [], selected: [], source: null, css: '', js: '', busy: false, loaded: false };
    },
    computed: {
        options() {
            return this.channels.map(channel => ({ value: channel.id, label: channel.translated?.name || channel.name }));
        },
        canSave() {
            return this.loaded && this.selected.length && !this.busy && this.acl.isAdmin();
        },
    },
    async created() {
        if (!this.acl.isAdmin()) return;
        const criteria = new Shopware.Data.Criteria(1, 100);
        criteria.addFilter(Shopware.Data.Criteria.equals('typeId', Shopware.Defaults.storefrontSalesChannelTypeId));
        try {
            this.channels = await this.repositoryFactory.create('sales_channel').search(criteria, Shopware.Context.api);
        } catch (error) {
            this.createNotificationError({ message: this.$tc('uct-custom-assets.error') });
        }
    },
    methods: {
        client() {
            return Shopware.Application.getContainer('init').httpClient;
        },
        headers() {
            return { Authorization: `Bearer ${Shopware.Service('loginService').getToken()}` };
        },
        async load(id) {
            if (!this.acl.isAdmin()) return;
            this.loaded = false;
            if (!id) return;
            this.busy = true;
            try {
                const response = await this.client().get(`_action/uct/custom-assets/${id}`, { headers: this.headers() });
                this.css = response.data.css || '';
                this.js = response.data.js || '';
                this.selected = [id];
                this.loaded = true;
            } catch (error) {
                this.createNotificationError({ message: this.$tc('uct-custom-assets.error') });
            } finally {
                this.busy = false;
            }
        },
        async save() {
            if (!this.canSave) return;
            this.busy = true;
            try {
                await this.client().post('_action/uct/custom-assets', {
                    salesChannelIds: this.selected, css: this.css, js: this.js,
                }, { headers: this.headers() });
                this.createNotificationSuccess({ message: this.$tc('uct-custom-assets.success') });
            } catch (error) {
                this.createNotificationError({ message: this.$tc('uct-custom-assets.error') });
            } finally {
                this.busy = false;
            }
        },
    },
});

Shopware.Module.register('uct-custom-assets', {
    type: 'plugin', name: 'Custom CSS + JS', title: 'uct-custom-assets.title', icon: 'regular-code',
    routes: { index: { component: 'uct-custom-assets', path: 'index', meta: { privilege: 'admin' } } },
    navigation: [{ id: 'uct-custom-assets', label: 'uct-custom-assets.title', path: 'uct.custom.assets.index',
        parent: 'sw-content', position: 40, privilege: 'admin' }],
});
