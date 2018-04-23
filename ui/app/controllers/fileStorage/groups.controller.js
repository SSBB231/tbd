sap.ui.controller("app.controllers.fileStorage.groups", {
		onInit: function() {},
	onAfterRendering: function(html) {
		var _self = this;
		this.view = $(html);
		this.view.table = this.view.find('#groupsTable');

		_self.loadList();
	},

	loadList: function(bodyData) {
		var _self = this;
		var body = [];
    
        Data.endpoints.fileStorage.listGroups.post({}).success(function(data) {
            _self.renderTable(data);
        });
	}, 
	
	renderTable: function(data) {
		var _self = this;
		
		var headers = [{ 
			text: i18n('NAME'),
			sort: true,
			resizable: true,
			width: "100px",
			type: "text"
		}, {
			text: i18n('DESCRIPTION'),
			sort: true,
			resizable: true,
			width: "100px",
			type: "center"
		}];
		var body = [];
		if (data && data.errorMsg === undefined) {
		    if(data && data.length > 0){
		        data.forEach(function(element, i) {
    				body.push({
    					actions: [],
    					id: element.id,
    					content: [
    						element.name,
    						element.description ? element.description : '—'
    					]
    				});
    			});
		    }
			
		}
		
		this.view.table.empty();
		this.view.table = this.view.table.bindBaseTable({
			hasActions: false,
			hasCheckboxes: true,
			hasFlags: false,
			flags: [],
			headers: headers,
			body: body
		});
// 		$(".th.checkbox-header").css("visibility", "hidden");
// 		$('input.checkbox').on('change', function() {
// 			$('input.checkbox').not(this).prop('checked', false);
// 		});
		if (body.length === 0) {
			$(this.view).find('.tr-no-data').css('width', '100%');
			$(this.view).find('.tr-no-data').show();
		}
		$(".tr").css("width", "97%");
		
		var loadData = _self.getData();
		var setData = loadData.data;
		if(setData && setData.groups){
		    for(var i =0; i < setData.groups.length; i++){
		        $('div').find("[data-id='" + setData.groups[i].idGroup + "'] input:checkbox").prop("checked", true);
		    }
		}
	}

});