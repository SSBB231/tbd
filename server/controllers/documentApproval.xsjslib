$.import('timp.core.server.api', 'api');
var core_api = $.timp.core.server.api.api;
var util = core_api.util;
var lodash = core_api.lodash;

$.import('timp.tbd.server.models', 'documentTypeConfig');
var documentTypeConfig = $.timp.tbd.server.models.documentTypeConfig;

$.import('timp.tbd.server.models', 'documentApproval');
var documentApproval = $.timp.tbd.server.models.documentApproval;

$.import('timp.tbd.server.models', 'fileStorage');
var fileStorage = $.timp.tbd.server.models.fileStorage;

$.import('timp.atr.server.api', 'api');
var atr_api = $.timp.atr.server.api.api;
var companyBranches = atr_api.companyBranchesController;

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
		var company = this.listCompanies();
		var branch = this.listBranches();
		var files = fileStorage.list();
		var companies = [];
		var ufs = [];
		var branches = [];
		var storedFiles = [];
		for (var i = 0; i < files.length; i++) {
			if (files[i].eef) {
				for (var m = 0; m < files[i].eef.length; m++) {
					if (files[i].eef[m].idCompany) {
						companies.push(files[i].eef[m].idCompany);
					}
					if (files[i].eef[m].uf) {
						ufs.push(files[i].eef[m].uf);
					}
					if (files[i].eef[m].idBranch) {
						branches.push(files[i].eef[m].idBranch);
					}
				}
			}
			storedFiles.push({
				id: files[i].file[0].id,
				fileName: files[i].file[0].fileName,
				imageUrl: files[i].file[0].link,
				company: lodash.uniq(companies),
				uf: lodash.uniq(ufs),
				branch: lodash.uniq(branches),
				validFrom: files[i].file[0].validFrom,
				validTo: files[i].file[0].validTo,
				securityClassification: files[i].file[0].storageClassification,
				status: files[i].file[0].fileStatus
			});
		}
		return {
			data: object && object.id ? this.read(object) : undefined,
			docTypes: docTypes,
			branches: branch,
			companies: company,
			files: storedFiles
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

	var response = {
		data: [],
		meta: {
			page: 1,
			size: documentApproval.paginate.size
		}
	};

	try {

		if (object.id && !isNaN(object.id)) {
			response.data = documentApproval.read(object);
		} else {
			response.data = documentApproval.list(object);
		}
		var tmp = [];
		for (var i = 0; i < response.data.length; i++) {
			response.data[i].creationUser = response.data[i].creationUserData[0];
			response.data[i].modificationUser = response.data[i].modificationUserData[0];
			delete response.data[i].creationUserData;
			delete response.data[i].modificationUserData;
			tmp.push(response.data[i]);
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

		var response;
		var info = object;

		if (object.id && !isNaN(object.id)) {
            
            var oldObject = this.read({id: object.id});
			response = documentApproval.update({
				info: info
			});
	        var newObject = this.read({id: object.id});
			
			supervisor.updateDocumentApproval(oldObject, newObject);

		} else {

			response = documentApproval.create({
				info: info
			});
			
			supervisor.createDocumentApproval(response.fieldsInfo);

		}
		return response;
	} catch (e) {
		if (object.id && object.id) {
			// No Object or object ID
			supervisor.errorUpdateDocumentApproval(util.parseError(e));
			$.messageCodes.push({
				"code": "TBD201003",
				"type": 'E',
				"errorInfo": util.parseError(e)
			});
			return [];
		} else {
			// An error occurred while trying to create document Approval register
			supervisor.errorCreateDocumentApproval(util.parseError(e));
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
		if (object.id && !isNaN(object.id)) {

			result = documentApproval.delete(object.id);
			var supervisor = new Supervisor();
			supervisor.deleteDocumentApproval(object.id);

		} else {
			var supervisor = new Supervisor();
			$.messageCodes.push({
				"code": "TBD201008",
				"type": 'E',
				"errorInfo": "Needs an object with property id"
			});
			supervisor.errorDeleteDocumentApproval($.messageCodes);
			// Error
			// 			throw 'Needs an object with property id';
		}
	} catch (e) {
		// Error
		var supervisor = new Supervisor();
		supervisor.errorDeleteDocumentApproval(util.parseError(e));
		$.messageCodes.push({
			"code": "TBD201008",
			"type": 'E',
			"errorInfo": util.parseError(e)
		});
	}
	return result;
};


//Endpoint used by Document Approval register because the execution changes the status of the document 
this.updateStatus = function(object) {
	try {
		var approved = false;
		if (object && object.updateStatus && object.status) {
		  //  oldStatus, newStatus
		    var oldStatus = this.read({id:object.id});
			approved = documentApproval.updateApprovalStatus(object);
			if (!approved) {
				$.messageCodes.push({
					"code": "TBD201006",
					"type": 'E',
					"errorInfo": "Status field error"
				});
				var supervisor = new Supervisor();
				supervisor.errorExecuteDocumentApproval($.messageCodes);
			} else {
				var supervisor = new Supervisor();
				supervisor.executeDocumentApproval(object.id, oldStatus.status, object.status);
				//   return null;
			}

		}
		return approved;
	} catch (e) {
		// Error
		var supervisor = new Supervisor();
		supervisor.errorExecuteDocumentApproval(util.parseError(e));
		$.messageCodes.push({
			"code": "TBD201006",
			"type": 'E',
			"errorInfo": util.parseError(e)
		});
	}
};

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
this.listBranches = function(object) {
	object = object || $.request.parameters.get('object') || {};
	try {
		var options = {};
		if (object.idCompany) {
			options.idCompany = typeof object.idCompany === 'string' ? object.idCompany : object.idCompany.toString();
		}
		if (object.uf) {
			options.uf = object.uf;
		}
		var branches = companyBranches.listBranchesByState(object);
		var temp = [];

		return branches.map(function(branch) {
			return {
				key: branch.codFilial,
				name: branch.codFilial
			};
		}).filter(function(value) {
			if (temp.indexOf(value.key) === -1) {
				temp.push(value.key);
				return true;
			}
			return false;
		});
	} catch (e) {
		$.messageCodes.push({
			"code": "MDR241009",
			"type": 'E',
			"errorInfo": util.parseError(e)
		});
		return null;
	}
};

//Update the field isDeleted since it was implemented after the table was created
this.updateIsDeleted = function() {
	var update = false;
	var allRegisters = documentApproval.table.READ({
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

		update = documentApproval.table.UPDATEWHERE({
			'isDeleted': 0
		}, updateWhere);

	}
	return update;
};