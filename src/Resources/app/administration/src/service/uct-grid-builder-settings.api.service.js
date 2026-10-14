const { Application } = Shopware;
const { ApiService } = Shopware.Classes;

class UctGridBuilderSettingsApiService extends ApiService {
    constructor(httpClient, loginService) {
        super(httpClient, loginService, '_action/uct/grid-builder-settings');
    }

    getSettings() {
        return this.httpClient.get(this.apiEndpoint, { headers: this.getBasicHeaders() })
            .then(response => ApiService.handleResponse(response));
    }
}

Application.addServiceProvider('uctGridBuilderSettingsApiService', container => {
    const initContainer = Application.getContainer('init');
    return new UctGridBuilderSettingsApiService(initContainer.httpClient, container.loginService);
});

export default UctGridBuilderSettingsApiService;
