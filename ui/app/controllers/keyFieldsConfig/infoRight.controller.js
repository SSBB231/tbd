sap.ui.controller('app.controllers.keyFieldsConfig.infoRight', {
    onInit: function() {
        var _self = this;
    },
    onAfterRendering: function(html) {
        var _self = this;
        
        this.view = html;
        this.view.tabs = this.view.find('#tabs');
        this.view.toolbar = this.view.find('#toolbar');
        
        
        _self.view.docType = _self.view.find('#docType');
        _self.view.docTypeDescription = _self.view.find('#docTypeDescription');
        _self.view.structure = _self.view.find('#structure');
        _self.view.keys = _self.view.find('#keys');
        _self.view.componentOrigin = _self.view.find('#componentOrigin');
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
					window.location = "#/keyFieldsConfig?action=edit&id=" + window.parameters.id;
				},
				isButton: true,
				iconFont: "Formatting-and-Tool",
				icon: "pensil",
				enabled: this.privileges && this.privileges.KeyFieldsConfig.update ? this.privileges.KeyFieldsConfig.update : false
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
						window.location = '#/library?cadastro=keyFieldsConfig';
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
            id: this.coreServices.id,
            getStructs: true
        };

        Data.endpoints.keyFieldsConfig.getRequiredInfo.post(params).success(function(_data) {
            _data.data.documentTypeConfig && _data.data.documentTypeConfig.length > 0 ? _data.data.documentTypeConfig.map(function(ele){
                _self.view.docType.text(ele.docType);
                _self.view.docTypeDescription.text(ele.description);
			}): '';
            
            if(_data.data.structureData && _data.data.structureData.length > 0) {
                _data.data.structureData.map(function(ele){
                     _self.view.structure.text(ele.title);
    			});
            }
            
            if(_data.data.componentData && _data.data.componentData.length > 0) {
                _data.data.componentData.map(function(ele){
                    _self.view.componentOrigin.text(ele.description);
    			});
            }
            
            _self.view.validFrom.text(parseDate(_data.data.validFrom));
            _self.view.validTo.text(_data.data.validTo ? parseDate(_data.data.validTo) : '—');
            
            if(_data.data.keys && _data.data.keys.length > 0) {
                _self.view.keys.text(_data.data.keys.map(function(ele){
                    return ele.keyName;
    			}));
            }
            
            _self.coreServices.getComponents('loader').close();
        }).error(function() {
            _self.coreServices.getComponents('loader').close();
        });
    }
});