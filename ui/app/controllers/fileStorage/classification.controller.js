sap.ui.controller("app.controllers.fileStorage.classification", {
    onInit: function() {},
	onAfterRendering: function(html) {
		var _self = this;
		this.view = $(html);
		this.view.tabs = this.view.find('#tabs');
        console.log(_self.getData())
        this.loader = this.view.tabs.baseLoader({
			modal: true
		});
		this.coreServices.addComponent(this.loader, 'loader');
// 		this.loader.open();
		
		_self.renderTabs();
	},

    renderTabs: function() {
		var _self = this;
		_self.tabs = this.view.tabs.bindBaseTabs({
			tab: [{
				title: i18n('USERS'),
				icon: "",
				iconColor: "white",
				iconFont: "File-and-Folders",
				viewName: "app.views.fileStorage.users",
				viewData: {
                    data: _self.getData() ? _self.getData().data : []
                },
				tooltip: i18n('CLICK PRESS') + ' ' + i18n('TO VIEW') + ' ' + i18n('USERS'),
				bgColor: ""
      }, {
				title: i18n('USER GROUPS'),
				icon: "",
				iconColor: "white",
				iconFont: "File-and-Folders",
				viewName: "app.views.fileStorage.groups",
				viewData: {
                    data: _self.getData() ? _self.getData().data : []
                },
				tooltip: i18n('CLICK PRESS') + ' ' + i18n('TO VIEW') + ' ' + i18n('GROUPS'),
				bgColor: ""
      }],
			type: "boxes",
			wrapperClass: "wrapperClass",
			tabClickCallback: function() {
				// if (_self.tabs.getSelected().index == 2)
				// 	_self.coreServices.renderTableAdjustment(_self.coreServices.getAdjustments());
				// else if (_self.tabs.getSelected().index == 1)
				// 	_self.coreServices.renderTableObrigation(_self.coreServices.getObrigations());
			}
		});
		this.view.find('.baseTabs-wrapper .baseTabs-view-wrapper').addClass('visibleScroll');
		// this.tabs.disableTab(1);
        // this.coreServices.addComponent(this.tabs, 'tabs');
	}
});