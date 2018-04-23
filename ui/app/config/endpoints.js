jQuery.sap.declare('app.config.endpoints');
jQuery.sap.require('core.config.BaseData');

Data.config = {
    folder: "timp/tbd/server/endpoint.xsjs",
    debug: true,

    endpoints: {
        privileges: {
            folder: "timp/tbd/server/endpoint.xsjs",
            name: "getUserPrivileges/",
            type: "json"
        },
        documentTypeConfig:{
            list: 'documentTypeConfig/read/',
            create: 'documentTypeConfig/create/',
            update: 'documentTypeConfig/update/',
            delete: 'documentTypeConfig/delete/'
        },
        keyFieldsConfig:{
            list: 'keyFieldsConfig/read/',
            create: 'keyFieldsConfig/create/',
            update: 'keyFieldsConfig/update/',
            delete: 'keyFieldsConfig/delete/',
            getRequiredInfo: 'keyFieldsConfig/getRequiredInformation/',
            getStructures:'keyFieldsConfig/getStructures/'
        }, 
        storageLocationConfig:{
            list: 'storageLocationConfig/read/',
            create: 'storageLocationConfig/create/',
            update: 'storageLocationConfig/update/',
            delete: 'storageLocationConfig/delete/',
            getRequiredInfo: 'storageLocationConfig/getRequiredInformation/'
        },
        fileStorage:{
            list: 'fileStorage/read/',
            listCompanies: 'fileStorage/listCompanies/',
            listUfs: 'fileStorage/listUfs/',
            listBranches: 'fileStorage/listBranches/',
            create: 'fileStorage/create/',
            update: 'fileStorage/update/',
            delete: 'fileStorage/delete/',
            getRequiredInfo: 'fileStorage/getRequiredInformation/',
            listUsers: 'fileStorage/listUsers/',
            listGroups: 'fileStorage/listGroups/'
        },
        documentApproval:{
            list: 'documentApproval/read/',
            create: 'documentApproval/create/',
            update: 'documentApproval/update/',
            delete: 'documentApproval/delete/',
            getRequiredInfo: 'documentApproval/getRequiredInformation/',
            updateStatus: 'documentApproval/updateStatus/'
        },
        documentConsulting:{
            getRequiredInfo: 'documentConsulting/getRequiredInformation/',
            list: 'documentConsulting/read/',
            readStructure: 'documentConsulting/readStructure/',
            listAdvancedFilters: 'documentConsulting/listAdvancedFilters/'
        }
    }
};
