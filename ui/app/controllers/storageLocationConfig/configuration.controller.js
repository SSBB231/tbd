sap.ui.controller('app.controllers.storageLocationConfig.configuration', {
    onInit: function() {
        var _self = this;
    },

    onAfterRendering: function(html) {
        var _self = this;
        _self.view = html;

        _self.view.docType = _self.view.find('#docType');
        
        var levels = [1,2,3,4,5,6,7,8,9,10,11];
        levels.forEach(function(number){
            _self.view['level' + number] = _self.view.find('#level'+number);
        });
        
        _self.view.validFrom = _self.view.find('#validFrom');
        _self.view.validTo = _self.view.find('#validTo');

        _self.bindElements();
        $('#docType').focus();
    },

    bindElements: function() {
        var _self = this;

        _self.renderInputs();
        _self.renderDates();

        _self.renderDocType({
            disabled: true
        });
        _self.coreServices.getComponents('loader').open();
        if (this.coreServices.action === 'new') {
            _self.newInformation();
        } else {
            _self.getInformation();
        }
    },

    newInformation: function() {
        var _self = this;

        Data.endpoints.storageLocationConfig.getRequiredInfo.post({}).success(function(_data) {
            _self.renderDocType({
                data: _data.docTypes
            });

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

        Data.endpoints.storageLocationConfig.getRequiredInfo.post(params).success(function(_data) {
            _self.loadFields(_data);
            var info = _data.data;
            
            if(info){
                if(info.docTypeConfig && info.docTypeConfig.length > 0){
                    _self.view.docType.ctrl.setKey(info.docTypeConfig[0].id);
                }
            }
            
            var levels = [1,2,3,4,5,6,7,8,9,10,11];
            levels.forEach(function(number){
                _self.view['level' + number].ctrl.setText(info['level' + number]);
            });

            _self.view.validFrom.ctrl.setDate(parseDate(info.validFrom));
            
            if(info.validTo)
                _self.view.validTo.ctrl.setDate(parseDate(info.validTo));

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
                options: options.data,
                required: true,
                placeholder: i18n('SELECT') + ' ' + i18n('DOCUMENT TYPE'),
                tooltip: i18n('CLICK PRESS') + ' ' + i18n('TO SELECT') + ' ' + i18n('DOCUMENT TYPE'),
                onChange: function(oldVal, newVal) {
                    _self.coreServices.hasChanged = true;
                    _self.coreServices.item.docTypeId = newVal.id;
                    // _self.view.docTypeDescription.ctrl.setText(newVal.description);
                }
            });
        } else {
            _self.view.docType.ctrl = _self.view.docType.bindBaseAutocomplete({
                options: options.data,
                isLoading: true,
                required: true
            });
            Data.endpoints.storageLocationConfig.getRequiredInfo.post().success(function(_data) {
                _self.renderDocType({
                    data: _data.docTypes
                });
            });
        }
    },
    
    renderInputs: function() {
        var _self = this;

        // _self.view.docType.empty();
        // _self.view.docType.ctrl = _self.view.docType.bindBaseInput({
        //     required: true,
        //     isDisabled: false,
        //     placeholder: i18n('DOCUMENT TYPE'),
        //     tooltip: i18n('DOCUMENT TYPE'),
        //     onChange: function(oldVal, newVal) {
        //         // _self.coreServices.item.docType = newVal;
        //         _self.coreServices.hasChanged = true;
        //     }
        // });
        // $('#docType input').attr('maxlength', 40);

        // _self.view.storageLocation.empty();
        // _self.view.storageLocation.ctrl = _self.view.storageLocation.bindBaseInput({
        //     required: false,
        //     placeholder: i18n('SELECT') + ' ' + i18n('STORAGE LOCATION'),
        //     tooltip: i18n('CLICK PRESS') + ' ' + i18n('TO SELECT') + ' ' + i18n('STORAGE LOCATION'),
        //     onChange: function(oldVal, newVal) {
        //         _self.coreServices.hasChanged = true;
        //         _self.coreServices.item.storageLocation = newVal;
        //     },
        //     validator: function(val) {
        //         var numericExpression = /^[0-9]+$/;
        //         return val.match(numericExpression) && val.length <= 40;
        //     }
        // });
        // $('#storageLocation input').attr('maxlength', 40);

        var levels = [1,2,3,4,5,6,7,8,9,10,11];
        
        levels.forEach(function(number){
            _self.view['level' + number].empty();
            _self.view['level' + number].ctrl = _self.view['level' + number].bindBaseInput({
                required: false,
                placeholder: i18n('FILL') + ' ' + i18n('LEVEL ' + number),
                tooltip:i18n('FILL') + ' ' + i18n('LEVEL ' + number),
                isDisabled: false,
                onChange: function(oldVal, newVal) {
                    _self.coreServices.hasChanged = true;
                    _self.coreServices.item['level' + number] = newVal;
                }
            });
            $('#level' + number + ' input').attr('maxlength', 255);
        });
    },

    renderDates: function() {
        var _self = this;

        _self.view.validFrom.empty();
        _self.view.validFrom.ctrl = _self.view.validFrom.bindBaseDatePicker({
            required: true,
            placeholder: i18n('SELECT') + ' ' + i18n('VALID FROM'),
            tooltip: i18n('CLICK PRESS') + ' '  + i18n('TO SELECT') + ' '+ i18n('VALID FROM'),
            onChange: function(oldVal, newVal) {
                _self.coreServices.item.validFrom = parseDate(newVal, "initDate");
                _self.coreServices.hasChanged = true;
            }
        });
        _self.coreServices.addComponent(_self.view.validFrom.ctrl, "validFrom");
        
        _self.view.validTo.empty();
        _self.view.validTo.ctrl = _self.view.validTo.bindBaseDatePicker({
            required: false,
            placeholder: i18n('SELECT') + ' ' + i18n('VALID TO'),
            tooltip: i18n('CLICK PRESS') + ' '  + i18n('TO SELECT') + ' '+ i18n('VALID TO'),
            onChange: function(oldVal, newVal) {
                _self.coreServices.item.validTo = parseDate(newVal, "initDate");
                _self.coreServices.hasChanged = true;
            }
        });
        _self.coreServices.addComponent(_self.view.validTo.ctrl, "validTo");
    }

});