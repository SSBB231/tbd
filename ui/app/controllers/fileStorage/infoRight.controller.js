sap.ui.controller('app.controllers.fileStorage.infoRight', {
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
        _self.view.fileName = _self.view.find('#fileName');
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
					window.location = "#/fileStorage?action=edit&id=" + window.parameters.id;
				},
				isButton: true,
				iconFont: "Formatting-and-Tool",
				icon: "pensil",
				enabled: this.privileges && this.privileges.FileStorage.update ? this.privileges.FileStorage.update : false
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
    
    getInformation: function() {
        var _self = this;
        var params = {
            id: this.coreServices.id
        };

        Data.endpoints.fileStorage.getRequiredInfo.post(params).success(function(_data) {
            _data.data.documentTypeConfig && _data.data.documentTypeConfig.length > 0 ? _data.data.documentTypeConfig.map(function(ele){
                _self.view.docType.text(ele.docType);
                _self.view.description.text(ele.description);
			}): '';
    
            _self.view.fileName.text(_data.data.fileName);
            
            $('#upload').css({
                'color': 'blue',
                'text-decoration': 'underline',
                'cursor': 'pointer',
                'overflow': 'hidden'
            });
            _self.view.upload.text(_data.data.imageUrl);
            
            _self.view.find('#upload').baseTooltip({
                class: 'dark',
                text: _data.data.imageUrl,
                position: 'top'
            });
            $("#upload").on("click", (function() {
                window.open(_data.data.imageUrl);
            }));
            
            _self.view.keyField1.text(_data.data.keyField1);
            _self.view.keyField2.text(_data.data.keyField2);
            _self.view.classification.text(_self.translateSecurity(_data.data.securityClassification));
            _self.view.status.text(_self.translate(_data.data.status));

            var empresas = [];
			var ufs = [];
			var branches = [];
			if(_data.data.eef){
			    for (var m = 0; m < _data.data.eef.length; m++){
				    if(_data.data.eef[m].idCompany){
				        empresas.push(_data.data.eef[m].idCompany);
				    }
				    if(_data.data.eef[m].uf){
				        ufs.push(_data.data.eef[m].uf);
				    }
				    if(_data.data.eef[m].idBranch){
				        branches.push(_data.data.eef[m].idBranch);
				    }
				}
			}
            _self.view.company.text(_.uniq(empresas));
            _self.view.branch.text(_.uniq(branches));
            _self.view.uf.text(_.uniq(ufs));
            var taxes = [];
            for(var i = 0; i < _data.data.taxData.length; i++){
                taxes.push(_data.data.taxData[i].descrCodTributoLabel);
            }
            _self.view.tax.text(_.uniq(taxes));
            _self.view.validFrom.text(parseDate(_data.data.validFrom));
            _self.view.validTo.text(_data.data.validTo ? parseDate(_data.data.validTo) : '—');
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
	},
	translateSecurity: function(status){
	    var _self = this;
	    var translation = "";
	    if(status == 1){
	        translation = i18n('FREE');
	    } else if (status ==2){
	        translation = i18n('RESTRICTED');
	    } else if(status ==3){
	        translation =  i18n('CONFIDENTIAL');
	    }
	    return translation;
	}
});