$.import('timp.core.server.api', 'api');
var core_api = $.timp.core.server.api.api;
var util = core_api.util;

$.import('timp.tbd.server.models','documentTypeConfig');
var documentTypeConfig = $.timp.tbd.server.models.documentTypeConfig;

$.import('timp.tbd.server.controllers','LogSupervisor');
var Supervisor = $.timp.tbd.server.controllers.LogSupervisor.Supervisor;

// Functions CRUD, no get required information is needed because all the fields are user input
this.read = function(object) {
	object = object || $.request.parameters.get('object') || {};
	if (typeof object === 'string') {
		object = JSON.parse(object);
	}

	try {
		var response = {
			data: [],
			meta: {
				page: 1,
				size: documentTypeConfig.paginate.size
			}
		};
		
		if (object.id) {
			response.data = documentTypeConfig.read(object);
		} else {
			response.data = documentTypeConfig.list(object);
		}
		var tmp = [];
		for (var i = 0; i < response.data.length; i++) {
			response.data[i].creationUser = response.data[i].creationUserData[0];
			response.data[i].modificationUser = response.data[i].modificationUserData[0];
			delete response.data[i].creationUserData;
			delete response.data[i].modificationUserData;
			// 07/06/2016: library results must be ordered by id asc
			tmp.push(response.data[i]);
			// tmp[response.data.length - 1 - i] = response.data[i];
		}
		response.meta.page = response.data.pageCount;
		response.data = tmp;
	
		return object.id ? (response.data ? response.data[0] : response) : response;
	} catch (e) {
		//error message
		$.messageCodes.push({
			"code": "TBD201002",
			"type": 'E',
			"errorInfo": util.parseError(e)
		});
		return e;
	}
};
this.save = function(object) {
    var supervisor = new Supervisor();
	try {
		object = object || $.request.parameters.get('object');
		
        if(object){
            object.isDeleted = 0;
		    var x = new Date(object.validFrom);
            x = new Date(x.setHours( 0 ) );
            x = new Date(x.getTime() - (x.getTimezoneOffset() * 60000)).toISOString();
            object.validFrom = x;
		    if(object.validTo){
		        var y = new Date(object.validTo);
                y = new Date(y.setHours( 0 ) );
                y = new Date(y.getTime() - (y.getTimezoneOffset() * 60000)).toISOString();
                object.validTo = y;
		    }
		}
		
		var response;
		if (object && object.id) {
	        var oldObject = this.read({id: object.id});
		    response = documentTypeConfig.update(object);
		    
	        var newObject = this.read({id: object.id});
	    	supervisor.updateDocumentTypeConfig(oldObject, newObject);
		} else {
		    response = documentTypeConfig.create(object);
	        supervisor.createDocumentTypeConfig(response);
		}
		return response;
	} catch (e) {
		if (object && object.id) {
			// No Object or object ID
			supervisor.errorUpdateDocumentTypeConfig(util.parseError(e));
			$.messageCodes.push({
				"code": "TBD201003",
				"type": 'E',
				"errorInfo": util.parseError(e)
			});
			return [];
		} else {
			// Error
			supervisor.errorCreateDocumentTypeConfig(util.parseError(e));
			$.messageCodes.push({
				"code": "TBD201004",
				"type": 'E',
				"errorInfo": util.parseError(e)
			});
			return [];
		}
	}
};
this.delete = function(object) {
	object = object || $.request.parameters.get('object');
	var result = [];
	try {
		if (object && object.id) {
		    
			    result = documentTypeConfig.delete(object.id);
			    var supervisor = new Supervisor();
			    supervisor.deleteDocumentTypeConfig(object.id);
		    
		} else {
			// Error
			//throw 'Needs an object with property id';
			var supervisor = new Supervisor();
		    $.messageCodes.push({
    			"code": "TBD201008",
    			"type": 'E',
    			"errorInfo": "Needs an object with property id"
    		});
    		supervisor.errorDeleteDocumentTypeConfig($.messageCodes);
		}
	} catch (e) {
		// Error
		var supervisor = new Supervisor();
		supervisor.errorDeleteDocumentTypeConfig(util.parseError(e));
		$.messageCodes.push({
			"code": "TBD201008",
			"type": 'E',
			"errorInfo": util.parseError(e)
		});
	}
	return result;
};

//Update the field isDeleted since it was implemented after the table was created
this.updateIsDeleted = function(){
    var update = false;
    var allRegisters = documentTypeConfig.table.READ({
        fields: ['id', 'isDeleted'],
        where: [{
            field: 'isDeleted', 
            oper: 'IS NULL'
        }]
    });
    if (allRegisters && allRegisters.length > 0){
        var ids = allRegisters.map(function(ele){
            return ele.id;
        });
        var updateWhere = [{
            field: 'id', 
            oper: '=',
            value: ids
        }];
            
        update = documentTypeConfig.table.UPDATEWHERE({
            'isDeleted': 0
        }, updateWhere);
        
    }
    return update;
};