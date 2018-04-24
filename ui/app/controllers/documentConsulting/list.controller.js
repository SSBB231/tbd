/*global i18n _ Data parseDate app*/
sap.ui.controller("app.controllers.documentConsulting.list", {
	onDataRefactor: function(data) {
		return $.extend(data, this.data);
	},
	
	//Change: add an instance of a PrinterSaver to handle printing and saving
	onInit: function() {
		this.printerSaver = newPrinterSaver();
	},
	
	//Add function that handles click on print button
	handlePrintClick: function(){

		//Filter files using the table controller's list of checked elements' ids
        this.printerSaver.applySelectionFilter(this._table.getCheckedElements());

        //If there are no files selected, then send a message and return from function
        if(this.printerSaver.noFiles()) {
            alert(this.noneSelectedMessage());
            return;
        }

		this.printerSaver.printAllSelected();
	},

	//Generates a prompt to select a file to print or save
	noneSelectedMessage: function(){

		//Use replace to get rid of branch and just keep select
		var select = i18n("SELECT BRANCH").replace("Filial", "").trim() + " ";

		//Split and pop to keep only the word register
		var register = i18n("SAVE DIALOG").split(" ").pop().replace("?", "").trim() + " ";


		var toPrint = i18n("TO") + " " + i18n("PRINT") + "/" + i18n("SAVE");

		return select + register + toPrint;
	},
	
	onAfterRendering: function(html) {
		var _self = this;
		_self.view = html;
		_self.page = 1;

		/* Filter Elements */
		_self.view.filters = _self.view.find('#advanced-filters');
		$('.advanced-filters').css('display', 'none');
		_self.view.filters.company = _self.view.find('#companyFilter');
		_self.view.filters.uf = _self.view.filters.find('#ufFilter');
		_self.view.filters.branch = _self.view.filters.find('#branchFilter');

		_self.view.filters.tax = _self.view.filters.find('#taxFilter');
		_self.view.filters.filesFilter = _self.view.filters.find('#filesFilter');
		_self.view.filters.docIdFilter = _self.view.filters.find('#docIdFilter');

		_self.view.filters.statusFilter = _self.view.find('#statusFilter');
		_self.view.filters.classificationFilter = _self.view.filters.find('#classificationFilter');
		_self.view.filters.structureFilter = _self.view.filters.find('#structureFilter');
		_self.view.filters.keyFieldsFilter = _self.view.filters.find('#keyFieldsFilter');
		_self.view.filters.originComponentFilter = _self.view.filters.find('#originComponentFilter');
		_self.view.filters.keyField1Filter = _self.view.filters.find('#keyField1');
		_self.view.filters.keyField2Filter = _self.view.filters.find('#keyField2');
		_self.view.filters.creationUserFilter = _self.view.filters.find('#creationUserFilter');
		_self.view.filters.modificationUserFilter = _self.view.filters.find('#modificationUserFilter');

		_self.icons = {
			'collapsedown': {
				iconFont: "Sign-and-Symbols",
				icon: "collapsedown"
			},
			'collapseup': {
				iconFont: 'Sign-and-Symbols',
				icon: 'collapseup'
			}
		};
		_self.coreServices.filters = {};
		_self.view.filters.resetBtn = _self.view.find("#resetButton");
		_self.view.filters.advancedFiltersBtn = _self.view.find("#advanced-filters-btn");
		_self.filterBox = _self.view.find('.search-input');
		_self.table = _self.view.find('#table');
		_self.Toolbar = _self.view.find('.toolbar');
		var title = document.getElementById("main-title");
		title.innerHTML = i18n('DOCUMENT CONSULTING');
		_self.bindElements();

		_self.bindFilterEvents();
	},
	bindElements: function() {
		var _self = this;
		_self.renderToolbar();
		_self.renderFiltersButtons();
		// _self.loadFilterData();
		_self.renderLibraryContent();
		_self.renderSearch();
		_self.listAdvancedFilters();
	},
	bindFilterEvents: function() {
		var _self = this;
		$('#advanced-filters-btn').unbind('click').bind('click', function() {
			if (!$(".library-advanced-filters-container").is(":visible")) {
			    if(_self.privileges && _self.privileges.DocumentConsulting && _self.privileges.DocumentConsulting.read ){
			        if (_self.filters.company.getKey() !== undefined) {
    					_self.renderUf(_self.getUfList());
    				} else {
    					_self.renderUf(null);
    				}
    				_self.renderTax(_self.endpointData.taxes);
    				_self.renderDocId(_self.endpointData.docTypes);
    				_self.renderCreationUserFilter(_self.endpointData.creationUsers);
    				_self.renderModificationUserFilter(_self.endpointData.modificationUsers);
    				_self.renderFiles(null);
    				_self.renderBranch(null);
    				_self.renderClassification(_self.endpointData.securityClassification);
    				_self.renderStructure(_self.endpointData.structures);
    				_self.renderStatus(_self.endpointData.status);
    				// _self.renderClassification(_self.endpointData.securityClassification);
    				_self.renderComponentOrigin(_self.endpointData.components);
    				_self.renderKeyField1(_self.endpointData.keyField1);
    				_self.renderKeyField2(_self.endpointData.keyField2);
    				_self.renderKeyFields(null);
    				// _self.renderCreationUserFilter(null);
    
    				$(".consulting-table").animate({
    					top: $(".library-advanced-filters-container").height() + $(".consulting-table").offset().top - 10
    				}, 400);
    				$(".library-advanced-filters-container").slideDown();
    				$(".library-advanced-filters-container").css("display", "inline-table");
			    }
			} else {
				$(".library-advanced-filters-container").slideUp();
				$(".consulting-table").animate({
					top: 110
				}, 400);
			}
			var icon = $('#advanced-filters-btn').find(".button-icon");
			if (icon.hasClass("icon-collapsedown")) {
				$('#advanced-filters-btn').find(".button-icon").toggleClass("icon-collapsedown");
				$('#advanced-filters-btn').find(".button-icon").toggleClass("icon-collapseup");
			} else if (icon.hasClass("icon-collapseup")) {
				$('#advanced-filters-btn').find(".button-icon").toggleClass("icon-collapseup");
				$('#advanced-filters-btn').find(".button-icon").toggleClass("icon-collapsedown");
			}
		});
		// _self.advancedFiltersBtn.baseTooltip({
		//     class: 'dark',
		//     position: 'top',
		//     text: i18n('STANDAR LIBRARY CONTENT ADVANCED FILTERS TOOLTIP')
		// });
		// _self.resetFilters.baseTooltip({
		//     class: 'dark',
		//     position: 'top',
		//     text: i18n('STANDAR LIBRARY CONTENT CLEAN FILTERS')
		// });
		// $('#reset-filters-btn').on('click', function() {
		//     _self.resetting = true;
		//     _self.resetFiltersFunction();
		//     _self.resetting = false;
		//     _self.loadList();
		// });
	},

	renderToolbar: function() {
		var _self = this;

		this.Toolbar.bindBaseLibraryToolbar({
			leftButtons: [{
				//     text: i18n('APPLY'),
				//     onPress: function() {
				//         // window.location = "#/fileStorage?action=new";
				//         // _self.renderLibraryContent();
				//         _self.renderTable();
				//     },
				//     icon: "adddoc",
				//     iconFont: "File-and-Folders",
				//     enabled: _self.privileges.Access && _self.privileges.FileStorage.create,
				//     tooltip: i18n('CLICK PRESS') + ' ' + i18n('TO') + ' ' + i18n('CREATE') + ' ' + i18n('APPLY'),
				// }, {
				onPress: function() {
					app.services.hideLeftPanel();
					$('#base-baseTooltip-wrapper').html('');
				},
				icon: "dataset",
				iconFont: "DataManager",
				tooltip: i18n('CLICK PRESS') + ' ' + i18n('TO') + ' ' + i18n('HIDE LEFT PANEL'),
				enabled: true
            },
			
			//Información para el botón de impresión
			{
				onPress: function() {
					_self.handlePrintClick();
				},
				icon: "Printersimple",
				iconFont: "Finance-and-Office",
				tooltip: i18n('CLICK PRESS') + ' ' + i18n('TO') + ' ' + i18n('PRINT'),
				enabled: true
            },
			
			//Información para el botón de descarga
			{
				onPress: function() {
					alert("DOWNLOADING");
				},
				icon: "download",
				iconFont: "DataManager",
				tooltip: i18n('CLICK PRESS') + ' ' + i18n('TO') + ' ' + i18n('DOWNLOAD'),
				enabled: true
            }],
			hideGrid: true
		});
	},

	renderLibraryContent: function() {
		var _self = this;
		this.loader = this.table.baseLoader({
			modal: true
		});
		this.loader.open();
		var params = {
			filters: _self.coreServices.filters,
			page: this.page
		};
		app.services.setMenuSelected('documentConsulting');

		_self.loader.open();
		Data.endpoints.documentConsulting.getRequiredInfo.post(params).success(function(_res) {
			// _self.endpointData = _res.listFilters;
			_self.renderList(_res.data);
			// _self.listAdvancedFilters(_res.data);
			_self.loader.close();
		}).error(function(d, m, s, xhr) {
			_self.renderList();
			_self.loader.close();
		});

	},
	listAdvancedFilters: function(object) {
		var _self = this;
		this.loader = this.table.baseLoader({
			modal: true
		});
		this.loader.open();
		var params = {
			filters: _self.coreServices.filters,
			page: this.page
		};
		app.services.setMenuSelected('documentConsulting');

		// _self.loader.open();
		Data.endpoints.documentConsulting.listAdvancedFilters.post(params).success(function(_res) {
			_self.endpointData = _res.listFilters;
			_self.renderFilters(_res.data);
			// _self.renderList(_res.data);
			// _self.loader.close();
		}).error(function(d, m, s, xhr) {
			_self.renderList();
			// _self.loader.close();
		});

	},
	renderTable: function() {
		var _self = this;
		this.loader = this.table.baseLoader({
			modal: true
		});
		this.loader.open();
		var params = {
			filters: _self.coreServices.filters, // _self.getFilterData(),
			page: this.page
		};
		app.services.setMenuSelected('documentConsulting');

		_self.loader.open();
		Data.endpoints.documentConsulting.getRequiredInfo.post(params).success(function(_res) {
			// _self.endpointData = _res.listFilters;
			// _self.renderFilters();
			_self.renderList(_res.data);
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
			text: i18n('DESCRIPTION'),
			sort: true,
			width: '100px',
			type: 'center'
        }, {
			text: i18n('NUMBER RANGE'),
			sort: true,
			width: '150px',
			type: 'center'
        }, {
			text: i18n('FILE STORAGE STATUS'),
			sort: true,
			width: '100px',
			type: 'text'
        }, {
			text: i18n('FILE NAMES'),
			sort: true,
			width: '200px',
			type: 'text'
        }, {
			text: i18n('COMPONENT ORIGIN'),
			sort: true,
			width: '100px',
			type: 'text'
        }, {
			text: i18n('STRUCTURE'),
			sort: true,
			width: '200px',
			type: 'text'
        }, {
			text: i18n('KEYS'),
			sort: true,
			width: '150px',
			type: 'text'
        }, {
			text: i18n('CREATION USERNAME'),
			sort: true,
			width: '100px',
			type: 'center'
        }, {
			text: i18n('CREATION DATE'),
			sort: true,
			width: '100px',
			type: 'center'
        }, {
			text: i18n('MODIFICATION USERNAME'),
			sort: true,
			width: '100px',
			type: 'center'
        }, {
			text: i18n('MODIFICATION DATE'),
			sort: true,
			width: '100px',
			type: 'center'
        }];
		if (data && data.errorMsg === undefined) {
			data.forEach(function(element, i) {
				var actions = [];
				var fileNames = [];
				var keyFieldsStructure = [];
				var componentOrigin = [];
				var approvalDate = [];
				var comments = [];
				var classDescription = [];
				var fields = [];
				var fileStatus = [];

				if (element && element.fileStorage && element.fileStorage.length > 0) {
					element.fileStorage.map(function(ele) {
						fileNames.push(ele.fileName);
						approvalDate.push(parseDate(ele.approvalDate));
						comments.push(ele.comments);
					});
				}
				if (element && element.keyFields && element.keyFields.length > 0) {
					element.keyFields.map(function(ele) {
						keyFieldsStructure.push(ele.structureName);
						componentOrigin.push(ele.componentName + ' - ' + ele.componentDesc);
						fields.push(ele.keyName)
					});
				}
				if (element && element.documentSecurity && element.documentSecurity.length > 0) {
					element.documentSecurity.map(function(ele) {
						classDescription.push(_self.translateClassification(ele.structureName));
					});
				}
				if (element && element.fileStorage && element.fileStorage.length > 0) {
					element.fileStorage.map(function(ele) {
						fileStatus.push(_self.translateStatus(ele.fileStatus));
					});
				}
				fileStatus = _.uniq(fileStatus);

				if (_self.privileges.Access && _self.privileges.DocumentConsulting.read) {
					actions.push({
						iconFont: "Sign-and-Symbols",
						icon: "info-52",
						text: i18n('INFO'),
						onPress: function() {
							_self._showInfoPanel(element);
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
                    fileStatus,
                    fileNames,
                    _.uniq(componentOrigin),
                    _.uniq(keyFieldsStructure),
                    _.uniq(fields),
                    element.creationUserData && element.creationUserData[0] ? element.creationUserData[0].name + ' ' + element.creationUserData[0].last_name : '—',
                    parseDate(element.creationDate),
                    element.modificationUserData && element.modificationUserData[0] ? element.modificationUserData[0].name + ' ' + element.modificationUserData[0].last_name : '—',
                    parseDate(element.modificationDate)]
				});

				element.fileStorage.forEach((file)=>{

					//Agregar información y links de cada uno de los archivos
					var fileInfo = {
						rowId: element.id,
						name: file.fileName,
						link: file.link,
						contents: null
					};

					_self.printerSaver.addFile(fileInfo);
				})
			});
		}

		this.table.empty();
		this._table = this.table.bindBaseTable({
			hasActions: true,
			hasCheckboxes: true,
			hasFlags: false,
			hasPagination: true, //true
			flags: [],
			headers: headers,
			body: body,
			// onSort: function(idx, asc, page, filter){},
			//          totalPages: data ? data.meta.page : 1,
			//          actualPage: this.page,
			//          onPageChange: function(oldVal, newVal) {
			//              _self.page = newVal;
			//              _self.renderLibraryContent();
			//          }
		});

	},
	_showInfoPanel: function(element) {
		var _self = this;

		var content = [];
		var companies = [];
		var branches = [];
		var ufs = [];
		if (element && element.fileStorage && element.fileStorage.length > 0) {
			element.fileStorage.map(function(ele) {
				for (var i = 0; i < element.eef.length; i++) {
					if (ele.id === element.eef[i].idConfiguration) {
						companies.push(element.eef[i].idCompany);
						branches.push(element.eef[i].idCompany + " - " + element.eef[i].idBranch);
						ufs.push(element.eef[i].uf);
					}
				}
				content.push({
					name: ele.id + ' - ' + ele.fileName,
					content: [{
						title: i18n('FILE NAME'),
						name: ele.fileName
             }, {
						title: i18n('COMPANY'),
						name: _.uniq(companies) //ele.company
        			}, {
						title: i18n('UF'),
						name: _.uniq(ufs) //ele.uf
        			}, {
						title: i18n('BRANCH'),
						name: _.uniq(branches) //ele.branch
        			}, {
						title: i18n('TAX'),
						name: ele.taxLabel
                 }, {
						title: i18n('KEY FIELD') + ' 1',
						name: ele.keyField1
                 }, {
						title: i18n('KEY FIELD') + ' 2',
						name: ele.keyField2
                 }, {
						title: i18n('FILE STORAGE STATUS'),
						name: ele.fileStatus ? _self.translateStatus(ele.fileStatus) : '—'
                 }, {
						title: i18n('APPROVAL DATE'),
						name: ele.approvalDate ? parseDate(ele.approvalDate) : '—'
                 }, {
						title: i18n('CLASSIFICATION'),
						name: _self.translateClassification(ele.storageClassification)
                 }, {
						name: ele.link ? ele.link : '—'
                }, {
						title: i18n('COMMENTARY'),
						name: ele.comments ? ele.comments : '—'
             }, {
						name: ele.modificationUsername ? ele.modificationUsername + ', ' + parseDate(ele.modificationDate) : '—'
            }, {
						name: ele.creationUsername ? ele.creationUsername + ', ' + parseDate(ele.creationDate) : '—'
            }]
				})
			});
		}
		var panel = _self.view.bindBaseInformationPanel({
			id: app.ID,
			name: i18n('FILE DETAILS'),
			sections: content,
			exactDate: true,
			history: [{
				modificationUser: element.modificationUserData && element.modificationUserData[0] ? element.modificationUserData[0].name + ' ' +
					element.modificationUserData[0].last_name : '—',
				modificationDate: parseDate(element.modificationDate, 'object'),
				creationUser: element.creationUserData && element.creationUserData[0] ? element.creationUserData[0].name + ' ' + element.creationUserData[
					0].last_name : '—',
				creationDate: parseDate(element.creationDate, 'object')
    }]
		});
		$(".content.detail-show > div:nth-child(11)").each(function(idx) {
			$(this).addClass("link-upload");
			// $( this ).addClass( "identifierId-" + "idx" );
			$(this).attr('id', "identifierId-" + idx);
			var link = document.createElement('a');
			link.href = $(this).text().trim();
			link.download = $(this).parent().children()[0].textContent.split(":")[1].trim();
			$(this).append(link);
			$(this).on("click", (function() {
				link.click();
			}));
		});

		$(".detail").css("word-wrap", "break-word");

	},

	renderFiltersButtons: function() {
		var _self = this;

		/**** Render buttons ****/
		// Hide advanced Filters
		if (_self.view.hasClass("open")) {
			_self.view.toggleClass('open');
		}

		// Reset Filters Button
		_self.view.filters.resetBtn.on('click', function() {
			_self.renderFilters(true);
			_self.coreServices.filters = {};
			_self.actualPage = 1;
			_self.renderLibraryContent();
		});
		_self.view.filters.resetBtn.baseTooltip({
			class: 'dark',
			position: 'top',
			text: i18n('TO RESET FILTERS')
		});
	},
	getFilterData: function() {
		var _self = this;

		var obj = {};
		if (_self.filters) {
			if (_self.filters.company && _self.filters.company.getKey && _self.filters.company.getKey()) {
				obj.company = _self.filters.company.getKey();
			}
			if (_self.filters.uf && _self.filters.uf.getKey && _self.filters.uf.getKey()) {
				obj.uf = _self.filters.uf.getKey();
			}
			if (_self.filters.branch && _self.filters.branch.getKey && _self.filters.branch.getKey()) {
				obj.branch = _self.filters.branch.getKey();
			}
			if (_self.filters.tax && _self.filters.tax.getKey && _self.filters.tax.getKey()) {
				obj.tax = _self.filters.tax.getKey();
			}
			if (_self.filters.docIdFilter && _self.filters.docIdFilter.getKey && _self.filters.docIdFilter.getKey()) {
				obj.id = _self.filters.docIdFilter.getKey();
			}
			if (_self.filters.filesFilter && _self.filters.filesFilter.getKey && _self.filters.filesFilter.getKey()) {
				obj.fileId = _self.filters.filesFilter.getKey();
			}

			if (_self.filters.statusFilter && _self.filters.statusFilter.getKey && _self.filters.statusFilter.getKey()) {
				obj.fileStatus = _self.filters.statusFilter.getKey();
			}
			if (_self.filters.classificationFilter && _self.filters.classificationFilter.getKey && _self.filters.classificationFilter.getKey()) {
				obj.securityClassification = _self.filters.classificationFilter.getKey();
			}
			if (_self.filters.keyField1Filter && _self.filters.keyField1Filter.getKey && _self.filters.keyField1Filter.getKey()) {
				obj.keyField1 = _self.filters.keyField1Filter.getKey();
			}
			if (_self.filters.keyField2Filter && _self.filters.keyField2Filter.getKey && _self.filters.keyField2Filter.getKey()) {
				obj.keyField2 = _self.filters.keyField2Filter.getKey();
			}
			if (_self.filters.keyField2Filter && _self.filters.keyField2Filter.getKey && _self.filters.keyField2Filter.getKey()) {
				obj.keyField2 = _self.filters.keyField2Filter.getKey();
			}
			if (_self.filters.structureFilter && _self.filters.structureFilter.getKey && _self.filters.structureFilter.getKey()) {
				obj.structureId = _self.filters.structureFilter.getKey();
			}
			if (_self.filters.keyFieldsFilter && _self.filters.keyFieldsFilter.getKey && _self.filters.keyFieldsFilter.getKey()) {
				obj.keyCode = _self.filters.keyFieldsFilter.getKey();
			}
			if (_self.filters.originComponentFilter && _self.filters.originComponentFilter.getKey && _self.filters.originComponentFilter.getKey()) {
				obj.componentOrigin = _self.filters.originComponentFilter.getKey();
			}
			if (_self.filters.creationUserFilter && _self.filters.creationUserFilter.getKey && _self.filters.creationUserFilter.getKey()) {
				obj.creationUser = _self.filters.creationUserFilter.getKey();
			}
			if (_self.filters.modificationUserFilter && _self.filters.modificationUserFilter.getKey && _self.filters.modificationUserFilter.getKey()) {
				obj.modificationUser = _self.filters.modificationUserFilter.getKey();
			}
		}

		return obj;
	},

	renderFilters: function(isReset) {
		var _self = this;
		_self.filters = {};

		var companies = [];
		if (_self.endpointData) {
			for (var i = 0; i < _self.endpointData.companies.length; i++) {
				companies.push({
					key: _self.endpointData.companies[i].key,
					name: _self.endpointData.companies[i].text
				});
			}
		}
		_self.view.filters.company.empty();
		_self.filters.company = _self.view.filters.company.bindBaseAutocomplete({
			placeholder: i18n('COMPANY'),
			tooltip: i18n('CLICK PRESS') + " " + i18n('TO SELECT COMPANY'),
			options: _self.endpointData.companies.sort(_self.orderByAlphabetical),
			adjustSize: true,
			maxWidth: '200px',
			onChange: function(oldVal, newVal) {
				if (newVal && newVal.key !== null) {
					_self.coreServices.filters.company = newVal.key
					_self.renderUf(_self.getUfList());
					_self.renderBranch(null);
				} else {
					_self.renderUf(null);
					_self.renderBranch(null);
				}
				_self.renderLibraryContent();
			}
		});

		if (_self.coreServices.filters.company && !isReset) {
			_self.filters.company.setKey(_self.coreServices.filters.company, true);
			if (_self.coreServices.filters.uf)
				_self.filters.uf.setKey(_self.coreServices.filters.uf, true);
			if (_self.coreServices.filters.branch)
				_self.filters.branch.setKey(_self.coreServices.filters.branch, true);
		}
		// _self.view.filters.advancedFiltersBtn.unbind('click').bind('click', function() {
		//     if (_self.view.filters.advancedFiltersBtn.hasClass('ativo')) {
		//         // _self.view.toggleClass('open');
		//         $('.consulting-table').toggleClass('openBigger');
		//         $('.advanced-filters').fadeOut(function() {
		//             $('.advanced-filters').css('top', 120);
		//             // $('.library-tile-container').css('top', "120px");
		//         });
		//         _self.view.filters.advancedFiltersBtn.find('.button-icon').removeClass('icon-' + _self.icons.collapseup.icon);
		//         _self.view.filters.advancedFiltersBtn.find('.button-icon').addClass('icon-' + _self.icons.collapsedown.icon);
		//         _self.view.filters.advancedFiltersBtn.removeClass('ativo');
		//     } else {
		//         // _self.view.toggleClass('open');
		//         $('.consulting-table').toggleClass('openBigger');
		//         $('.advanced-filters').fadeIn(function() {});
		//         _self.view.filters.advancedFiltersBtn.addClass('ativo');
		//         // $('.library-tile-container').css('top', "270px");
		//         _self.view.filters.advancedFiltersBtn.find('.button-icon').removeClass('icon-' + _self.icons.collapsedown.icon);
		//         _self.view.filters.advancedFiltersBtn.find('.button-icon').addClass('icon-' + _self.icons.collapseup.icon);
		//         if (_self.filters.company.getKey() !== undefined )
		//             _self.renderUf(_self.getUfList());
		//         else
		//             _self.renderUf(null);

		//         _self.renderTax(_self.endpointData.taxes);
		//         _self.renderDocId(_self.endpointData.docTypes);
		//         _self.renderCreationUserFilter(_self.endpointData.creationUsers);
		//         _self.renderModificationUserFilter(_self.endpointData.modificationUsers);
		//         _self.renderFiles(null);
		//         _self.renderBranch(null);
		//         _self.renderClassification(_self.endpointData.securityClassification);
		//         _self.renderStructure(_self.endpointData.structures);
		//         _self.renderStatus(_self.endpointData.status);
		//         // _self.renderClassification(_self.endpointData.securityClassification);
		//         _self.renderComponentOrigin(_self.endpointData.components);
		//         _self.renderKeyField1(_self.endpointData.keyField1);
		//         _self.renderKeyField2(_self.endpointData.keyField2);
		//         _self.renderKeyFields(null);
		//         // _self.renderCreationUserFilter(null);

		//         _self.disableTooltipsFilters();
		//     }

		// });
		_self.view.filters.advancedFiltersBtn.baseTooltip({
			class: 'dark',
			position: 'top',
			text: i18n('LIBRARY CONTENT ADVANCED FILTERS TOOLTIP')
		});

		if (isReset) {
			_self.renderSearch();
			_self.renderUf(null);
			_self.renderBranch(null);
			_self.renderKeyFields(null);
			_self.renderCreationUserFilter(_self.endpointData.creationUsers);
			_self.renderModificationUserFilter(_self.endpointData.modificationUsers);
			_self.renderTax(_self.endpointData.taxes);
			_self.renderStatus(_self.endpointData.status);
			_self.renderStructure(_self.endpointData.structures);
			_self.renderClassification(_self.endpointData.securityClassification);
			_self.renderComponentOrigin(_self.endpointData.components);
			_self.renderFiles(null);
			_self.renderKeyField1(_self.endpointData.keyField1);
			_self.renderKeyField2(_self.endpointData.keyField2);
			_self.renderDocId(_self.endpointData.docTypes);
		}
	},
	disableTooltipsFilters: function() {
		var _self = this;

		if (_self.view.hasClass("open")) {
			_self.view.filters.find('input').attr('tabindex', 0);
			//_self.view.filters.find('.base-select-wrapper').attr('tabindex', 0);
		} else {
			_self.view.filters.find('input').attr('tabindex', -1);
			//_self.view.filters.find('.base-select-wrapper').attr('tabindex', -1);
		}
	},

	renderUf: function(options) {
		var _self = this;
		// If options === null, render a disabled Select
		if (options === null) {
			_self.view.filters.uf.empty();
			_self.filters.uf = _self.view.filters.uf.bindBaseSelect({
				options: [],
				isDisabled: true,
				placeholder: i18n('UF'),
				tooltip: i18n('CLICK PRESS') + " " + i18n('TO SELECT STATE')
			});
		} else {
			_self.view.filters.uf.empty();
			_self.filters.uf = _self.view.filters.uf.bindBaseAutocomplete({
				options: options,
				placeholder: i18n('UF'),
				tooltip: i18n('CLICK PRESS') + " " + i18n('TO SELECT STATE'),
				isDisabled: false,
				onChange: function(oldVal, newVal) {
					if (newVal && newVal.key) {
						_self.coreServices.filters.uf = newVal.key;
						_self.renderBranch(_self.getBranchList());
					} else {
						_self.renderBranch(null);
					}
					_self.renderLibraryContent();
					//_self.actualPage = 1;
				}
			});
		}
	},
	getUfList: function() {
		var result = [],
			i;
		var companyKey = this.filters.company.getKey();

		for (i = 0; i < this.endpointData.uf.length; i++) {
			if (companyKey === this.endpointData.uf[i].company) {
				result.push({
					key: this.endpointData.uf[i].key,
					name: this.endpointData.uf[i].text
				});
			}
		}

		// Remove Duplicates
		var obj = {};
		for (i = 0; i < result.length; i++) {
			obj[result[i].key] = result[i];
		}
		result = [];
		for (var key in obj)
			result.push(obj[key]);

		return result;
	},

	renderBranch: function(options) {
		var _self = this;
		if (options === null) {
			_self.view.filters.branch.empty();
			_self.filters.branch = _self.view.filters.branch.bindBaseSelect({
				options: [],
				isDisabled: true,
				placeholder: i18n('BRANCH'),
				tooltip: i18n('CLICK PRESS') + " " + i18n('TO SELECT BRANCH')
			});
		} else {
			if (options && options.length > 0) {
				_self.view.filters.branch.empty();
				_self.filters.branch = _self.view.filters.branch.bindBaseAutocomplete({
					options: options,
					placeholder: i18n('BRANCH'),
					tooltip: i18n('CLICK PRESS') + " " + i18n('TO SELECT BRANCH'),
					onChange: function(oldVal, newVal) {
					    if(newVal && newVal.key){
    						_self.coreServices.filters.branch = newVal.key;
    						_self.renderLibraryContent();
    						//_self.actualPage = 1;
					    }
					}
				});
			} else {
				_self.view.filters.branch.empty();
				_self.filters.branch = _self.view.filters.branch.bindBaseSelect({
					options: [],
					isDisabled: true,
					placeholder: i18n('BRANCH'),
					tooltip: i18n('CLICK PRESS') + " " + i18n('TO SELECT BRANCH')
				});
			}

		}
	},
	getBranchList: function() {
		var _self = this;
		var result = [];
		var ufKey = _self.coreServices.filters.uf; //_self.filters.uf.getKey();
		var companyKey = _self.filters.company.getKey();

		_self.endpointData.branches.forEach(function(branch, branchIndex) {
			if (branch.company === companyKey && branch.uf === ufKey) {
				result.push({
					key: branch.key,
					name: branch.text
				});
			}
		});

		// Remove Duplicates
		var obj = {};
		for (var i = 0; i < result.length; i++) {
			obj[result[i].key] = result[i];
		}
		result = [];
		for (var key in obj) {
			result.push(obj[key]);
		}

		return result;
	},

	renderTax: function(options) {
		var _self = this;

		var _self = this;
		if (options === null) {
			_self.view.filters.tax.empty();
			_self.filters.tax = _self.view.filters.tax.bindBaseSelect({
				options: [],
				isDisabled: true,
				placeholder: i18n('TAX'),
				tooltip: i18n('CLICK PRESS') + " " + i18n('TO SELECT TAX')
			});
		} else {
			if (options && options.length > 0) {
				// var taxesOpts = [];
				// for (var i = 0; i < options.length; i++) {
				//     taxesOpts.push({
				//         key: options[i].key,
				//         name: options[i].text
				//     });
				// }

				_self.view.filters.tax.empty();
				_self.filters.tax = _self.view.filters.tax.bindBaseAutocomplete({
					options: options.sort(_self.orderByAlphabetical),
					placeholder: i18n('TAX'),
					tooltip: i18n('CLICK PRESS') + " " + i18n('TO SELECT TAX'),
					onChange: function(oldVal, newVal) {
					    if(newVal && newVal.key){
    						_self.coreServices.filters.tax = newVal.key;
    						_self.renderLibraryContent();
    						//_self.actualPage = 1;
					    }
					}
				});
			} else {
				_self.view.filters.tax.empty();
				_self.filters.tax = _self.view.filters.tax.bindBaseSelect({
					options: [],
					isDisabled: true,
					placeholder: i18n('TAX'),
					tooltip: i18n('CLICK PRESS') + " " + i18n('TO SELECT TAX')
				});
			}

		}
	},

	renderDocId: function(options) {
		var _self = this;
		if (options === null) {
			_self.view.filters.docIdFilter.empty();
			_self.filters.docIdFilter = _self.view.filters.docIdFilter.bindBaseSelect({
				options: [],
				isDisabled: true,
				placeholder: i18n('DOCUMENT TYPE'),
				tooltip: i18n('CLICK PRESS') + " " + i18n('TO SELECT') + " " + i18n('DOCUMENT TYPE')
			});
		} else {
			if (options && options.length > 0) {
				_self.view.filters.docIdFilter.empty();
				_self.filters.docIdFilter = _self.view.filters.docIdFilter.bindBaseAutocomplete({
					options: options,
					placeholder: i18n('DOCUMENT TYPE'),
					tooltip: i18n('CLICK PRESS') + " " + i18n('TO SELECT') + " " + i18n('DOCUMENT TYPE'),
					onChange: function(oldVal, newVal) {
						//_self.actualPage = 1;
						if (newVal && newVal.key) {
							_self.coreServices.filters.id = newVal.key;
							_self.renderFiles(_self.endpointData.files, newVal);
						} else {
							_self.renderFiles(null);
						}
						_self.renderLibraryContent();
					}
				});
			} else {
				_self.view.filters.docIdFilter.empty();
				_self.filters.docIdFilter = _self.view.filters.docIdFilter.bindBaseSelect({
					options: [],
					isDisabled: true,
					placeholder: i18n('DOCUMENT TYPE'),
					tooltip: i18n('CLICK PRESS') + " " + i18n('TO SELECT') + " " + i18n('DOCUMENT TYPE')
				});
			}

		}
	},
	renderFiles: function(options, docId) {
		var _self = this;

		var _self = this;
		if (options === null) {
			_self.view.filters.filesFilter.empty();
			_self.filters.filesFilter = _self.view.filters.filesFilter.bindBaseSelect({
				options: [],
				isDisabled: true,
				placeholder: i18n('FILE NAME'),
				tooltip: i18n('CLICK PRESS') + " " + i18n('TO SELECT') + " " + i18n('FILE NAME')
			});
		} else {
			if (options && options.length > 0) {
				var filesByDocId = [];
				if (docId && docId.key) {
					options.map(function(ele) {
						if (docId.key == ele.docTypeId) {
							filesByDocId.push(ele);
						}
					})
				}
				_self.view.filters.filesFilter.empty();
				_self.filters.filesFilter = _self.view.filters.filesFilter.bindBaseAutocomplete({
					options: filesByDocId,
					placeholder: i18n('FILE NAME'),
					tooltip: i18n('CLICK PRESS') + " " + i18n('TO SELECT') + " " + i18n('FILE NAME'),
					onChange: function(oldVal, newVal) {
					    if(newVal && newVal.key){
    						_self.coreServices.filters.fileId = newVal.key;
    						_self.renderLibraryContent();
					    }
					}
				});
			} else {
				_self.view.filters.filesFilter.empty();
				_self.filters.filesFilter = _self.view.filters.filesFilter.bindBaseSelect({
					options: [],
					isDisabled: true,
					placeholder: i18n('FILE NAME'),
					tooltip: i18n('CLICK PRESS') + " " + i18n('TO SELECT') + " " + i18n('FILE NAME')
				});
			}
		}
	},

	renderStatus: function(options) {
		var _self = this;

		if (options === null) {
			_self.view.filters.statusFilter.empty();
			_self.filters.statusFilter = _self.view.filters.statusFilter.bindBaseSelect({
				options: [],
				isDisabled: true,
				placeholder: i18n('FILE STORAGE STATUS'),
				tooltip: i18n('CLICK PRESS') + " " + i18n('TO SELECT') + " " + i18n('FILE STORAGE STATUS')
			});
		} else {
			if (options && options.length > 0) {
				_self.view.filters.statusFilter.empty();
				_self.filters.statusFilter = _self.view.filters.statusFilter.bindBaseAutocomplete({
					options: options,
					placeholder: i18n('FILE STORAGE STATUS'),
					tooltip: i18n('CLICK PRESS') + " " + i18n('TO SELECT') + " " + i18n('FILE STORAGE STATUS'),
					onChange: function(oldVal, newVal) {
					    if(newVal && newVal.key){
    						_self.coreServices.filters.fileStatus = newVal.key;
    						_self.renderLibraryContent();
    						// _self.renderFiles(_self.endpointData.files, newVal);
					    }
					}
				});
			} else {
				_self.view.filters.statusFilter.empty();
				_self.filters.statusFilter = _self.view.filters.statusFilter.bindBaseSelect({
					options: [],
					isDisabled: true,
					placeholder: i18n('FILE STORAGE STATUS'),
					tooltip: i18n('CLICK PRESS') + " " + i18n('TO SELECT') + " " + i18n('FILE STORAGE STATUS')
				});
			}

		}
	},
	renderClassification: function(options) {
		var _self = this;
		if (options === null) {
			_self.view.filters.classificationFilter.empty();
			_self.filters.classificationFilter = _self.view.filters.classificationFilter.bindBaseSelect({
				options: [],
				isDisabled: true,
				placeholder: i18n('CLASSIFICATION'),
				tooltip: i18n('CLICK PRESS') + " " + i18n('TO SELECT') + " " + i18n('CLASSIFICATION')
			});
		} else {
			if (options && options.length > 0) {
				_self.view.filters.classificationFilter.empty();
				_self.filters.classificationFilter = _self.view.filters.classificationFilter.bindBaseAutocomplete({
					options: options,
					placeholder: i18n('CLASSIFICATION'),
					tooltip: i18n('CLICK PRESS') + " " + i18n('TO SELECT') + " " + i18n('CLASSIFICATION'),
					onChange: function(oldVal, newVal) {
					    if(newVal && newVal.key){
    						_self.coreServices.filters.securityClassification = newVal.key;
    						_self.renderLibraryContent();
    						// _self.renderFiles(_self.endpointData.files, newVal);
					    }
					}
				});
			} else {
				_self.view.filters.classificationFilter.empty();
				_self.filters.classificationFilter = _self.view.filters.classificationFilter.bindBaseSelect({
					options: [],
					isDisabled: true,
					placeholder: i18n('CLASSIFICATION'),
					tooltip: i18n('CLICK PRESS') + " " + i18n('TO SELECT') + " " + i18n('CLASSIFICATION')
				});
			}

		}
	},
	renderComponentOrigin: function(options) {
		var _self = this;
		if (options === null) {
			_self.view.filters.originComponentFilter.empty();
			_self.filters.originComponentFilter = _self.view.filters.originComponentFilter.bindBaseSelect({
				options: [],
				isDisabled: true,
				placeholder: i18n('COMPONENT ORIGIN'),
				tooltip: i18n('CLICK PRESS') + " " + i18n('TO SELECT') + " " + i18n('COMPONENT ORIGIN')
			});
		} else {
			if (options && options.length > 0) {
				_self.view.filters.originComponentFilter.empty();
				_self.filters.originComponentFilter = _self.view.filters.originComponentFilter.bindBaseAutocomplete({
					options: options.sort(_self.orderByAlphabetical),
					placeholder: i18n('COMPONENT ORIGIN'),
					tooltip: i18n('CLICK PRESS') + " " + i18n('TO SELECT') + " " + i18n('COMPONENT ORIGIN'),
					onChange: function(oldVal, newVal) {
					    if(newVal && newVal.key){
    						_self.coreServices.filters.componentOrigin = newVal.key;
    						_self.renderLibraryContent();
					    }
					}
				});
			} else {
				_self.view.filters.originComponentFilter.empty();
				_self.filters.originComponentFilter = _self.view.filters.originComponentFilter.bindBaseSelect({
					options: [],
					isDisabled: true,
					placeholder: i18n('COMPONENT ORIGIN'),
					tooltip: i18n('CLICK PRESS') + " " + i18n('TO SELECT') + " " + i18n('COMPONENT ORIGIN')
				});
			}

		}
	},
	renderStructure: function(options) {
		var _self = this;
		if (options === null) {
			_self.view.filters.structureFilter.empty();
			_self.filters.structureFilter = _self.view.filters.structureFilter.bindBaseSelect({
				options: [],
				isDisabled: true,
				placeholder: i18n('STRUCTURE'),
				tooltip: i18n('CLICK PRESS') + " " + i18n('TO SELECT') + " " + i18n('STRUCTURE')
			});
		} else {
			if (options && options.length > 0) {
				_self.view.filters.structureFilter.empty();
				_self.filters.structureFilter = _self.view.filters.structureFilter.bindBaseAutocomplete({
					options: options,
					placeholder: i18n('STRUCTURE'),
					tooltip: i18n('CLICK PRESS') + " " + i18n('TO SELECT') + " " + i18n('STRUCTURE'),
					onChange: function(oldVal, newVal) {
					    if(newVal && newVal.key){
    						_self.coreServices.filters.structureId = newVal.key;
    						_self.renderKeyFields(newVal);
    						_self.renderLibraryContent();
					    }
					}
				});
			} else {
				_self.view.filters.structureFilter.empty();
				_self.filters.structureFilter = _self.view.filters.structureFilter.bindBaseSelect({
					options: [],
					isDisabled: true,
					placeholder: i18n('STRUCTURE'),
					tooltip: i18n('CLICK PRESS') + " " + i18n('TO SELECT') + " " + i18n('STRUCTURE')
				});
			}
		}
	},
	renderKeyFields: function(options) {
		var _self = this;
		//Call Endpoint!!
		var _self = this;
		if (options === null) {
			_self.view.filters.keyFieldsFilter.empty();
			_self.filters.keyFieldsFilter = _self.view.filters.keyFieldsFilter.bindBaseSelect({
				options: [],
				isDisabled: true,
				placeholder: i18n('STRUCTURE KEY FIELDS'),
				tooltip: i18n('CLICK PRESS') + " " + i18n('TO SELECT') + " " + i18n('STRUCTURE KEY FIELDS')
			});
		} else {
			var params = {
				id: options.key
			};
			// _self.loader.open();
			Data.endpoints.documentConsulting.readStructure.post(params).success(function(_res) {
				var opts = []
				if (_res && _res.fields.length > 0) {
					$.each(_res.fields, function(idx, itm) {
						opts.push({
							key: itm.ID,
							name: sessionStorage.getItem('lang') === 'ptrbr' ? itm.labelPT : itm.labelEN
						})
					});
				}

				_self.view.filters.keyFieldsFilter.empty();
				_self.filters.keyFieldsFilter = _self.view.filters.keyFieldsFilter.bindBaseAutocomplete({
					options: opts,
					placeholder: i18n('STRUCTURE KEY FIELDS'),
					tooltip: i18n('CLICK PRESS') + " " + i18n('TO SELECT') + " " + i18n('STRUCTURE KEY FIELDS'),
					onChange: function(oldVal, newVal) {
					    if(newVal && newVal.key){
    						_self.coreServices.filters.keyCode = newVal.key;
    						_self.renderLibraryContent();
					    }
					}
				});
				// _self.loader.close();
			}).error(function(d, m, s, xhr) {
				_self.view.filters.keyFieldsFilter.empty();
				_self.filters.keyFieldsFilter = _self.view.filters.keyFieldsFilter.bindBaseSelect({
					options: [],
					isDisabled: true,
					placeholder: i18n('STRUCTURE KEY FIELDS'),
					tooltip: i18n('CLICK PRESS') + " " + i18n('TO SELECT') + " " + i18n('STRUCTURE KEY FIELDS')
				});
				// _self.loader.close();
			});
		}
	},
	renderKeyField1: function(options) {
		var _self = this;
		var _self = this;
		if (options === null) {
			_self.view.filters.keyField1Filter.empty();
			_self.filters.keyField1Filter = _self.view.filters.keyField1Filter.bindBaseSelect({
				options: [],
				isDisabled: true,
				placeholder: i18n('KEY FIELD'),
				tooltip: i18n('CLICK PRESS') + " " + i18n('TO SELECT') + " " + i18n('KEY FIELD')
			});
		} else {
			if (options && options.length > 0) {
				_self.view.filters.keyField1Filter.empty();
				_self.filters.keyField1Filter = _self.view.filters.keyField1Filter.bindBaseAutocomplete({
					options: options,
					placeholder: i18n('KEY FIELD'),
					tooltip: i18n('CLICK PRESS') + " " + i18n('TO SELECT') + " " + i18n('KEY FIELD'),
					onChange: function(oldVal, newVal) {
					    if(newVal && newVal.key){
    						_self.coreServices.filters.keyField1 = newVal.key;
    						_self.renderLibraryContent();
					    }
					}
				});
			} else {
				_self.view.filters.keyField1Filter.empty();
				_self.filters.keyField1Filter = _self.view.filters.keyField1Filter.bindBaseSelect({
					options: [],
					isDisabled: true,
					placeholder: i18n('KEY FIELD'),
					tooltip: i18n('CLICK PRESS') + " " + i18n('TO SELECT') + " " + i18n('KEY FIELD')
				});
			}
		}
	},
	renderKeyField2: function(options) {
		var _self = this;
		var _self = this;
		if (options === null) {
			_self.view.filters.keyField2Filter.empty();
			_self.filters.keyField2Filter = _self.view.filters.keyField2Filter.bindBaseSelect({
				options: [],
				isDisabled: true,
				placeholder: i18n('KEY FIELD'),
				tooltip: i18n('CLICK PRESS') + " " + i18n('TO SELECT') + " " + i18n('KEY FIELD')
			});
		} else {
			if (options && options.length > 0) {
				_self.view.filters.keyField2Filter.empty();
				_self.filters.keyField2Filter = _self.view.filters.keyField2Filter.bindBaseAutocomplete({
					options: options,
					placeholder: i18n('KEY FIELD'),
					tooltip: i18n('CLICK PRESS') + " " + i18n('TO SELECT') + " " + i18n('KEY FIELD'),
					onChange: function(oldVal, newVal) {
					    if(newVal && newVal.key){
    						_self.coreServices.filters.keyField2 = newVal.key;
    						_self.renderLibraryContent();
					    }
					}
				});
			} else {
				_self.view.filters.keyField2Filter.empty();
				_self.filters.keyField2Filter = _self.view.filters.keyField2Filter.bindBaseSelect({
					options: [],
					isDisabled: true,
					placeholder: i18n('KEY FIELD'),
					tooltip: i18n('CLICK PRESS') + " " + i18n('TO SELECT') + " " + i18n('KEY FIELD')
				});
			}
		}
	},
	renderCreationUserFilter: function(options) {
		var _self = this;

		var _self = this;
		if (options === null) {
			_self.view.filters.creationUserFilter.empty();
			_self.filters.creationUserFilter = _self.view.filters.creationUserFilter.bindBaseSelect({
				options: [],
				isDisabled: true,
				placeholder: i18n('CREATION USER'),
				tooltip: i18n('CLICK PRESS') + " " + i18n('TO SELECT') + " " + i18n('CREATION USER')
			});
		} else {
			if (options && options.length > 0) {
				_self.view.filters.creationUserFilter.empty();
				_self.filters.creationUserFilter = _self.view.filters.creationUserFilter.bindBaseAutocomplete({
					options: options.sort(_self.orderByAlphabetical),
					placeholder: i18n('CREATION USER'),
					tooltip: i18n('CLICK PRESS') + " " + i18n('TO SELECT') + " " + i18n('CREATION USER'),
					onChange: function(oldVal, newVal) {
					    if(newVal && newVal.key){
    						_self.coreServices.filters.creationUser = newVal.key;
    						_self.renderLibraryContent();
					    }
					}
				});
			} else {
				_self.view.filters.creationUserFilter.empty();
				_self.filters.creationUserFilter = _self.view.filters.creationUserFilter.bindBaseSelect({
					options: [],
					isDisabled: true,
					placeholder: i18n('CREATION USER'),
					tooltip: i18n('CLICK PRESS') + " " + i18n('TO SELECT') + " " + i18n('CREATION USER')
				});
			}
		}
	},
	renderModificationUserFilter: function(options) {
		var _self = this;

		var _self = this;
		if (options === null) {
			_self.view.filters.modificationUserFilter.empty();
			_self.filters.modificationUserFilter = _self.view.filters.modificationUserFilter.bindBaseSelect({
				options: [],
				isDisabled: true,
				placeholder: i18n('MODIFICATION USER'),
				tooltip: i18n('CLICK PRESS') + " " + i18n('TO SELECT') + " " + i18n('MODIFICATION USER')
			});
		} else {
			if (options && options.length > 0) {
				_self.view.filters.modificationUserFilter.empty();
				_self.filters.modificationUserFilter = _self.view.filters.modificationUserFilter.bindBaseAutocomplete({
					options: options.sort(_self.orderByAlphabetical),
					placeholder: i18n('MODIFICATION USER'),
					tooltip: i18n('CLICK PRESS') + " " + i18n('TO SELECT') + " " + i18n('MODIFICATION USER'),
					onChange: function(oldVal, newVal) {
					    if(newVal && newVal.key){
    						_self.coreServices.filters.modificationUser = newVal.key;
    						_self.renderLibraryContent();
					    }
					}
				});
			} else {
				_self.view.filters.modificationUserFilter.empty();
				_self.filters.modificationUserFilter = _self.view.filters.modificationUserFilter.bindBaseSelect({
					options: [],
					isDisabled: true,
					placeholder: i18n('MODIFICATION USER'),
					tooltip: i18n('CLICK PRESS') + " " + i18n('TO SELECT') + " " + i18n('MODIFICATION USER')
				});
			}
		}
	},
	renderSearch: function() {
		var _self = this;
		_self.filterBox.empty();
		_self.filterBox.ctrl = _self.filterBox.bindBaseInput({
			isSearchBox: true,
			restrict: ['special', 'letters'],
			tooltip: {
				class: "dark",
				position: "top",
				text: i18n("SEARCH BOX TOOLTIP") + ' ' + i18n("ID")
			},
// 			onChange: function(oldVal, newVal) {
// 				_self._table.filter(newVal);
// 			},
			onSearch: function() {
				_self.coreServices.page = 1;
				if(_self.filterBox.ctrl.getText().length){
				    _self.coreServices.filters.id = _self.filterBox.ctrl.getText();
				} else {
				    _self.coreServices.filters.id = null;
				}
				_self.renderLibraryContent();
			}
		});
	},

	translateStatus: function(value) {
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

	translateClassification: function(value) {
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
	getLockFile: function(id, action) {
		var _self = this;
		this.getLock({
			id: id,
			objectType: 'TBD::DocumentConsulting',
			callback: function(_data) {
				if (_data.response === true) {
					_self.coreServices.lock = _data.controller;
					action();
				}
			}
		});
	},
	orderByAlphabetical: function(a, b) {
		var _self = this;
		if (a.key < b.key) {
			return -1;
		}
		if (a.key > b.key) {
			return 1;
		}
		return 0;
	}
});