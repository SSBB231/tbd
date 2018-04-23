$.import('timp.core.server.api', 'api');
var core_api = $.timp.core.server.api.api;
var util = core_api.util;
const usersControlller = core_api.usersController;

$.import('timp.atr.server.api', 'api');
var atr_api = $.timp.atr.server.api.api;
var companyBranches = atr_api.companyBranchesController;
var companyBranchesModel = atr_api.companyBranches.table;
var tributo = atr_api.tributo;

$.import('timp.tbd.server.models', 'documentTypeConfig');
var documentTypeConfig = $.timp.tbd.server.models.documentTypeConfig;

$.import('timp.tbd.server.models', 'fileStorage');
var fileStorage = $.timp.tbd.server.models.fileStorage;

$.import('timp.tbd.server.controllers', 'LogSupervisor');
var Supervisor = $.timp.tbd.server.controllers.LogSupervisor.Supervisor;

//Get the information required to load the options in the UI
this.getRequiredInformation = function(object) {
	try {
		var object = object || {};
		var companies = [];
		var empresas = companyBranches.listDistinctCompanies();
		empresas.forEach(function(ele) {
			companies.push({
				key: ele.codEmpresa,
				name: ele.codEmpresa
			});
		});
		var branches = this.listBranches(object);

		var getDocType = documentTypeConfig.list();
		var docTypes = getDocType.map(function(element) {
			return {
				key: element.docType,
				name: element.docType,
				id: element.id,
				description: element.description
			};
		});
		var taxes = this.getTributos();
		var ufs = this.listUfs(object);
		return {
			data: object && object.id ? this.read(object) : undefined,
			docTypes: docTypes,
			companies: companies,
			branches: branches,
			taxes: taxes,
			ufs: ufs
		};

	} catch (e) {
		//error message
		$.messageCodes.push({
			"code": "TBD201001",
			"type": 'E',
			"errorInfo": util.parseError(e)
		});
		return e;
	}
};

//Functions CRUD
this.read = function(object) {
	object = object || $.request.parameters.get('object') || {};
	if (typeof object === 'string') {
		object = JSON.parse(object);
	}
	// return fileStorage.list(object);
	try {
		var response = {
			data: [],
			meta: {
				page: 1,
				size: fileStorage.paginate.size
			}
		};

		if (object.id) {
			response.data = fileStorage.read(object);
		} else {
			response.data = fileStorage.list(object);
		}
		// 			return response
		// 			var tmp = [];
		// 			for (var i = 0; i < response.data.length; i++) {
		// 				response.data[i].creationUser = response.data[i].creationUserData[0];
		// 				response.data[i].modificationUser = response.data[i].modificationUserData[0];
		// 				delete response.data[i].creationUserData;
		// 				delete response.data[i].modificationUserData;
		// 				// 07/06/2016: library results must be ordered by id asc
		// 				tmp.push(response.data[i]);
		// 				// tmp[response.data.length - 1 - i] = response.data[i];
		// 			}
		response.meta.page = response.data.pageCount;
		// 			response.data = tmp;

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
		if (object) {
			object.isDeleted = 0;
			object.component = object.component;
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

		var response = [];
		if (object.id) {
            var oldObject = this.read({id: object.id});
			response = fileStorage.update(object);
            var newObject = this.read({id: object.id});
            
			supervisor.updateFileStorage(oldObject, newObject);
		} else {
			response = fileStorage.create(object);
			supervisor.createFileStorage(response.fieldsInfo);
		}
		return response;
	} catch (e) {
		if (object && object.id) {
			// No Object or object ID
			supervisor.errorUpdateFileStorage(util.parseError(e));
			$.messageCodes.push({
				"code": "TBD201003",
				"type": 'E',
				"errorInfo": util.parseError(e)
			});
			return [];
		} else {
			// Error
			supervisor.errorCreateFileStorage(util.parseError(e));
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
	var result = null;
	try {
		if (object && object.id) {

			result = fileStorage.delete(object.id);
			var supervisor = new Supervisor();
			supervisor.deleteFileStorage(object.id);

		} else {
			var supervisor = new Supervisor();
			$.messageCodes.push({
				"code": "TBD201008",
				"type": 'E',
				"errorInfo": "Needs an object with property id"
			});
			supervisor.errorDeleteFileStorage($.messageCodes);
			//error
			//throw 'Needs an object with property id';
		}
	} catch (e) {
		//error
		$.messageCodes.push({
			"code": "TBD201008",
			"type": 'E',
			"errorInfo": util.parseError(e)
		});
		var supervisor = new Supervisor();
		supervisor.errorDeleteFileStorage(util.parseError(e));
	}
	return result;
};

//Information for the fields
this.listCompanies = function(object) {
	object = object || $.request.parameters.get('object') || {};
	try {
		var companies = companyBranches.listDistinctCompanies();
		var response = [];

		for (var i = 0; i < companies.length; i++) {
			response.push({
				key: companies[i].codEmpresa,
				name: companies[i].codEmpresa
			});
		}
		return response;
	} catch (e) {
		$.messageCodes.push({
			"code": "MDR241007",
			"type": 'E',
			"errorInfo": util.parseError(e)
		});
		return null;
	}
};
this.listUfs = function(object) {
	try {
		var response = [];
		var states = companyBranchesModel.getCompanies(object.idCompany);
		var stateCompanyMap = {};
		if (states) {
			for (var x = 0; x < states.length; x++) {
				stateCompanyMap[states[x].ufFilial] = stateCompanyMap[states[x].ufFilial] || [];
				stateCompanyMap[states[x].ufFilial].push(states[x].codEmpresa);
			}
			Object.keys(stateCompanyMap).forEach(function(stateKey) {
				response.push({
					key: stateKey,
					name: stateKey,
					idCompany: stateCompanyMap[stateKey]
				});
			});
		}
		return response;
	} catch (e) {
		$.messageCodes.push({
			"code": "",
			"type": 'E',
			"errorInfo": util.parseError(e)
		});
	}
	return [];
};
this.listBranches = function(object) {
	var result = [];
	try {
		var response = [];
		if (object && object.hasOwnProperty('companyUf') && Array.isArray(object.companyUf) && object.companyUf.length > 0) {
			var where = [];
			var conditions = [];
			object.companyUf.forEach(function(companyUf) {
				conditions.push([
					{
						field: 'codEmpresa',
						oper: '=',
						value: companyUf.idCompany
					},
					{
						field: 'ufFilial',
						oper: '=',
						value: companyUf.uf
					}
		        ]);
			});
			if (conditions.length > 0) {
				where.push(conditions);
			}
			var branchList = companyBranchesModel.READ({
				fields: ['codEmpresa', 'ufFilial', 'codFilial'],
				where: where,
				simulate: object.simulate
			});
			if (object.simulate) {
				return branchList;
			}
			response = branchList.map(function(ele) {
				return {
					name: ele.codEmpresa + " - " + ele.codFilial,
					key: ele.codEmpresa + "_" + ele.ufFilial + "_" + ele.codFilial
				};
			});
		} else {
			var branches = companyBranches.listBranchesByState(object);
			if (branches) {
				response = branches.map(function(ele) {
					return {
						name: ele.codEmpresa + " - " + ele.codFilial,
						key: ele.codEmpresa + "_" + ele.ufFilial + "_" + ele.codFilial
					};
				});
			}
		}
		return response;
	} catch (e) {
		$.messageCodes.push({
			"code": "",
			"type": 'E',
			"errorInfo": util.parseError(e)
		});
	}
	return result;
};
this.listTax = function(object) {
	try {
		var result = [];
		object = object || $.request.parameters.get('object');
		if (typeof object === 'string') {
			object = JSON.parse(object);
		}
		var response = atr_api.tributo.table.READ({
			distinct: true,
			fields: ['codTributo', 'descrCodTributoLabel']
		});
		for (var i = 0; i < response.length; i++) {
			result.push({
				key: response[i].codTributo,
				name: response[i].descrCodTributoLabel
			});
		}
		return result;
	} catch (e) {
		$.messageCodes.push({
			"code": "MDR244002",
			"type": 'E',
			"errorInfo": util.parseError(e)
		});
		return null;
	}
};
this.getTributos = function() {
	try {
		var result = tributo.table.READ({
			fields: ['codTributo', 'descrCodTributoLabel'],
			distinct: true
		});

		var response = [];
		for (var i = 0; i < result.length; i++) {
			response.push({
				key: result[i].codTributo,
				name: result[i].descrCodTributoLabel
			});
		}
		return response;
	} catch (e) {
		$.messageCodes.push({
			'code': 'MDR248013',
			'type': 'E',
			"errorInfo": util.parseError(e)
		});
	}
};

//Get the information required to load the options in the UI
this.listUsers = function() {
	var result = [];
	try {
		result = usersControlller.listAllUsers();
	} catch (e) {
		//error
		$.messageCodes.push({
			"code": "TBD201001",
			"type": 'E',
			"errorInfo": util.parseError(e)
		});
	}
	return result;
};
this.listGroups = function() {
	var result = [];
	try {
		result = usersControlller.listGroups();
	} catch (e) {
		//error
		$.messageCodes.push({
			"code": "TBD201001",
			"type": 'E',
			"errorInfo": util.parseError(e)
		});
	}
	return result;
};

//Initialize IsDeleted field from main table
this.updateIsDeleted = function() {
	var update = false;
	var allRegisters = fileStorage.table.READ({
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

		update = fileStorage.table.UPDATEWHERE({
			'isDeleted': 0
		}, updateWhere);

	}
	return update;
};

//Update Security Classification to public for past files
this.updateSecurityClassification = function() {
	var update = false;
	var allRegisters = this.fileStorage.table.READ({
		fields: ['id', 'securityClassification']
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

		update = this.fileStorage.table.UPDATEWHERE({
			'securityClassification': 1
		}, updateWhere);

	}
	return update;
};

//migrate all data from codEmpresa, uf, codFilial tables to one single eef table
this.migrateFileStorageEEF = function() {
	var createdList = [];
	try {
		var idList = fileStorage.table.READ({
			fields: ['id'],
			join: [{
				outer: 'left',
				alias: 'eef',
				table: fileStorage.tableEEF,
				on: [{
					left: 'id',
					right: 'idConfiguration'
				}]
            }]
		});
		var uncoveredEEF = idList.filter(function(elem) {
			return elem.eef.length === 0;
		});
		uncoveredEEF.forEach(function(elem) {
			//create eef registers
			var companies = fileStorage.tableCompany.READ({
				where: [{
					field: 'idConfiguration',
					oper: '=',
					value: elem.id
				}]
			});
			var ufs = fileStorage.tableRegion.READ({
				where: [{
					field: 'idConfiguration',
					oper: '=',
					value: elem.id
				}]
			});
			var branches = fileStorage.tableBranch.READ({
				where: [{
					field: 'idConfiguration',
					oper: '=',
					value: elem.id
				}]
			});
			branches.forEach(function(br) {
				var eef = {
					idConfiguration: elem.id,
					idCompany: companies[0].codEmpresa,
					uf: ufs[0].uf,
					idBranch: br.codFilial
				};
				var created = fileStorage.tableEEF.CREATE(eef);
				createdList.push(created);
			});
		});
	} catch (e) {
		return util.parseError(e);
	}
	return createdList;
};