try {
   $.import('timp.core.server.api','api');
    var core_api = $.timp.core.server.api.api;
    var util = core_api.util;
    
    $.import('timp.tbd.server.controllers','tbd');
    var tbd = $.timp.tbd.server.controllers.tbd;
    
    $.import('timp.tbd.server.controllers', 'documentTypeConfig');
    var documentTypeConfig =  $.timp.tbd.server.controllers.documentTypeConfig;
    
    $.import('timp.tbd.server.controllers', 'keyFieldsConfig');
    var keyFieldsConfig =  $.timp.tbd.server.controllers.keyFieldsConfig;
    
    $.import('timp.tbd.server.controllers', 'storageLocationConfiguration');
    var storageLocationConfig =  $.timp.tbd.server.controllers.storageLocationConfiguration;
    
    $.import('timp.tbd.server.controllers', 'fileStorage');
    var fileStorage =  $.timp.tbd.server.controllers.fileStorage;
    
    $.import('timp.tbd.server.controllers', 'documentApproval');
    var documentApproval =  $.timp.tbd.server.controllers.documentApproval;
    
    $.import('timp.tbd.server.controllers', 'documentConsulting');
    var documentConsulting =  $.timp.tbd.server.controllers.documentConsulting;
    
    $.import('timp.tbd.server.controllers', 'external');
    var externalController =  $.timp.tbd.server.controllers.external;
    
    var router = new util.URLRouter({
        routes: [
            {url: "^getCoreData/$",                             view: tbd.getCoreData,                              ctx:tbd},//get only
            {url: "^getUserPrivileges/$",                       view: tbd.getPrivileges,                            ctx:tbd},//get only
            {url: "^alterTableTypes/",                          view: tbd.alterTableTypes,                          ctx: tbd},
            
            //Document Type Config
            {url: "^documentTypeConfig/create/",                view: documentTypeConfig.save,                      ctx: documentTypeConfig,        privileges: ["DocumentTypeConfig.create"]},
            {url: "^documentTypeConfig/update/",                view: documentTypeConfig.save,                      ctx: documentTypeConfig,        privileges: ["DocumentTypeConfig.update"]},
            {url: "^documentTypeConfig/read/",                  view: documentTypeConfig.read,                      ctx: documentTypeConfig,        privileges: ["DocumentTypeConfig.read"]},
            {url: "^documentTypeConfig/delete/",                view: documentTypeConfig.delete,                    ctx: documentTypeConfig,        privileges: ["DocumentTypeConfig.delete"]},

            //Key Fields Configuration
            {url: "^keyFieldsConfig/create/",                    view: keyFieldsConfig.save,                        ctx: keyFieldsConfig,           privileges: ["KeyFieldsConfig.create"]},
            {url: "^keyFieldsConfig/update/",                    view: keyFieldsConfig.save,                        ctx: keyFieldsConfig,           privileges: ["KeyFieldsConfig.update"]},
            // {url: "^keyFieldsConfig/update/",                  view: keyFieldsConfig.update,                      ctx: keyFieldsConfig,              privileges: ["KeyFieldsConfig.update"]},
            {url: "^keyFieldsConfig/read/",                    view: keyFieldsConfig.read,                        ctx: keyFieldsConfig,             privileges: ["KeyFieldsConfig.read"]},
            {url: "^keyFieldsConfig/delete/",                  view: keyFieldsConfig.delete,                      ctx: keyFieldsConfig,             privileges: ["KeyFieldsConfig.delete"]},
            {url: "^keyFieldsConfig/getRequiredInformation/",  view: keyFieldsConfig.getRequiredInformation,      ctx: keyFieldsConfig,             privileges: ["KeyFieldsConfig.read"]},
            {url: "^keyFieldsConfig/getStructures/",           view: keyFieldsConfig.getStructures,               ctx: keyFieldsConfig},
            
            
            //Storage Location Configuration
            {url: "^storageLocationConfig/create/",                  view: storageLocationConfig.save,                       ctx: storageLocationConfig,            privileges: ["StorageLocationConfig.create"]},
            {url: "^storageLocationConfig/update/",                  view: storageLocationConfig.save,                       ctx: storageLocationConfig,            privileges: ["StorageLocationConfig.update"]},
            {url: "^storageLocationConfig/read/",                    view: storageLocationConfig.read,                       ctx: storageLocationConfig,            privileges: ["StorageLocationConfig.read"]},
            {url: "^storageLocationConfig/delete/",                  view: storageLocationConfig.delete,                     ctx: storageLocationConfig,            privileges: ["StorageLocationConfig.delete"]},
            {url: "^storageLocationConfig/getRequiredInformation/",  view: storageLocationConfig.getRequiredInformation,     ctx: storageLocationConfig,            privileges: ["StorageLocationConfig.read"]},
            
            //File Storage
            {url: "^fileStorage/create/",                   view: fileStorage.save,                         ctx: fileStorage,           privileges: ["FileStorage.create"]},
            {url: "^fileStorage/update/",                   view: fileStorage.save,                         ctx: fileStorage,           privileges: ["FileStorage.update"]},
            {url: "^fileStorage/read/",                     view: fileStorage.read,                         ctx: fileStorage,           privileges: ["FileStorage.read"]},
            {url: "^fileStorage/delete/",                   view: fileStorage.delete,                       ctx: fileStorage,           privileges: ["FileStorage.delete"]},
            {url: "^fileStorage/getRequiredInformation/",   view: fileStorage.getRequiredInformation,       ctx: fileStorage,           privileges: ["FileStorage.read"]},
            {url: "^fileStorage/listCompanies/",            view: fileStorage.listCompanies,                ctx: fileStorage},
            {url: "^fileStorage/listUfs/",                  view: fileStorage.listUfs,                      ctx: fileStorage},
            {url: "^fileStorage/listBranches/",             view: fileStorage.listBranches,                 ctx: fileStorage},
            {url: "^fileStorage/listUsers/",                view: fileStorage.listUsers,                    ctx: fileStorage},
            {url: "^fileStorage/listGroups/",               view: fileStorage.listGroups,                   ctx: fileStorage},
            {url: "^fileStorage/listTaxes/",                view: fileStorage.getTributos,                  ctx: fileStorage},
            {url: "^fileStorage/migrateFileStorageEEF/",    view: fileStorage.migrateFileStorageEEF,        ctx: fileStorage},
            
            //Document Approval
            {url: "^documentApproval/create/",                  view: documentApproval.save,                        ctx: documentApproval,          privileges: ["DocumentApproval.create"]},
            {url: "^documentApproval/update/",                  view: documentApproval.save,                        ctx: documentApproval,          privileges: ["DocumentApproval.update"]},
            {url: "^documentApproval/read/",                    view: documentApproval.read,                        ctx: documentApproval,          privileges: ["DocumentApproval.read"]},
            {url: "^documentApproval/delete/",                  view: documentApproval.delete,                      ctx: documentApproval,          privileges: ["DocumentApproval.delete"]},
            {url: "^documentApproval/getRequiredInformation/",  view: documentApproval.getRequiredInformation,      ctx: documentApproval,          privileges: ["DocumentApproval.read"]},
            {url: "^documentApproval/updateStatus/",            view: documentApproval.updateStatus,                ctx: documentApproval,          privileges: ["DocumentApproval.update"]},
            
            //Document Consulting
            {url: "^documentConsulting/getRequiredInformation/",    view: documentConsulting.getRequiredInformation,        ctx: documentConsulting,        privileges: ["DocumentConsulting.read"]},
            {url: "^documentConsulting/read/",                      view: documentConsulting.read,                          ctx: documentConsulting,        privileges: ["DocumentConsulting.read"]},
            {url: "^documentConsulting/readStructure/",             view: documentConsulting.readStructure,                 ctx: documentConsulting,        privileges: []},
            {url: "^documentConsulting/listAdvancedFilters/",       view: documentConsulting.listAdvancedFilters,           ctx: documentConsulting,        privileges: ["DocumentConsulting.read"]},
            
            // Save a file from an external component
            {url: "^saveFile/",                 view: externalController.saveFile,              ctx: externalController,    privileges: ["FileStorage.create"]}
        ],
        default: function () {
            $.response.setBody('');
            $.response.contentType = 'text/html';
        }
    });
    
    router.parseURL(null, 'tbd');
} catch (e) {
    $.response.setBody('Unknown failure: ' + util.parseError(e));
}
