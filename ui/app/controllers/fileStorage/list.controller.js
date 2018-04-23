/*global i18n Data _ app parseDate*/
sap.ui.controller("app.controllers.fileStorage.list", {
	onDataRefactor: function(data) {
		return $.extend(data, this.data);
	},
	onInit: function() {},
	onAfterRendering: function(html) {
		var _self = this;
		this.view = html;
// 		this.page = 1;
		this.filterBox = this.view.find('.search-box');
		this.table = this.view.find('#table');
		this.Toolbar = this.view.find('.toolbar');
		var title = document.getElementById("main-title");
		title.innerHTML = i18n('FILE STORAGE');
		this.bindElements();
	},
	bindElements: function() {
		var _self = this;
		this.renderToolbar();
		this.renderFilter();
		this.loadList();
	},
	renderToolbar: function() {
		var _self = this;

		this.Toolbar.bindBaseLibraryToolbar({
			leftButtons: [{
				text: i18n('FILE STORAGE NEW'),
				onPress: function() {
					window.location = "#/fileStorage?action=new";
				},
				icon: "plussign",
				iconFont: "Sign-and-Symbols",
				enabled: this.privileges.Access && this.privileges.FileStorage.create,
				tooltip: i18n('CLICK PRESS TO CREATE') + i18n('FILE STORAGE NEW')
			}, {
				onPress: function() {
					app.services.hideLeftPanel();
					$('#base-baseTooltip-wrapper').html('');
				},
				icon: "dataset",
				iconFont: "DataManager",
				tooltip: i18n('CLICK PRESS TO HIDE LEFT PANEL'),
				enabled: true
			}],
			hideGrid: true
		});
	},
	renderFilter: function() {
		var _self = this;
		this.filterBox.empty();
		this.filterBox.ctrl = this.filterBox.bindBaseInput({
			isSearchBox: true,
			restrict: ["letters", "special"],
			tooltip: {
                class: "dark",
                position: "top",
                text: i18n("SEARCH BOX TOOLTIP") + ' ' + i18n("ID")
            },
			onSearch: function(newVal) {
				_self.coreServices.page = 1;
			    _self.loadList({id: newVal});
			}
		});
	},
	loadList: function(filterBy) {
		var _self = this;
		this.loader = this.table.baseLoader({
			modal: true
		});
		this.loader.open();
		var params = {
			page: _self.coreServices.page,
			filterBy: filterBy
		};
		app.services.setMenuSelected('fileStorage');
		Data.endpoints.fileStorage.list.post(params).success(function(_res) {
			_self.renderList(_res);
			_self.renderFilter();
			_self.loader.close();
		}).error(function(d, m, s, xhr) {
			_self.renderList();
			_self.loader.close();
		});
	},
	renderList: function(data) {
		var _self = this;
		var body = [];
		var headers = [{
			text: i18n('ID'),
			sort: true,
			width: "80px",
			type: "center"
		}, {
			text: i18n('FILE NAME'),
			sort: true,
			width: '150px',
			type: 'center'
		}, {
			text: i18n('DOCUMENT TYPE'),
			sort: true,
			width: '150px',
			type: 'center'
		}, {
			text: i18n('DESCRIPTION'),
			sort: true,
			width: '100px',
			type: 'center'
		}, {
			text: i18n('STATUS'),
			sort: true,
			width: '100px',
			type: 'center'
		}, {
			text: i18n('CLASSIFICATION'),
			sort: true,
			width: '100px',
			type: 'center'
		}, {
			text: i18n('COMPANY'),
			sort: true,
			width: '150px',
			type: 'center'
		},{
			text: i18n('UF'),
			sort: true,
			width: '150px',
			type: 'center'
		}, {
			text: i18n('BRANCH'),
			sort: true,
			width: '150px',
			type: 'center'
		}, {
			text: i18n('TAX'),
			sort: true,
			width: '150px',
			type: 'center'
		}];
		if (data && _.isArray(data.data) && data.errorMsg === undefined) {
			data.data.forEach(function(element, i) {
				var actions = [];
				if (_self.privileges.Access && _self.privileges.FileStorage.read) {
					actions.push({
						iconFont: "Sign-and-Symbols",
						icon: "info-52",
						text: i18n('INFO'),
						onPress: function() {
							_self._showInfoPanel(element);
						}
					});
				}
				if (_self.privileges.Access && _self.privileges.FileStorage.read) {
					actions.push({
						iconFont: "Sign-and-Symbols",
						icon: "magnifierplus",
						text: i18n('VISUALIZATION ACTION'),
						onPress: function() {
							window.location = "#/fileStorage?action=view&id=" + element.id;
						}
					});
				}
				if (_self.privileges.Access && _self.privileges.FileStorage.update) {
					actions.push({
						iconFont: "Formatting-and-Tool",
						icon: "pensil",
						text: i18n('EDIT'),
						onPress: function() {
							window.location = "#/fileStorage?action=edit&id=" + element.id;
						}
					});
				}
				if (_self.privileges.Access && _self.privileges.FileStorage.delete) {
					actions.push({
						iconFont: "Sign-and-Symbols",
						icon: "persign",
						text: i18n('DELETE'),
						onPress: function() {
							_self.deleteRow(element.id);
						}
					});
				}
				
                var docType = '—';
                var docTypeDescription = '—';
                element.documentTypeConfig && element.documentTypeConfig.length > 0 ? element.documentTypeConfig.map(function(ele){
                    docType = ele.docType;
				    docTypeDescription = ele.description;
				}): '';
				
				var empresas = [];
				var ufs = [];
				var branches = [];
				var fileName = "";
				var fileStatus = "";
				var classification = "";
				if(element.eef){
				    for (var m = 0; m < element.eef.length; m++){
    				    if(element.eef[m].idCompany && _self.equalsArray(empresas, element.eef[m].idCompany) ){
    				        empresas.push(element.eef[m].idCompany);
    				    }
    				    if(element.eef[m].uf && _self.equalsArray(ufs, element.eef[m].uf)){
    				        ufs.push(element.eef[m].uf);
    				    }
    				    if(element.eef[m].idBranch){
    				        branches.push(element.eef[m].idBranch);
    				    }
    				}
				}

				if(element.file){
				    for (var m = 0; m < element.file.length; m++){
    				    fileName = element.file[m].fileName;
    				    fileStatus = element.file[m].fileStatus;
    				    classification =  element.file[m].storageClassification;
    				}
				}
				
				body.push({
					actions: actions,
					id: element.id,
					content: [
						element.id,
						fileName,
						docType,
						docTypeDescription,
						fileStatus ? _self.translate(fileStatus) : '',
						element.securityClassification == 1 ? _self.translateClass(element.securityClassification) : _self.translateClass(classification),
						empresas,
						ufs,
						branches,
        				element.taxData && element.taxData.length > 0 ? element.taxData.map(function(ele){
                            return ele.descrCodTributoLabel;
        				}): ''
					]
				});
			});
		}

		this.table.empty();
		this._table = this.table.bindBaseTable({
			hasActions: true,
			hasCheckboxes: false,
			hasFlags: false,
			hasPagination: true,
			flags: [],
			headers: headers,
			body: body,
			// onSort: function(idx, asc, page, filter){},
			totalPages: data && data.meta ? data.meta.page : 1,
			actualPage: _self.coreServices.page,
			onPageChange: function(oldVal, newVal) {
				_self.coreServices.page = newVal;
				_self.loadList();
			}
		});
	},
	_showInfoPanel: function(element) {
		var _self = this;
		var docType = '—';
        var docTypeDescription = '—';
        var uf = [];
        var fileData = element.file[0];

        element.documentTypeConfig && element.documentTypeConfig.length > 0 ? element.documentTypeConfig.map(function(ele){
            docType = ele.docType;
		    docTypeDescription = ele.description;
		}): '';
		if(element.eef){
		    uf = element.eef.map(function(ele){
                return ele.uf;
    		});
		}
		uf = _.uniq(uf);
		var content = [{
			name: i18n('ID'),
			content: [{
				name: element.id
			}]
		}, {
			name: i18n('FILE NAME'),
			content: [{
				name: element.file[0].fileName
			}]
		},  {
			name: i18n('DOCUMENT TYPE'),
			content: [{
				name: docType
			}]
		}, {
			name: i18n('DESCRIPTION'),
			content: [{
				name: docTypeDescription
			}]
		}, {
			name: i18n('STATUS'), 
			content: [{
				name: _self.translate(element.status)
			}]
		}, {
			name: i18n('CLASSIFICATION'),
			content: [{
				name: element.securityClassification == 1 ? (_self.translateClass(element.securityClassification)) :  _self.translateClass(fileData.storageClassification)
			}]
		}, {
			name: i18n('COMPANY'),
			content: element.eef && element.eef.length > 0 ? element.eef.map(function(ele){
                return  {name: ele.idCompany};
			}): '—'
		}, {
			name: i18n('UF'),
			content: uf ? [{name: uf}] : '—'
		}, {
			name: i18n('BRANCH'),
			content: element.eef && element.eef.length > 0 ? element.eef.map(function(ele){
                return  {name: ele.idBranch};
			}): '—'
		}, {
			name: i18n('TAX'),
			content: element.taxData && element.taxData.length > 0 ? element.taxData.map(function(ele){
                return  {name: ele.descrCodTributoLabel};
			}): '—'
		}, {
			name: i18n('VALIDITY'),
			content: [{
				name: fileData ? (parseDate(fileData.validTo) ? parseDate(fileData.validFrom) + " - " + parseDate(fileData.validTo) : parseDate(fileData.validFrom)) : '—'
			}]
		}];
		var panel = _self.view.bindBaseInformationPanel({
			id: app.ID,
			name: i18n('DETAIL'),
			sections: content,
			exactData: true,
			history: [{
				modificationUser: fileData ? (fileData.modificationUsername ? fileData.modificationUsername : '—') : '—',
				modificationDate: fileData ? (fileData.modificationDate ? parseDate(fileData.modificationDate, 'object') : '—') : '—',
				creationUser: fileData ? (fileData.creationUsername ?  fileData.creationUsername : '—') : '—',
				creationDate: fileData ? (fileData.creationDate ? parseDate(fileData.creationDate, 'object') : '—') : '—'
			}]
		});
	},
	deleteRow: function(id) {
		var _self = this;
		var confirm = $.baseDialog({
			title: i18n('DELETE'),
			modal: true,
			cssClass: 'tbd-dialog',
			size: "small",
			outerClick: 'disabled',
			viewName: 'app.views.layout.AlertName',
			viewData: {
				text1: i18n('SURE YOU WANT DELETE')
			},
			buttons: [{
				name: i18n('NO'),
				isCloseButton: true,
				tooltip: i18n('CLICK PRESS CANCEL'),
				click: function() {
					_self.coreServices.lock.removeLock();
				}
			}, {
				name: i18n('YES'),
				tooltip: i18n('CLICK PRESS CONFIRM'),
				click: function() {
					_self.coreServices.lock.enableToSave(function(_resp) {
						if (_resp === true) {
							_self.loader.open();
							Data.endpoints.fileStorage.delete.post({
								id: id
							}).success(function(_res) {
								if (_res === true) {
									$('.tr[data-id="' + id + '"]').fadeOut('slow', function() {
										$(this).remove();
									});
									$.baseToast({
										isSuccess: true,
										text: i18n('DELETED SUCCESFULLY')
									});
								} else {
									$.baseToast({
										isError: true,
										text: i18n('ERROR ON DELETING')
									});
								}
								confirm.close();
								_self.loadList();
								_self.loader.close();
								_self.coreServices.lock.removeLock();
							}).error(function(d, m, s, xhr) {
								$.baseToast({
									isError: true,
									text: i18n('ERROR ON DELETING')
								});
								confirm.close();
								_self.loader.close();
								_self.coreServices.lock.removeLock();
							});
						}
					});
					confirm.close();
				}
			}]
		});
		this.getLockFile(id, function() {
			confirm.open();
		});
	},
	getLockFile: function(id, action) {
		var _self = this;
		this.getLock({
			id: id,
			objectType: 'TBD::FileStorage',
			callback: function(_data) {
				if (_data.response === true) {
					_self.coreServices.lock = _data.controller;
					action();
				}
			}
		});
	},
	translate: function(value) {
		var _self = this;
		var translation = "";
		if (value == 1) {
			translation = i18n('CREATION')
		} else if (value == 2) {
			translation = i18n('PENDING')
		} else if (value == 3) {
			translation = i18n('APPROVED')
		} else {
			translation = i18n('ARCHIVED')
		}
		return translation;
	},
	translateClass: function(value) {
		var _self = this;
		var translation = "";
		if (value == 1) {
			translation = i18n('FREE')
		} else if (value == 2) {
			translation = i18n('RESTRICTED')
		} else if (value == 3) {
			translation = i18n('CONFIDENTIAL')
		}
		return translation;
	},
	equalsArray: function(a, b) {
		for (var i = 0; i < a.length; ++i) {
			if (b.indexOf(a[i]) !== -1) {
				return false;
			}
		}
		return true;
	}
});