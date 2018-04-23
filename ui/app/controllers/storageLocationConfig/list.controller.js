/*global i18n Data _ app parseDate*/
sap.ui.controller("app.controllers.storageLocationConfig.list", {
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
		title.innerHTML = i18n('STORAGE LOCATION CONFIGURATION');
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
				text: i18n('STORAGE LOCATION CONFIGURATION NEW'),
				onPress: function() {
					window.location = "#/storageLocationConfig?action=new";
				},
				icon: "plussign",
				iconFont: "Sign-and-Symbols",
				enabled: this.privileges.StorageLocationConfig.create,
				tooltip: i18n('CLICK PRESS TO CREATE') + i18n('STORAGE LOCATION CONFIGURATION NEW')
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
		app.services.setMenuSelected('storageLocationConfig');
		Data.endpoints.storageLocationConfig.list.post(params).success(function(_res) {
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
			text: i18n('DOCUMENT TYPE'),
			sort: true,
			width: '150px',
			type: 'center'
		}, {
			text: i18n('LEVEL 1'),
			sort: true,
			width: '100px',
			type: 'center'
		}, {
			text: i18n('LEVEL 2'),
			sort: true,
			width: '100px',
			type: 'center'
		}, {
			text: i18n('LEVEL 3'),
			sort: true,
			width: '100px',
			type: 'center'
		}, {
			text: i18n('LEVEL 4'),
			sort: true,
			width: '100px',
			type: 'center'
		}, {
			text: i18n('LEVEL 5'),
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
		    if(data.data && data.data.length > 0){
		        data.data.forEach(function(element, i) {
    				var actions = [];
    				if (_self.privileges.StorageLocationConfig.read) {
    					actions.push({
    						iconFont: "Sign-and-Symbols",
    						icon: "info-52",
    						text: i18n('INFO'),
    						onPress: function() {
    							_self._showInfoPanel(element);
    						}
    					});
    				}
    				if (_self.privileges.StorageLocationConfig.read) {
    					actions.push({
    						iconFont: "Sign-and-Symbols",
    						icon: "magnifierplus",
    						text: i18n('VISUALIZATION ACTION'),
    						onPress: function() {
    							window.location = "#/storageLocationConfig?action=view&id=" + element.id;
    						}
    					});
    				}
    				if (_self.privileges.StorageLocationConfig.update) {
    					actions.push({
    						iconFont: "Formatting-and-Tool",
    						icon: "pensil",
    						text: i18n('EDIT'),
    						onPress: function() {
    							window.location = "#/storageLocationConfig?action=edit&id=" + element.id;
    						}
    					});
    				}
    				if (_self.privileges.StorageLocationConfig.delete) {
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
    						element.level1 ? element.level1  : '',
    						element.level2 ? element.level2  : '',
    						element.level3 ? element.level3  : '',
    						element.level4 ? element.level4  : '',
    						element.level5 ? element.level5  : '',
    						parseDate(element.validTo) ? parseDate(element.validFrom) + " - " + parseDate(element.validTo) : parseDate(element.validFrom)
    					]
    				});
    			});
		    }
			
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
				name: element.docTypeConfig && element.docTypeConfig.length > 0 ? element.docTypeConfig[0].docType : '—'
			}]
		}];
		var levels = [1,2,3,4,5,6,7,8,9,10,11];
		levels.forEach(function(number){
		    if(element['level'+number]){
		        content.push({
        			name: i18n('LEVEL '+ number),
        			content: [{
        				name: element['level'+number]
        			}]
        		});
		    }
		});
		content.push({
			name: i18n('VALIDITY'),
			content: [{
				name: parseDate(element.validTo) ? parseDate(element.validFrom) + " - " + parseDate(element.validTo) : parseDate(element.validFrom)
			}]
		});
		
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
		$(".detail").css("word-wrap","break-word");
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
							Data.endpoints.storageLocationConfig.delete.post({
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
			objectType: 'TBD::StorageLocationConfiguration',
			callback: function(_data) {
				if (_data.response === true) {
					_self.coreServices.lock = _data.controller;
					action();
				}
			}
		});
	}
});