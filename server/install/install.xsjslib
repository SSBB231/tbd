$.import('timp.core.server.api', 'api');
const coreApi = $.timp.core.server.api.api;
const Installer = coreApi.Installer;
const util = coreApi.util;
const _this = this;

$.import('timp.tbd.server.install.objectActions', 'component');
$.import('timp.tbd.server.install.privileges', 'privileges');
$.import('timp.tbd.server.install.models', 'modelIndex');
const modelIndex = $.timp.tbd.server.install.models.modelIndex.models;

_this.metadata = {
    name: 'TBD',
    labelEnus: 'Tax Business Documents',
    labelPtbr: 'Gestor de Documentos'
};

_this.install = function(page) {
    const beforeInstall = function() {};
    const seeder = [];
    const component = _this.metadata;
    const i18n = [];
    const labels = [];

    const afterInstall = function() {};

    let response = new Installer({
        models: modelIndex,
        beforeInstall: beforeInstall,
        afterInstall: afterInstall,
        seeder: seeder,
        component: component,
        i18n: i18n,
        privileges: $.timp.tbd.server.install.privileges.privileges.values,
        objectActions: $.timp.tbd.server.install.objectActions.component.component,
        labels: labels,
		page: page
    }, {
        returnSeederInstances: true
    }).install();

    return response;
};