sap.ui.controller('app.controllers.documentApproval.executeApprovalDialog', {
    onInit: function() {
        var _self = this;
    },

    onAfterRendering: function(html) {
        var _self = this;
        _self.view = html;

        _self.view.status = _self.view.find('#status');
        _self.bindElements();
        $('#status').focus();
    },

    bindElements: function() {
        var _self = this;
        var data = this.getData(); 
        _self.coreServices.newStatus = null;
        // _self.renderStatus(data && data.files && data.files[0] ? data.files[0].status : 1);
        _self.renderStatus(data ? data.status : 1);
    },

    renderStatus: function(value) {
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
            tooltip: i18n('CLICK PRESS') + ' ' + i18n('SELECT') + ' ' + i18n('STATUS'),
            placeholder: i18n('SELECT') + ' ' + i18n('STATUS'),
            required: true,
            onChange: function(oldVal, newVal) {
                _self.coreServices.hasChanged = true;
                _self.coreServices.newStatus = newVal.key;
            }
        });
        if(value){
            _self.view.status.ctrl.setKey(value);
        }
    }
    

});