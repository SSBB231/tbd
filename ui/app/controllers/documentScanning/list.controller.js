sap.ui.controller("app.controllers.documentScanning.list", {

	onDataRefactor: function(data) {
		return $.extend(data, this.data);
	},
	onInit: function() {},
	onAfterRendering: function(html) {
		var _self = this;
		this.view = html;
		this.page = 1;
		this.filterBox = this.view.find('.search-box');
		this.table = this.view.find('#table');
		this.Toolbar = this.view.find('.toolbar');
		var title = document.getElementById("main-title");
		title.innerHTML = i18n('DOCUMENT SCANNING');
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
				text: i18n('DOCUMENT SCANNING NEW'),
				onPress: function() {
					// window.location = "#/fileStorage?action=new";
				},
				icon: "adddoc",
				iconFont: "File-and-Folders",
				enabled: this.privileges.Access && this.privileges.FileStorage.create,
				tooltip: i18n('CLICK PRESS') + ' ' + i18n('TO') + ' ' + i18n('CREATE') + i18n('DOCUMENT SCANNING NEW'),
			}, {
				onPress: function() {
					app.services.hideLeftPanel();
					$('#base-baseTooltip-wrapper').html('');
				},
				icon: "dataset",
				iconFont: "DataManager",
				tooltip: i18n('CLICK PRESS') + ' ' + i18n('TO') + ' ' + i18n('HIDE LEFT PANEL'),
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
			onChange: function(oldVal, newVal) {
				_self._table.filter(newVal);
			}
		});
	},
	loadList: function() {
		var _self = this;
		this.loader = this.table.baseLoader({
			modal: true
		});
		this.loader.open();
		var params = {
			page: this.page
		};
		app.services.setMenuSelected('fileStorage');
// 		Data.endpoints.fileStorage.list.post(params).success(function(_res) {
// 			_self.renderList(_res);
// 			_self.renderFilter();
// 			_self.loader.close();
// 		}).error(function(d, m, s, xhr) {
// 			_self.renderList();
// 			_self.loader.close();
// 		});
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
			type: 'text'
		}, {
			text: i18n('DESCRIPTION'),
			sort: true,
			width: '100px',
			type: 'text'
		}, {
			text: i18n('NUMBER RANGE'),
			sort: true,
			width: '150px',
			type: 'text'
		}, {
			text: i18n('STATUS'),
			sort: true,
			width: '100px',
			type: 'text'
		}, {
			text: i18n('VALIDITY'),
			sort: true,
			width: '200px',
			type: 'text'
		}];
		if (data && data.errorMsg === undefined) {
			data.data.forEach(function(element, i) {
				var actions = [];
				if (_self.privileges.Access && _self.privileges.FileStorage.read) {
					actions.push({
						iconFont: "Sign-and-Symbols",
						icon: "info-52",
						text: i18n('INFO'),
						onPress: function() {
				// 			_self._showInfoPanel(element);
						}
					});
				}
				if (_self.privileges.Access && _self.privileges.FileStorage.update) {
					actions.push({
						iconFont: "Formatting-and-Tool",
						icon: "pensil",
						text: i18n('EDIT'),
						onPress: function() {
							// window.location = "#/fileStorage?action=edit&id=" + element.id;
						}
					});
				}
				if (_self.privileges.Access && _self.privileges.FileStorage.read) {
					actions.push({
						iconFont: "Sign-and-Symbols",
						icon: "magnifierplus",
						text: i18n('VISUALIZATION ACTION'),
						onPress: function() {
							// window.location = "#/fileStorage?action=view&id=" + element.id;
						}
					});
				}
				if (_self.privileges.Access && _self.privileges.FileStorage.delete) {
					actions.push({
						iconFont: "Finance-and-Office",
						icon: "trash",
						text: i18n('DELETE'),
						onPress: function() {
				// 			_self.deleteRow(element.id);
						}
					});
				}

				body.push({
					actions: actions,
					id: element.id,
					content: [
						element.id,
						element.docType,
						element.description,
						element.numberRange,
						_self.translate(element.status),
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
			// onSort: function(idx, asc, page, filter){},
			totalPages: data ? data.meta.page : 1,
			actualPage: this.page,
			onPageChange: function(oldVal, newVal) {
				_self.page = newVal;
				_self.loadList();
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
				name: element.docType
			}]
		}, {
			name: i18n('DESCRIPTION'),
			content: [{
				name: element.description
			}]
		}, {
			name: i18n('NUMBER RANGE'),
			content: [{
				name: element.numberRange
			}]
		}, {
			name: i18n('STATUS'),
			content: [{
				name: _self.translate(element.status)
			}]
		}, {
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
							Data.endpoints.fileStorage.delete.post({
								id: id
							}).success(function(_res) {
								if (_res === true) {
									$('.tr[data-id="' + id + '"]').fadeOut('slow', function() {
										$(this).remove();
									});
									$.baseToast({
										isSuccess: true,
										text: i18n('DELETED SUCCESSFULLY')
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
	}
});