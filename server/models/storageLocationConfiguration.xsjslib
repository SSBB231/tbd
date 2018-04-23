$.import('timp.core.server.api', 'api');
var coreApi = $.timp.core.server.api.api;
var util = coreApi.util;
var sql = coreApi.sql;
var table_lib = coreApi.table_lib;
var users = coreApi.users.table;
var schema = coreApi.schema;

$.import('timp.tbd.server.models', 'fileStorage');
var fileStorage = $.timp.tbd.server.models.fileStorage.table;
$.import('timp.tbd.server.models', 'documentTypeConfig');
var documentTypeConfig = $.timp.tbd.server.models.documentTypeConfig.table;

var table = new table_lib.Table({
	component: 'TBD',
	defaultFields: 'common',
	name: schema.default+'."TBD::StorageLocationConfiguration"',
	tags: false,
	fields: {
		id: new table_lib.AutoField({
			pk: true,
			name: "ID",
			auto: schema.default+'."TBD::StorageLocationConfiguration::ID".nextval',
			type: $.db.types.INTEGER
		}),
		fileStoredId: new table_lib.Field({
			name: "FILE_STORED_ID",
			type: $.db.types.INTEGER
		}),
		docTypeId: new table_lib.Field({
			name: "DOCUMENT_TYPE_ID",
			type: $.db.types.INTEGER
		}),
		level1: new table_lib.Field({
			name: "LEVEL_1",
			type: $.db.types.NVARCHAR,
			dimension: 255
		}),
		level2: new table_lib.Field({
			name: "LEVEL_2",
			type: $.db.types.NVARCHAR,
			dimension: 255
		}),
		level3: new table_lib.Field({
			name: "LEVEL_3",
			type: $.db.types.NVARCHAR,
			dimension: 255
		}),
		level4: new table_lib.Field({
			name: "LEVEL_4",
			type: $.db.types.NVARCHAR,
			dimension: 255
		}),
		level5: new table_lib.Field({
			name: "LEVEL_5",
			type: $.db.types.NVARCHAR,
			dimension: 255
		}),
		level6: new table_lib.Field({
			name: "LEVEL_6",
			type: $.db.types.NVARCHAR,
			dimension: 255
		}),
		level7: new table_lib.Field({
			name: "LEVEL_7",
			type: $.db.types.NVARCHAR,
			dimension: 255
		}),
		level8: new table_lib.Field({
			name: "LEVEL_8",
			type: $.db.types.NVARCHAR,
			dimension: 255
		}),
		level9: new table_lib.Field({
			name: "LEVEL_9",
			type: $.db.types.NVARCHAR,
			dimension: 255
		}),
		level10: new table_lib.Field({
			name: "LEVEL_10",
			type: $.db.types.NVARCHAR,
			dimension: 255
		}),
		level11: new table_lib.Field({
			name: "LEVEL_11",
			type: $.db.types.NVARCHAR,
			dimension: 255
		}),
		validFrom: new table_lib.Field({
			name: 'VALID_FROM',
			type: $.db.types.DATE
		}),
		validTo: new table_lib.Field({
			name: 'VALID_TO',
			type: $.db.types.DATE
		}),
		isDeleted: new table_lib.Field({
		    name: 'IS_DELETED',
		    type: $.db.types.INTEGER
		})
	}
});
this.table = table;

this.paginate = {   //Returns 'pageCount' with the total of pages
    size: 15,       //What is the page size?
    number: 1,      //What is the page number?
    count: true     //Do you want a total of pages?
};

//Functions CRUD
this.create = function(object) {
    return table.CREATE(object);
};
this.update = function(object) {
    return table.UPDATE(object);
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
    var where = this.getWhereArray(object);
    var pageCount = 1;
    if(object && object.page){
        prevList = table.READ({
            where: where,
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
    
    var join = [{
            table: documentTypeConfig,
            alias: 'docTypeConfig',
            fields: ['id', 'docType', 'description'],
            on: [{
                left: 'docTypeId',
                right: 'id'
            }]
        }, {
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
        }
    ];
    return join;
};
this.getWhereArray = function(object) {
    var where = [{
        field: "isDeleted",
        oper: "!=",
        value: 1
    }];
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
    
    return where;
};