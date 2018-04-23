sap.ui.controller('app.controllers.fileStorage.editorRight', {
    onInit: function() {
        var _self = this;
    },
    onAfterRendering: function(html) {
        var _self = this;
        this.view = html;
        this.view.tabs = this.view.find('#tabs');
        this.view.toolbar = this.view.find('#toolbar');
        this.loader = this.view.tabs.baseLoader({
            modal: true
        });
        this.coreServices.addComponent(this.loader, 'loader');
        this.loader.open();
        this.coreServices.hideLeftPanel();
        this.bindElements();
    },
    bindElements: function() {
        var _self = this;

        this.renderToolbar(false);
        this.renderTabs();
    },
    renderToolbar: function(add) {
        var _self = this;
        this.view.toolbar.empty();
        this.view.toolbar.ctrl = this.view.toolbar.bindBaseLibraryToolbar({
            leftButtons: [{
                text: i18n('SAVE'),
                tooltip: i18n('CLICK PRESS') + ' ' + i18n('TO') + ' ' + i18n('SAVE'),
                onPress: function() {
                    if (_self.coreServices.action === 'edit') {
                        _self.coreServices.lock.enableToSave(function(_resp) {
                            if (_resp === true) {
                                _self.renderDialog(false, false);
                            }
                        });
                    } else {
                        _self.renderDialog(false, false);
                    }
                },
                isButton: true,
                iconFont: "Finance-and-Office",
                icon: "floppydisc",
                enabled: this.coreServices.action !== 'view',
            }, {
                text: i18n('SAVE AND NEW'),
                tooltip: i18n('CLICK PRESS') + ' ' + i18n('TO') + ' ' + i18n('SAVE AND NEW'),
                onPress: function() {
                    if (_self.coreServices.action === 'edit') {
                        _self.coreServices.lock.enableToSave(function(_resp) {
                            if (_resp === true) {
                                _self.renderDialog(true, false);
                            }
                        });
                    } else {
                        _self.renderDialog(true, false);
                    }
                },
                isButton: true,
                iconFont: "File-and-Folders",
                icon: "adddoc",
                enabled: this.coreServices.action !== 'view',
            }],
            rightButtons: [{
                text: i18n('LIBRARY'),
                tooltip: i18n('CLICK PRESS') + ' ' + i18n('TO') + ' ' + i18n('GO BACK') + ' ' + i18n('TO') + ' ' + i18n('LIBRARY'),
                onPress: function() {
                    if (_self.coreServices.hasChanged) {
                        _self.renderDialog(false, true);
                    } else {
                        if (_self.coreServices.action === 'edit') {
                            _self.coreServices.lock.removeLock();
                        }
                        window.location = '#/library?cadastro=fileStorage';
                    }
                },
                isButton: true,
                iconFont: "Sign-and-Symbols",
                icon: "toleft",
                enabled: true,
            }],
            hideGrid: true
        });
    },
    renderDialog: function(saveAndNew, close) {
        var _self = this;
        this.dialog = $.baseDialog({
            title: i18n('SAVE'),
            modal: true,
            size: 'small',
            cssClass: 'tbd-dialog',
            outerClick: 'disabled',
            viewName: 'app.views.layout.AlertName',
            viewData: {
                text1: i18n('CONFIRM SAVE')
            },
            buttons: [{
                name: i18n('NO'),
                isCloseButton: true,
                click: function() {
                    if (close) {
                        if (_self.coreServices.action === 'edit') {
                            _self.coreServices.lock.removeLock();
                        }
                        window.location = '#/library?cadastro=fileStorage';
                    }
                },
                tooltip: i18n('CLICK PRESS CANCEL')
            }, {
                name: i18n('YES'),
                tooltip: i18n('CLICK PRESS CONFIRM'),
                click: function() {
                    _self.dialogLoader = $('.base-dialog.tbd-dialog').baseLoader({
                        modal: true
                    }).open();
                    var classification = _self.coreServices.getComponents('classification')
                    if(classification && classification.getKey() == 1){
                        _self.coreServices.item.users = null;
                        _self.coreServices.item.groups = null;
                    }
                    var item = _self.coreServices.item;
                    var branch =  _self.coreServices.getComponents('branches');
                    var companies =  _self.coreServices.getComponents('companies');
                    
                    var eef = [];
					var eefList = branch.getKeys();
					var companyList = companies.getKeys();
					var companiesInBranches = [];
					eefList.forEach(function(eefString) {
						var split = eefString.split('_');
						var company = split[0];
						var uf = split[1];
						var branch = split[2];
						companiesInBranches.push(company);
						eef.push({
							idCompany: company,
							uf: uf,
							idBranch: branch
						});
					});
					companyList.forEach(function(company) {
						if (companiesInBranches.indexOf(company) === -1) {
							eef.push({
								idCompany: company,
								uf: null,
								branch: null
							});
						}
					});
					delete item.companies;
					delete item.branches;
					delete item.ufs;
					item.eef = eef;
                    var endpoint = 'create';
                    item.id = _self.coreServices.id || undefined;
                    if(item && item.id){
                        endpoint = 'update';
                    }
                    
                    if(_self.coreServices.getComponents("validFrom")){
                        var from = _self.coreServices.getComponents("validFrom");
                        item.validFrom = from.getDate && from.getDate() ? parseDate(from.getDate(), 'initDate')  : null;
                    }
                    if(_self.coreServices.getComponents("validTo")){
                        var to = _self.coreServices.getComponents("validTo");
                        item.validTo = to.getDate && to.getDate() ? parseDate(to.getDate(), 'initDate')  : null;
                    }
                    
                    if (!_self.validate(item)) {
                        _self.dialogLoader.close();
                        _self.dialog.close();
                        return;
                    }
                    var callback = function() {
                        if (close) {
                            if (_self.coreServices.action === 'edit') {
                                _self.coreServices.lock.removeLock();
                            }
                            window.location = '#/library?cadastro=fileStorage';
                        }
                    };
                    item.component = "TBD";
                    Data.endpoints.fileStorage[endpoint].post(item).success(function(_data) {
                        $.baseToast({
                            text: i18n('SAVE SUCCESS'),
                            isSuccess: true
                        });

                        _self.coreServices.hasChanged = false;
                        var action = function() {
                            if (saveAndNew) {
                                _self.loader.open();
                                if (_self.coreServices.lock)
                                    _self.coreServices.lock.removeLock();
                                _self.coreServices.action = 'new';
                                _self.coreServices.id = null;
                                _self.bindElements();
                            } else if (_data !== true) {
                                _self.coreServices.action = 'edit';
                                _self.coreServices.id = _data.fieldsInfo.id;
                            }
                            // _self.dialogLoader.close();
                            // _self.dialog.close();
                            callback();
                        };
                        if (_self.coreServices.action === 'new' && !saveAndNew) {
                            _self.getLock({
                                objectType: 'TBD::FileStorage',
                                id: _data.fieldsInfo.id,
                                callback: function(_data2) {
                                    if (!_data2.response) {
                                        window.location.hash = '/library?cadastro=fileStorage';
                                    } else {
                                        _self.coreServices.lock = _data2.controller;
                                        action();
                                    }
                                }
                            });
                        } else {
                            action();
                        }
                        _self.dialogLoader.close();
                        _self.dialog.close();
                    }).error(function() {
                        _self.dialogLoader.close();
                        _self.dialog.close();
                    });
                }
            }]
        }).open();
    },
    renderTabs: function() {
        var _self = this;
        this.view.tabs.empty();
        this.view.tabs.ctrl = this.view.tabs.bindBaseTabs({
            tab: [{
                viewName: "app.views.fileStorage.configuration"
            }],
            wrapperClass: "wrapperClass"
        });
        this.coreServices.addComponent(this.view.tabs.ctrl, 'tabs');
    },

    validate: function(item) {
        var _self = this;
        var acceptable = false;
        var share = true;

        var config = item.docTypeId !== "" && (item.eef.length >0) && item.status !== null  && 
       (item.tax && item.tax.length >0) && item.validFrom !== "" && item.imageUrl !== "" && item.securityClassification !== null && 
       item.keyFields1 !== ""  && item.keyFields2 !== "";

        var isValid = true;

        if (Object.keys(item).length > 8) {
            acceptable = true;
        }
        
        if (!item.imageUrl) {
            acceptable = false;
        }
        
        if(item.securityClassification === 2 && item.users.length < 1 && item.groups.length < 1){
            share = false;
            $.baseToast({
                text: i18n('SHARE WITH USERS OR GROUPS'),
                isError: true
            });
        }
        
        var validFrom = _self.coreServices.getComponents("validFrom");
        var validTo = _self.coreServices.getComponents("validTo");
        
        if (!_self.validateDate(_self.coreServices.item.validFrom, _self.coreServices.item.validTo) || (!validTo.isValid() || !validFrom.isValid())) {
            isValid = false;
            $.baseToast({
                text: i18n('INVALID DATE'),
                isError: true
            });
        }
        
        if (!config) {
            $.baseToast({
                text: i18n('INVALID DATA'),
                isError: true
            });
        }
        
        if (!acceptable) {
            $.baseToast({
                text: i18n('REQUIRED FIELDS MSG'),
                isError: true
            });
        }

        return config && isValid && acceptable && share;
    },

    validateDate: function(start, finish) {
        /* Return true if the dates are ok */
        var _self = this;
        var valid = true;

        if (finish != "" && start != null && finish != null) {
            if (finish < start) {
                valid = false;
            }
        }

        return valid;
    },
});