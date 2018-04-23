sap.ui.controller("app.controllers.library.Library", {
    
    onInit: function() {
        this.components = {};
        this.initServices();
        this._views = {
            leftContent: {
                view: "app.views.menu.accordion",
                wrapper: "#left-content"
            }
        };
    },
    onBeforeRendering: function(hmtl){
		if(!this.privileges.Access){
			window.location.pathname = "timp/tkb";
			window.location.hash = "/tkb";
		}
	},
    onAfterRendering: function(html) {
        var _self = this;

        var tam = $(document).height() - $('#tbdWrapper .main-wrapper .main-header').height() -
            $('#tbdWrapper .main-footer').height() - 5;

        $('#left-content').css('height', tam - 121);

        _self.form = html;
        _self.form.rightContent = _self.form.find("#right-content");
        _self.form.leftContent = _self.form.find("#left-content");
        _self.loader = _self.form.leftContent.baseLoader({
            modal: true
        });

        app.services.addComponent(_self.loader, 'loader');

        //titletbd is a json that contains the data of the view and the
        //title of each view it's going to be called in the app.service.renderView
        _self.titlesTBD = {
            documentTypeConfig: {
                title: i18n('DOCUMENT TYPE CONFIGURATION'),
                view: {
                    viewName: "app.views.documentTypeConfig.list",
                    type: sap.ui.core.mvc.ViewType.HTML,
                    viewData: {
                        type: 'documentTypeConfig'
                    }
                }
            },
            keyFieldsConfig: {
                title: i18n('KEY FIELDS CONFIGURATION'),
                view: {
                    viewName: "app.views.keyFieldsConfig.list",
                    type: sap.ui.core.mvc.ViewType.HTML,
                    viewData: {
                        type: 'keyFieldsConfig'
                    }
                }
            },
            storageLocationConfig: {
                title: i18n('STORAGE LOCATION CONFIGURATION'),
                view: {
                    viewName: "app.views.storageLocationConfig.list",
                    type: sap.ui.core.mvc.ViewType.HTML,
                    viewData: {
                        type: 'storageLocationConfig'
                    }
                }
            },
            fileStorage: {
                title: i18n('FILE STORAGE'),
                view: {
                    viewName: "app.views.fileStorage.list",
                    type: sap.ui.core.mvc.ViewType.HTML,
                    viewData: {
                        type: 'fileStorage'
                    }
                }
            },
            documentApproval: {
                title: i18n('DOCUMENT APPROVAL'),
                view: {
                    viewName: "app.views.documentApproval.list",
                    type: sap.ui.core.mvc.ViewType.HTML,
                    viewData: {
                        type: 'documentApproval'
                    }
                }
            },
            documentConsulting: {
                title: i18n('DOCUMENT CONSULTING'),
                view: {
                    viewName: "app.views.documentConsulting.list",
                    type: sap.ui.core.mvc.ViewType.HTML,
                    viewData: {
                        type: 'documentConsulting'
                    }
                }
            }
        };
        if(this.coreServices && !this.coreServices.page){
            this.coreServices.page = 1;
        }
        
        //The actionForm is to know what "action" or what sub component (element of the accordion)
        //it's being called.
        _self.actionForm = window.parameters.cadastro;
        if (typeof(_self.actionForm) === "undefined"){
            // _self.coreServices.page = 1;
            app.services.renderView('documentTypeConfig');
        } else if (typeof(_self.actionForm) !== "undefined" && _self.actionForm == "documentTypeConfig") {
            app.services.renderView('documentTypeConfig');
            _self.loader.close();
        } else if (typeof(_self.actionForm) !== "undefined" && _self.actionForm == "keyFieldsConfig") {
            app.services.renderView('keyFieldsConfig');
            // _self.loader.close();
        } else if (typeof(_self.actionForm) !== "undefined" && _self.actionForm == "storageLocationConfig") {
            app.services.renderView('storageLocationConfig');
        } else if (typeof(_self.actionForm) !== "undefined" && _self.actionForm == "fileStorage") {
            app.services.renderView('fileStorage');
            // _self.loader.close();
        } else if (typeof(_self.actionForm) !== "undefined" && _self.actionForm == "documentApproval") {
            app.services.renderView('documentApproval');
            // _self.loader.close();
        } else if (typeof(_self.actionForm) !== "undefined" && _self.actionForm == "documentConsulting") {
            app.services.renderView('documentConsulting');
            // _self.loader.close();
        } 
    },

    initServices: function() {
        var _self = this;
        _self.isVisibleRight = true;
        _self.isVisibleLeft = true;
        _self.isRendered = false;


        //service that live in all the listing of the accordion
        app.services = {
            renderView: function(data) {
                if (_self.isRendered === false) {
                    $('.right-panel').removeClass('visible');
                    enableBackTabIndex();
                    $('.info-close-button').attr('tabindex', -1);
                    var title = document.getElementById("main-title");
                    title.innerHTML = _self.titlesTBD[data].title;
                    $('#main-title').html(i18n('COMPONENT NAME'))
                    _self.form.find("#right-content").html('');
                    _self.form.find("#right-content").empty();
                    _self.isRendered = true;
                    _self.form.find("#right-content").bindView(new sap.ui.view(_self.titlesTBD[data].view),
                        _self.titlesTBD[data].view.viewData);
                }
            },
            addComponent: function(component, componentName) {
                _self.addComponentField(component, componentName);
            },
            getComponents: function() {
                return _self.components;
            },
            loadDocumentTypeConfig: function(name, objToEdit) {
                _self.loadDocumentTypeConfig(name, objToEdit);
            },
            hideLeftPanel: function() {
                //Method called to hide the left panel or ACCORDION and disabled and enable all tab indexes
                $('.base-layout').toggleClass('left-collapsed');
                if (_self.isVisibleRight === true) {
                    _self.form.find('#left-content .accordion li').prop('tabindex', -1);
                    _self.isVisibleRight = false;
                } else if (_self.isVisibleRight === false) {
                    _self.form.find("li[identifier='accordion-item-documentTypeConfig']").prop('tabindex', 0);
                    _self.form.find("li[identifier='accordion-item-fileStorage']").prop('tabindex', 0);
                    _self.form.find("li[identifier='accordion-item-keyFieldsConfig']").prop('tabindex', 0);
                    _self.form.find("li[identifier='accordion-item-storageLocationConfig']").prop('tabindex', 0);
                    _self.form.find("li[identifier='accordion-item-documentApproval']").prop('tabindex', 0);
                    _self.form.find("li[identifier='accordion-item-documentConsulting']").prop('tabindex', 0);
                    
                    _self.isVisibleRight = true;
                }
                setTimeout(function() {
                    $(window).resize();
                    $(window).resize();
                }, 600);
            },
            removeComponent: function(component) {
                delete _self.components[component];
            },
            clearComponents: function() {
                _self.components = {};
            },
            updateAccordion: function() {
                if (_self.isVisibleLeft) {
                    _self.loader.open();
                    _self.isVisibleLeft = false;
                } else {
                    _self.loader.close();
                    _self.isVisibleLeft = true;
                }
            },
            isRendered: function() {
                return _self.form.find('#left-content .accordion li').length;
            },
            setMenuSelected: function(menu) {
                //Method that changes the color of the selected item in the accordion
                _self.form.find('#left-content .accordion li').removeClass('selected');
                
                var option = menu;
                switch (menu) {
                    case "documentTypeConfig":
                        option = "documentTypeConfig";
                        break;
                    case "fileStorage":
                        option = "fileStorage";
                        break;
                    case "keyFieldsConfig":
                        option = "keyFieldsConfig";
                        break;
                    case "storageLocationConfig":
                        option = "storageLocationConfig";
                        break;
                    case "documentApproval":
                        option = "documentApproval";
                        break;
                    case "documentConsulting":
                        option = "documentConsulting";
                        break;
                }
                
                _self.form.find("li[identifier='accordion-item-" + option + "']").addClass("selected");
                _self.form.find('#base-baseTooltip-wrapper').empty();
                _self.isRendered = false;
            }
        };
    },

    addComponentField: function(component, componentName) {
        var _self = this;
        _self.components[componentName] = component;
    },
    getComponents: function() {
        var _self = this;
        return _self.components;
    }
});