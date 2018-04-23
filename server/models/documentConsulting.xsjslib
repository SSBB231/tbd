$.import('timp.core.server.api', 'api');
var core_api = $.timp.core.server.api.api;
var util = core_api.util;
var view_lib = core_api.view_lib;
var users = core_api.users.table;
var lodash = core_api.lodash;

$.import('timp.tbd.server.models', 'documentTypeConfig');
var documentTypeConfig = $.timp.tbd.server.models.documentTypeConfig.table;

$.import('timp.tbd.server.models', 'documentApproval');
var documentApproval = $.timp.tbd.server.models.documentApproval.table;
$.import('timp.tbd.server.models', 'fileStorage');
var fileStorage = $.timp.tbd.server.models.fileStorage;
$.import('timp.tbd.server.models', 'storageLocationConfiguration');
var storageLocationConfiguration = $.timp.tbd.server.models.storageLocationConfiguration.table;

//View of key fields needed to join and get the information of structure and component
var keyFieldsConfigTable = new view_lib.View({
	component: 'TBD',
	name: '"_SYS_BIC"."timp.tbd.modeling/CV_KEY_FIELDS"',
	fields: {
	    id: new view_lib.Field({
			name: "ID",
			type: $.db.types.INTEGER
		}),
		idConfig: new view_lib.Field({
			name: "ID_CONFIGURATION",
			type: $.db.types.INTEGER
		}),
		docTypeId: new view_lib.Field({
			name: 'DOCUMENT_TYPE_ID',
			type: $.db.types.INTEGER
		}),
		keyCode: new view_lib.Field({
			name: 'KEY_CODE',
			type: $.db.types.NVARCHAR,
			dimension: 128
		}),
		keyName: new view_lib.Field({
			name: 'KEY_NAME',
			type: $.db.types.NVARCHAR,
			dimension: 128
		}),
		structureId: new view_lib.Field({
			name: 'STRUCTURE_ID',
			type: $.db.types.INTEGER
		}),
		structureName: new view_lib.Field({
			name: 'STRUCTURE_NAME',
			type: $.db.types.NVARCHAR,
			dimension: 100
		}),
		componentOrigin: new view_lib.Field({
			name: 'COMPONENT_ORIGIN',
			type: $.db.types.INTEGER
		}),
		componentName: new view_lib.Field({
			name: 'COMPONENT_NAME',
			type: $.db.types.NVARCHAR,
			dimension: 255
		}),
		componentDesc: new view_lib.Field({
			name: 'COMPONENT_DESCRIPTION',
			type: $.db.types.TEXT
		})
	}
});
this.keyFieldsConfigTable = keyFieldsConfigTable;

//View of storage location needed to join and get the information of the levels
var storageLocationTable = new view_lib.View({
	component: 'TBD',
	name: '"_SYS_BIC"."timp.tbd.modeling/CV_STORAGE_LOCATION"',
	fields: {
		id: new view_lib.Field({
			name: "ID",
			type: $.db.types.INTEGER
		}),
		docTypeId: new view_lib.Field({
			name: 'DOCUMENT_TYPE_ID',
			type: $.db.types.INTEGER
		}),
		fileStoredId: new view_lib.Field({
			name: 'FILE_STORED_ID',
			type: $.db.types.INTEGER
		}),
		level1: new view_lib.Field({
            name: 'LEVEL_1',
            type: $.db.types.NVARCHAR,
            dimension: 20
        }),
        level2: new view_lib.Field({
            name: 'LEVEL_2',
            type: $.db.types.NVARCHAR,
            dimension: 20
        }),
        level3: new view_lib.Field({
            name: 'LEVEL_3',
            type: $.db.types.NVARCHAR,
            dimension: 20
        }),
        level4: new view_lib.Field({
            name: 'LEVEL_4',
            type: $.db.types.NVARCHAR,
            dimension: 20
        }),
        level5: new view_lib.Field({
            name: 'LEVEL_5',
            type: $.db.types.NVARCHAR,
            dimension: 20
        }),
        level6: new view_lib.Field({
            name: 'LEVEL_6',
            type: $.db.types.NVARCHAR,
            dimension: 20
        }),
        level7: new view_lib.Field({
            name: 'LEVEL_7',
            type: $.db.types.NVARCHAR,
            dimension: 20
        }),
        level8: new view_lib.Field({
            name: 'LEVEL_8',
            type: $.db.types.NVARCHAR,
            dimension: 20
        }),
        level9: new view_lib.Field({
            name: 'LEVEL_9',
            type: $.db.types.NVARCHAR,
            dimension: 20
        }),
        level10: new view_lib.Field({
            name: 'LEVEL_10',
            type: $.db.types.NVARCHAR,
            dimension: 20
        }),
        level11: new view_lib.Field({
            name: 'LEVEL_11',
            type: $.db.types.NVARCHAR,
            dimension: 20
        })
	}
});
this.storageLocationTable = storageLocationTable;

//View of document approval needed to join and get the information of the date and comments about it
var documentApprovalTable = new view_lib.View({
	component: 'TBD',
	name: '"_SYS_BIC"."timp.tbd.modeling/CV_DOCUMENT_APPROVAL"',
	fields: {
	    id: new view_lib.Field({
			name: "ID",
			type: $.db.types.INTEGER
		}),
		docTypeId: new view_lib.Field({
			name: 'DOCUMENT_TYPE_ID',
			type: $.db.types.INTEGER
		}),
		fileStoredId: new view_lib.Field({
			name: 'FILE_STORED_ID',
			type: $.db.types.INTEGER
		}),
		approvalDate: new view_lib.Field({
			name: 'APPROVAL_DATE',
			type: $.db.types.TIMESTAMP
		}),
		comments: new view_lib.Field({
			name: 'COMMENTS',
			type: $.db.types.NVARCHAR,
			dimension: 60
		})
	}
});
this.documentApprovalTable = documentApprovalTable;

//Document Consulting is a register for reading/consulting only
this.read = function(object) {
    var where = [];
    
    if(object){
        // Filter the fields and set in which table the data will be in
        if(!object.filters){
            object.filters = {};
        }
        var fileStorageFilterBy = {
            id: object.filters.fileId ? object.filters.fileId : null,
            fileName: object.filters.fileName ? object.filters.fileName : null,
            fileStatus: object.filters.fileStatus ? object.filters.fileStatus : null,
            company: object.filters.company ? object.filters.company : null,
            branch: object.filters.branch ? object.filters.branch : null,
            uf: object.filters.uf ? object.filters.uf : null,
            tax: object.filters.tax ? object.filters.tax : null,
            keyField1: object.filters.keyField1 ? object.filters.keyField1 : null,
            keyField2: object.filters.keyField2 ? object.filters.keyField2 : null,
            storageClassification: object.filters.securityClassification ? object.filters.securityClassification : null  
        };
        var fileStorageWhere = this.getWhereArray(fileStorageFilterBy, fileStorage.fileStorageView);
        
        var keyFieldsFilterBy = {
            structureId: object.filters.structureId ? object.filters.structureId : null,
            keyCode: object.filters.keyCode ? object.filters.keyCode : null,
            componentOrigin: object.filters.componentOrigin ? object.filters.componentOrigin : null
        };
        var keyFieldsWhere = this.getWhereArray(keyFieldsFilterBy, this.keyFieldsConfigTable);
        
        var consultingDocType = {
            id:  object.filters.id ? object.filters.id : null,
            creationUser: object.filters.creationUser ? object.filters.creationUser : null,
            modificationUser: object.filters.modificationUser ? object.filters.modificationUser : null
        };
        var consultingWhere = this.getWhereArray(consultingDocType, null);
        
        if(Object.keys(fileStorageWhere).length > 0){
            where = where.concat(fileStorageWhere);
        }
    
        if(Object.keys(keyFieldsWhere).length > 0){
           where = where.concat(keyFieldsWhere);
        }
        
        if(Object.keys(consultingWhere).length > 0){
            where = where.concat(consultingWhere);
        }
    }
    
    return documentTypeConfig.READ({
        where: where,
        join: this.getJoin(),
        order_by: ['-id'],
        simulate: false
    });
};

this.getJoin = function() {
    var join = [{
        table: fileStorage.fileStorageView,
        alias: 'fileStorage',
        on: [{
            left: 'id',
            right: 'docTypeId'
        }],
        outer: 'left'
    }, {
        table: fileStorage.tableEEF,
        alias:'eef',
        fields:['id','idConfiguration','idCompany', 'uf','idBranch'],
        on:[{
            left_table: fileStorage.fileStorageView,
            left:'id',
            right:'idConfiguration'
        }],
        outer: 'left'
    },  {
        table: keyFieldsConfigTable,
        alias: 'keyFields',
        fields: ['id','docTypeId','keyCode','keyName','structureId','structureName','componentOrigin','componentName','componentDesc'],
        on: [{
            left: 'id',
            right: 'docTypeId'
        }],
        outer: 'left'
    }, {
        table: storageLocationTable,
        alias: 'storageLocation',
        fields: ['id','docTypeId','fileStoredId','level1','level2','level3','level4','level5','level6','level7','level8','level9','level10','level11'],
        on: [{
            left: 'id',
            right: 'docTypeId'
        }],
        outer: 'left'
    },  {
        table: users,
        alias: 'creationUserData',
        rename: 'creation',
        fields: ['id', 'name', 'last_name'],
        on: [{
            left: 'creationUser',
            right: 'id'
        }],
        outer: 'left'
    }, {
        table: users,
        alias: 'modificationUserData',
        rename: 'modification',
        fields: ['id', 'name', 'last_name'],
        on: [{
            left: 'modificationUser',
            right: 'id'
        }],
        outer: 'left'
    }];
    
    var files = fileStorage.list();
    var fileIds = [];
    if(files){
        for(var i = 0; i < files.length; i++){
            fileIds.push(files[i].id);
        }
    }
    if(fileIds.length > 0 ){
        join[0].on.push({
            field: "id",
            oper: "=",
            value: fileIds
        });
    }
    return join;
};

this.getWhereArray = function(object, table) {
    var where = [];
    for (var key in object) {
        if (key !== 'lang' && key !== 'page' && object[key] !== null) {
            if(lodash.isNil(table)){
                where.push({
                    field: key,
                    oper: '=',
                    value: object[key]
                });
            } else {
                where.push({
                    field: key,
                    oper: '=',
                    value: object[key],
                    table: table
                });
            }
            
        } 
    }
    return where;
};