$.import('timp.core.server.api', 'api');
var core_api = $.timp.core.server.api.api;
var util = core_api.util;
var lodash = core_api.lodash;
var components = core_api.modelComponents.components;

$.import('timp.atr.server.api','api');
var atr_api = $.timp.atr.server.api.api;
var structureController = atr_api.structureController;
var companyBranches = atr_api.companyBranchesController;
var tributosModel = atr_api.tributo.table;

$.import('timp.tbd.server.models','documentConsulting');
var documentConsulting = $.timp.tbd.server.models.documentConsulting;
    
$.import('timp.tbd.server.models','fileStorage');
var fileStorage = $.timp.tbd.server.models.fileStorage;

this.getRequiredInformation = function(object){
    try{
        var data = this.read(object);
        return  {
            data: data 
        };
    }catch(e){
        //error message
        $.messageCodes.push({"code": "TBD201001","type": 'E',"errorInfo": util.parseError(e)});
        return e;
    }
};

this.listAdvancedFilters = function(object){
    try{
        var response = {};
        response = {
            listFilters: this.getLibraryFilters()
        };
        return response;
    }catch(e){
        //error message
        $.messageCodes.push({"code": "TBD201001","type": 'E',"errorInfo": util.parseError(e)});
        return e;
    }
};

this.listCompanies = function() {
    try {
        var listCompanies = atr_api.companyBranchesController.listCompanies();
        var response = [];
        for (var i = 0; i < listCompanies.length; i++) {
            if (listCompanies[i].hasOwnProperty("codEmpresa")) {
                var jsonCodEmpresa = {
                    key: listCompanies[i].codEmpresa,
                    text: listCompanies[i].codEmpresa
                };
                response.push(jsonCodEmpresa);
            }
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
this.listBranches = function(object) { // send codEmprese instead of idCompany
    try {
        if (!object) {
            var object = {};
        }
        var listBranchesByState = atr_api.companyBranchesController.listBranchesByState(object);

        if (listBranchesByState) {
            var response = [];
            for (var i = 0; i < listBranchesByState.length; i++) {
                if (listBranchesByState[i].hasOwnProperty("codFilial")) {
                    var jsonCodFilial = {
                        key: listBranchesByState[i].codFilial,
                        text: listBranchesByState[i].codFilial
                    };
                    response.push(jsonCodFilial);
                }
            }
            return response;
        }
    } catch (e) {
        $.messageCodes.push({
            "code": "MDR241009",
            "type": 'E',
            "errorInfo": util.parseError(e)
        });
        return null;
    }
};
this.listUf = function(object) {
    try {
        var response = [];
        var jsonUf = {};
        if (object) {
            var arrayValue = atr_api.companyBranchesController.listCompanyStates({
                codEmpresa: object.codEmpresa
            }); // should be idCompany for a while we will use codEmpresa
        } else {
            arrayValue = atr_api.companyBranchesController.listCompanyStates();
        }
        for (var j = 0; j < arrayValue.length; j++) {
            response.push({
                key: jsonUf.key = arrayValue[j],
                text: jsonUf.text = arrayValue[j]
            });
        }
        return response;
    } catch (e) {
        $.messageCodes.push({
            "code": "TFP001063",
            "type": 'E',
            "errorInfo": util.parseError(e)
        });
        return null;
    }
};
this.listTax = function() {
    try {
        var getTributos = atr_api.tributo.table.getTributosLabel();
        var response = [];
        for (var i = 0; i < getTributos.length; i++) {
            if (getTributos[i].hasOwnProperty("codTributo")) {
                var jsonCodTributo = {
                    key: getTributos[i].codTributo,
                    name: getTributos[i].descrCodTributoLabel
                };
                response.push(jsonCodTributo);
            }
        }
        return response;
    } catch (e) {
        $.messageCodes.push({
            "code": "MDR244002",
            "type": 'E',
            "errorInfo": util.parseError(e)
        });
        return null;
    }
};

this.getLibraryFilters = function() {
    try {
        var listFilters = {
            companies: [],
            branches: [],
            uf: [],
            taxes: [],
            creationUsers: [],
            modificationUsers: []
        };
        
        listFilters.docTypes = []; //docTypes;
        
        var files = fileStorage.list();
        var keyField1 = [];
        var keyField2 = [];
        var company = [];
        var branch = [];
        var uf = [];
        var tax = [];
        var storedFiles = [];
        var docType =[];
        
        for(var i = 0; i < files.length; i ++){
            
            if(files[i].eef){
			    for (var m = 0; m < files[i].eef.length; m++){
				    if(files[i].eef[m].idCompany ){
				        company.push({
				            key: files[i].eef[m].idCompany,
				            name: files[i].eef[m].idCompany
				        });
				    }
				    if(files[i].eef[m].uf){
				        uf.push({
				            key: files[i].eef[m].uf,
				            text: files[i].eef[m].uf,
				            company: files[i].eef[m].idCompany
				        });
				    }
				    if(files[i].eef[m].idBranch){
				        branch.push({
				            key: files[i].eef[m].idBranch,
				            text: files[i].eef[m].idBranch,
				            company: files[i].eef[m].idCompany,
				            uf: files[i].eef[m].uf
				        });
				    }
				}
			}
			
			if(!lodash.isNil(files[i].documentTypeConfig)){
                docType.push({ key: files[i].documentTypeConfig[0].id, name:files[i].documentTypeConfig[0].docType + " - " + files[i].documentTypeConfig[0].description });
            }
			if(!lodash.isNil(files[i].file[0].keyField1)){
                keyField1.push({ key: files[i].file[0].keyField1, name: files[i].file[0].keyField1 });
            }
            
            for (var j = 0; j < files[i].taxData.length; j++){
                tax.push({
                    key:  files[i].taxData[j].codTributo, 
                    name:  files[i].taxData[j].descrCodTributoLabel 
                });
            }
            
            if(!lodash.isNil(files[i].file[0].keyField2)){
                keyField2.push({ key: files[i].file[0].keyField2, name: files[i].file[0].keyField2 });
            }
			storedFiles.push({
			    key: files[i].file[0].id,
                name: files[i].file[0].id + ' - ' + files[i].file[0].fileName,
                docTypeId: files[i].file[0].docTypeId,
				imageUrl: files[i].file[0].link,
		        securityClassification: files[i].file[0].storageClassification
		    });
        }

        listFilters.files = storedFiles; //lodash.uniq(storedFiles);
        listFilters.keyField1 = lodash.uniq(keyField1);
        listFilters.keyField2 = lodash.uniq(keyField2);
        
        listFilters.companies = lodash.uniq(company);
        listFilters.branches = lodash.uniq(branch);
        listFilters.uf = lodash.uniq(uf);
        listFilters.taxes = lodash.uniq(tax);
        listFilters.docTypes = lodash.uniq(docType);
        
        // listFilters.securityClassification = lodash.uniq(securityClassification);
        
        var lang = $.request.cookies.get("Content-Language");
        lang = lang === "ptrbr" ? lang : 'enus';
        
        //Document Type configuration status
        listFilters.status = [{
            key: 1,
            name: lang == 'enus' ? 'Creation' : 'Criação'
        }, {
            key: 2,
            name:lang == 'enus' ? 'Pending' : 'Pendente'
        }, {
            key: 3,
            name:lang == 'enus' ? 'Approved' : 'Aprovado'
        }, {
            key: 4,
            name: lang == 'enus' ? 'Archived' : 'Arquivado'
        }];
        
        //File Storage security configuration 
        listFilters.securityClassification = [{
            key: 1,
            name: lang == 'enus' ? 'Free' : 'Livre'
        }, {
            key: 2,
            name:lang == 'enus' ? 'Restricted' : 'Restrito'
        }, {
            key: 3,
            name:lang == 'enus' ? 'Confidential' : 'Confidencial'
        }];
        
        var structures = this.getStructures();
		var structs = [];
	    structures.forEach(function(data, index) {
            structs.push({
                key: data.id,
                name: data.title
            });
        });
        listFilters.structures = structs; 
        
        //Do not add the components that have been deleted
        var comp = components.READ({
            where: [{field: 'name', oper:'!=', value: 'CORE'},{field: 'name', oper:'!=', value: 'LOG'}, {field: 'name', oper:'!=', value: 'UES'}, {field: 'name', oper:'!=', value: 'MKT'}]
        });
        var componentsLst = comp.map(function(element) {
			return {
				key: element.id,
				name: element.name + " - " + element.description
			};
		});
		listFilters.components = componentsLst;
		
		var documentTypes = this.read({});
		var creationUsers = [];
		var modificationUsers = [];
		if(documentTypes){
		    creationUsers = documentTypes.map(function(element){
		        return {
		            key: element.creationUserData[0].id,
		            name: element.creationUserData[0].name + " " + element.creationUserData[0].last_name
		        };
		    });
		    modificationUsers = documentTypes.map(function(element){
		        return {
		            key: element.modificationUserData[0].id,
		            name: element.modificationUserData[0].name + " " + element.modificationUserData[0].last_name
		        };
		    });
		}
		listFilters.creationUsers = lodash.uniq(creationUsers);
        listFilters.modificationUsers = lodash.uniq(modificationUsers);
    } catch (e) {
        $.messageCodes.push({
            "code": "TBD201001",
            "type": 'E',
            "errorInfo": util.parseError(e)
        });
    }
    return listFilters;
};

this.filters = function() {
    try {
        var language = $.request.cookies.get("Content-Language");
        //Temp - language change to ptbr
        if (language === 'ptrbr') {
            language = 'ptbr';
        }

        var listCompanies = this.listCompanies();
        var response = {
            companies: listCompanies
        };
        response.taxes = this.listTax();
        
        return response;
    } catch (e) {
        $.messageCodes.push({
            "code": "TBD201001",
            "type": 'E',
            "errorInfo": util.parseError(e)
        });
        return null;
    }
};

//List the  structures from ATR for the advanced filters 
this.getStructures = function(){
    try{
        return structureController.listStructures();
    }catch(e){
        //message error
		$.messageCodes.push({
			"code": "MDR244003",
			"type": 'E',
			"errorInfo": util.parseError(e)
		});
		return [];
    }
};

this.readStructure = function(object){
    try{
        return structureController.readStructure(object);
    }catch(e){
        //message error
		$.messageCodes.push({
			"code": "MDR244003",
			"type": 'E',
			"errorInfo": util.parseError(e)
		});
		return [];
    }
};

this.read = function(object){
    try{
        return documentConsulting.read(object);
    }catch(e){
        //error message
        $.messageCodes.push({"code": "TBD201002","type": 'E',"errorInfo": util.parseError(e)});
        return e;
    }
};