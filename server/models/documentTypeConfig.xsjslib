$.import('timp.core.server.api', 'api');
var coreApi = $.timp.core.server.api.api;
var util = coreApi.util;
var sql = coreApi.sql;
var table_lib = coreApi.table_lib;
var users = coreApi.users.table;

var schema = coreApi.schema;

var table = new table_lib.Table({
	component: 'TBD',
	defaultFields: 'common',
	name: schema.default+'."TBD::DocumentTypeConfig"',
	tags: false,
	fields: {
		id: new table_lib.AutoField({
			pk: true,
			name: "ID",
			auto: schema.default+'."TBD::DocumentTypeConfig::ID".nextval',
			type: $.db.types.INTEGER
		}),
		docType: new table_lib.Field({
			name: "DOCUMENT_TYPE",
			type: $.db.types.NVARCHAR,
			dimension: 4
		}),
		description: new table_lib.Field({
			name: "DESCRIPTION",
			type: $.db.types.NVARCHAR,
			dimension: 40
		}),
		numberRange: new table_lib.Field({
			name: "NUMBER_RANGE",
			type: $.db.types.NVARCHAR,
			dimension: 10
		}),
		status: new table_lib.Field({
			name: "STATUS",
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

this.read = function(object) {
    return table.READ({
        where: this.getWhereArray(object),
        join: this.getJoin()
    });
};
this.list = function(object) {
    var prevList = [];
    var where =  this.getWhereArray(object);
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
    var join = [
        {
            table: users,
            alias: 'creationUserData',
            rename: 'creation',
            fields: ['id', 'name', 'last_name'],
            on: [{
                left: 'creationUser',
                right: 'id'
            }]
        }, {
            table: users,
            alias: 'modificationUserData',
            rename: 'modification',
            fields: ['id', 'name', 'last_name'],
            on: [{
                left: 'modificationUser',
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