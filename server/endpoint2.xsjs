try {
    $.import("timp.core.server.api", "api");
    const coreApi = $.timp.core.server.api.api;
    const Router = coreApi.Router;

    $.import('timp.tbd.server.controllers', 'tbd');
    var tbd = $.timp.tbd.server.controllers.tbd;

    $.import('timp.tbd.server.controllers', 'documentTypeConfig');
    var documentTypeConfig = $.timp.tbd.server.controllers.documentTypeConfig;

    // $.import('timp.tbd.server.controllers', 'documentSecurity');
    // var documentSecurity =  $.timp.tbd.server.controllers.documentSecurity;

    $.import('timp.tbd.server.controllers', 'keyFieldsConfig');
    var keyFieldsConfig = $.timp.tbd.server.controllers.keyFieldsConfig;

    $.import('timp.tbd.server.controllers', 'storageLocationConfiguration');
    var storageLocationConfig = $.timp.tbd.server.controllers.storageLocationConfiguration;

    $.import('timp.tbd.server.controllers', 'fileStorage');
    var fileStorage = $.timp.tbd.server.controllers.fileStorage;

    $.import('timp.tbd.server.controllers', 'documentApproval');
    var documentApproval = $.timp.tbd.server.controllers.documentApproval;

    $.import('timp.tbd.server.controllers', 'documentConsulting');
    var documentConsulting = $.timp.tbd.server.controllers.documentConsulting;

    const routes = [{
            url: "^getCoreData/$",
            fn: tbd.getCoreData,
            method: 'POST',
            bypass: true,
            privileges: [],
            object: '00',
            category: '1000',
            params: {
                object: 'json'
            }
        }, //get only
        {
            url: "^getUserPrivileges/$",
            fn: tbd.getPrivileges,
            method: 'POST',
            bypass: true,
            privileges: [],
            object: '00',
            category: '1000',
            params: {
                object: 'json'
            }
        }, //get only
        {
            url: "^alterTableTypes/",
            fn: tbd.alterTableTypes,
            method: 'POST',
            bypass: true,
            privileges: [],
            object: '00',
            category: '1000',
            params: {
                object: 'json'
            }
        },

        //Document Type Config
        {
            url: "^documentTypeConfig/save/",
            fn: documentTypeConfig.save,
            method: 'POST',
            bypass: true,
            privileges: [],
            object: '13',
            category: '0000',
            params: {
                object: 'json'
            }
        }, {
            url: "^documentTypeConfig/update/",
            fn: documentTypeConfig.update,
            method: 'POST',
            bypass: true,
            privileges: [],
            object: '13',
            category: '2000',
            params: {
                object: 'json'
            }
        }, {
            url: "^documentTypeConfig/read/",
            fn: documentTypeConfig.read,
            method: 'POST',
            bypass: true,
            privileges: [],
            object: '13',
            category: '1000',
            params: {
                object: 'json'
            }
        }, {
            url: "^documentTypeConfig/delete/",
            fn: documentTypeConfig.delete,
            method: 'POST',
            bypass: true,
            privileges: [],
            object: '13',
            category: '3000',
            params: {
                object: 'json'
            }
        },
        //Key Fields Configuration
        {
            url: "^keyFieldsConfig/save/",
            fn: keyFieldsConfig.save,
            method: 'POST',
            bypass: true,
            privileges: [],
            object: '13',
            category: '0000',
            params: {
                object: 'json'
            }
        }, {
            url: "^keyFieldsConfig/update/",
            fn: keyFieldsConfig.update,
            method: 'POST',
            bypass: true,
            privileges: [],
            object: '13',
            category: '2000',
            params: {
                object: 'json'
            }
        }, {
            url: "^keyFieldsConfig/read/",
            fn: keyFieldsConfig.read,
            method: 'POST',
            bypass: true,
            privileges: [],
            object: '13',
            category: '1000',
            params: {
                object: 'json'
            }
        }, {
            url: "^keyFieldsConfig/delete/",
            fn: keyFieldsConfig.delete,
            method: 'POST',
            bypass: true,
            privileges: [],
            object: '13',
            category: '3000',
            params: {
                object: 'json'
            }
        }, {
            url: "^keyFieldsConfig/getRequiredInformation/",
            fn: keyFieldsConfig.getRequiredInformation,
            method: 'POST',
            bypass: true,
            privileges: [],
            object: '13',
            category: '1000',
            params: {
                object: 'json'
            }
        }, {
            url: "^keyFieldsConfig/getStructures/",
            fn: keyFieldsConfig.getStructures,
            method: 'POST',
            bypass: true,
            privileges: [],
            object: '13',
            category: '1000',
            params: {
                object: 'json'
            }
        },


        //Storage Location Configuration
        {
            url: "^storageLocationConfig/save/",
            fn: storageLocationConfig.save,
            method: 'POST',
            bypass: true,
            privileges: [],
            object: '13',
            category: '0000',
            params: {
                object: 'json'
            }
        }, {
            url: "^storageLocationConfig/update/",
            fn: storageLocationConfig.update,
            method: 'POST',
            bypass: true,
            privileges: [],
            object: '13',
            category: '2000',
            params: {
                object: 'json'
            }
        }, {
            url: "^storageLocationConfig/read/",
            fn: storageLocationConfig.read,
            method: 'POST',
            bypass: true,
            privileges: [],
            object: '13',
            category: '1000',
            params: {
                object: 'json'
            }
        }, {
            url: "^storageLocationConfig/delete/",
            fn: storageLocationConfig.delete,
            method: 'POST',
            bypass: true,
            privileges: [],
            object: '13',
            category: '3000',
            params: {
                object: 'json'
            }
        }, {
            url: "^storageLocationConfig/getRequiredInformation/",
            fn: storageLocationConfig.getRequiredInformation,
            method: 'POST',
            bypass: true,
            privileges: [],
            object: '13',
            category: '1000',
            params: {
                object: 'json'
            }
        },

        //File Storage
        {
            url: "^fileStorage/save/",
            fn: fileStorage.save,
            method: 'POST',
            bypass: true,
            privileges: [],
            object: '39',
            category: '0000',
            params: {
                object: 'json'
            }
        }, {
            url: "^fileStorage/update/",
            fn: fileStorage.update,
            method: 'POST',
            bypass: true,
            privileges: [],
            object: '39',
            category: '2000',
            params: {
                object: 'json'
            }
        }, {
            url: "^fileStorage/read/",
            fn: fileStorage.read,
            method: 'POST',
            bypass: true,
            privileges: [],
            object: '39',
            category: '1000',
            params: {
                object: 'json'
            }
        }, {
            url: "^fileStorage/delete/",
            fn: fileStorage.delete,
            method: 'POST',
            bypass: true,
            privileges: [],
            object: '39',
            category: '3000',
            params: {
                object: 'json'
            }
        }, {
            url: "^fileStorage/getRequiredInformation/",
            fn: fileStorage.getRequiredInformation,
            method: 'POST',
            bypass: true,
            privileges: [],
            object: '39',
            category: '1000',
            params: {
                object: 'json'
            }
        }, {
            url: "^fileStorage/listCompanies/",
            fn: fileStorage.listCompanies,
            method: 'POST',
            bypass: true,
            privileges: [],
            object: '00',
            category: '1000',
            params: {
                object: 'json'
            }
        }, {
            url: "^fileStorage/listUfs/",
            fn: fileStorage.listUfs,
            method: 'POST',
            bypass: true,
            privileges: [],
            object: '00',
            category: '1000',
            params: {
                object: 'json'
            }
        }, {
            url: "^fileStorage/listBranches/",
            fn: fileStorage.listBranches,
            method: 'POST',
            bypass: true,
            privileges: [],
            object: '00',
            category: '1000',
            params: {
                object: 'json'
            }
        }, {
            url: "^fileStorage/listUsers/",
            fn: fileStorage.listUsers,
            method: 'POST',
            bypass: true,
            privileges: [],
            object: '01',
            category: '1000',
            params: {
                object: 'json'
            }
        }, {
            url: "^fileStorage/listGroups/",
            fn: fileStorage.listGroups,
            method: 'POST',
            bypass: true,
            privileges: [],
            object: '00',
            category: '1000',
            params: {
                object: 'json'
            }
        }, {
            url: "^fileStorage/migrateFileStorageEEF/",
            fn: fileStorage.migrateFileStorageEEF,
            method: 'POST',
            bypass: true,
            privileges: [],
            object: '39',
            category: '2000',
            params: {
                object: 'json'
            }
        },


        //Document Approval
        {
            url: "^documentApproval/save/",
            fn: documentApproval.save,
            method: 'POST',
            bypass: true,
            privileges: [],
            object: '33',
            category: '0000',
            params: {
                object: 'json'
            }
        }, {
            url: "^documentApproval/update/",
            fn: documentApproval.update,
            method: 'POST',
            bypass: true,
            privileges: [],
            object: '33',
            category: '2000',
            params: {
                object: 'json'
            }
        }, {
            url: "^documentApproval/read/",
            fn: documentApproval.read,
            method: 'POST',
            bypass: true,
            privileges: [],
            object: '33',
            category: '1000',
            params: {
                object: 'json'
            }
        }, {
            url: "^documentApproval/delete/",
            fn: documentApproval.delete,
            method: 'POST',
            bypass: true,
            privileges: [],
            object: '33',
            category: '3000',
            params: {
                object: 'json'
            }
        }, {
            url: "^documentApproval/getRequiredInformation/",
            fn: documentApproval.getRequiredInformation,
            method: 'POST',
            bypass: true,
            privileges: [],
            object: '33',
            category: '1000',
            params: {
                object: 'json'
            }
        }, {
            url: "^documentApproval/updateStatus/",
            fn: documentApproval.updateStatus,
            method: 'POST',
            bypass: true,
            privileges: [],
            object: '33',
            category: '2000',
            params: {
                object: 'json'
            }
        },

        //Document Consulting
        {
            url: "^documentConsulting/getRequiredInformation/",
            fn: documentConsulting.getRequiredInformation,
            method: 'POST',
            bypass: true,
            privileges: [],
            object: '34',
            category: '1000',
            params: {
                object: 'json'
            }
        }, {
            url: "^documentConsulting/read/",
            fn: documentConsulting.read,
            method: 'POST',
            bypass: true,
            privileges: [],
            object: '34',
            category: '1000',
            params: {
                object: 'json'
            }
        }, {
            url: "^documentConsulting/readStructure/",
            fn: documentConsulting.readStructure,
            method: 'POST',
            bypass: true,
            privileges: [],
            object: '34',
            category: '1000',
            params: {
                object: 'json'
            }
        }, {
            url: "^documentConsulting/listAdvancedFilters/",
            fn: documentConsulting.listAdvancedFilters,
            method: 'POST',
            bypass: true,
            privileges: [],
            object: '34',
            category: '1000',
            params: {
                object: 'json'
            }
        }
    ];

    const router = new Router('tbd', routes);
    router.parseURL();
} catch (e) {
    $.response.setBody('Unknown failure: ' + $.parseError(e));
}