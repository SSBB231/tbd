sap.ui.controller('app.controllers.keyFieldsConfig.configuration', {
    onInit: function() {
        var _self = this;
    },

    onAfterRendering: function(html) {
        var _self = this;
        _self.view = html;

        _self.view.docType = _self.view.find('#docType');
        _self.view.docTypeDescription = _self.view.find('#docTypeDescription');
        _self.view.structure = _self.view.find('#structure');
        _self.view.keys = _self.view.find('#keys');
        _self.view.componentOrigin = _self.view.find('#componentOrigin');
        _self.view.validFrom = _self.view.find('#validFrom');
        _self.view.validTo = _self.view.find('#validTo');

        _self.coreServices.keysCount = 1;
        _self.coreServices.keysData = [];
        this.loader = this.view.baseLoader({
            modal: true
        });
        
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

        _self.renderStructure({
            disabled: true
        });
        
        _self.renderComponentOrigin({
            disabled: true
        });
        
        _self.renderKeys({
            disabled: true,
            info: null
        });

        if (this.coreServices.action === 'new') {
            _self.newInformation();
        } else {
            _self.getInformation();
        }
    },

    newInformation: function() {
        var _self = this;
        
        _self.loader.open();
        Data.endpoints.keyFieldsConfig.getRequiredInfo.post({getStructs: true}).success(function(_data) {
            _self.strucData = _data.structureData;
            _self.renderDocType({
                data: _data.docTypes
            });
    
            _self.renderComponentOrigin({
                data: _data.componentsList
            });
            
            _self.renderStructure({
                data: _data.structureData
            });

            _self.loader.close();
        }).error(function() {
            _self.loader.close();
        });
    },

    getInformation: function() {
        var _self = this;
        var params = {
            id: this.coreServices.id,
            getStructs: true
        };
        
        _self.loader.open();
        Data.endpoints.keyFieldsConfig.getRequiredInfo.post(params).success(function(_data) {
            _self.strucData = _data.structureData;
            // _self.coreServices.id = _data.id;
            _self.loadFields(_data);
            
            _self.view.componentOrigin.ctrl.setKey(_data.data.componentOrigin);
            _data.data.documentTypeConfig && _data.data.documentTypeConfig.length > 0 ? _data.data.documentTypeConfig.map(function(ele){
                _self.view.docType.ctrl.setKey(ele.docType);
                _self.view.docTypeDescription.ctrl.setValue(ele.description);
			}): '';

            _self.view.structure.ctrl.setKey(_data.data.structure, false);
            _self.view.validFrom.ctrl.setDate(parseDate(_data.data.validFrom));
            _self.view.validTo.ctrl.setDate(parseDate(_data.data.validTo));

            var components = app.services.getComponents();
            for (var i = 0; i < _data.data.keys.length; i++) {
                if (i > 0) {
                    _self.renderKeys({
                        field: 'keys',
                        data: _self.strucData,
                        strucId: _data.data.structure,
                        info: _data.data.keys[i],
                        disabled: _self.coreServices.action === 'view' ? true : false
                    });
                }
                
                components.KEYS.setKey(_data.data.keys[i].keyCode);
                if (_self.coreServices.action === 'view') {
                    components.KEYS.disable();
                    $('.delete-icon').off();
                    $('.add-icon').off();
                }
            }
    
            if (_self.coreServices.action === 'view') {
                _self.view.docType.ctrl.disable();
                _self.view.docTypeDescription.ctrl.disable();
                _self.view.structure.ctrl.disable();
                _self.view.validFrom.ctrl.disable();
                _self.view.validTo.ctrl.disable();
            }

           _self.coreServices.hasChanged = false;
           _self.loader.close();
        }).error(function() {
            _self.loader.close();
        });
    },

    loadFields: function(_data) {
        var _self = this;

        _self.renderDocType({
            data: _data.docTypes
        });

        _self.renderStructure({
            data: _data.structureData
        });
        
        _self.renderComponentOrigin({
            data: _data.componentList
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
                options: options.data,
                required: true,
                placeholder: i18n('SELECT') + ' ' + i18n('DOCUMENT TYPE'),
                tooltip: i18n('CLICK PRESS') + ' ' + i18n('TO SELECT') + ' ' + i18n('DOCUMENT TYPE'),
                onChange: function(oldVal, newVal) {
                    _self.coreServices.hasChanged = true;
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
            Data.endpoints.keyFieldsConfig.getRequiredInfo.post().success(function(_data) {
                _self.renderDocType({
                    data: _data.docTypes
                });
            });
        }
    },

    renderStructure: function(options) {
        var _self = this;
        _self.view.structure.empty();

        if (options.disabled) {
            _self.view.structure.ctrl = _self.view.structure.bindBaseAutocomplete({
                required: true,
                isDisabled: true,
                placeholder: i18n('SELECT') + ' ' + i18n('DOCUMENT TYPE')
            });
            // _self.view.keys.ctrl = _self.view.keys.bindBaseAutocomplete({
            //     required: true,
            //     isDisabled: true,
            //     placeholder: i18n('SELECT') + ' ' + i18n('KEYS')
            // });
        } else if (options.data) {
            var opts = [];
            options.data.forEach(function(data, index) {
                opts.push({
                    key: data.id,
                    name: data.title
                });
            });
            _self.view.structure.ctrl = _self.view.structure.bindBaseAutocomplete({
                options: opts,
                required: true,
                placeholder: i18n('SELECT') + ' ' + i18n('STRUCTURE'),
                tooltip: i18n('CLICK PRESS') + ' ' + i18n('TO SELECT') + ' ' + i18n('STRUCTURE'),
                onChange: function(oldVal, newVal) {
                    _self.coreServices.hasChanged = true;
                    _self.coreServices.item.structure = newVal.key;
                    //call endpoint to get structures' fields for keys
                    if (newVal.key) {
                        _self.coreServices.keysData.length = 1;
                        _self.coreServices.keysCount = 1;
                        _self.coreServices.keysData[this.coreServices.keysCount] = {
                            keys: null
                        };
                        _self.view.keys.empty();
                        _self.renderKeys({
                            data: _self.strucData,
                            strucId: newVal.key,
                            info: null
                        });
                    } else {
                        _self.coreServices.keysData.length = 1;
                        _self.coreServices.keysCount = 1;
                        _self.coreServices.keysData[this.coreServices.keysCount] = {
                            keys: null
                        };
                        _self.view.keys.empty();
                        _self.renderKeys({
                            disabled: true,
                            info: null
                        });
                    }
                }
            });
        } else {
            _self.view.structure.ctrl = _self.view.structure.bindBaseAutocomplete({
                options: [],
                isLoading: true,
                required: true
            });
            Data.endpoints.keyFieldsConfig.getStructures.post().success(function(_data) {
                _self.renderStructure({
                    data: _data
                });
            });
        }
    },
    
    renderComponentOrigin: function(options) {
        var _self = this;
        _self.view.componentOrigin.empty();

        if (options.disabled) {
            _self.view.componentOrigin.ctrl = _self.view.componentOrigin.bindBaseAutocomplete({
                required: true,
                isDisabled: true,
                placeholder: i18n('SELECT') + ' ' + i18n('COMPONENT ORIGIN')
            });
        } else if (options.data) {
            _self.view.componentOrigin.ctrl = _self.view.componentOrigin.bindBaseAutocomplete({
                options: options.data,
                required: true,
                placeholder: i18n('SELECT') + ' ' + i18n('COMPONENT ORIGIN'),
                tooltip: i18n('CLICK PRESS') + ' ' + i18n('TO SELECT') + ' ' + i18n('COMPONENT ORIGIN'),
                onChange: function(oldVal, newVal) {
                    _self.coreServices.hasChanged = true;
                    _self.coreServices.item.componentOrigin = newVal.key;
                }
            });
        } else {
            _self.view.componentOrigin.ctrl = _self.view.componentOrigin.bindBaseAutocomplete({
                options: options.data,
                isLoading: true,
                required: true
            });
            Data.endpoints.keyFieldsConfig.getRequiredInfo.post().success(function(_data) {
                _self.renderComponentOrigin({
                    data: _data.componentList
                });
            });
        }
    },
    
    renderInputs: function() {
        var _self = this;

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
    },
    renderDates: function() {
        var _self = this;

        _self.view.validFrom.empty();
        _self.view.validFrom.ctrl = _self.view.validFrom.bindBaseDatePicker({
            required: true,
            placeholder: i18n('SELECT') + ' ' + i18n('VALID FROM'),
            tooltip: i18n('CLICK PRESS') + ' ' + i18n('TO SELECT') + ' '+ i18n('VALID FROM'),
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
            tooltip: i18n('CLICK PRESS') + ' ' + i18n('TO SELECT') + ' '+ i18n('VALID TO'),
            onChange: function(oldVal, newVal) {
                _self.coreServices.item.validTo = parseDate(newVal, 'initDate');
                _self.coreServices.hasChanged = true;
            }
        });
        _self.coreServices.addComponent(_self.view.validTo.ctrl, "validTo");
    },

    renderKeys: function(data) {
        var _self = this;
        this.components = {};
        var fields = ['keys'];
        this.components.keys = {};
        this.keysCount = 1;

        _self.coreServices.keysData[this.coreServices.keysCount] = {
            keys: null
        };

        fields.forEach(function(field) {
            _self.renderInput({
                field: field,
                disabled: data.disabled,
                info: data.info,
                data: data.data,
                strucId: data.strucId
            });
        });
    },
    renderInput: function(data) {
        var _self = this;
        var view = new sap.ui.view({
            viewName: "app.views.keyFieldsConfig.tab",
            type: sap.ui.core.mvc.ViewType.HTML,
            data: {}
        });

        var viewData = {
            parentController: this,
            index: this[data.field + 'Count'], //this.coreServices.keysCount,
            label: i18n(data.field.toUpperCase() + ' LABEL'),
            field: data.field,
            disabled: data.disabled
        }

        if (data.info) {
            viewData.info = data.info;
        }
        if (data.data) {
            viewData.data = data.data;
        }
        if (data.strucId) {
            viewData.strucId = data.strucId;
        }
        this.components[data.field][this[data.field + 'Count']++] = this.view[data.field].bindView(view, viewData);
    }
});