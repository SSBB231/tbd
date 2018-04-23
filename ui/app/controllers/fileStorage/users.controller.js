sap.ui.controller("app.controllers.fileStorage.users", {
	onInit: function() {},
	onAfterRendering: function(html) {
		var _self = this;
		this.view = $(html);
		this.view.table = this.view.find('#usersTable');
        
		_self.loadList();
	},

	loadList: function(bodyData) {
		var _self = this;
		var body = [];
    
        Data.endpoints.fileStorage.listUsers.post({}).success(function(data) {
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
			text: i18n('USERNAME'),
			sort: true,
			resizable: true,
			width: "70px",
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
    						element.hanaName
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
		$("input[data-id='" + _self.loggedUser.id + "']").prop('checked', true);
		$("input[data-id='" + _self.loggedUser.id + "']").prop('disabled', true);
		var loadData = _self.getData();
		var setData = loadData.data;
		if(setData && setData.users){
		    for(var i =0; i < setData.users.length; i++){
		        $('div').find("[data-id='" + setData.users[i].idUser + "'] input:checkbox").prop("checked", true);
		    }
		}
	}

});