//LOG
$.import('timp.log.server.api', 'api');
var Log = $.timp.log.server.api.api;

function Register(messageCode, idObject, json) {
	this.componentName = 'TBD';
	this.messageCode = messageCode;
	this.objectId = idObject;
	this.json = json;
}


function Supervisor() {}

Supervisor.prototype._difference = function(a1, a2) {
	var a = [],
		diff = [];
	for (var i = 0; i < a1.length; i++) {
		a[a1[i]] = true;
	}
	for (var i = 0; i < a2.length; i++) {
		if (a[a2[i]]) {
			delete a[a2[i]];
		} else {
			a[a2[i]] = true;
		}
	}
	for (var k in a) {
		diff.push(k);
	}
	diff.splice(diff.length - 1, 1);
	return diff;
};
Supervisor.prototype._intersection = function(a,b){
    var retVal = [];
    try{
        var coveredA = a.reduce(function(obj,e){obj[e] = true; return obj;},{});
        var coveredB = b.reduce(function(obj,e){obj[e] = true; return obj;},{});
        a.forEach(function(e){
            if(coveredB[e] && retVal.indexOf(e) === -1){
                retVal.push(e);
            }
        });
        b.forEach(function(e){
            if(coveredA[e] && retVal.indexOf(e) === -1){
                retVal.push(e);
            }
        });
    }catch(e){
        retVal.error = e;
    }
    return retVal;
};

Supervisor.prototype._translateStatusToWord = function(status) {
    var lang = $.request.cookies.get("Content-Language");
        lang = (lang == "enus") ? "us" : "br";
        
	var translation = "";
	
	if(lang == 'us'){
	    if(status == 1){
            translation = 'Created';
        } else if (status == 2){
            translation = 'Pending';
        } else if(status == 3){
            translation = 'Approved';
        } else if(status == 4){
            translation = 'Archived';
        }
	} else {
	    if(status == 1){
            translation = 'Criação';
        } else if (status == 2){
            translation = 'Pendente';
        } else if(status == 3){
            translation = 'Aprovado';
        } else if(status == 4){
            translation = 'Arquivado';
        }
	}
    
    return translation;
};

Supervisor.prototype._translateClassificationToWord = function(classification){
    var lang = $.request.cookies.get("Content-Language");
        lang = (lang == "enus") ? "us" : "br";
    
    var translation = "";
    
    if(lang == 'us'){
        if(classification == 1){
            translation = 'Free';
        } else if (classification == 2){
            translation = 'Restricted';
        } else if(classification == 3){
            translation = 'Confidential';
        }
    } else {
        if(classification == 1){
            translation = 'Livre';
        } else if (classification == 2){
            translation = 'Restrito';
        } else if(classification == 3){
            translation = 'Confidencial';
        }
    }
    return translation;
};


// ----------------------------------------------------------------- ACTIONS ----------------------------------------------------------------- 

Supervisor.prototype.createStorageLocation = function(object) {
	var json = {
		messagePtbr: "Foi criada uma configuração de Local de Armazenamento com Id " + object.id,
		messageEnus: "A Storage Location configuration with Id " + object.id + "was created",
		object: object
	};
	var register = new Register('LOG212001', object.id, json);
	return Log.createEvent(register);
};

Supervisor.prototype.compareStorageLocation = function(oldObject,newObject){
    var detailsJson = {
        details:[],
        properties:[
            {property:'message',enus:'Message',ptrbr:'Mensagem'},
            {property:'oldValue',enus:'Previous value',ptrbr:'Valor anterior'},
            {property:'newValue',enus:'New value',ptrbr:'Novo valor'}
        ]
    };
    try{
        var propertyDictionary = {
            docTypeConfig:{
                enus:'Document Type',
                ptrbr:'Tipo de Documento'
            },
            level1:{
                enus:'Level 1',
                ptrbr:'Nível 1'
            },
            level2:{
                enus:'Level 2',
                ptrbr:'Nível 2'
            },
            level3:{
                enus:'Level 3',
                ptrbr:'Nível 3'
            },
            level4:{
                enus:'Level 4',
                ptrbr:'Nível 4'
            },
            level5:{
                enus:'Level 5',
                ptrbr:'Nível 5'
            },
            level6:{
                enus:'Level 6',
                ptrbr:'Nível 6'
            },
            level7:{
                enus:'Level 7',
                ptrbr:'Nível 7'
            },
            level8:{
                enus:'Level 8',
                ptrbr:'Nível 8'
            },
            level9:{
                enus:'Level 9',
                ptrbr:'Nível 9'
            },
            level10:{
                enus:'Level 10',
                ptrbr:'Nível 10'
            },
            level11:{
                enus:'Level 11',
                ptrbr:'Nível 11'
            },
            validFrom:{
                enus:'Valid From Date',
                ptrbr:'Inicio de vigência'
            },
            validTo:{
                enus:'Valid To Date',
                ptrbr:'Fim de vigência'
            }
        };
        
        var propertiesToCompare = ["docTypeConfig", "level1", "level2", "level3", "level4", "level5", "level6", "level7", "level8", "level9", "level10", "level11", "validFrom", "validTo"];
        //compare flat properties
        
        propertiesToCompare.forEach(function(prop){
            if(prop === 'validFrom' || prop === 'validTo'){
                if(oldObject[prop] && oldObject[prop].toISOString){
                    oldObject[prop] = oldObject[prop].toISOString();
                }
                if(newObject[prop] && newObject[prop].toISOString){
                    newObject[prop] = newObject[prop].toISOString();
                }
            }
            
            if(prop == 'docTypeConfig'){
                if(oldObject[prop] && oldObject[prop].length){
                    oldObject[prop] = oldObject[prop][0].docType;
                }
                if(newObject[prop] &&  newObject[prop].length){
                    newObject[prop] = newObject[prop][0].docType;
                }
            }
            
            if(newObject[prop] !== undefined && oldObject[prop] != newObject[prop]){ //is different
                detailsJson.details.push({
                    message:{
                        enus:'The field ' + propertyDictionary[prop].enus + ' changed',
                        ptrbr:'O campo ' + propertyDictionary[prop].ptrbr + ' mudou'
                    },
                    oldValue:{
                        enus:oldObject[prop],
                        ptrbr:oldObject[prop]
                    },
                    newValue:{
                        enus:newObject[prop],
                        ptrbr:newObject[prop]
                    }
                });
            }
        });
    }catch(e){
        detailsJson.error = e;
    } 
    return detailsJson;
};

Supervisor.prototype.updateStorageLocation = function(oldObject, newObject) {
	var json = {
		messagePtbr: "Foi atualizada uma configuração de Local de Armazenamento com Id " + newObject.id,
		messageEnus: "A Storage Location configuration with Id " + newObject.id + " was updated",
		object: newObject,
		oldObject: oldObject
	};
	json = this.compareStorageLocation(oldObject, newObject);
	var register = new Register('LOG212002', newObject.id, json);
	return Log.createEvent(register);
};
Supervisor.prototype.deleteStorageLocation = function(id) {
	var json = {
		messagePtbr: "Foi excluída uma configuração de Local de Armazenamento com Id " + id,
		messageEnus: "A Storage Location configuration with Id " + id + "was deleted",
		object: id
	};
	var register = new Register('LOG212003', id, json);
	return Log.createEvent(register);
};

Supervisor.prototype.createKeyFieldsConfig = function(object) {
	var json = {
		messagePtbr: "Foi criado uma configuração de Campos Chave com Id " + object.id,
		messageEnus: "A Key Fields configuration with Id " + object.id + "was created",
		object: object
	};
	var register = new Register('LOG212004', object.id, json);
	return Log.createEvent(register);
};
Supervisor.prototype.compareKeyFields = function(oldObject,newObject){
    var detailsJson = {
        details:[],
        properties:[
            {property:'message',enus:'Message',ptrbr:'Mensagem'},
            {property:'oldValue',enus:'Previous value',ptrbr:'Valor anterior'},
            {property:'newValue',enus:'New value',ptrbr:'Novo valor'}
        ]
    };
    try{
        var propertyDictionary = {
            docTypeConfig:{
                enus:'Document Type',
                ptrbr:'Tipo de Documento'
            },
            componentData:{
                enus:'Origin Component',
                ptrbr:'Componente de Origem'
            },
            structureData:{
                enus:'Structure',
                ptrbr:'Estrutura'
            },
            keys:{
                enus:'Key Fields',
                ptrbr:'Campos Chaves'
            },
            validFrom:{
                enus:'Valid From Date',
                ptrbr:'Inicio de vigência'
            },
            validTo:{
                enus:'Valid To Date',
                ptrbr:'Fim de vigência'
            }
        };
        
        var propertiesToCompare = ["docTypeConfig", "componentData", "structureData","validFrom", "validTo"];
        //compare flat properties
        
        propertiesToCompare.forEach(function(prop){
            if(prop === 'validFrom' || prop === 'validTo'){
                if(oldObject[prop] && oldObject[prop].toISOString){
                    oldObject[prop] = oldObject[prop].toISOString();
                }
                if(newObject[prop] && newObject[prop].toISOString){
                    newObject[prop] = newObject[prop].toISOString();
                }
            }
            
            if(prop == 'docTypeConfig'){
                if(oldObject[prop] && oldObject[prop].length){
                    oldObject[prop] = oldObject[prop][0].docType;
                }
                if(newObject[prop] &&  newObject[prop].length){
                    newObject[prop] = newObject[prop][0].docType;
                }
            }
            if(prop == 'componentData'){
                if(oldObject[prop] && oldObject[prop].length){
                    oldObject[prop] = oldObject[prop][0].name + " - " + oldObject[prop][0].description;
                }
                if(newObject[prop] &&  newObject[prop].length){
                    newObject[prop] = newObject[prop][0].name + " - " + newObject[prop][0].description;
                }
            }
            
            if(prop == 'structureData'){
                if(oldObject[prop] && oldObject[prop].length){
                    oldObject[prop] = oldObject[prop][0].title;
                }
                if(newObject[prop] &&  newObject[prop].length){
                    newObject[prop] = newObject[prop][0].title;
                }
            }
            
            if(newObject[prop] !== undefined && oldObject[prop] != newObject[prop]){ //is different
                detailsJson.details.push({
                    message:{
                        enus:'The field ' + propertyDictionary[prop].enus + ' changed',
                        ptrbr:'O campo ' + propertyDictionary[prop].ptrbr + ' mudou'
                    },
                    oldValue:{
                        enus:oldObject[prop],
                        ptrbr:oldObject[prop]
                    },
                    newValue:{
                        enus:newObject[prop],
                        ptrbr:newObject[prop]
                    }
                });
            }
            
            var oldKeys = [];
            var newKeys = [];
            if(oldObject.keys && newObject.keys){
                oldObject.keys.forEach(function(element){
                    if(element.keyName && oldKeys.indexOf(element.keyName) === -1){
                        oldKeys.push(element.keyName);
                    }
                });
                newObject.keys.forEach(function(element){
                    if(element.keyName && newKeys.indexOf(element.keyName) === -1){
                        newKeys.push(element.keyName);
                    }
                });
            }
            var differentKeys = Supervisor.prototype._difference(oldKeys,newKeys);
            if(differentKeys.length > 0){
                detailsJson.details.push({
                    message:{
                        enus:'The field ' + propertyDictionary.keys.enus + ' changed',
                        ptrbr:'O campo ' + propertyDictionary.keys.ptrbr + ' alterou'
                    },
                    oldValue:{
                        enus:oldKeys.join(','),
                        ptrbr:oldKeys.join(',')
                    },
                    newValue:{
                        enus:newKeys.join(','),
                        ptrbr:newKeys.join(',')
                    }
                });
            }

        });
    }catch(e){
        detailsJson.error = e;
    } 
    return detailsJson;
};

Supervisor.prototype.updateKeyFieldsConfig = function(oldObject,newObject) {
	var json = {
		messagePtbr: "Foi atualizada uma configuração de Campos Chave com Id " + newObject.id,
		messageEnus: "A Key Fields configuration with Id " + newObject.id + " was updated",
		object: newObject,
		oldObject: oldObject
	};
	json = this.compareKeyFields(oldObject, newObject);
	var register = new Register('LOG212005', newObject.id, json);
	return Log.createEvent(register);
};
Supervisor.prototype.deleteKeyFieldsConfig = function(id) {
	var json = {
		messagePtbr: "Foi excluída uma configuração de Campos Chave com Id " + id,
		messageEnus: "A Key Fields configuration with Id " + id + "was deleted",
		object: id
	};
	var register = new Register('LOG212006', id, json);
	return Log.createEvent(register);
};

Supervisor.prototype.createFileStorage = function(object) {
	var json = {
		messagePtbr: "Foi criado uma configuração de Armazenagem de Arquivos com Id " + object.id,
		messageEnus: "A File Storage configuration with Id " + object.id + "was created",
		object: object
	};
	var register = new Register('LOG212007', object.id, json);
	return Log.createEvent(register);
};

Supervisor.prototype.compareFileStorage = function(oldObject,newObject){
    var detailsJson = {
        details:[],
        properties:[
            {property:'message',enus:'Message',ptrbr:'Mensagem'},
            {property:'oldValue',enus:'Previous value',ptrbr:'Valor anterior'},
            {property:'newValue',enus:'New value',ptrbr:'Novo valor'}
        ]
    };
    try{
        var propertyDictionary = {
            idCompany:{enus:'Company',ptrbr:'Empresa'},
    		uf:{enus:'UF',ptrbr:'UF'},
    		idBranch:{enus:'Branch',ptrbr:'Filial'},
    	    idTax:{enus:'Tax',ptrbr:'Tributo'},
    	    documentTypeConfig:{enus:'Document Type', ptrbr:'Tipo de Documento'},
            status:{enus:'Status', ptrbr:'Status'},
            securityClassification:{enus:'Classification',ptrbr:'Classificação'},
            keyField1:{enus:'Key Field', ptrbr:'Campo Chave'},
            keyField2:{enus:'Key Field', ptrbr:'Campo Chave'},
            fileName:{enus:'File Name', ptrbr:'Nome de Arquivo'},
    		validFrom:{enus:'Valid From Date', ptrbr:'Inicio de vigência'},
            validTo:{enus:'Valid To Date', ptrbr:'Fim de vigência'}
        };
        var propertiesToCompare = ['documentTypeConfig','status','securityClassification','keyField1','keyField2','fileName','validFrom','validTo'];
        
        //compare flat properties
        propertiesToCompare.forEach(function(prop){
            if(prop === 'validFrom' || prop === 'validTo'){
                if(oldObject[prop] && oldObject[prop].toISOString){
                    oldObject[prop] = oldObject[prop].toISOString();
                }
                if(newObject[prop] && newObject[prop].toISOString){
                    newObject[prop] = newObject[prop].toISOString();
                }
            }
            
            if(prop == 'documentTypeConfig'){
                if(oldObject[prop] && oldObject[prop].length){
                    oldObject[prop] = oldObject[prop][0].docType;
                }
                if(newObject[prop] &&  newObject[prop].length){
                    newObject[prop] = newObject[prop][0].docType;
                }
            }
            
            if(prop === 'status'){
                if(oldObject[prop]){
                    oldObject[prop] = Supervisor.prototype._translateStatusToWord(oldObject[prop]);
                }
                if(newObject[prop]){
                    newObject[prop] = Supervisor.prototype._translateStatusToWord(newObject[prop]);
                }
            }
            
            if(prop === 'securityClassification'){
                if(oldObject[prop]){
                    oldObject[prop] = Supervisor.prototype._translateClassificationToWord(oldObject[prop]);
                }
                if(newObject[prop]){
                    newObject[prop] = Supervisor.prototype._translateClassificationToWord(newObject[prop]);
                }
            }
            
            if(newObject[prop] !== undefined && oldObject[prop] != newObject[prop]){//is different
                detailsJson.details.push({
                    message:{
                        enus:'The field ' + propertyDictionary[prop].enus + ' changed',
                        ptrbr:'O campo ' + propertyDictionary[prop].ptrbr + ' alterou'
                    },
                    oldValue:{
                        enus:oldObject[prop],
                        ptrbr:oldObject[prop]
                    },
                    newValue:{
                        enus:newObject[prop],
                        ptrbr:newObject[prop]
                    }
                });
            }
        });
        //compare multivaluedProperties eef(idCompany,uf,idBranch),ufDestinoResults(ufDestino)
        var oldCompanies = [];
        var newCompanies = [];
        var oldTaxes = [];
        var newTaxes = [];
        var oldUf = [];
        var newUf = [];
        var oldBranch = [];
        var newBranch = [];
        if(oldObject.eef && newObject.eef){
            oldObject.eef.forEach(function(eef){
                if(eef.idCompany && oldCompanies.indexOf(eef.idCompany) === -1){
                    oldCompanies.push(eef.idCompany);
                }
                if(eef.uf && oldUf.indexOf(eef.uf) === -1){
                    oldUf.push(eef.uf);
                }
                if(eef.idBranch && oldBranch.indexOf(eef.idBranch) === -1){
                    oldBranch.push(eef.idBranch);
                }
            });
            newObject.eef.forEach(function(eef){
                if(eef.idCompany && newCompanies.indexOf(eef.idCompany) === -1){
                    newCompanies.push(eef.idCompany);
                }
                if(eef.uf && newUf.indexOf(eef.uf) === -1){
                    newUf.push(eef.uf);
                }
                if(eef.idBranch && newBranch.indexOf(eef.idBranch) === -1){
                    newBranch.push(eef.idBranch);
                }
            });
        }
        
        if(oldObject.taxData && newObject.taxData){
            oldObject.taxData.forEach(function(element){
                if(element.descrCodTributoLabel && oldTaxes.indexOf(element.descrCodTributoLabel) === -1){
                    oldTaxes.push(element.descrCodTributoLabel);
                }
            });
            newObject.taxData.forEach(function(element){
                if(element.descrCodTributoLabel && newTaxes.indexOf(element.descrCodTributoLabel) === -1){
                    newTaxes.push(element.descrCodTributoLabel);
                }
            });
        }
        
        var differentCompanies = this._difference(oldCompanies,newCompanies);
        var differentUfs = this._difference(oldUf,newUf);
        var differentBranches = this._difference(oldBranch,newBranch);
        var differentTaxes = $.lodash.difference(oldTaxes,newTaxes);
        if(differentCompanies.length > 0){
            detailsJson.details.push({
                message:{
                    enus:'The field ' + propertyDictionary.idCompany.enus + ' changed',
                    ptrbr:'O campo ' + propertyDictionary.idCompany.ptrbr + ' alterou'
                },
                oldValue:{
                    enus:oldCompanies.join(','),
                    ptrbr:oldCompanies.join(',')
                },
                newValue:{
                    enus:newCompanies.join(','),
                    ptrbr:newCompanies.join(',')
                }
            });
        }
        if(differentUfs.length > 0){
            detailsJson.details.push({
                message:{
                    enus:'The field ' + propertyDictionary.uf.enus + ' changed',
                    ptrbr:'O campo ' + propertyDictionary.uf.ptrbr + ' alterou'
                },
                oldValue:{
                    enus:oldUf.join(','),
                    ptrbr:oldUf.join(',')
                },
                newValue:{
                    enus:newUf.join(','),
                    ptrbr:newUf.join(',')
                }
            });
        }
        if(differentBranches.length > 0){
            detailsJson.details.push({
                message:{
                    enus:'The field ' + propertyDictionary.idBranch.enus + ' changed',
                    ptrbr:'O campo ' + propertyDictionary.idBranch.ptrbr + ' alterou'
                },
                oldValue:{
                    enus:oldBranch.join(','),
                    ptrbr:oldBranch.join(',')
                },
                newValue:{
                    enus:newBranch.join(','),
                    ptrbr:newBranch.join(',')
                }
            });
        }
        
        if(differentTaxes.length > 0){
            detailsJson.details.push({
                message:{
                    enus:'The field ' + propertyDictionary.idTax.enus + ' changed',
                    ptrbr:'O campo ' + propertyDictionary.idTax.ptrbr + ' alterou'
                },
                oldValue:{
                    enus:oldTaxes.join(','),
                    ptrbr:oldTaxes.join(',')
                },
                newValue:{
                    enus:newTaxes.join(','),
                    ptrbr:newTaxes.join(',')
                }
            });
        }
        
    }catch(e){
        detailsJson.error = e;
    }
    return detailsJson;
};
Supervisor.prototype.updateFileStorage = function(oldObject, newObject) {
	var json = {
		messagePtbr: "Foi atualizada uma configuração de Armazenagem de Arquivos com Id " + newObject.id,
		messageEnus: "A File Storage configuration with Id " + newObject.id + " was updated",
		object: newObject,
		oldObject: oldObject
	};
	json = this.compareFileStorage(oldObject, newObject);
	var register = new Register('LOG212008', newObject.id, json);
	return Log.createEvent(register);
};
Supervisor.prototype.deleteFileStorage = function(id) {
	var json = {
		messagePtbr: "Foi excluída uma configuração de Armazenagem de Arquivos com Id " + id,
		messageEnus: "A File Storage configuration with Id " + id + "was deleted",
		object: id
	};
	var register = new Register('LOG212009', id, json);
	return Log.createEvent(register);
};

Supervisor.prototype.createDocumentTypeConfig = function(object) {
	var json = {
		messagePtbr: "Foi criado uma configuração de Tipo de Documento com Id " + object.id,
		messageEnus: "A Document Type configuration with Id " + object.id + "was created",
		object: object
	};
	var register = new Register('LOG212010', object.id, json);
	return Log.createEvent(register);
};
Supervisor.prototype.compareDocumentTypeConfig = function(oldObject,newObject){
    var detailsJson = {
        details:[],
        properties:[
            {property:'message',enus:'Message',ptrbr:'Mensagem'},
            {property:'oldValue',enus:'Previous value',ptrbr:'Valor anterior'},
            {property:'newValue',enus:'New value',ptrbr:'Novo valor'}
        ]
    };
    try{
        var propertyDictionary = {
            docType:{
                enus:'Document Type',
                ptrbr:'Tipo de Documento'
            },
            description:{
                enus:'Description',
                ptrbr:'Descrição'
            },
            numberRange:{
                enus:'Number Range',
                ptrbr:'Intervalo de Numeração'
            },
            status:{
                enus:'Status',
                ptrbr:'Status'
            },
            validFrom:{
                enus:'Valid From Date',
                ptrbr:'Inicio de vigência'
            },
            validTo:{
                enus:'Valid To Date',
                ptrbr:'Fim de vigência'
            }
        };
        
        var propertiesToCompare = ["docType", "description", "numberRange", "status","validFrom", "validTo"];
        //compare flat properties
        
        propertiesToCompare.forEach(function(prop){
            if(prop === 'validFrom' || prop === 'validTo'){
                if(oldObject[prop] && oldObject[prop].toISOString){
                    oldObject[prop] = oldObject[prop].toISOString();
                }
                if(newObject[prop] && newObject[prop].toISOString){
                    newObject[prop] = newObject[prop].toISOString();
                }
            }
            
            if(prop === 'status'){
                if(oldObject[prop]){
                    oldObject[prop] = Supervisor.prototype._translateStatusToWord(oldObject[prop]);
                }
                if(newObject[prop]){
                    newObject[prop] = Supervisor.prototype._translateStatusToWord(newObject[prop]);
                }
            }
            
            if(newObject[prop] !== undefined && oldObject[prop] != newObject[prop]){ //is different
                detailsJson.details.push({
                    message:{
                        enus:'The field ' + propertyDictionary[prop].enus + ' changed',
                        ptrbr:'O campo ' + propertyDictionary[prop].ptrbr + ' mudou'
                    },
                    oldValue:{
                        enus:oldObject[prop],
                        ptrbr:oldObject[prop]
                    },
                    newValue:{
                        enus:newObject[prop],
                        ptrbr:newObject[prop]
                    }
                });
            }
        });
    }catch(e){
        detailsJson.error = e;
    } 
    return detailsJson;
};

Supervisor.prototype.updateDocumentTypeConfig = function(oldObject,newObject) {
	var json = {
		messagePtbr: "Foi atualizada uma configuração de Tipo de Documento com Id " + newObject.id,
		messageEnus: "A Document Type configuration with Id " + newObject.id + " was updated",
		object: newObject,
		oldObject: oldObject
	};
	json = this.compareDocumentTypeConfig(oldObject, newObject);
	var register = new Register('LOG212011', newObject.id, json);
	return Log.createEvent(register);
};
Supervisor.prototype.deleteDocumentTypeConfig = function(id) {
	var json = {
		messagePtbr: "Foi excluída uma configuração de Tipo de Documento com Id " + id,
		messageEnus: "A Document Type configuration with Id " + id + "was deleted",
		object: id
	};
	var register = new Register('LOG212012', id, json);
	return Log.createEvent(register);
};



Supervisor.prototype.createDocumentApproval = function(object) {
	var json = {
		messagePtbr: "Foi criado uma configuração de Aprovação de Documentos com Id " + object.id,
		messageEnus: "A Document Approval configuration with Id " + object.id + "was created",
		object: object
	};
	var register = new Register('LOG212013', object.id, json);
	return Log.createEvent(register);
};

Supervisor.prototype.compareDocumentApproval = function(oldObject,newObject){
    var detailsJson = {
        details:[],
        properties:[
            {property:'message',enus:'Message',ptrbr:'Mensagem'},
            {property:'oldValue',enus:'Previous value',ptrbr:'Valor anterior'},
            {property:'newValue',enus:'New value',ptrbr:'Novo valor'}
        ]
    };
    try{
        var propertyDictionary = {
            docTypeConfig:{
                enus:'Document Type',
                ptrbr:'Tipo de Documento'
            },
            files:{
                enus:'File Name',
                ptrbr:'Nome do arquivo'
            },
            comments:{
                enus:'Comments',
                ptrbr:'Comentários'
            },
            approvalDate:{
                enus:'Valid From Date',
                ptrbr:'Inicio de vigência'
            }
        };
        
        var propertiesToCompare = ["docTypeConfig","files","approvalDate","comments"];
        //compare flat properties
        
        propertiesToCompare.forEach(function(prop){
            if(prop === 'validFrom' || prop === 'validTo' || prop === 'approvalDate'){
                if(oldObject[prop] && oldObject[prop].toISOString){
                    oldObject[prop] = oldObject[prop].toISOString();
                }
                if(newObject[prop] && newObject[prop].toISOString){
                    newObject[prop] = newObject[prop].toISOString();
                }
            }
            
            if(prop == 'docTypeConfig'){
                if(oldObject[prop] && oldObject[prop].length){
                    oldObject[prop] = oldObject[prop][0].docType;
                }
                if(newObject[prop] &&  newObject[prop].length){
                    newObject[prop] = newObject[prop][0].docType;
                }
            }
            
            if(prop == 'files'){
                if(oldObject[prop] && oldObject[prop].length){
                    oldObject[prop] = oldObject[prop][0].fileName;
                }
                if(newObject[prop] &&  newObject[prop].length){
                    newObject[prop] = newObject[prop][0].fileName;
                }
            }
            
            if(newObject[prop] !== undefined && oldObject[prop] != newObject[prop]){ //is different
                detailsJson.details.push({
                    message:{
                        enus:'The field ' + propertyDictionary[prop].enus + ' changed',
                        ptrbr:'O campo ' + propertyDictionary[prop].ptrbr + ' mudou'
                    },
                    oldValue:{
                        enus:oldObject[prop],
                        ptrbr:oldObject[prop]
                    },
                    newValue:{
                        enus:newObject[prop],
                        ptrbr:newObject[prop]
                    }
                });
            }
        });
    }catch(e){
        detailsJson.error = e;
    } 
    return detailsJson;
};
Supervisor.prototype.updateDocumentApproval = function(oldObject, newObject) {
	var json = {
		messagePtbr: "Foi atualizada uma configuração de Aprovação de Documentos com Id " + newObject.id,
		messageEnus: "A Document Approval configuration with Id " + newObject.id + "was updated",
		object: newObject
	};
	json = this.compareDocumentApproval(oldObject, newObject);
	var register = new Register('LOG212014', newObject.id, json);
	return Log.createEvent(register);
};
Supervisor.prototype.deleteDocumentApproval = function(id) {
	var json = {
		messagePtbr: "Foi excluída uma configuração de Aprovação de Documento com Id " + id,
		messageEnus: "A Document Approval configuration with Id " + id + "was deleted",
		object: id
	};
	var register = new Register('LOG212015', id, json);
	return Log.createEvent(register);
};


Supervisor.prototype.executeDocumentApproval = function(id, oldStatus, newStatus) {
    var oldS = Supervisor.prototype._translateStatusToWord(oldStatus);
    var newS = Supervisor.prototype._translateStatusToWord(newStatus);
    
	var json = {
		messagePtbr: "Foi executada uma configuração de Aprovação de Documento com Id " + id + ". O status mudou de " + oldS + " para " + newS,
		messageEnus: "A Document Approval configuration with Id " + id + "was executed. The status changed from " + oldS + " to " + newS,
		object: id
	};
	var register = new Register('LOG212016', id, json);
	return Log.createEvent(register);
};

Supervisor.prototype.createDocumentSecurity = function(object) {
	var json = {
	};
	var register = new Register('LOG212017', object.id, json);
	return Log.createEvent(register);
};
Supervisor.prototype.updateDocumentSecurity = function(object) {
	var json = {
	};
	var register = new Register('LOG212018', object.id, json);
	return Log.createEvent(register);
};

Supervisor.prototype.deleteDocumentSecurity = function(object) {
	var json = {
	};
	var register = new Register('LOG212019', object, json);
	return Log.createEvent(register);
};


// ----------------------------------------------------------------- ERRORS ----------------------------------------------------------------- 

Supervisor.prototype.errorCreateStorageLocation = function(trace) {
	var json = trace;
	var register = new Register('LOG212020', json);
	return Log.createErrorEvent(register);
};
Supervisor.prototype.errorUpdateStorageLocation = function(trace) {
	var json = trace;
	var register = new Register('LOG212021', json);
	return Log.createErrorEvent(register);
};
Supervisor.prototype.errorDeleteStorageLocation = function(trace) {
	var json = trace;
	var register = new Register('LOG212022', json);
	return Log.createErrorEvent(register);
};

Supervisor.prototype.errorCreateKeyFieldsConfig = function(trace) {
	var json = trace;
	var register = new Register('LOG212023', json);
	return Log.createErrorEvent(register);
};
Supervisor.prototype.errorUpdateKeyFieldsConfig = function(trace) {
	var json = trace;
	var register = new Register('LOG212024', json);
	return Log.createErrorEvent(register);
};
Supervisor.prototype.errorDeleteKeyFieldsConfig = function(trace) {
	var json = trace;
	var register = new Register('LOG212025', json);
	return Log.createErrorEvent(register);
};

Supervisor.prototype.errorCreateFileStorage = function(trace) {
	var json = trace;
	var register = new Register('LOG212026', json);
	return Log.createErrorEvent(register);
};
Supervisor.prototype.errorUpdateFileStorage = function(trace) {
	var json = trace;
	var register = new Register('LOG212027', json);
	return Log.createErrorEvent(register);
};
Supervisor.prototype.errorDeleteFileStorage = function(trace) {
	var json = trace;
	var register = new Register('LOG212028', json);
	return Log.createErrorEvent(register);
};

Supervisor.prototype.errorCreateDocumentTypeConfig = function(trace) {
	var json = trace;
	var register = new Register('LOG212029', json);
	return Log.createErrorEvent(register);
};
Supervisor.prototype.errorUpdateDocumentTypeConfig = function(trace) {
	var json = trace;
	var register = new Register('LOG212030', json);
	return Log.createErrorEvent(register);
};
Supervisor.prototype.errorDeleteDocumentTypeConfig = function(trace) {
	var json = trace;
	var register = new Register('LOG212031', json);
	return Log.createErrorEvent(register);
};

Supervisor.prototype.errorCreateDocumentApproval = function(trace) {
	var json = trace;
	var register = new Register('LOG212032', json);
	return Log.createErrorEvent(register);
};
Supervisor.prototype.errorUpdateDocumentApproval = function(trace) {
	var json = trace;
	var register = new Register('LOG212033', json);
	return Log.createErrorEvent(register);
};
Supervisor.prototype.errorDeleteDocumentApproval = function(trace) {
	var json = trace;
	var register = new Register('LOG212034', json);
	return Log.createErrorEvent(register);
};

Supervisor.prototype.errorExecuteDocumentApproval = function(trace) {
	var json = trace;
	var register = new Register('LOG212035', json);
	return Log.createErrorEvent(register);
};

Supervisor.prototype.errorCreateDocumentSecurity = function(trace) {
	var json = trace;
	var register = new Register('LOG212036', json);
	return Log.createErrorEvent(register);
};
Supervisor.prototype.errorUpdateDocumentSecurity = function(trace) {
	var json = trace;
	var register = new Register('LOG212037', json);
	return Log.createErrorEvent(register);
};
Supervisor.prototype.errorDeleteDocumentSecurity = function(trace) {
	var json = trace;
	var register = new Register('LOG212038', json);
	return Log.createErrorEvent(register);
};

this.Supervisor = Supervisor;