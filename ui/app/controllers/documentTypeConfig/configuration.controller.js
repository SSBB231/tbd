sap.ui.controller('app.controllers.documentTypeConfig.configuration', {
    onInit: function() {
        var _self = this;
    },

    onAfterRendering: function(html) {
        var _self = this;
        _self.view = html;

        _self.view.docType = _self.view.find('#docType');
        _self.view.description = _self.view.find('#description');
        _self.view.numberRange = _self.view.find('#numberRange');
        _self.view.status = _self.view.find('#status');


        _self.view.validFrom = _self.view.find('#validFrom');
        _self.view.validTo = _self.view.find('#validTo');

        _self.bindElements();
        $('#docType').focus();
    },

    bindElements: function() {
        var _self = this;

        _self.renderInputs();
        _self.renderStatus();
        _self.renderDates();

        if (this.coreServices.action !== "new") {
            _self.loadData();
        }
    },

    loadData: function() {
        var _self = this;
        var params = {
            id: this.coreServices.id
        };
        _self.coreServices.getComponents('loader').open();
        Data.endpoints.documentTypeConfig.list.post(params).success(function(_data) {
            _self.view.docType.ctrl.setValue(_data.docType);
            _self.view.description.ctrl.setText(_data.description);
            _self.view.numberRange.ctrl.setValue(_data.numberRange);
            
            _self.view.status.ctrl.setKey(_data.status, false);

            _self.view.validFrom.ctrl.setDate(parseDate(_data.validFrom));
            _self.view.validTo.ctrl.setDate(parseDate(_data.validTo));

            _self.coreServices.hasChanged = false;
            _self.coreServices.getComponents('loader').close();
        }).error(function() {
            _self.coreServices.getComponents('loader').close();
        });
    },

    renderInputs: function() {
        var _self = this;
        
        // $('#code input').attr('maxlength', 12);
        // this.coreServices.addComponent(_self.view.code.ctrl, 'code');

        _self.view.docType.empty();
        _self.view.docType.ctrl = _self.view.docType.bindBaseInput({
            required: true,
            placeholder: i18n('FILL') + ' ' + i18n('DOCUMENT TYPE'),
            tooltip:i18n('FILL') + ' ' + i18n('DOCUMENT TYPE'),
            onChange: function(oldVal, newVal) {
                _self.coreServices.item.docType = newVal;
                _self.coreServices.hasChanged = true;
            }
        });
        $('#docType input').attr('maxlength', 4);

        _self.view.description.empty();
        _self.view.description.ctrl = _self.view.description.bindBaseInput({
            required: true,
            placeholder: i18n('FILL') + ' ' + i18n('DESCRIPTION'),
            tooltip: i18n('FILL') + ' ' + i18n('DESCRIPTION'),
            onChange: function(oldVal, newVal) {
                _self.coreServices.item.description = newVal;
                _self.coreServices.hasChanged = true;
            }
        });
        $('#description input').attr('maxlength', 40);

        _self.view.numberRange.empty();
        _self.view.numberRange.ctrl = _self.view.numberRange.bindBaseInput({
            required: true,
            placeholder: i18n('FILL') + ' ' + i18n('NUMBER RANGE'),
            tooltip: i18n('FILL') + ' ' + i18n('NUMBER RANGE'),
            onChange: function(oldVal, newVal) {
                _self.coreServices.hasChanged = true;
                _self.coreServices.item.numberRange = newVal;
            },
            validator: function(val) {
                var numericExpression = /^[0-9]+$/;
                return val.match(numericExpression) && val.length <= 10;
            }
        });
    },

    renderStatus: function() {
        var _self = this;
        var opt = [{
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
        _self.view.status.ctrl = _self.view.status.bindBaseSelect({
            options: opt,
            required: false,
            tooltip: i18n('CLICK PRESS') + ' ' +i18n('TO SELECT') + ' ' + i18n('STATUS'),
            placeholder: i18n('SELECT') + ' ' + i18n('STATUS'),
            hasNullableOption: true,
            onChange: function(oldVal, newVal) {
                _self.coreServices.hasChanged = true;
                _self.coreServices.item.status = newVal.key;
            }
        });
    },

    renderDates: function() {
        var _self = this;

        _self.view.validFrom.empty();
        _self.view.validFrom.ctrl = _self.view.validFrom.bindBaseDatePicker({
            required: true,
            placeholder: i18n('SELECT') + ' ' + i18n('VALID FROM'),
            tooltip: i18n('CLICK PRESS') + ' ' +i18n('TO SELECT') + ' ' + i18n('VALID FROM'),
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
            tooltip: i18n('CLICK PRESS') + ' ' +  i18n('TO SELECT') + ' ' +i18n('VALID TO'),
            onChange: function(oldVal, newVal) {
                _self.coreServices.item.validTo = parseDate(newVal, 'initDate');
                _self.coreServices.hasChanged = true;
            }
        });
        _self.coreServices.addComponent(_self.view.validTo.ctrl, "validTo");
    }

});