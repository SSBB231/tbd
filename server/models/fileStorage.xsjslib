$.import('timp.core.server.api', 'api');
var core_api = $.timp.core.server.api.api;
var util = core_api.util;
var sql = core_api.sql;
var table_lib = core_api.table_lib;
var view_lib = core_api.view_lib;
var users = core_api.users.table;
var schema = core_api.schema;

$.import('timp.tbd.server.models', 'documentTypeConfig');
var documentTypeConfig = $.timp.tbd.server.models.documentTypeConfig.table;

$.import('timp.tbd.server.models', 'keyFieldsConfig');
var keyFieldsConfig = $.timp.tbd.server.models.keyFieldsConfig.table;

$.import('timp.atr.server.api', 'api');
var atr_api = $.timp.atr.server.api.api;
var tributoModel = atr_api.tributo.table;

var table = new table_lib.Table({
    component: 'TBD',
    name: schema.default +'."TBD::FileStorage"',
    tags: false,
    default_fields: 'common',
    fields: {
        id: new table_lib.AutoField({
            pk: true,
            name: "ID",
            auto: schema.
            default +'."TBD::FileStorage::ID".nextval',
            type: $.db.types.INTEGER
        }),
        docTypeId: new table_lib.Field({
			name: "DOCUMENT_TYPE_ID",
			type: $.db.types.INTEGER
		}),
		fileName: new table_lib.Field({
			name: "FILE_NAME",
			type: $.db.types.NVARCHAR,
			dimension: 40
		}),
		imageUrl: new table_lib.Field({
			name: "IMAGE_URL",
			type: $.db.types.NVARCHAR,
			dimension: 1024
		}),
		keyField1: new table_lib.Field({
			name: "KEY_FIELD_1",
			type: $.db.types.NVARCHAR,
			dimension: 20
		}),
		keyField2: new table_lib.Field({
			name: "KEY_FIELD_2",
			type: $.db.types.NVARCHAR,
			dimension: 20
		}),
		status: new table_lib.Field({
			name: "STATUS",
			type: $.db.types.INTEGER
		}),
	    securityClassification: new table_lib.Field({
			name: "SECURITY_CLASSIFICATION",
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
		    type: $.db.types.INTEGER,
		    default: 0
		}),
		component: new table_lib.Field({
			name: "COMPONENT",
			type: $.db.types.NVARCHAR,
			dimension: 4
		})
    }
});
this.table = table;

var tableEEF = new table_lib.Table({
    component: 'TBD',
	name: schema.default+'."TBD::FileStorageEEF"',
	tags: false,
	fields: {
		id: new table_lib.AutoField({
			pk: true,
			name: "ID",
			auto: schema.default+'."TBD::FileStorageEEF::ID".nextval',
			type: $.db.types.INTEGER
		}),
		idConfiguration: new table_lib.Field({
			name: 'ID_CONFIGURATION',
			type: $.db.types.INTEGER
		}),
		idCompany: new table_lib.Field({
		    name: 'ID_COMPANY',
		    type: $.db.types.NVARCHAR,
		    dimension: 4
		}),
		uf: new table_lib.Field({
		    name: 'UF',
		    type: $.db.types.NVARCHAR,
		    dimension: 2
		}),
		idBranch: new table_lib.Field({
		    name: 'ID_BRANCH',
		    type: $.db.types.NVARCHAR,
		    dimension: 4
		})
	}
});
this.tableEEF = tableEEF;

var tableTax = new table_lib.Table({
   component: 'TBD',
    name: schema.default +'."TBD::FileStorageTax"',
    tags: false,
    default_fields: 'common',
    fields: {
        id: new table_lib.AutoField({
            pk: true,
            name: "ID",
            auto: schema.
            default +'."TBD::FileStorageTax::ID".nextval',
            type: $.db.types.INTEGER
        }),
        idConfiguration: new table_lib.Field({
            name: 'ID_CONFIGURATION',
            type: $.db.types.INTEGER
        }),
        idTax: new table_lib.Field({
            name: 'TAX',
            type: $.db.types.NVARCHAR,
            dimension: 4
        })
    }
});
this.tableTax = tableTax;

// For the security classification, used on security: 2 - Restricted
// Creation user of the file is saved by default
var tableUsers = new table_lib.Table({
   component: 'TBD',
    name: schema.default +'."TBD::FileStorageUsers"',
    tags: false,
    default_fields: 'common',
    fields: {
        id: new table_lib.AutoField({
            pk: true,
            name: "ID",
            auto: schema.
            default +'."TBD::FileStorageUsers::ID".nextval',
            type: $.db.types.INTEGER
        }),
        idConfiguration: new table_lib.Field({
            name: 'ID_CONFIGURATION',
            type: $.db.types.INTEGER
        }),
        idUser: new table_lib.Field({
            name: 'ID_USER',
            type: $.db.types.INTEGER
        })
    }
});
this.tableUsers = tableUsers;

// For the security classification, used on security: 2 - Restricted
var tableGroups = new table_lib.Table({
   component: 'TBD',
    name: schema.default +'."TBD::FileStorageGroups"',
    tags: false,
    default_fields: 'common',
    fields: {
        id: new table_lib.AutoField({
            pk: true,
            name: "ID",
            auto: schema.
            default +'."TBD::FileStorageGroups::ID".nextval',
            type: $.db.types.INTEGER
        }),
        idConfiguration: new table_lib.Field({
            name: 'ID_CONFIGURATION',
            type: $.db.types.INTEGER
        }),
        idGroup: new table_lib.Field({
            name: 'ID_GROUP',
            type: $.db.types.INTEGER
        })
    }
});
this.tableGroups = tableGroups;

// File storage view that brings all the information
var fileStorageView = new view_lib.View({
	component: 'TBD',
	name: '"_SYS_BIC"."timp.tbd.modeling/CV_FILE_STORAGE"',
	fields: {
	    id: new view_lib.Field({
			name: "ID",
			type: $.db.types.INTEGER
		}),
		docTypeId: new view_lib.Field({
			name: 'DOCUMENT_TYPE_ID',
			type: $.db.types.INTEGER
		}),
		company: new view_lib.Field({
			name: 'ID_COMPANY',
			type: $.db.types.NVARCHAR,
			dimension: 4
		}),
		branch: new view_lib.Field({
			name: 'ID_BRANCH',
			type: $.db.types.NVARCHAR,
			dimension: 4
		}),
		uf: new view_lib.Field({
			name: 'UF',
			type: $.db.types.NVARCHAR,
			dimension: 4
		}),
		tax: new view_lib.Field({
			name: 'TAX',
			type: $.db.types.NVARCHAR,
			dimension: 4
		}),
		taxLabel: new view_lib.Field({
			name: 'TAX_LABEL',
			type: $.db.types.NVARCHAR,
			dimension: 255
		}),
		keyField1: new view_lib.Field({
			name: 'KEY_FIELD_1',
			type: $.db.types.NVARCHAR,
			dimension: 20
		}),
		keyField2: new view_lib.Field({
			name: 'KEY_FIELD_2',
			type: $.db.types.NVARCHAR,
			dimension: 20
		}),
		link: new view_lib.Field({
			name: 'IMAGE_URL',
			type: $.db.types.NVARCHAR,
			dimension: 1024
		}),
		fileName: new view_lib.Field({
			name: 'FILE_NAME',
			type: $.db.types.NVARCHAR,
			dimension: 40
		}),
		approvalDate: new view_lib.Field({
			name: 'APPROVAL_DATE',
			type: $.db.types.TIMESTAMP
		}),
		comments: new view_lib.Field({
			name: 'COMMENTS',
			type: $.db.types.NVARCHAR,
			dimension: 60
		}),
		fileStatus: new view_lib.Field({
			name: 'STATUS',
			type: $.db.types.INTEGER
		}),
		creationDate: new view_lib.Field({
            name: 'CREATION_DATE',
            type: $.db.types.TIMESTAMP
        }),
        modificationDate: new view_lib.Field({
            name: 'MODIFICATION_DATE',
            type: $.db.types.TIMESTAMP
        }),
		creationUsername: new view_lib.Field({
			name: 'CREATION_USERNAME',
			type: $.db.types.NVARCHAR,
			dimension: 255
		}),
		creationIdUser: new view_lib.Field({
			name: 'CREATION_ID_USER',
			type: $.db.types.INTEGER
		}),
		modificationUsername: new view_lib.Field({
			name: 'MODIFICATION_USERNAME',
			type: $.db.types.NVARCHAR,
			dimension: 255
		}),
		validFrom: new view_lib.Field({
            name: 'STORAGE_VALID_FROM',
            type: $.db.types.DATE
        }),
        validTo: new view_lib.Field({
            name: 'STORAGE_VALID_TO',
            type: $.db.types.DATE
        }),
        storageClassification: new view_lib.Field({
			name: 'STORAGE_CLASSIFICATION',
			type: $.db.types.INTEGER
		})
	}
});
this.fileStorageView = fileStorageView;

//Views needed to actually implement the security, since the old ORM did not support union and the view did not support session_user 
//The process was implemented separately. The view brings the union and the session user is implemented here in the controller
var fileStorageFilteredView = new view_lib.View({
	component: 'TBD',
	name: '"_SYS_BIC"."timp.tbd.modeling/CV_FILES_STORAGE_FILTERED"',
	fields: {
	    id: new view_lib.Field({
			name: "FILE_ID",
			type: $.db.types.INTEGER
		}),
		fileId: new view_lib.Field({
			name: "FILE_ID",
			type: $.db.types.INTEGER
		}),
		userHana: new view_lib.Field({
			name: 'USER_HANA_USER',
			type: $.db.types.NVARCHAR,
			dimension: 255
		}),
	    groupsHana: new view_lib.Field({
			name: 'GROUPS_HANA_USER',
			type: $.db.types.NVARCHAR,
			dimension: 255
		}),
		restrictedHana: new view_lib.Field({
			name: 'RESTRICTED_HANA_USER',
			type: $.db.types.NVARCHAR,
			dimension: 255
		}),
		securityClassification: new view_lib.Field({
			name: "PUBLIC_SECURITY_CLASSIFICATION",
			type: $.db.types.INTEGER
		})
	}
});
this.fileStorageFilteredView = fileStorageFilteredView;

var fileStorageUsersView = new view_lib.View({
	component: 'TBD',
	name: '"_SYS_BIC"."timp.tbd.modeling/CV_FILE_STORAGE_USERS"',
	fields: {
	    id: new view_lib.Field({
			name: "ID_TABLE",
			type: $.db.types.INTEGER
		}),
		fileId: new view_lib.Field({
			name: "FILE_ID",
			type: $.db.types.INTEGER
		}),
		userHana: new view_lib.Field({
			name: 'USER_HANA_USER',
			type: $.db.types.NVARCHAR,
			dimension: 32
		}),
	    idUser: new view_lib.Field({
            name: 'ID_USER',
            type: $.db.types.INTEGER
        })
	}
});
this.fileStorageUsersView = fileStorageUsersView;

var fileStorageGroupsView = new view_lib.View({
	component: 'TBD',
	name: '"_SYS_BIC"."timp.tbd.modeling/CV_FILE_STORAGE_GROUPS"',
	fields: {
	    id: new view_lib.Field({
			name: "ID_TABLE",
			type: $.db.types.INTEGER
		}),
		fileId: new view_lib.Field({
			name: "FILE_ID",
			type: $.db.types.INTEGER
		}),
		hanaUser: new view_lib.Field({
			name: 'HANA_USER',
			type: $.db.types.NVARCHAR,
			dimension: 32
		}),
	    idUser: new view_lib.Field({
            name: 'USER_ID',
            type: $.db.types.INTEGER
        }),
        idGroup: new view_lib.Field({
            name: 'GROUP_ID',
            type: $.db.types.INTEGER
        })
	}
});
this.fileStorageGroupsView = fileStorageGroupsView;

this.paginate = {   //Returns 'pageCount' with the total of pages
    size: 15,       //What is the page size?
    number: 1,      //What is the page number?
    count: true     //Do you want a total of pages?
};

//Functions CRUD
this.create = function(object) {
    var createTax = [];
    var createGroups = [];
    var createUsers = [];
    var eef = [];
    var createdConfiguration = table.CREATE(object);
   
    if(object && object.tax){
        object.tax.forEach(function(tax){
            createTax.push(tableTax.CREATE({
                idConfiguration: createdConfiguration.id,
                idTax: tax
            }));
        });
    }
    
    if (createdConfiguration) {
		if (object.eef && object.eef.length > 0) {
			object.eef.forEach(function(ele) {
				var o = {
					idConfiguration: createdConfiguration.id,
					idCompany: ele.idCompany,
					uf: ele.uf || null,
					idBranch: ele.idBranch || null
				};
				var createdEEF = tableEEF.CREATE(o);
				eef.push(createdEEF);
			});
		}
    }
    
    if(object && object.users){
        object.users.forEach(function(user){
            createUsers.push(tableUsers.CREATE({
                idConfiguration: createdConfiguration.id,
                idUser: user
            }));
        });
    }
    if(object && object.groups){
        object.groups.forEach(function(group){
            createGroups.push(tableGroups.CREATE({
                idConfiguration: createdConfiguration.id,
                idGroup: group
            }));
        });
    }
    return {
        fieldsInfo: createdConfiguration,
        tax: createTax,
        eef: eef,
        users: createUsers,
        groups: createGroups
    };
};
this.read = function(object) {
    return table.READ({
        where: this.readWhere(object),
        join: this.readJoin(),
        simulate: false
    });
};
this.list = function(object) {
    var prevList = [];
    var where = [];
    var pageCount = 1;
    
    if(object && object.page){
        prevList = fileStorageFilteredView.READ({
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
            return item.fileId;
    	});
    	where = [{
            field: 'fileId',
            oper: '=',
            value: ids
    	}];
    	pageCount = prevList.pageCount;
    }
    
    var response =  fileStorageFilteredView.READ({
        where: object && object.page ? where : this.getWhereArray(object),
        join: this.getJoin(),
        simulate: false
    });
    response.pageCount = pageCount;
    return response;
};
this.update = function(object) {
    var id = object.id;
    
    var createTax = [];
    var createGroups = [];
    var createUsers = [];
    var createdConfiguration = table.UPDATE(object);
    var eef = [];
    
    if(object && object.tax.length > 0){
        tableTax.DELETEWHERE([
            {field:'idConfiguration',oper:'=',value: id}
        ]);
        object.tax.forEach(function(tax){
            createTax.push(tableTax.CREATE({
                idConfiguration: id,
                idTax: tax
            }));
        });
    }
    
    if (object && object.id) {
        tableEEF.DELETEWHERE([
            {field:'idConfiguration',oper:'=',value: id}
        ]);
		if (object.eef && object.eef.length > 0) {
			object.eef.forEach(function(ele) {
				var o = {
					idConfiguration: object.id,
					idCompany: ele.idCompany,
					uf: ele.uf || null,
					idBranch: ele.idBranch || null
				};
				var createdEEF = tableEEF.CREATE(o);
				eef.push(createdEEF);
			});
		}
    }
    
    if(object && object.users){
        var users = tableUsers.DELETEWHERE([
            {field:'idConfiguration',oper:'=',value: id}
        ]);
        object.users.forEach(function(user){
            createUsers.push(tableUsers.CREATE({
                idConfiguration: id,
                idUser: user
            }));
        });
    }
    if(object && object.groups){
        var groups = tableGroups.DELETEWHERE([
            {field:'idConfiguration',oper:'=',value: id}
        ]);
        object.groups.forEach(function(group){
            createGroups.push(tableGroups.CREATE({
                idConfiguration: id,
                idGroup: group
            }));
        });
    }
    return {
        fieldsInfo: {id: id},
        eef: eef,
        tax: createTax,
        users: createUsers,
        groups: createGroups
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

this.getJoin = function() {
    var join = [{
        table: fileStorageView,
        alias:'file',
        // fields:['id','docType','description'],
        on:[{
            left:'fileId',
            right:'id'
        }],
        outer: 'left'
    }, {
        table: documentTypeConfig,
        alias:'documentTypeConfig',
        fields:['id','docType','description'],
        on:[{
            left_table: fileStorageView,
            left:'docTypeId',
            right:'id'
        }]
    }, {
        table: tableEEF,
        alias:'eef',
        fields:['id','idConfiguration','idCompany', 'uf','idBranch'],
        on:[{
            left_table: fileStorageView,
            left:'id',
            right:'idConfiguration'
        }],
        outer: 'left'
    }, {
        table: tableTax,
        alias:'tax',
        fields:['id','idConfiguration','idTax'],
        on:[{
            left_table: fileStorageView,
            left:'id',
            right:'idConfiguration'
        }],
        outer: 'left'
    }, {
        table: tributoModel,
        alias:'taxData',
        fields:['id','codTributo','descrCodTributoLabel'],
        on:[{
            left_table: tableTax,
            left:'idTax',
            right:'codTributo'
        }],
        outer: 'left'
    }];
    return join;
};
this.readJoin = function() {
    var join = [{
        table: documentTypeConfig,
        alias:'documentTypeConfig',
        fields:['id','docType','description'],
        on:[{
            left:'docTypeId',
            right:'id'
        }]
    }, {
        table: tableEEF,
        alias: 'eef',
        on: [{left:'id',right:'idConfiguration'}],
        outer: 'left'
    },{
        table: tableTax,
        alias:'tax',
        fields:['id','idConfiguration','idTax'],
        on:[{
            left:'id',
            right:'idConfiguration'
        }],
        outer: 'left'
    }, {
        table: tributoModel,
        alias:'taxData',
        fields:['id','codTributo','descrCodTributoLabel'],
        on:[{
            left_table: tableTax,
            left:'idTax',
            right:'codTributo'
        }],
        outer: 'left'
    }, {
        table: fileStorageUsersView,
        alias:'users',
        on:[{
            left:'id',
            right:'fileId'
        }],
        outer: 'left'
    }, {
        table: fileStorageGroupsView,
        alias:'groups',
        on:[{
            left:'id',
            right:'fileId'
        }],
        outer: 'left'
    }];
    return join;
};
this.getWhereArray = function(object) {
    var where = [];
    var hanaUser = $.session.getUsername().toUpperCase();
    where.push([
        [{field: 'userHana', oper: 'IS NULL', not: true}, {field: "userHana", oper: "=", value: hanaUser}],
        [{field: 'groupsHana', oper: 'IS NULL', not: true}, {field: "groupsHana", oper: "=", value: hanaUser}],
        [{field: 'restrictedHana', oper: 'IS NULL', not: true}, {field: "restrictedHana", oper: "=", value:hanaUser}],
        [{field: 'securityClassification', oper: '=', value: 1}]
    ]);
    
    if (object && object.filterBy && object.filterBy.id) {
        where.push({
            field: 'fileId',
            oper: '=',
            value: Number(object.filterBy.id)
        });
    }
    return where;
    
};
this.readWhere = function(object) {
    var where = [];
    
    for (var key in object) {
        if (key !== 'lang' && key !== 'page') {
            where.push({
                field: key,
                oper: '=',
                value: object[key]
            });
        }
    }
    return where;
};


