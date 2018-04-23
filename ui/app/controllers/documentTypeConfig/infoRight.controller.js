sap.ui.controller('app.controllers.documentTypeConfig.infoRight', {
    onInit: function() {
        var _self = this;
    },
    onAfterRendering: function(html) {
        var _self = this;
        
        this.view = html;
        this.view.tabs = this.view.find('#tabs');
        this.view.toolbar = this.view.find('#toolbar');
        
        
        _self.view.docType = _self.view.find('#docType');
		_self.view.description = _self.view.find('#description');
		_self.view.numberRange = _self.view.find('#numberRange');
		_self.view.status = _self.view.find('#status');
		_self.view.validFrom = _self.view.find('#validFrom');
		_self.view.validTo = _self.view.find('#validTo');
		
		
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
        _self.getInformation();
    },
    renderToolbar: function(add) {
		var _self = this;
		_self.parameters = {
			id: window.parameters.id
		};
		this.view.toolbar.empty();
		this.view.toolbar.ctrl = this.view.toolbar.bindBaseLibraryToolbar({
			leftButtons: [{
				text: i18n('EDIT'),
				tooltip: i18n('CLICK PRESS') + ' ' + i18n('TO') + ' ' + i18n('EDIT'),
				onPress: function() {
					window.location = "#/documentTypeConfig?action=edit&id=" + window.parameters.id;
				},
				isButton: true,
				iconFont: "Formatting-and-Tool",
				icon: "pensil",
				enabled: this.privileges && this.privileges.DocumentTypeConfig.update ? this.privileges.DocumentTypeConfig.update : false
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
						window.location = '#/library';
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
    
    getInformation: function() {
		var _self = this;
		var params = {
			id: this.coreServices.id
		};

		Data.endpoints.documentTypeConfig.list.post(params).success(function(_data) {
			_self.view.docType.text(_data.docType);
			_self.view.description.text(_data.description);
			_self.view.numberRange.text(_data.numberRange);

			_self.view.status.text(_data.status ? _self.translate(_data.status) : '—');

			_self.view.validFrom.text(parseDate(_data.validFrom));
			_self.view.validTo.text(_data.validTo ? parseDate(_data.validTo) : '—');

			_self.coreServices.getComponents('loader').close();
		}).error(function() {
			_self.coreServices.getComponents('loader').close();
		});
	},
	translate: function(status){
	    var _self = this;
	    var translation = "";
	    if(status == 1){
	        translation = i18n('CREATION');
	    } else if (status ==2){
	        translation = i18n('PENDING');
	    } else if(status ==3){
	        translation =  i18n('APPROVED');
	    }else if(status ==4){
	        translation = i18n('ARCHIVED');
	    }
	    return translation;
	}
});