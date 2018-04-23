jQuery.sap.registerModulePath("app", "ui/app");
jQuery.sap.registerModulePath("js", "ui/js");
jQuery.sap.require('app.config.endpoints');
jQuery.sap.require("sap.ui.app.Application");

//Importar tbd/ui/js/PrintAndSaveManager.js
jQuery.sap.require("js.PrintAndSaveManager");

sap.ui.app.Application.extend("TBD", {

    config: null,

    /*Functions*/
    init: function() {
        this.config = {
            components: {},
            indexRoute: 'library',
            routes: {
                'library': {
                    layout: 'app.views.layout.layout',
                    controller: 'app.controllers.library.Library'
                },
                'menu': {
                    layout: 'app.views.menu.Menu',
                    controller: 'app.controllers.menu.Menu'
                },
                'documentTypeConfig': {
                    layout: 'app.views.layout.layout',
                    controller: 'app.controllers.documentTypeConfig.editor'
                },
                'keyFieldsConfig': {
                    layout: 'app.views.layout.layout',
                    controller: 'app.controllers.keyFieldsConfig.editor'
                },
                'storageLocationConfig': {
                    layout: 'app.views.layout.layout',
                    controller: 'app.controllers.storageLocationConfig.editor'
                },
                'fileStorage': {
                    layout: 'app.views.layout.layout',
                    controller: 'app.controllers.fileStorage.editor'
                },
                'documentApproval': {
                    layout: 'app.views.layout.layout',
                    controller: 'app.controllers.documentApproval.editor'
                },
                'documentConsulting': {
                    layout: 'app.views.layout.layout',
                    controller: 'app.controllers.documentConsulting.editor'
                }
            }
        };
    },

    main: function() {
        allTaxApp.init(this.config);
    }
});