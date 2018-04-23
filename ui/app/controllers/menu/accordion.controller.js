sap.ui.controller("app.controllers.menu.accordion", {

    onInit: function() {},

    onBeforeRendering: function() {},

    onAfterRendering: function(html) {
        var _self = this;
        _self.Library = $(html).parent();
        $("#version").html("v." + _self.componentVersion);

        /*Left Panel Components*/
        _self.Library.Accordion = _self.Library.find(".accordion-container");

        _self.bindElements();
    },

    bindElements: function() {
        var _self = this;
        window.onresize = function() {
            _self.resizeLeftDiv();
        };
        // Data.endpoints.privileges.get().success(function(privileges) {
        _self.renderAccordion(_self.privileges);
        _self.createAcordionLinks();
        _self.resizeLeftDiv();
        // });
    },

    resizeLeftDiv: function() {
        var _self = this;
        var ELEMENTS_HEIGHT_SUM = 236; //sum of the heights of all elements with the exception of "left-content"
        //console.log(ELEMENTS_HEIGHT_SUM);
        var height = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
        $("#left-content").css("height", height - ELEMENTS_HEIGHT_SUM);
    },

    createAcordionLinks: function() {
        var _self = this;
        //RBind click events to each accordion item and call the service to rener that view

        $('li[identifier="accordion-item-documentTypeConfig"]').on('click', function() {
            _self.coreServices.page = 1;
            app.services.renderView('documentTypeConfig');
        });
        $('li[identifier="accordion-item-keyFieldsConfig"]').on('click', function() {
            _self.coreServices.page = 1;
            app.services.renderView('keyFieldsConfig');
        });
        $('li[identifier="accordion-item-storageLocationConfig"]').on('click', function() {
            _self.coreServices.page = 1;
            app.services.renderView('storageLocationConfig');
        });
        $('li[identifier="accordion-item-fileStorage"]').on('click', function() {
            _self.coreServices.page = 1;
            app.services.renderView('fileStorage');
        });
        $('li[identifier="accordion-item-documentApproval"]').on('click', function() {
            _self.coreServices.page = 1;
            app.services.renderView('documentApproval');
        });
        $('li[identifier="accordion-item-documentConsulting"]').on('click', function() {
            _self.coreServices.page = 1;
            app.services.renderView('documentConsulting');
        });
    },

    renderAccordion: function(privileges) {
        var _self = this;
        var hasPermition, accordionData;
        //Creates the accordion

        for (var category in privileges) {
            var obj = privileges[category];

            if (obj.hasOwnProperty('read')) {
                if (obj.read === true) {
                    hasPermition = true;
                }
            }

        }

        if (!hasPermition) {
            accordionData = {
                accordion: [{
                    customTitle: {
                        name: "core.views.TimpLibrary.libraryAccordionTitle",
                        data: {
                            title: i18n('INSUFFICIENT PRIVILEGES'),
                        }
                    }
                }]
            };
        } else {
            accordionData = {
                accordion: [{
                    customTitle: {
                        name: "core.views.TimpLibrary.libraryAccordionTitle",
                        data: {
                            title: i18n('DOCUMENT TYPE CONFIGURATION'),
                            iconFont: "File-and-Folders",
                            icon: "layout"
                        }
                    },
                    identifier: 'documentTypeConfig',
                    tooltip: i18n('CLICK PRESS') + ' ' + i18n('TO VIEW') + ' ' + i18n('DOCUMENT TYPE CONFIGURATION')
                }, {
                    customTitle: {
                        name: "core.views.TimpLibrary.libraryAccordionTitle",
                        data: {
                            title: i18n('FILE STORAGE'),
                            iconFont: "File-and-Folders",
                            icon: "archive"
                        }
                    },
                    identifier: 'fileStorage',
                    tooltip: i18n('CLICK PRESS') + ' ' + i18n('TO VIEW') + ' ' + i18n('FILE STORAGE')
                }, {
                    customTitle: {
                        name: "core.views.TimpLibrary.libraryAccordionTitle",
                        data: {
                            title: i18n('KEY FIELDS CONFIGURATION'),
                            iconFont: "Sign-and-Symbols",
                            icon: "key-68"
                        }
                    },
                    identifier: 'keyFieldsConfig',
                    tooltip: i18n('CLICK PRESS') + ' ' + i18n('TO VIEW') + ' ' + i18n('KEY FIELDS CONFIGURATION')
                }, {
                    customTitle: {
                        name: "core.views.TimpLibrary.libraryAccordionTitle",
                        data: {
                            title: i18n('STORAGE LOCATION CONFIGURATION'),
                            iconFont: "File-and-Folders",
                            icon: "docdrawer2"
                        }
                    },
                    identifier: 'storageLocationConfig',
                    tooltip: i18n('CLICK PRESS') + ' ' + i18n('TO VIEW') + ' ' + i18n('STORAGE LOCATION CONFIGURATION')
                }, {
                    customTitle: {
                        name: "core.views.TimpLibrary.libraryAccordionTitle",
                        data: {
                            title: i18n('DOCUMENT APPROVAL'),
                            iconFont: "File-and-Folders",
                            icon: "checkeddoc"
                        }
                    },
                    identifier: 'documentApproval',
                    tooltip: i18n('CLICK PRESS') + ' ' + i18n('TO VIEW') + ' ' + i18n('DOCUMENT APPROVAL')
                }, {
                    customTitle: {
                        name: "core.views.TimpLibrary.libraryAccordionTitle",
                        data: {
                            title: i18n('DOCUMENT CONSULTING'),
                            iconFont: "File-and-Folders",
                            icon: "docanalisis"
                        }
                    },
                    identifier: 'documentConsulting',
                    tooltip: i18n('CLICK PRESS') + ' ' + i18n('TO VIEW') + ' ' + i18n('DOCUMENT CONSULTING')
                }]
            };
        }

        // Change the accordion according to the permitions
        // _self.editAccordion(accordionData, privileges);

        _self.Library.Accordion.bindBaseAccordion(accordionData);

        //Color the permition background a light grey if it appears
        if (!hasPermition) {
            $(".accordion > li > .title").css("background-color", "gainsboro");
        }
    }
});