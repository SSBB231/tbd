sap.ui.controller("app.controllers.keyFieldsConfig.tab", {
	onInit: function() {},
	/*Content of this.getData:
		{
			index:<integer>,// index of the tab inside parentController.components.tabs
			parentController:<feriadoEditorRight controller>,
			text:<string>//text of the field
		}
	*/
	onDataRefactor: function(data) {
		$.extend(data, this.data);
	},
	onAfterRendering: function(html) {
		this._view = html;

		this._view.field = this._view.find(".field");

		this._view.deleteButton = this._view.find('.delete-icon');
		this._view.deleteButton.attr('tabindex', 0);
		this._view.addButton = this._view.find('.add-icon');
		this._view.addButton.attr('tabindex', 0);

		this.renderComponents();
		this.bindEvents();
	},
	renderComponents: function() {
		var _self = this;
		var data = this.getData();
		var opts = [];
		if (data.strucId) {
			$.each(data.data, function(idx, itm) {
				if (itm.id == data.strucId) {
					$.each(itm.fields, function(idx2, itm2) {
						opts.push({
							key: itm2.ID,
							name: sessionStorage.getItem('lang') === 'ptrbr' ? itm2.labelPT : itm2.labelEN
						})
					})
				}
			});
		}
		
		this.components = {};
		this.components.field = this._view.field.bindBaseAutocomplete({
			options: opts,
			placeholder: i18n('SELECT') + ' ' + i18n('KEYS'),
			tooltip: i18n('CLICK PRESS') + ' ' + i18n('TO SELECT') + ' ' + i18n('KEYS'),
			required: true,
			isDisabled: data.disabled,
			onChange: function(oldVal, newVal) {
				_self.coreServices.hasChanged = true;
				this.coreServices.keysData[data.index][data.field] = newVal;
				this.coreServices.keysData[data.index][data.field].structure = data.strucId;
			}
		});

		app.services.addComponent(this.components.field, data.field.toUpperCase());
	},

	bindEvents: function() {
		var _self = this;
		var data = this.getData();
		if (data.disabled) {
			return false;
		}
		this._view.addButton.bind("keyup", this._addTab.bind(this));
		this._view.addButton.bind("click", this._add.bind(this));
		this._view.addButton.baseTooltip({
			class: 'dark',
			position: 'top',
			text: i18n('TOOLTIP') + " " + i18n('ADD ' + data.field.toUpperCase())
		});
		this._view.deleteButton.bind("keyup", this._deleteTab.bind(this));
		this._view.deleteButton.bind("click", this._delete.bind(this));
		this._view.deleteButton.baseTooltip({
			class: 'dark',
			position: 'top',
			text: i18n('TOOLTIP') + " " + i18n('DELETE ' + data.field.toUpperCase())
		});
	},
	_addTab: function(evt) {
		var _self = this;
		var data = this.getData();
		var keycode = (evt.keyCode ? evt.keyCode : evt.which);
		if (keycode == undefined && (keycode != '13' || keycode != '9')) {
			return;
		}
		if (keycode && keycode == '13') {
			this._add();
		}
	},
	_add: function() {
		var _self = this;
		var data = this.getData();
		this.coreServices.keysCount++;
		this.coreServices.keysData[this.coreServices.keysCount] = {};
		if (Object.keys(data.parentController.components[data.field]).length < 100) {
			data.parentController.renderInput({
				field: data.field,
				data: data.data,
				strucId: data.strucId,
				info: data.info,
				disabled: data.disabled
			});
		}
		// if (Object.keys(data.parentController.components[data.field]).length < 100) {
		// 	data.parentController.renderInput(data.field,data.data, data.strucId);
		// }
	},
	_deleteTab: function(evt) {
		var _self = this;
		var data = this.getData();
		var keycode = (evt.keyCode ? evt.keyCode : evt.which);
		if (keycode == undefined && (keycode != '13' || keycode != '9')) {
			return;
		}
		if (keycode && keycode == '13') {
			this._delete();
		}
	},
	_delete: function() {
		var _self = this;
		var data = this.getData();
		delete this.coreServices.keysData[data.index];
		if (Object.keys(data.parentController.components[data.field]).length > 1) {
			data.parentController.components[data.field][data.index].ctrl._view.detach();
			delete data.parentController.components[data.field][data.index];
			//code to focus last input
			var keyCount = Object.keys(data.parentController.components[data.field]).length;
			var lastKey = Object.keys(data.parentController.components[data.field])[keyCount - 1];
			var lastTab = data.parentController.components[data.field][lastKey];
			lastTab.ctrl._view.field.find('input').focus();
		}
	},
	validate: function() {
		var _self = this;
		var isValid = true;
		//validate if it's empty
		if (!this.components.field.validate() || this.components.field.getText() === "") {
			isValid = false;
		}
		//validate if it has a repeated name with other tab
		var data = this.getData();
		var tabs = data.parentController.components[data.field];
		var repeated = Object.keys(tabs).filter(function(key) {
			if (Number(key) === data.index) {
				//just compare with other tabs, not with this
				return false;
			}
			return tabs[key].ctrl.components.field.getText() === _self.components.field.getText();
		});
		if (repeated.length > 0) {
			isValid = false;
		}
		if (!isValid) {
			this.components.field.showError();
		}
		return isValid;
	}
});