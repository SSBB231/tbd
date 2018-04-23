$.import('timp.core.server.api', 'api');
var core_api = $.timp.core.server.api.api;
var util = core_api.util;

$.import('timp.tbd.server.models', 'fileStorage');
var fileStorageModel = $.timp.tbd.server.models.fileStorage;

$.import('timp.tbd.server.models','documentTypeConfig');
var documentTypeConfigModel = $.timp.tbd.server.models.documentTypeConfig;

$.import('timp.tbd.server.controllers','LogSupervisor');
var Supervisor = $.timp.tbd.server.controllers.LogSupervisor.Supervisor;

//Document Type Configuration List
// 1: Created
// 2: Pending
// 3: Approved
// 4: Archived

//File Classification List
// 1: Free
// 2: Restricted
// 3: Confidential

/* @example Object
{
    component:'DFG',
    idCompany: ['1000'],
    idState: ['SP'],
    idBranch: ['1000_SP_0001'],
    idTax: ['00','01'],
    validFrom: "Sat Mar 01 2014 00:00:00 GMT-0300 (BRT)",
    validTo: "Mon Mar 31 2014 00:00:00 GMT-0300 (BRT)", // + 5 years
    keyField1: "Tipo Documento DFG",
    keyField2:  "2014 / 1M",
    
    docType: "PROT",
    description: "Protocolo de entrega de obrigacao",
    numberRange: 1
}
*/

this.saveFile = function(object){
    var response = {
        success: false
    };
    var supervisor = new Supervisor();
    try{
        if(object){
            // Created default
            object.status = 1;
            //Free default
            object.securityClassification = 1;
            
            if(object.docType && object.docType.length <= 4 ){
                if(object.description && object.description.length <= 40 ){
                    if(object.numberRange && object.numberRange.length <= 10){
                        if(object.validFrom){
                            if(object.idCompany && $.lodash.isArray(object.idCompany) && object.idCompany.length > 0){
                                if(object.idState && $.lodash.isArray(object.idState) && object.idState.length > 0 ){
                                    if(object.idBranch && $.lodash.isArray(object.idBranch) && object.idBranch.length > 0){
                                        if(object.idTax && $.lodash.isArray(object.idTax) && object.idTax.length > 0){
                                            if((object.keyField1 && object.keyField1.length <= 20) && ((object.keyField2 && object.keyField2.length <= 20))){
                                                var documentTypeObj = {
                                                    docType: object.docType,
                                                    description: object.description,
                                                    numberRange: object.numberRange,
                                                    status: object.status,
                                                    validFrom: object.validFrom,
                                                    validTo: object.validTo || null,
                                                    isDeleted: 0
                                                };
                                                var configuration = documentTypeConfigModel.table.CREATE(documentTypeObj);
                                                response.documentTypeConfiguration = configuration;
                                                supervisor.createDocumentTypeConfig(configuration);
                                                
                                                var fileObj = {
                                                    docTypeId: configuration.id,
                                                    keyField1: object.keyField2,
                                                    keyField2: object.keyField1,
                                                    status: object.status,
                                                    securityClassification: object.securityClassification,
                                                    validFrom: object.validFrom,
                                                    validTo: object.validTo || null,
                                                    imageUrl: object.imageUrl,
                                                    fileName: object.fileName,
                                                    component: object.component,
                                                    isDeleted: 0
                                                };
                                                var fileStorage = fileStorageModel.table.CREATE(fileObj);
                                                response.fileStorage = fileStorage;
                                                supervisor.createFileStorage(fileStorage);
                                                
                                                var eef = [];
                                                var eefObj = {};
                                                if ($.lodash.has(object, 'idBranch') && $.lodash.isArray(object.idBranch)) {
                                                	$.lodash.forEach(object.idBranch, function(eefString) {
                                                		let split = eefString.split('_');
                                                		eefObj = {
                                                            idConfiguration: fileStorage.id,
                                                            idCompany: split[0],
                                                            uf: split[1],
                                                            idBranch: split[2]
                                                        };
                                                        eef.push(fileStorageModel.tableEEF.CREATE(eefObj));
                                                	}); 
                                                } else {
                                                    eefObj = {
                                                        idConfiguration: fileStorage.id,
                                                        idCompany: object.idCompany,
                                                        uf: object.idState,
                                                        idBranch: object.idBranch
                                                    };
                                                    eef.push(fileStorageModel.tableEEF.CREATE(eefObj));
                                                }
                                    			response.eef = eef;
                                    			
                                    			var tax = [];
                                                var taxObj = {};
                                    			if ($.lodash.has(object, 'idTax') && $.lodash.isArray(object.idTax)) {
                                                	$.lodash.forEach(object.idTax, function(element) {
                                                		taxObj = {
                                                            idConfiguration: fileStorage.id,
                                                            idTax: element
                                                        };
                                                        tax.push(fileStorageModel.tableTax.CREATE(taxObj));
                                                	}); 
                                                } else {
                                                    taxObj = {
                                                        idConfiguration: fileStorage.id,
                                                        idTax: object.idTax
                                                    };
                                                    tax.push(fileStorageModel.tableTax.CREATE(taxObj));
                                                }
                                                response.tax = tax;
                                                if(configuration && Object.keys(configuration).length && fileStorage && Object.keys(fileStorage).length && eef && eef.length && tax && tax.length ){
                                                    response.success = true;
                                                }
                                            } else {
                                                //No Key Fields
                                                $.messageCodes.push({
                                        			"code": "TBD201019",
                                        			"type": 'E',
                                        			"errorInfo": "Ocorreu um erro ao tentar gravar o documento, os Campos Chaves não podem estar vazios" //util.parseError(e)
                                        		});
                                            }
                                        } else {
                                            //No Tax
                                            $.messageCodes.push({
                                    			"code": "TBD201018",
                                    			"type": 'E',
                                    			"errorInfo": "Ocorreu um erro ao tentar gravar o documento, o Tributo não pode estar vazio" //util.parseError(e)
                                    		});
                                        }
                                    } else {
                                        //No Branch
                                        $.messageCodes.push({
                                			"code": "TBD201017",
                                			"type": 'E',
                                			"errorInfo": "Ocorreu um erro ao tentar gravar o documento, a Filial não pode estar vazia" //util.parseError(e)
                                		});
                                    }
                                } else {
                                    //No Uf
                                    $.messageCodes.push({
                            			"code": "TBD201016",
                            			"type": 'E',
                            			"errorInfo": "Ocorreu um erro ao tentar gravar o documento, a UF não pode estar vazia" //util.parseError(e)
                            		});
                                }
                            } else {
                                //No Company
                                $.messageCodes.push({
                        			"code": "TBD201015",
                        			"type": 'E',
                        			"errorInfo": "Ocorreu um erro ao tentar gravar o documento, a Empresa não pode estar vazia" // util.parseError(e)
                        		});
                            }
                        } else {
                            //No valid from
                            $.messageCodes.push({
                    			"code": "TBD201014",
                    			"type": 'E',
                    			"errorInfo": "Ocorreu um erro ao tentar gravar o documento, a Validade De não pode estar vazia" //util.parseError(e)
                    		});
                        }
                    } else {
                        //No number range
                        $.messageCodes.push({
                			"code": "TBD201013",
                			"type": 'E',
                			"errorInfo": "Ocorreu um erro ao tentar gravar o documento, o Intervalo de Numeração não pode estar vazio" //util.parseError(e)
                		});
                    }
                } else {
                    //No description
                    $.messageCodes.push({
            			"code": "TBD201012",
            			"type": 'E',
            			"errorInfo": "Ocorreu um erro ao tentar gravar o documento, a Descrição do Tipo do Documento não pode estar vazia" //util.parseError(e)
            		});
                }
            } else {
                // No document type
                $.messageCodes.push({
        			"code": "TBD201011",
        			"type": 'E',
        			"errorInfo": "Ocorreu um erro ao tentar gravar o documento, o Tipo do Documento não pode estar vazio" //util.parseError(e)
        		});
            }
        } else {
            //No object
            $.messageCodes.push({
    			"code": "TBD201010",
    			"type": 'E',
    			"errorInfo": "Ocorreu um erro ao tentar gravar o documento" //util.parseError(e)
    		});
        }
    } catch (e){
        $.messageCodes.push({
			"code": "TBD201010",
			"type": 'E',
			"errorInfo": util.parseError(e)
		});
		return e;
    }
    return response;
};
