sap.ui.controller('app.controllers.fileStorage.configuration', {

    onDataRefactor: function(data) {
        return $.extend(data, this.data);
    },

    onInit: function() {
        var _self = this;
        this.data = {
            data: {
                text: i18n('UPLOAD FILE'),
                class: "uploadFile disabled",
                hasTransition: false,
                iconFont: "Communication",
                icon: "send",
                isDisabled: true
            }
        }
    },

    onAfterRendering: function(html) {
        var _self = this;
        _self.view = html;

        _self.view.docType = _self.view.find('#docType');
        _self.view.description = _self.view.find('#description');

        // _self.view.fileName = _self.view.find('#fileName');

        _self.view.upload = _self.view.find('#upload');
        _self.view.file = _self.view.find('#file');

        _self.view.keyField1 = _self.view.find('#keyField1');
        _self.view.keyField2 = _self.view.find('#keyField2');

        _self.view.company = _self.view.find('#company');
        _self.view.branch = _self.view.find('#branch');
        _self.view.uf = _self.view.find('#uf');
        _self.view.tax = _self.view.find('#tax');
        _self.view.status = _self.view.find('#status');
        _self.view.classification = _self.view.find('#classification');
        _self.view.classificationBtn = _self.view.find('#classificationBtn');
        _self.view.classificationBtn.baseTooltip({
            class: 'dark',
            position: 'top',
            text: i18n('CLASSIFICATION BTN TOOLTIP')
        });

        
        _self.view.validFrom = _self.view.find('#validFrom');
        _self.view.validTo = _self.view.find('#validTo');

        _self.bindElements();
        $('#docType input').focus();
    },

    bindElements: function() {
        var _self = this;

        _self.renderDocType({
            disabled: true
        });

        _self.renderCompany({
            disabled: true
        });
        _self.renderUf({
            disabled: true
        });
        _self.renderBranch({
            disabled: true
        });
        _self.renderTax({
            disabled: false
        });
        _self.renderClassDesc();
        _self.renderInputs();
        _self.renderStatus();

        _self.renderDates();
        _self.renderButton();
        if (this.coreServices.action === 'new') {
            _self.newInformation();
        } else {
            _self.getInformation();
        }
    },
    newInformation: function() {
        var _self = this;

        Data.endpoints.fileStorage.getRequiredInfo.post({}).success(function(_data) {
            _self.renderCompany({
                data: _data.companies
            });
            _self.renderTax({
                data: _data.taxes
            });
            _self.renderDocType({
                data: _data.docTypes
            });
            _self.view.status.ctrl.setKey(1);
            _self.renderUpload();
            $('#browse-button').addClass('upload-btn');
            $('#browse-button').addClass('btn highlighted');
            $('#browse-button').baseTooltip({
                class: 'dark',
                position: 'top',
                text: i18n('UPLOAD FILE BTN TOOLTIP')
            });
            _self.coreServices.getComponents('loader').close();
        }).error(function() {
            _self.coreServices.getComponents('loader').close();
        });
        //set contract also
    },

    getInformation: function() {
        var _self = this;
        var params = {
            id: this.coreServices.id
        };

        Data.endpoints.fileStorage.getRequiredInfo.post(params).success(function(_data) {
            _self.loadFields(_data);
            _self.coreServices.item.imageUrl = _data.data.imageUrl;
            var fileId = _data.data.imageUrl.split("/");
            _self.renderUpload(fileId[fileId.length - 2], _data.data.component);
            $('#browse-button').addClass('upload-btn');
            $('#browse-button').addClass('btn highlighted');
            
            _data.data.documentTypeConfig && _data.data.documentTypeConfig.length > 0 ? _data.data.documentTypeConfig.map(function(ele){
                _self.view.docType.ctrl.setKey(ele.docType);
                _self.view.description.ctrl.setValue(ele.description);
			}): '';
            
            // _self.view.fileName.ctrl.setValue(_data.data.fileName);
            _self.view.keyField1.ctrl.setValue(_data.data.keyField1);
            _self.view.keyField2.ctrl.setValue(_data.data.keyField2);
            
            var users = [];
            for (var x = 0; x < _data.data.users.length; x++){
			    if(_data.data.users[x].idUser){
			        users.push(_data.data.users[x].idUser);
			    }
			}
            _self.coreServices.item.users = users;
            
            var groups = [];
            for (var n = 0; n < _data.data.groups.length; n++){
			    if(_data.data.groups[n].idGroup){
			        groups.push(_data.data.groups[n].idGroup);
			    }
			}
            _self.coreServices.item.groups = groups;
            _self.view.classification.ctrl.setKey(_data.data.securityClassification, true);
            _self.view.status.ctrl.setKey(_data.data.status);

            var companies = [];
			var ufs = [];
			var branches = [];
			for (var m = 0; m < _data.data.eef.length; m++){
			    if(_data.data.eef[m].idCompany){
			        companies.push(_data.data.eef[m].idCompany);
			    }
			    if(_data.data.eef[m].uf){
			        ufs.push(_data.data.eef[m].uf);
			    }
			    if(_data.data.eef[m].idBranch){
			        branches.push(_data.data.eef[m].idCompany + "_" + _data.data.eef[m].uf + "_" + _data.data.eef[m].idBranch);
			    }
			}
			_self.renderCompany({
                data: _data.companies
            });
            
			_self.view.company.ctrl.setKey(companies, true);
			_self.coreServices.item.companies = companies;
			if( _data.data.ufs){
			    _self.renderUf({
    				data: _data.data ? _data.data.ufs : []
    			});
			}
            
			_self.view.uf.ctrl.setKey(ufs, true);
			_self.coreServices.item.ufs = ufs;
			if( _data.data.branches){
			    _self.renderBranch({
    				data: _data.data ? _data.data.branches : []
    			});
			}
		
			_self.view.branch.ctrl.setKey(branches, true);
			_self.coreServices.item.branches = branches;

            _self.coreServices.item.tax = [];
            _self.view.tax.ctrl.setKey(_data.data.tax.map(function(ele) {
                _self.coreServices.item.tax.push(ele.idTax);
                return ele.idTax;
            }), true);

            _self.view.validFrom.ctrl.setDate(parseDate(_data.data.validFrom));
            _self.view.validTo.ctrl.setDate(parseDate(_data.data.validTo));

            if (_self.coreServices.action === 'view') {
                _self.view.docType.ctrl.disable();
                // _self.view.fileName.ctrl.disable();
                _self.view.description.ctrl.disable();
                _self.view.status.ctrl.disable();
                _self.view.company.ctrl.disable();
                // _self.view.address.ctrl.disable();
                _self.view.branch.ctrl.disable();
                _self.view.tax.ctrl.disable();
                _self.view.status.ctrl.disable();
                _self.view.uf.ctrl.disable();
                _self.view.classification.ctrl.disable();
                // _self.view.link.ctrl.disable();
                _self.view.keyField1.ctrl.disable();
                _self.view.keyField2.ctrl.disable();

                _self.view.validFrom.ctrl.disable();
                _self.view.validTo.ctrl.disable();
                $("#browse-button").off()
            }

            _self.coreServices.hasChanged = false;
            _self.coreServices.getComponents('loader').close();
        }).error(function() {
            _self.coreServices.getComponents('loader').close();
        });
    },

    loadFields: function(_data) {
        this.renderCompany({
            data: _data.companies
        });
        this.renderBranch({
            data: _data.branches
        });
        this.renderUf({
            data: _data.ufs
        });
        this.renderTax({
            data: _data.taxes
        });
        this.renderDocType({
            data: _data.docTypes
        });
    },
    
    renderButton: function() {
        var _self = this;
        $('#classificationBtn').on('click', function() {
            var dialog = $.baseDialog({
                title: i18n('DOCUMENT SECURITY'),
                modal: true,
                size: 'big',
                cssClass: 'mdr-dialog',
                disableOuterClick: true,
                viewName: 'app.views.fileStorage.classification',
                viewData: {
                    // title: i18n('SECURITY CLASSIFICATION'),
                    data: _self.coreServices.item
                },
                buttons: [{
                    name: i18n('CANCEL'),
                    isCloseButton: true,
                    tooltip: i18n('CLICK PRESS CANCEL')
                }, {
                name: i18n('APPLY'),
                tooltip: i18n('CLICK PRESS CONFIRM'),
                click: function() {
                    // var id = $('#table').find('input[type="checkbox"]:checked').attr("data-id");
                    var users = [];
                    $('#usersTable .base-table .tbody').children().each(function(_i, _v) {
                      if ($(_v).find('.td.checkbox input').prop("checked")) {
                        users.push($(_v).data('id'));
                      }
                    });
                    var groups = [];
                    $('#groupsTable .base-table .tbody').children().each(function(_i, _v) {
                      if ($(_v).find('.td.checkbox input').prop("checked")) {
                        groups.push($(_v).data('id'));
                      }
                    });
                    _self.coreServices.item.users = users;
                    _self.coreServices.item.groups = groups;
                    if(users.length > 0 || groups.length > 0){
                        dialog.close();
                        _self.view.classification.ctrl.setKey(2, true);
                        _self.coreServices.item.securityClassification = 2;
                    } else {
                        $.baseToast({
                            isError: true,
                            text: i18n('CHOOSE ONE USER OR GROUP')
                        });
                    }
                    if(_self.coreServices.item.users.indexOf(_self.loggedUser.id) == -1){
                        _self.coreServices.item.users[_self.coreServices.item.users.length] = _self.loggedUser.id;
                    }
                }
            }]
            });
            dialog.open();
        });	
    },
    
    renderUpload: function(id, component) {
        var _self = this;
        _self.view.file.empty();
        _self.coreServices.getComponents('loader').open();
        _self.view.file.ctrl = _self.view.file.bindBaseAttachment({
            component: component ? component : "TBD",
            maxNum: 1,
            mode: 2,
            allowedTypes: "file_extension .jpg, .png, .tif, .pdf, .txt, .doc, .xls",
            multiple: false,
            chargeUploads: false,
            reUploadOne: true,
            removeShare: true,
            id: id ? id : undefined,
            onUpload: function(data) {
                _self.coreServices.item.fileName = data.name;
                _self.coreServices.item.imageUrl = data.url;
                $("#file-path").text(_self.coreServices.item.imageUrl);
                $("#header-logo-container").css({
                    "background-image": "url(" + _self.coreServices.item.imageUrl + "/)",
                    "background-repeat": 'no-repeat'
                });
                $("#header-logo-container").on("click", (function() {
                    if (data && data.id && _self.coreServices.item.imageUrl) {
                        window.open(_self.coreServices.item.imageUrl);
                    }
                }));
                _self.coreServices.hasChanged = true;
            },
            onError: function() {
                console.log("ERROR", true);
            },
            onList: function(data) {
                if (data && data[0]) {
                    _self.coreServices.item.fileName = data[0].name;
                    _self.coreServices.item.imageUrl = data[0].url;
                    $("#file-path").text(_self.coreServices.item.imageUrl);
                    $("#header-logo-container").css({
                        "background-image": "url(" + _self.coreServices.item.imageUrl + "/)",
                        "background-repeat": 'no-repeat'
                    });
                    $("#header-logo-container").on("click", (function() {
                        window.open(_self.coreServices.item.imageUrl);
                    }));
                } else {
                    $("#file-path").text("");
                }
            },
            onDelete: function() {
                _self.coreServices.hasChanged = true;
                $("#file-path").text("");
                $("#header-logo-container").css("background-image", "");
                //unbind click function
                delete _self.coreServices.item.imageUrl;
                delete _self.coreServices.item.fileName;
                _self.renderUpload();
            }
        });

        if (_self.coreServices.action === 'view') {
            $('#file-list').children().children().each(function() {
                $(this).off();
                $(this).css('pointer-events', 'none');
                $(this).css('cursor', 'default');
            });
        }
        _self.coreServices.getComponents('loader').close();
        $('#browse-button').addClass('upload-btn');
        $('#browse-button').addClass('btn highlighted');
    },
    
    renderCompany: function (options) {
        var _self = this;
        _self.view.company.empty();
        if (options.data) {
            _self.view.company.ctrl = _self.view.company.bindBaseMultipleSelect3({ 
                options: options.data,
                placeholder: i18n('SELECT') + ' ' + i18n('COMPANY'),
                tooltip: i18n('TOOLTIP') + ' ' + i18n('SELECT') + ' ' + i18n('COMPANY'),
                required:true,
                onChange: function( newVal) {
                    _self.coreServices.hasChanged = true;
                    _self.coreServices.item.companies = newVal.map(function(ele){
                        return ele.key;
                    });
                    _self.renderUf({
                        disabled: false,
                        idCompany: _self.coreServices.item.companies
                    });
                    _self.renderBranch({
                        disabled:true
                    });
                }
            });
        }else {
            _self.view.company.ctrl = _self.view.company.bindBaseSelect({
                isDisabled: true,
                placeholder: i18n('SELECT') + ' ' + i18n('COMPANY')
            });
        }
        _self.coreServices.addComponent(_self.view.company.ctrl, 'companies');
    },
    renderUf: function(options){
        var _self = this;
        this.view.uf.empty();    
        if (options.disabled) {
            _self.view.uf.ctrl = _self.view.uf.bindBaseMultipleSelect3({            
                isDisabled: true,
                placeholder: i18n('SELECT') + ' ' + i18n('UF'),
                tooltip: i18n('TOOLTIP') + ' ' + i18n('SELECT') + ' ' + i18n('UF'),
                required:true
            });
        } else if (options.data) {
            _self.view.uf.empty();
            _self.view.uf.ctrl = _self.view.uf.bindBaseMultipleSelect3({                
                placeholder: i18n('SELECT') + ' ' + i18n('UF'),
                tooltip: i18n('TOOLTIP') + ' ' + i18n('SELECT') + ' ' + i18n('UF'),
                options: options.data,
                required:true,
                onChange: function(newVal) {
                    _self.coreServices.hasChanged = true;
                    _self.coreServices.item.ufs = newVal.map(function(elem){
                        return elem.key;
                    });
                    if(newVal && newVal.length > 0){
                        var companies = _self.view.company.ctrl.getKeys();
                        _self.renderBranch({
                            disabled: false,
                            idCompany: companies,
                            uf: newVal.map(function(elem){return elem.key;})
                        });
                    }else{
                        _self.renderBranch({disabled:true});
                    }
                }
            });
        } else if (options.idCompany) {
            var callBack = function(opt){
                _self.renderUf({
                    data: opt
                });
            };
            _self.view.uf.empty();
            _self.view.uf.ctrl = _self.view.uf.bindBaseMultipleSelect3({                
                isLoading: true,
                placeholder: i18n('SELECT') + ' ' + i18n('LIBRARY CONTENT UF'),
                tooltip: i18n('TOOLTIP') + ' ' + i18n('SELECT') + ' ' + i18n('LIBRARY CONTENT UF')
            });
            Data.endpoints.fileStorage.listUfs.post({idCompany:options.idCompany}).success(function(_res){
                callBack(_res);
            }).error(function(){
                callBack([]);
            });
        }
        _self.coreServices.addComponent(_self.view.uf.ctrl, 'uf');
    },
    renderBranch: function(options) {
        var _self = this;
        this.view.branch.empty();
        if (options.disabled) {
            _self.view.branch.ctrl = _self.view.branch.bindBaseMultipleSelect3({                
                isDisabled: true,
                placeholder: i18n('SELECT') + ' ' + i18n('BRANCH'),
                tooltip: i18n('TOOLTIP') + ' ' + i18n('SELECT') + ' ' + i18n('BRANCH'),
                required:true
            });
        } else if (options.data) {
            _self.view.branch.empty();
            _self.view.branch.ctrl = _self.view.branch.bindBaseMultipleSelect3({                
                placeholder: i18n('SELECT') + ' ' + i18n('BRANCH'),
                tooltip: i18n('TOOLTIP') + ' ' + i18n('SELECT') + ' ' + i18n('BRANCH'),
                options: options.data,
                isDisabled: false,
                required:true,
                onChange: function(newVal) {
                    _self.coreServices.item.branches = newVal.map(function(elem){
                        return elem.key;
                    });
                    _self.coreServices.hasChanged = true;
                }
            });
        } else if (options.idCompany && options.uf) {
            _self.view.branch.empty();
            var callBack = function(opt){
                _self.renderBranch({
                    data: opt
                });
            };
            _self.view.branch.ctrl = _self.view.branch.bindBaseMultipleSelect3({                
                isLoading: true,
                placeholder: i18n('SELECT') + ' ' + i18n('BRANCH'),
                required:true,
                tooltip: i18n('TOOLTIP') + ' ' + i18n('SELECT') + ' ' + i18n('BRANCH')
            });
            Data.endpoints.fileStorage.listBranches.post({
                companyUf: [{
					idCompany: options.idCompany,
					uf: options.uf
				}],
                companies:[options.idCompany],
                ufs:options.uf,
                multiple:true
            }).success(function(_res){
                _res = _res.map(function(ele){return {key: ele.key, name: ele.name};});
                callBack(_res);
            }).error(function(){
                callBack([]);
            });
        }
        _self.coreServices.addComponent(_self.view.branch.ctrl, 'branches');
    },

    renderTax: function(options) {
        var _self = this;
        _self.view.tax.empty();

        if (options.disabled) {
            _self.view.tax.ctrl = _self.view.tax.bindBaseMultipleSelect3({
                required: true,
                isDisabled: true,
                placeholder: i18n('SELECT') + ' ' + i18n('TAX'),
                tooltip: i18n('CLICK PRESS') + ' ' + i18n('TO SELECT') + ' ' + i18n('TAX')
            });
        } else if (options.data) {
            _self.view.tax.ctrl = _self.view.tax.bindBaseMultipleSelect3({
                required: true,
                placeholder: i18n('SELECT') + ' ' + i18n('TAX'),
                tooltip: i18n('CLICK PRESS') + ' ' + i18n('TO SELECT') + ' ' + i18n('TAX'),
                options: options.data,
                onChange: function(newVal) {
                    _self.coreServices.item.tax = newVal.map(function(ele) {
                        return ele.key
                    });
                    _self.coreServices.hasChanged = true;
                }
            });
        }
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
                options: options.data,
                required: true,
                placeholder: i18n('SELECT') + ' ' + i18n('DOCUMENT TYPE'),
                tooltip: i18n('CLICK PRESS') + ' ' + i18n('TO SELECT') + ' ' + i18n('DOCUMENT TYPE'),
                onChange: function(oldVal, newVal) {
                    _self.coreServices.hasChanged = true;
                    _self.coreServices.item.docTypeId = newVal.id;
                    _self.view.description.ctrl.setText(newVal.description);
                }
            });
        } else {
            _self.view.docType.ctrl = _self.view.docType.bindBaseAutocomplete({
                options: options.data,
                isLoading: true,
                required: true
            });
            Data.endpoints.fileStorage.getRequiredInfo.post().success(function(_data) {
                _self.renderDocType({
                    data: _data.docTypes
                });
            });
        }
    },

    renderInputs: function() {
        var _self = this;
        _self.view.description.empty();
        _self.view.description.ctrl = _self.view.description.bindBaseInput({
            required: true,
            isDisabled: true,
            placeholder: i18n('DESCRIPTION'),
            tooltip:i18n('DESCRIPTION'),
            onChange: function(oldVal, newVal) {
                _self.coreServices.hasChanged = true;
            }
        });
        $('#description input').attr('maxlength', 40);

        // _self.view.fileName.empty();
        // _self.view.fileName.ctrl = _self.view.fileName.bindBaseInput({
        //     required: true,
        //     placeholder: i18n('SELECT') + ' ' + i18n('FILE NAME'),
        //     tooltip: i18n('CLICK PRESS') + ' ' + i18n('TO SELECT') + ' ' + i18n('FILE NAME'),
        //     onChange: function(oldVal, newVal) {
        //         _self.coreServices.item.fileName = newVal;
        //         _self.coreServices.hasChanged = true;
        //     }
        // });
        // $('#fileName input').attr('maxlength', 40);

        // _self.view.address.empty();
        // _self.view.address.ctrl = _self.view.address.bindBaseInput({
        //     required: true,
        //     placeholder: i18n('SELECT') + ' ' + i18n('ADDRESS'),
        //     tooltip: i18n('CLICK PRESS') + ' ' + i18n('TO SELECT') + ' ' + i18n('ADDRESS'),
        //     onChange: function(oldVal, newVal) {
        //         _self.coreServices.item.address = newVal;
        //         _self.coreServices.hasChanged = true;
        //     }
        // });
        // $('#address input').attr('maxlength', 40);

        _self.view.keyField1.empty();
        _self.view.keyField1.ctrl = _self.view.keyField1.bindBaseInput({
            required: true,
            placeholder: i18n('FILL') + ' ' + i18n('KEY FIELD'),
            tooltip:i18n('FILL') + ' ' + i18n('KEY FIELD'),
            onChange: function(oldVal, newVal) {
                _self.coreServices.item.keyField1 = newVal;
                _self.coreServices.hasChanged = true;
            }
        });
        $('#keyField1 input').attr('maxlength', 20);

        _self.view.keyField2.empty();
        _self.view.keyField2.ctrl = _self.view.keyField2.bindBaseInput({
            required: true,
            placeholder: i18n('FILL') + ' ' + i18n('KEY FIELD'),
            tooltip:i18n('FILL') + ' ' + i18n('KEY FIELD'),
            onChange: function(oldVal, newVal) {
                _self.coreServices.item.keyField2 = newVal;
                _self.coreServices.hasChanged = true;
            }
        });
        $('#keyField2 input').attr('maxlength', 20);
    },

    renderStatus: function() {
        var _self = this;
        var opt = [{
            key: '1',
            name: i18n('CREATION')
        }, {
            key: '2',
            name: i18n('PENDING')
        }, {
            key: '3',
            name: i18n('APPROVED')
        }, {
            key: '4',
            name: i18n('ARCHIVED')
        }];
        _self.view.status.ctrl = _self.view.status.bindBaseSelect({
            options: opt,
            required: true,
            isDisabled: false,
            tooltip: i18n('CLICK PRESS') + ' ' + i18n('TO SELECT') + ' ' + i18n('STATUS'),
            placeholder: i18n('SELECT') + ' ' + i18n('STATUS'), 
            onChange: function(oldVal, newVal) {
                _self.coreServices.hasChanged = true;
                _self.coreServices.item.status = newVal.key;
            }
        });
    },
    
    renderClassDesc: function() {
        var _self = this;

        var opt = [{
            key: "1",
            name: i18n('FREE')
        }, {
            key: "2",
            name: i18n('RESTRICTED')
        }, {
            key: "3",
            name: i18n('CONFIDENTIAL')
        }];
        _self.view.classification.ctrl = _self.view.classification.bindBaseSelect({
            options: opt,
            required: true,
            hasNullableOption: true,
            tooltip: i18n('CLICK PRESS') + ' ' + i18n('TO SELECT') + ' ' + i18n('CLASSIFICATION'),
            placeholder: i18n('SELECT') + ' ' + i18n('CLASSIFICATION'),
            onChange: function(oldVal, newVal) {
                _self.coreServices.hasChanged = true;
                _self.coreServices.item.securityClassification = newVal.key;
                if(newVal.key == 2){
                    $('#classificationBtn').click();
                } else {
                    $.baseToast({
                        type: 'I',
                        text: i18n('SHARE ONLY ON RESTRICTED')
                    });
                }
            }
        });
        _self.coreServices.addComponent(_self.view.classification.ctrl, 'classification');
    },

    renderDates: function() {
        var _self = this;

        _self.view.validFrom.empty();
        _self.view.validFrom.ctrl = _self.view.validFrom.bindBaseDatePicker({
            required: true,
            placeholder: i18n('SELECT') + ' ' + i18n('VALID FROM'),
            tooltip: i18n('CLICK PRESS') + ' ' + i18n('TO SELECT') + ' ' + i18n('VALID FROM'),
            onChange: function(oldVal, newVal) {
                _self.coreServices.item.validFrom = parseDate(newVal, 'initDate');
                _self.coreServices.hasChanged = true;
            }
        });
        _self.coreServices.addComponent(_self.view.validFrom.ctrl, "validFrom");
        _self.view.validTo.empty();
        _self.view.validTo.ctrl = _self.view.validTo.bindBaseDatePicker({
            required: false,
            placeholder: i18n('SELECT') + ' ' + i18n('VALID TO'),
            tooltip: i18n('CLICK PRESS') + ' ' + i18n('TO SELECT') + ' ' + i18n('VALID TO'),
            onChange: function(oldVal, newVal) {
                _self.coreServices.item.validTo = parseDate(newVal, 'initDate');
                _self.coreServices.hasChanged = true;
            }
        });
        _self.coreServices.addComponent(_self.view.validTo.ctrl, "validTo");
    }

});