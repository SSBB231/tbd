sap.ui.controller('app.controllers.documentApproval.infoRight', {
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
        _self.view.fileName = _self.view.find('#fileName');
        _self.view.imageUrl = _self.view.find('#imageUrl');
        _self.view.company = _self.view.find('#company');
        _self.view.status = _self.view.find('#status');
        _self.view.branch = _self.view.find('#branch');
        _self.view.classification = _self.view.find('#classification');
        _self.view.approvalDate = _self.view.find('#approvalDate');
        _self.view.comments = _self.view.find('#comments');
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
					window.location = "#/documentApproval?action=edit&id=" + window.parameters.id;
				},
				isButton: true,
				iconFont: "Formatting-and-Tool",
				icon: "pensil",
				enabled: this.privileges && this.privileges.DocumentApproval.update ? this.privileges.DocumentApproval.update : false
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
						window.location = '#/library?cadastro=documentApproval';
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

		Data.endpoints.documentApproval.getRequiredInfo.post(params).success(function(_data) {
            
            
            if(_data.data.docTypeConfig && _data.data.docTypeConfig.length > 0){
                _data.data.docTypeConfig.map(function(ele) {
                    _self.view.docType.text(ele.docType);
                    _self.view.docTypeDescription.text(ele.description);
                });
            }
            
            if(_data.data.files && _data.data.files.length > 0){
                _data.data.files.map(function(ele) {
                    _self.view.fileName.text(ele.fileName);
                    if(ele.imageUrl){
                        _self.view.imageUrl.text(ele.imageUrl);
                        $('#imageUrl').css({
                            'color': 'blue',
                            'text-decoration': 'underline',
                            'cursor': 'pointer',
                            'overflow': 'hidden'
                        });
                        
                        _self.view.find('#imageUrl').baseTooltip({
                            class: 'dark',
                            text: ele.imageUrl,
                            position: 'top'
                        });
                        $("#imageUrl").on("click", (function() {
                            window.open(ele.imageUrl);
                        }));
                    } else {
                        $("#imageUrl").text(i18n('NO LINK AVAILABLE'));
                    }
                });
            }
            
            _self.view.classification.text(_self.translateClassification(_data.data.classification));
            _self.view.comments.text(_data.data.comments);
            _self.view.status.text(_self.translate(_data.data.status));

            var empresas = [];
			var branches = [];
			if(_data.data.eef){
			    for (var m = 0; m < _data.data.eef.length; m++){
				    if(_data.data.eef[m].idCompany){
				        empresas.push(_data.data.eef[m].idCompany);
				    }
				    if(_data.data.eef[m].idBranch){
				        branches.push(_data.data.eef[m].idBranch);
				    }
				}
			}
			_self.view.company.text(_.uniq(empresas));
            _self.view.branch.text(_.uniq(branches));
            
            _self.view.approvalDate.text(_data.data.approvalDate ? parseDate(_data.data.approvalDate) : '—');
            _self.view.validFrom.text(parseDate(_data.data.validFrom));
            _self.view.validTo.text(parseDate(_data.data.validTo));
            
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
	translateClassification: function(classification){
	    var _self = this;
	    var translation = "";
	    if(classification == 1){
	        translation = i18n('FREE');
	    } else if (classification ==2){
	        translation = i18n('RESTRICTED');
	    } else if(classification ==3){
	        translation =  i18n('CONFIDENTIAL');
	    }
	    
	    return translation;
	}
});