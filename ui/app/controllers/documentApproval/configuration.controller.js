sap.ui.controller('app.controllers.documentApproval.configuration', {
    onInit: function() {
        var _self = this;
    },

    onAfterRendering: function(html) {
        var _self = this;
        _self.view = html;

        _self.view.docType = _self.view.find('#docType');
        _self.view.docTypeDescription = _self.view.find('#docTypeDescription');
        _self.view.fileName = _self.view.find('#fileName');
        _self.view.imageUrl = _self.view.find('#imageUrl');
        _self.view.company = _self.view.find('#company');
        _self.view.status = _self.view.find('#status');
        _self.view.branch = _self.view.find('#branch');
        _self.view.classification = _self.view.find('#classification');
        _self.view.approvalDate = _self.view.find('#approvalDate');
        _self.view.comments = _self.view.find('#comments');
        _self.view.validFrom = _self.view.find('#validFrom');
        _self.view.validTo = _self.view.find('#validTo');

        _self.bindElements();
        $('#docType input').focus();
    },

    bindElements: function() {
        var _self = this;

        _self.renderInputs();
        _self.renderDates();

        _self.renderDocType({
            disabled: true
        });
        
        _self.renderSelects({
            disabled: true
        });
        
        $("#imageUrl").text(i18n('NO LINK AVAILABLE'));

        _self.coreServices.getComponents('loader').open();
        if (this.coreServices.action === 'new') {
            _self.newInformation();
        } else {
            _self.getInformation();
        }
        $("#imageUrl").css("word-wrap","break-word");
    },

    newInformation: function() {
        var _self = this;

        Data.endpoints.documentApproval.getRequiredInfo.post({}).success(function(_data) {
            _self.renderDocType({
                data: _data.docTypes
            });
            _self.renderSelects({
                data: _data
            });

            _self.loadFilesInfo(_data);
            _self.view.status.ctrl.setKey(1, true);
            _self.coreServices.item.status = 1;
            _self.coreServices.getComponents('loader').close();
        }).error(function() {
            _self.coreServices.getComponents('loader').close();
        });
    },

    getInformation: function() {
        var _self = this;
        var params = {
            id: this.coreServices.id
        };

        Data.endpoints.documentApproval.getRequiredInfo.post(params).success(function(_data) {
            _self.loadFields(_data);
            _self.renderSelects(_data);
            _self.loadFilesInfo(_data);
            
            
            if(_data.data.docTypeConfig && _data.data.docTypeConfig.length > 0){
                _data.data.docTypeConfig.map(function(ele) {
                    _self.view.docType.ctrl.setKey(ele.docType, true);
                    _self.view.docTypeDescription.ctrl.setValue(ele.description);
                });
            }
            
            if(_data.data.files && _data.data.files.length > 0){
                _data.data.files.map(function(ele) {
                    _self.view.fileName.ctrl.setKey(ele.fileName, true);
                    if(ele.imageUrl){
                        _self.linkStyle(ele.imageUrl, "");
                    } else {
                        $("#imageUrl").text(i18n('NO LINK AVAILABLE'));
                    }
                    _self.coreServices.item.fileStoredId = ele.id;
                });
            }
            
            var empresas = [];
			var branches = [];
			if(_data.data.eef){
			    for (var m = 0; m < _data.data.eef.length; m++){
				    if(_data.data.eef[m].idCompany){
				        empresas.push(_data.data.eef[m].idCompany);
				    }
				    if(_data.data.eef[m].idBranch){
				        branches.push(_data.data.eef[m].idBranch);
				    }
				}
			}
            
            _self.view.company.ctrl.setKey(_.uniq(empresas), true);
            _self.view.branch.ctrl.setKey(_.uniq(branches), true);
            
            _self.view.classification.ctrl.setValue(_self.translateClassification(_data.data.classification));

            
            _self.view.comments.ctrl.setText(_data.data.comments);
            _self.coreServices.item.comments = _data.data.comments;
            _self.view.status.ctrl.setKey(_data.data.files[0].status, true);
            _self.coreServices.item.status = _data.data.files[0].status;
            
            if(_data.data.approvalDate)
                _self.view.approvalDate.ctrl.setDate(parseDate(_data.data.approvalDate));
            _self.view.validFrom.ctrl.setDate(parseDate(_data.data.validFrom));
            _self.view.validTo.ctrl.setDate(parseDate(_data.data.validTo));

            if (_self.coreServices.action === 'view') {
                _self.view.docType.ctrl.disable();
                _self.view.docTypeDescription.ctrl.disable();
                _self.view.fileName.ctrl.disable();
                _self.view.comments.ctrl.disable();
                // _self.view.classification.ctrl.disable();
                _self.view.classification.ctrl.disable();
                _self.view.approvalDate.ctrl.disable();
                _self.view.validFrom.ctrl.disable();
                _self.view.validTo.ctrl.disable();
                _self.coreServices.hasChanges = false;
            }

            _self.coreServices.hasChanged = false;
            _self.coreServices.getComponents('loader').close();
        }).error(function() {
            _self.coreServices.getComponents('loader').close();
        });
    },

    loadFields: function(_data) {
        var _self = this;
        _self.renderDocType({
            data: _data.docTypes
        });
    },

    renderDocType: function(options) {
        var _self = this;
        _self.view.docType.empty();

        if (options.disabled) {
            _self.view.docType.ctrl = _self.view.docType.bindBaseAutocomplete({
                required: true,
                isDisabled: true,
                placeholder: i18n('SELECT') + ' ' + i18n('DOCUMENT TYPE')
            });
        } else if (options.data) {
            _self.view.docType.ctrl = _self.view.docType.bindBaseAutocomplete({
                options: options.data.length > 0 ? options.data : [],
                required: true,
                placeholder: i18n('SELECT') + ' ' + i18n('DOCUMENT TYPE'),
                tooltip: i18n('CLICK PRESS') + ' ' + i18n('TO SELECT') + ' ' + i18n('DOCUMENT TYPE'),
                onChange: function(oldVal, newVal) {
                    _self.coreServices.hasChanges = true;
                    _self.coreServices.item.docTypeId = newVal.id;
                    
                    _self.view.docTypeDescription.ctrl.setText(newVal.description);
                }
            });
        } else {
            _self.view.docType.ctrl = _self.view.docType.bindBaseAutocomplete({
                options: options.data,
                isLoading: true,
                required: true
            });
            Data.endpoints.documentApproval.getRequiredInfo.post().success(function(_data) {
                _self.renderDocType({
                    data: _data.docTypes
                });
            });
        }
    },
    loadFilesInfo: function(data) {
        var _self = this;
        
        _self.view.fileName.empty();
        if(data.disabled){
            _self.view.fileName.ctrl = _self.view.fileName.bindBaseMultipleSelect3({
                options: [],
                required: true,
                placeholder: i18n('SELECT') + ' ' + i18n('FILE NAME'),
                tooltip: i18n('CLICK PRESS') + ' ' + i18n('FILE NAME'),
                isLoading: true,
                onChange: function(newVal) {}
            });
            $("#imageUrl").text(i18n('NO LINK AVAILABLE'));
        } else {
            var opts = [];
            for (var i = 0; i < data.files.length; i++) {
                opts.push({
                    key: data.files[i].fileName,
                    name: data.files[i].fileName,
                    id: data.files[i].id
                });
            }
            
            _self.view.fileName.ctrl = _self.view.fileName.bindBaseSelect({
                options: opts,
                required: true,
                placeholder: i18n('SELECT') + ' ' + i18n('FILE NAME'),
                tooltip: i18n('CLICK PRESS') + ' ' + i18n('FILE NAME'),
                isDisabled: false,
                onChange: function(oldVal, newVal) {
                    _self.coreServices.hasChanged = true;
                    _self.coreServices.item.fileStoredId = newVal.id;
                    var obj = data.files.find(function(d) {
                        return d.fileName === newVal.key;
                    });
                    if (obj) {
                        if(obj.imageUrl){
                            _self.linkStyle(obj.imageUrl, "");
                        }else{
                            $("#imageUrl").text(i18n('NO LINK AVAILABLE'));
                        }
                        _self.view.status.ctrl.setKey(obj.status, true);
                        _self.coreServices.item.status = obj.status;
                        
                        _self.view.company.ctrl.setKey(obj.company, true);
    
                        _self.view.branch.ctrl.setKey(obj.branch, true);
    
                        _self.view.classification.ctrl.setValue(_self.translateClassification(obj.securityClassification));
                        _self.view.validFrom.ctrl.setDate(parseDate(obj.validFrom));
                        _self.coreServices.item.classification = obj.securityClassification;
                        _self.coreServices.item.validFrom = parseDate(obj.validFrom, 'initDate');
                        _self.view.validTo.ctrl.setDate(parseDate(obj.validTo));
                        _self.coreServices.item.validTo = parseDate(obj.validTo, 'initDate');
                    }else {
                        _self.linkStyle("", i18n('NO LINK AVAILABLE'));
                        _self.coreServices.item.company = undefined;
                        _self.coreServices.item.branch = undefined;
                        _self.coreServices.item.imageUrl = undefined;
                        _self.coreServices.item.validFrom = undefined;
                        _self.coreServices.item.validTo = undefined;
                        _self.coreServices.item.status = undefined;
                        _self.coreServices.item.classification = undefined;
                    }
                }
            });
        }
        
    },
    renderSelects: function(options) {
        var _self = this;
        _self.view.company.empty();
        _self.view.branch.empty();
        
        if(options.disabled){
            _self.view.company.ctrl = _self.view.company.bindBaseMultipleSelect3({
                options: [],
                required: true,
                placeholder: i18n('COMPANY'),
                tooltip: i18n('SELECT COMPANY'),
                isLoading: true,
                onChange: function(oldVal, newVal) {}
            });
            _self.view.branch.ctrl = _self.view.branch.bindBaseMultipleSelect3({
                options: [],
                required: true,
                placeholder: i18n('COMPANY'),
                tooltip: i18n('SELECT COMPANY'),
                isLoading: true,
                onChange: function(oldVal, newVal) {}
            });
        } else {
            _self.view.company.ctrl = _self.view.company.bindBaseMultipleSelect3({
                options: options.data.companies ? options.data.companies : options.companies,
                required: true,
                placeholder: i18n('COMPANY'),
                tooltip: i18n('SELECT COMPANY'),
                isDisabled: true,
                onChange: function(oldVal, newVal) {
                    _self.coreServices.hasChanged = true;
                }
            });
            
            _self.view.branch.ctrl = _self.view.branch.bindBaseMultipleSelect3({
                required: false,
                placeholder: i18n('BRANCH'),
                tooltip: i18n('BRANCH'),
                options: options.data.branches ? options.data.branches : options.branches,
                isDisabled: true,
                onChange: function(oldVal, newVal) {
                    _self.coreServices.item.idBranch = newVal.key;
                    _self.coreServices.hasChanged = true;
                }
            });
        }
        
        var opts = [{
            key: 1,
            name: i18n('CREATION')
        }, {
            key: 2,
            name: i18n('PENDING')
        }, {
            key: 3,
            name: i18n('APPROVED')
        }, {
            key: 4,
            name: i18n('ARCHIVED')
        }];
        _self.view.status.empty();
        _self.view.status.ctrl = _self.view.status.bindBaseSelect({
            required: true,
            isDisabled: true,
            options: opts,
            placeholder: i18n('SELECT') + ' ' + i18n('STATUS'),
            tooltip: i18n('CLICK PRESS') + ' ' + i18n('TO SELECT') + ' ' + i18n('STATUS'),
            onChange: function(oldVal, newVal) {
                _self.coreServices.hasChanged = true;
                _self.coreServices.item.status = newVal;
            }
        });
        // $('#status input').attr('maxlength', 2);
    },

    renderInputs: function() {
        var _self = this;

        _self.view.classification.empty();
        _self.view.classification.ctrl = _self.view.classification.bindBaseInput({
            required: true,
            tooltip: i18n('CLASSIFICATION'),
            placeholder:i18n('CLASSIFICATION'),
            isDisabled: true,
            onChange: function(oldVal, newVal) {
                _self.coreServices.hasChanges = true;
                _self.coreServices.item.classification = newVal.key;
            }
        });

        _self.view.docTypeDescription.empty();
        _self.view.docTypeDescription.ctrl = _self.view.docTypeDescription.bindBaseInput({
            required: true,
            isDisabled: true,
            placeholder: i18n('DESCRIPTION'),
            tooltip: i18n('DESCRIPTION'),
            onChange: function(oldVal, newVal) {
                _self.coreServices.hasChanged = true;
            }
        });
        $('#docTypeDescription input').attr('maxlength', 40);

        _self.view.comments.empty();
        _self.view.comments.ctrl = _self.view.comments.bindBaseTextarea({
            required: true,
            placeholder: i18n('FILL IN') + ' ' + i18n('COMMENTS'),
            tooltip: i18n('FILL IN') + ' ' + i18n('COMMENTS'),
            isDisabled: false,
            rows: 2,
            validatorType: 2,
            validator: function(val) {
                return val.length <= 1024;
            },
            onChange: function(oldVal, newVal) {
                _self.coreServices.item.comments = newVal;
                _self.coreServices.hasChanged = true;
            }
        });
    },

    renderDates: function() {
        var _self = this;

        _self.view.validFrom.empty();
        _self.view.validFrom.ctrl = _self.view.validFrom.bindBaseDatePicker({
            required: true,
            placeholder: i18n('VALID FROM'),
            tooltip:  i18n('VALID FROM'),
            isDisabled: true,
            onChange: function(oldVal, newVal) {
                _self.coreServices.item.validFrom = parseDate(newVal, 'initDate');
                _self.coreServices.hasChanged = true;
            }
        });
        _self.coreServices.addComponent(_self.view.validFrom.ctrl, "validFrom");
        _self.view.validTo.empty();
        _self.view.validTo.ctrl = _self.view.validTo.bindBaseDatePicker({
            required: false,
            placeholder: i18n('VALID TO'),
            tooltip:  i18n('VALID TO'),
            isDisabled: true,
            onChange: function(oldVal, newVal) {
                _self.coreServices.item.validTo = parseDate(newVal, 'initDate');
                _self.coreServices.hasChanged = true;
            }
        });
        _self.coreServices.addComponent(_self.view.validTo.ctrl, "validTo");
        _self.view.approvalDate.empty();
        _self.view.approvalDate.ctrl = _self.view.approvalDate.bindBaseDatePicker({
            required: false,
            placeholder: i18n('SELECT') + ' ' + i18n('APPROVAL DATE'),
            tooltip: i18n('CLICK PRESS') + ' '  + i18n('TO SELECT') + ' '+ i18n('APPROVAL DATE'),
            onChange: function(oldVal, newVal) {
                _self.coreServices.item.approvalDate = parseDate(newVal, 'initDate');
                _self.coreServices.hasChanged = true;
            }
        });
        _self.coreServices.addComponent(_self.view.approvalDate.ctrl, "approvalDate");
    },

    linkStyle: function(url, text) {
        var _self = this;
        $("#imageUrl").text(text);
        if(url !== "" ){
            var a = document.createElement('a');
            a.setAttribute('href',url);
            a.setAttribute('target',"_blank");
            a.innerHTML = url;
            document.getElementById('imageUrl').appendChild(a);
        }
    },
    
    translateClassification: function(classification){
	    var _self = this;
	    var translation = "";
	    if(classification == 1){
	        translation = i18n('FREE');
	    } else if (classification ==2){
	        translation = i18n('RESTRICTED');
	    } else if(classification ==3){
	        translation =  i18n('CONFIDENTIAL');
	    }
	    
	    return translation;
	}

});
