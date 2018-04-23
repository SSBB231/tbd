/*global i18n Data _ app parseDate*/
sap.ui.controller("app.controllers.documentApproval.list", {
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
		title.innerHTML = i18n('DOCUMENT APPROVAL');
		this.bindElements();
	},
	bindElements: function() {
		var _self = this;
		this.renderToolbar();
		this.loadList();
		this.renderFilter();
	},
	renderToolbar: function() {
		var _self = this;

		this.Toolbar.bindBaseLibraryToolbar({
			leftButtons: [{
				text: i18n('DOCUMENT APPROVAL NEW'),
				onPress: function() {
					window.location = "#/documentApproval?action=new";
				},
				icon: "plussign",
				iconFont: "Sign-and-Symbols",
				enabled: this.privileges.Access && this.privileges.DocumentApproval.create,
				tooltip: i18n('CLICK PRESS TO CREATE') + i18n('DOCUMENT APPROVAL NEW')
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
				// _self._table.filter(newVal);
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
		app.services.setMenuSelected('documentApproval');
		Data.endpoints.documentApproval.list.post(params).success(function(_res) {
			_self.renderList(_res);
// 			_self.renderFilter();
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
			text: i18n('DOCUMENT TYPE'),
			sort: true,
			width: '150px',
			type: 'center'
		}, {
			text: i18n('DOCUMENT TYPE DESCRIPTION'),
			sort: true,
			width: '100px',
			type: 'center'
		}, {
			text: i18n('FILE NAME'),
			sort: true,
			width: '100px',
			type: 'center'
		}, {
			text: i18n('CLASSIFICATION'),
			sort: true,
			width: '150px',
			type: 'center'
		},  {
			text: i18n('APPROVAL STATUS'),
			sort: true,
			width: '100px',
			type: 'center'
		},{
			text: i18n('FILE STORAGE STATUS'),
			sort: true,
			width: '100px',
			type: 'center'
		}, {
			text: i18n('VALIDITY'),
			sort: true,
			width: '150px',
			type: 'center'
		}];
		if (data && data.errorMsg === undefined) {
			data.data.forEach(function(element, i) {
				var actions = [];
				
				if (_self.privileges.Access) {
					actions.push({
						iconFont: "Sign-and-Symbols",
						icon: "info-52",
						text: i18n('INFO'),
						onPress: function() {
							_self._showInfoPanel(element);
						}
					});
				}
				if (_self.privileges.Access && _self.privileges.DocumentApproval.read) {
					actions.push({
						iconFont: "Sign-and-Symbols",
						icon: "magnifierplus",
						text: i18n('VISUALIZATION ACTION'),
						onPress: function() {
							window.location = "#/documentApproval?action=view&id=" + element.id;
						}
					});
				}
				if (_self.privileges.Access && _self.privileges.DocumentApproval.update) {
					actions.push({
						iconFont: "Formatting-and-Tool",
						icon: "pensil",
						text: i18n('EDIT'),
						onPress: function() {
							window.location = "#/documentApproval?action=edit&id=" + element.id;
						}
					});
				}
				
				// if (_self.privileges.Access && _self.privileges.DocumentApproval.read) {
				// 	actions.push({
				// 		iconFont: "File-and-Folders",
				// 		icon: "copydoc",
				// 		text: i18n('COPY'),
				// 		onPress: function() {
				// // 			window.location = "#/documentApproval?action=edit&id=" + element.id;
				//             window.location = "#/documentApproval?action=copy&id=" + element.id;
				// 		}
				// 	});
				// }
				if (_self.privileges.Access && _self.privileges.DocumentApproval.execute) {
					actions.push({
						iconFont: "Media",
						icon: "play",
						text: i18n('EXECUTE'),
						onPress: function() {
						    _self.getLock({
                                objectType: 'TBD::DocumentApproval',
                                id: element.id,
                                callback: function(_data2) {
                                    if (!_data2.response) {
                                        //do something?
                                    } else {
                                        _self.coreServices.lock = _data2.controller;
                                        _self.renderExecutionDialog(element);
                                    }
                                }
                            });
						}
					});
				}
				if (_self.privileges.Access && _self.privileges.DocumentApproval.delete) {
					actions.push({
						iconFont: "Sign-and-Symbols",
						icon: "persign",
						text: i18n('DELETE'),
						onPress: function() {
							_self.deleteRow(element.id);
						}
					});
				}
				body.push({
					actions: actions,
					id: element.id,
					content: [
						element.id,
						element.docTypeConfig && element.docTypeConfig.length > 0 ? element.docTypeConfig[0].docType : '',
						element.docTypeConfig && element.docTypeConfig.length > 0 ? element.docTypeConfig[0].description : '',
    					element.files && element.files.length > 0 ? element.files[0].fileName : '',
						_self.translateClassification(element.classification),
						_self.translate(element.status), //element.files && element.files.length > 0 ? _self.translate(element.files[0].status) : '',
						element.files && element.files.length > 0 ? _self.translate(element.files[0].status) : '',
						parseDate(element.validTo) ? parseDate(element.validFrom) + " - " + parseDate(element.validTo) : parseDate(element.validFrom)
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
			totalPages: data ? data.meta.page : 1,
			actualPage: _self.coreServices.page,
			onPageChange: function(oldVal, newVal) {
				_self.coreServices.page = newVal;
				_self.loadList({id: newVal});
			}
		});
	},
	
	renderExecutionDialog: function(data){
	    var _self = this;
        this.dialog = $.baseDialog({
            title: i18n('EXECUTE APPROVAL'),
            modal: true,
            size: 'small',
            cssClass: 'mdr-dialog',
            outerClick: 'disabled',
            viewName: 'app.views.documentApproval.executeApprovalDialog',
			viewData: data,
            buttons: [{
                name: i18n('NO'),
                isCloseButton: true,
                tooltip: i18n('CLICK PRESS CANCEL'),
                click: function() {
                    if (_self.coreServices.lock) {
                        _self.coreServices.lock.removeLock();
                    }
                }
            }, {
                name: i18n('YES'),
                tooltip: i18n('CLICK PRESS CONFIRM'),
                click: function() {
                    var params = {
                        id: data.id,// data.files && data.files.length > 0 ? data.files[0].id : null,
                        updateStatus: true,
                        status: _self.coreServices.newStatus
                    };
                    _self.loader.open();
                    Data.endpoints.documentApproval.updateStatus.post(params).success(function(response) {
                        if(response && Object.keys(response).length > 0){
                            $.baseToast({
    							isSuccess: true,
    							text: i18n('STATUS UPDATED')
    						});
                        }else {
                            $.baseToast({
    							isError: true,
    							text: i18n('ERROR WHILE UPDATING STATUS')
    						});
                        }
            			if (_self.coreServices.lock) {
                            _self.coreServices.lock.removeLock();
                        }
                        _self.loader.close();
                        _self.dialog.close();
                        _self.loadList();
            		}).error(function(d, m, s, xhr) {
            			$.baseToast({
							isError: true,
							text: i18n('ERROR WHILE UPDATING STATUS')
						});
						if (_self.coreServices.lock) {
                            _self.coreServices.lock.removeLock();
                        }
            			_self.loader.close();
            			_self.dialog.close();
            		});
                }
            }]
        });
        
        this.dialog.open();
	},
	_showInfoPanel: function(element) {
		var _self = this;
		
		var content = [{
			name: i18n('ID'),
			content: [{
				name: element.id
			}]
		}, {
			name: i18n('DOCUMENT TYPE'),
			content: [{
				name:  element.docTypeConfig && element.docTypeConfig.length > 0 ? element.docTypeConfig[0].docType : '—'
			}]
		}, {
			name: i18n('DOCUMENT TYPE DESCRIPTION'),
			content: [{
				name:  element.docTypeConfig && element.docTypeConfig.length > 0 ? element.docTypeConfig[0].description : '—'
			}]
		}, {
			name: i18n('FILE NAME'),
			content: [{
				name:  element.files && element.files.length > 0 ? element.files[0].fileName : '—'
			}]
		}, {
			name: i18n('CLASSIFICATION'),
			content: [{
				name: element.classification
			}]
		}, {
			name: i18n('APPROVAL STATUS'),
			content: [{
				name: _self.translate(element.status)
			}]
		}, {
			name: i18n('FILE STORAGE STATUS'),
			content: [{
				name: element.files && element.files.length > 0 ? _self.translate(element.files[0].status) : ''
			}]
		},{
			name: i18n('VALIDITY'),
			content: [{
				name: parseDate(element.validTo) ? parseDate(element.validFrom) + " - " + parseDate(element.validTo) : parseDate(element.validFrom)
			}]
		}];
		var panel = _self.view.bindBaseInformationPanel({
			id: app.ID,
			name: i18n('DETAIL'),
			sections: content,
			history: [{
				modificationUser: element.modificationUser.name + ' ' + element.modificationUser.last_name,
				modificationDate: parseDate(element.modificationDate, 'object'),
				creationUser: element.creationUser.name + ' ' + element.creationUser.last_name,
				creationDate: parseDate(element.creationDate, 'object')
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
							Data.endpoints.documentApproval.delete.post({
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
	getLockFile: function(id, action) {
		var _self = this;
		this.getLock({
			id: id,
			objectType: 'TBD::DocumentApproval',
			callback: function(_data) {
				if (_data.response === true) {
					_self.coreServices.lock = _data.controller;
					action();
				}
			}
		});
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