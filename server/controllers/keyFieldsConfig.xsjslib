$.import('timp.core.server.api', 'api');
var core_api = $.timp.core.server.api.api;
var util = core_api.util;
var components = core_api.modelComponents.components;
var privileges = core_api.privilegesController;

//ATR API
$.import('timp.atr.server.api', 'api');
var atr_api = $.timp.atr.server.api.api;
var structureController = atr_api.structureController;
var structureGroupModel = atr_api.structureGroup;

$.import('timp.tbd.server.models', 'keyFieldsConfig');
var keyFieldsConfig = $.timp.tbd.server.models.keyFieldsConfig;

$.import('timp.tbd.server.models', 'documentTypeConfig');
var documentTypeConfig = $.timp.tbd.server.models.documentTypeConfig;

$.import('timp.tbd.server.controllers', 'LogSupervisor');
var Supervisor = $.timp.tbd.server.controllers.LogSupervisor.Supervisor;

//Get the information required to load the options in the UI
this.getRequiredInformation = function(object) {
	try {
		var getDocType = documentTypeConfig.read();
		var docTypes = getDocType.map(function(element) {
			return {
				key: element.docType,
				name: element.docType,
				id: element.id,
				description: element.description
			};
		});

		var structures;
		if (object && object.getStructs) {
			structures = this.getStructures();
		}
		// 		var structures = structureController.listStructures();
		// 		var structures = structureController.listStructures({
		// 			ids: [6, 18, 19, 21, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104]
		// 		});

		var comp = components.READ({
			where: [{
				field: 'name',
				oper: '!=',
				value: 'CORE'
			}, {
				field: 'name',
				oper: '!=',
				value: 'LOG'
			}, {
				field: 'name',
				oper: '!=',
				value: 'UES'
			}, {
				field: 'name',
				oper: '!=',
				value: 'MKT'
			}]
		});
		var componentsLst = comp.map(function(element) {
			return {
				key: element.id,
				name: element.name + " - " + element.description
			};
		});
		return {
			data: object && object.id ? this.read(object) : undefined,
			docTypes: docTypes,
			structureData: structures,
			componentList: componentsLst
		};
	} catch (e) {
		//message error
		$.messageCodes.push({
			"code": "TBD201001",
			"type": 'E',
			"errorInfo": util.parseError(e)
		});
		return null;
	}
};
this.getStructures = function() {
	try {
		return structureController.listStructures();
	} catch (e) {
		//message error
		$.messageCodes.push({
			"code": "MDR244003",
			"type": 'E',
			"errorInfo": util.parseError(e)
		});
		return [];
	}

};

//Functions CRUD
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
				size: keyFieldsConfig.paginate.size
			}
		};

		if (object.id) {
			response.data = keyFieldsConfig.read(object);
		} else {
			response.data = keyFieldsConfig.list(object);
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
		if (typeof object === 'string') {
			object = JSON.parse(object);
		}
		if (object) {
			object.isDeleted = 0;
			var x = new Date(object.validFrom);
			x = new Date(x.setHours(0));
			x = new Date(x.getTime() - (x.getTimezoneOffset() * 60000)).toISOString();
			object.validFrom = x;
			if (object.validTo) {
				var y = new Date(object.validTo);
				y = new Date(y.setHours(0));
				y = new Date(y.getTime() - (y.getTimezoneOffset() * 60000)).toISOString();
				object.validTo = y;
			}
		}

		var keys = object.keys;
		var info = object;
		delete object.keys;
		// return {info:info,keys:keys};
		var response = [];
		if (object.id) {
			var oldObject = this.read({id: Number(object.id)});
			response = keyFieldsConfig.update({
				info: info,
				keys: keys
			});
			var newObject = this.read({id: Number(object.id)});
			
			supervisor.updateKeyFieldsConfig(oldObject, newObject);
		} else {

			response = keyFieldsConfig.create({
				info: info,
				keys: keys
			});
			
			supervisor.createKeyFieldsConfig(response.keyFieldsInfo);

		}
		return response;
	} catch (e) {
		if (object && (object.id)) {
			// No Object or object ID
			supervisor.errorUpdateKeyFieldsConfig(object, util.parseError(e));
			$.messageCodes.push({
				"code": "TBD201003",
				"type": 'E',
				"errorInfo": util.parseError(e)
			});
			return [];
		} else {
			// Error
			supervisor.errorCreateKeyFieldsConfig(util.parseError(e));
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
	if (typeof id === 'string') {
		object = JSON.parse(object);
	}
	var result = null;
	var supervisor = new Supervisor();
	try {
		if (object && object.id) {

			result = keyFieldsConfig.delete(object.id);
			var supervisor = new Supervisor();
			supervisor.deleteKeyFieldsConfig(object.id);

		} else {
			$.messageCodes.push({
				"code": "TBD201008",
				"type": 'E',
				"errorInfo": "Needs an object with property id"
			});
			supervisor.errorDeleteKeyFieldsConfig($.messageCodes);
			// Error
			//throw 'needs an object with property id';
		}
	} catch (e) {
		$.messageCodes.push({
			"code": "TBD201008",
			"type": 'E',
			"errorInfo": util.parseError(e)
		});
		supervisor.errorDeleteKeyFieldsConfig(util.parseError(e));
		// Error
	}
	return result;
};

//Initialize IsDeleted field to 0(zero) from main table
this.updateIsDeleted = function() {
	var update = false;
	var allRegisters = keyFieldsConfig.table.READ({
		fields: ['id', 'isDeleted'],
		where: [{
			field: 'isDeleted',
			oper: 'IS NULL'
        }]
	});
	if (allRegisters && allRegisters.length > 0) {
		var ids = allRegisters.map(function(ele) {
			return ele.id;
		});
		var updateWhere = [{
			field: 'id',
			oper: '=',
			value: ids
        }];

		update = keyFieldsConfig.table.UPDATEWHERE({
			'isDeleted': 0
		}, updateWhere);

	}
	return update;
};