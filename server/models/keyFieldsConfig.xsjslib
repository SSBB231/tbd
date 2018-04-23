$.import('timp.core.server.api', 'api');
var coreApi = $.timp.core.server.api.api;
var util = coreApi.util;
var sql = coreApi.sql;
var table_lib = coreApi.table_lib;
var users = coreApi.users.table;
var components = coreApi.modelComponents.components;
var schema = coreApi.schema;

$.import('timp.atr.server.api', 'api');
var atr_api = $.timp.atr.server.api.api;
var structure = atr_api.structure.table;

$.import('timp.tbd.server.models', 'documentTypeConfig');
var documentTypeConfig = $.timp.tbd.server.models.documentTypeConfig.table;

var table = new table_lib.Table({
	component: 'TBD',
	defaultFields: 'common',
	name: schema.default+'."TBD::KeyFieldsConfig"',
	tags: false,
	fields: {
		id: new table_lib.AutoField({
			pk: true,
			name: "ID",
			auto: schema.default+'."TBD::KeyFieldsConfig::ID".nextval',
			type: $.db.types.INTEGER
		}),
		docTypeId: new table_lib.Field({
			name: "DOCUMENT_TYPE_ID",
			type: $.db.types.INTEGER
		}),
		componentOrigin: new table_lib.Field({
			name: "COMPONENT_ORIGIN",
			type: $.db.types.INTEGER
		}),
		validFrom: new table_lib.Field({
			name: 'VALID_FROM',
			type: $.db.types.DATE
		}),
		validTo: new table_lib.Field({
			name: 'VALID_TO',
			type: $.db.types.DATE
		}),
		structure: new table_lib.Field({
			name: "STRUCTURE_ID",
			type: $.db.types.INTEGER
		}),
		isDeleted: new table_lib.Field({
		    name: 'IS_DELETED',
		    type: $.db.types.INTEGER,
		    default: 0
		})
	}
});
this.table = table;

//Multiple Keys
var keyTable = new table_lib.Table({
	component: 'TBD',
	name: schema.default+'."TBD::KeyFieldsConfigKeys"',
	defaultFields: 'common',
	tags: false,
	fields: {
		id: new table_lib.AutoField({
			pk: true,
			name: "ID",
			auto: schema.default+'."TBD::KeyFieldsConfigKeys::ID".nextval',
			type: $.db.types.INTEGER
		}),
		idConfiguration: new table_lib.Field({
			name: "ID_CONFIGURATION",
			type: $.db.types.INTEGER
		}),
		keyCode: new table_lib.Field({
			name: "KEY_CODE",
			type: $.db.types.NVARCHAR,
			dimension: 128
		}),
		keyName: new table_lib.Field({
			name: "KEY_NAME",
			type: $.db.types.NVARCHAR,
			dimension: 128
		})
	}
});
this.keyTable = keyTable;

this.paginate = {   //Returns 'pageCount' with the total of pages
    size: 15,       //What is the page size?
    number: 1,      //What is the page number?
    count: true     //Do you want a total of pages?
};

//Functions CRUD
this.create = function(object) {
    var createdKeysConfig = [];
    
    var createdConfiguration = table.CREATE(object.info);
    object.keys.forEach(function(keyCode){
        createdKeysConfig.push(keyTable.CREATE({
            idConfiguration:createdConfiguration.id,
            structureId: keyCode.structure,
            keyCode: keyCode.key,
            keyName: keyCode.name
        }));
    });
    return {
        keyFieldsInfo: createdConfiguration,
        keyCode: createdKeysConfig
    };
};
this.update = function(object) {
    var updated = table.UPDATE(object.info);
    var newKeys = object.keys;
    if(object){
        keyTable.DELETEWHERE([{
    		field: 'idConfiguration',
    		oper: '=',
    		value: object.info.id
    	}]);
    }
    
    var createdKeysConfig = [];
    
    newKeys.forEach(function(keyCode){
        createdKeysConfig.push(keyTable.CREATE({
            idConfiguration: object.info.id,
            structureId: keyCode.structure,
            keyCode: keyCode.key,
            keyName: keyCode.name
        }));
    });
    
    return {
        updated:updated,
        createdKeys: createdKeysConfig
    };
};
this.delete = function(object) {
    var updateWhere = [{
        field: 'id', 
        oper: '=',
        value: object
    }];
        
    var update = this.table.UPDATEWHERE({
        'isDeleted': 1
    }, updateWhere);
    
    return update;
};
//Used for getting a single register
this.read = function(object) {
    return table.READ({
        where: this.getWhereArray(object),
        join: this.getJoin()
    });
};

//Used in the library - has pagination
this.list = function(object) {
    var prevList = [];
    var where = [];
    var pageCount = 1;
    if(object && object.page){
        prevList = table.READ({
            where: this.getWhereArray(object),
            orderBy: ['id'],
            paginate: {
                size: this.paginate.size,
                number: object.page,
                count: true
            },
            simulate: false
    	});
    	
    	if (prevList.length === 0) {
            return {
                data: [],
                pageCount: 1
            };
    	}
    	
    	var ids = prevList.map(function(item) {
            return item.id;
    	});
    	where = [{
            field: 'id',
            oper: '=',
            value: ids
    	}];
    	pageCount = prevList.pageCount;
    }
    
    var response =  table.READ({
        where: where,
        join: this.getJoin()
    });
    response.pageCount = pageCount;
    return response;
};

this.getJoin = function() {
    var join = [
        {
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
        }, {
            table:keyTable,
            alias:'keys',
            fields:['id','idConfiguration','keyCode', 'keyName'],
            on:[{
                left:'id',
                right:'idConfiguration'
            }]
        }, {
            table: documentTypeConfig,
            alias:'documentTypeConfig',
            fields:['id','docType','description'],
            on:[{
                left:'docTypeId',
                right:'id'
            }]
        }, {
            table: structure,
            alias: 'structureData',
            fields: ['id', 'title', 'hanaName'],
            on: [{
                left: 'structure',
                right: 'id'
            }]
        }, {
            table: components,
            alias: 'componentData',
            fields: ['id', 'name', 'description'],
            on: [{
                left: 'componentOrigin',
                right: 'id'
            }]
        }
    ];
    return join;
};
this.getWhereArray = function(object) {
    var where = [];
    for (var key in object) {
        if (key !== 'lang' && key !== 'page' && key !== 'filterBy') {
            where.push({
                field: key,
                oper: '=',
                value: object[key]
            });
        }
    }
    
    if (object && object.filterBy && object.filterBy.id) {
        where.push({
            field: 'id',
            oper: '=',
            value: Number(object.filterBy.id)
        });
    }
    if(where && where.length > 0 ){
        where.push({
            field: "isDeleted",
            oper: "!=",
            value: 1
        });
    }else {
        where = [{
            field: "isDeleted",
            oper: "!=",
            value: 1
        }];
    }
    return where;
};