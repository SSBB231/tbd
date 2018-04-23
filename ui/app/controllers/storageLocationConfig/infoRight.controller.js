sap.ui.controller('app.controllers.storageLocationConfig.infoRight', {
    onInit: function() {
        var _self = this;
    },
    onAfterRendering: function(html) {
        var _self = this;
        
        this.view = html;
        this.view.tabs = this.view.find('#tabs');
        this.view.toolbar = this.view.find('#toolbar');
        
        _self.view.docType = _self.view.find('#docType');
        
        var levels = [1,2,3,4,5,6,7,8,9,10,11];
        levels.forEach(function(number){
            _self.view['level' + number] = _self.view.find('#level'+number);
        });
        
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
					window.location = "#/storageLocationConfig?action=edit&id=" + window.parameters.id;
				},
				isButton: true,
				iconFont: "Formatting-and-Tool",
				icon: "pensil",
				enabled: this.privileges && this.privileges.StorageLocationConfig.update ? this.privileges.StorageLocationConfig.update : false
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
						window.location = '#/library?cadastro=storageLocationConfig';
					}
				},
				isButton: true,
				iconFont: "Sign-and-Symbols",
				icon: "toleft",
				enabled: true
            }],
			hideGrid: true
		});
	},
    
    getInformation: function() {
		var _self = this;
		var params = {
			id: this.coreServices.id,
			view: true
		};

		Data.endpoints.storageLocationConfig.getRequiredInfo.post(params).success(function(_data) {
            _data && _data.docTypeConfig.length > 0 ? _data.docTypeConfig.map(function(ele){
                _self.view.docType.text(ele.docType + " - " + ele.description);
			}): '';
        
            var levels = [1,2,3,4,5,6,7,8,9,10,11];
            levels.forEach(function(number){
                _self.view['level' + number].text(_data['level' + number] ? _data['level' + number] : '—');
            });

            _self.view.validFrom.text(parseDate(_data.validFrom));
            _self.view.validTo.text(_data.validTo ? parseDate(_data.validTo) : '—');

            _self.coreServices.getComponents('loader').close();
        }).error(function() {
            _self.coreServices.getComponents('loader').close();
        });
	}
});