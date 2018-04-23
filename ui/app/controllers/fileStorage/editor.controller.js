sap.ui.controller('app.controllers.fileStorage.editor', {
    onInit: function() {
        var _self = this;
         if (window.parameters.action === 'view') {
            this._views = {
                rightContent: {
                    view: "app.views.fileStorage.infoRight",
                    wrapper: "#right-content"
                }
            };
        } else if(window.parameters.action !== 'edit') {
            this._views = {
                rightContent: {
                    view: "app.views.fileStorage.editorRight",
                    wrapper: "#right-content"
                }
            };
        }
    },
    onAfterRendering: function(html) {
        var _self = this;
        this.initServices();
        this.components = {};
        var title = document.getElementById("main-title");
        title.innerHTML = (window.parameters.action === 'new' ? i18n('CREATE') : i18n('EDIT')) + ' ' + i18n('DOCUMENT TYPE CONFIGURATION');
        if(window.parameters.action === 'new'){
            title.innerHTML = i18n('FILE STORAGE NEW');
        }else if(window.parameters.action === 'edit'){
            title.innerHTML = i18n('FILE STORAGE EDIT');
        }else if(window.parameters.action === 'view'){
            title.innerHTML = i18n('FILE STORAGE VIEW');
        }
        if (window.parameters.action === 'edit') {
            this.getLock({
                objectType: 'TBD::FileStorage',
                id: window.parameters.id,
                callback: function(_data) {
                    if (_data.response === false) {
                        window.location.hash = '/library?cadastro=fileStorage';
                    } else {
                        _self.coreServices.lock = _data.controller;
                        var view = new sap.ui.view({
                            viewName: 'app.views.fileStorage.editorRight',
                            type: sap.ui.core.mvc.ViewType.HTML
                        });
                        $('#right-content').empty();
                        var x = $('#right-content').bindView(view, {});
                    }
                }
            });
        }
    },
    initServices: function() {
        var _self = this;
        this.coreServices.hasChanged = false;
        this.coreServices.structure = {};
        this.coreServices.item = {};
        this.coreServices.action = window.parameters.action;
        this.coreServices.id = window.parameters.id;
        this.coreServices.hideLeftPanel = function() {
            if(!$('.base-layout').hasClass('left-collapsed'))
                $('.base-layout').toggleClass('left-collapsed');
        };
        this.coreServices.addComponent = function(component, name) {
            _self.components[name] = component;
        };
        this.coreServices.getComponents = function(component) {
            return component ? _self.components[component] : _self.components;
        };
    }
});