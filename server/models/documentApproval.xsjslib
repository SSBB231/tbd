$.import('timp.core.server.api', 'api');
var coreApi = $.timp.core.server.api.api;
var util = coreApi.util;
var sql = coreApi.sql;
var table_lib = coreApi.table_lib;
var users = coreApi.users.table;

var schema = coreApi.schema;

$.import('timp.tbd.server.models', 'documentTypeConfig');
var documentTypeConfig = $.timp.tbd.server.models.documentTypeConfig.table;
$.import('timp.tbd.server.models', 'fileStorage');
var fileStorage = $.timp.tbd.server.models.fileStorage;

var table = new table_lib.Table({
	component: 'TBD',
	defaultFields: 'common',
	name: schema.default+'."TBD::DocumentApproval"',
	tags: false,
	fields: {
		id: new table_lib.AutoField({
			pk: true,
			name: "ID",
			auto: schema.default+'."TBD::DocumentApproval::ID".nextval',
			type: $.db.types.INTEGER
		}),
		docTypeId: new table_lib.Field({
			name: "DOCUMENT_TYPE_ID",
			type: $.db.types.INTEGER
		}),
		fileStoredId: new table_lib.Field({
			name: "FILE_STORED_ID",
			type: $.db.types.INTEGER
		}),
		status: new table_lib.Field({
			name: "STATUS",
			type: $.db.types.INTEGER
		}),
		classification: new table_lib.Field({
			name: "CLASSIFICATION",
			type: $.db.types.NVARCHAR,
			dimension: 4
		}),
		approvalDate: new table_lib.Field({
			name: "APPROVAL_DATE",
			type: $.db.types.TIMESTAMP
		}),
		comments: new table_lib.Field({
			name: "COMMENTS",
			type: $.db.types.NVARCHAR,
			dimension: 60
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
		    type: $.db.types.INTEGER,
		    default: 0
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
    var createdConfiguration = table.CREATE(object.info);
    return {
        fieldsInfo: createdConfiguration
    };
};

this.read = function(object) {
    return table.READ({
        where: this.getWhereArray(object),
        join: this.getJoin()
    });
};
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
    	where.push({
            field: 'id',
            oper: '=',
            value: ids
    	});
    	pageCount = prevList.pageCount;
    }
    
    var response =  table.READ({
        where: where,
        join: this.getJoin(),
        simulate: false
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
            table: documentTypeConfig,
            alias:'docTypeConfig',
            fields:['id','docType','description'],
            on:[{
                left:'docTypeId',
                right:'id'
            }]
        }, {
            table: fileStorage.table,
            alias: 'files',
            fields: ['id', 'docTypeId', 'fileName', 'imageUrl', 'status'],
            on: [{
                left: 'fileStoredId',
                right: 'id'
            }]
        },  {
            table: fileStorage.tableEEF,
            alias:'eef',
            fields:['id','idConfiguration','idCompany', 'uf','idBranch'],
            on:[{
                left_table: fileStorage.table,
                left:'id',
                right:'idConfiguration'
            }],
            outer: 'left'
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

this.update = function(object) {
    var id = object.info.id;
    var createdConfiguration = table.UPDATE(object.info); 
    return {
        fieldsInfo: {id: id},
        updated: createdConfiguration
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

this.updateApprovalStatus = function(object){
    var updated = false;
    if(object.status == 1 || object.status == 2 || object.status == 3 || object.status == 4){
        // var query = 'UPDATE' + schema.default + '."TBD::FileStorage" SET "STATUS" = '+  object.status + ' WHERE "ID" = ' +  object.id;
        var query = 'UPDATE' + schema.default + '."TBD::DocumentApproval" SET "STATUS" = '+  object.status + ' WHERE "ID" = ' +  object.id;
        updated = sql.UPDATE({ 
            query: query
        });
    }else {
        return null;
    }
    return {
        id: object.id,
        updated: updated
    };
};