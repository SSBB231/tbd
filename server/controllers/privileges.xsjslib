 $.import("timp.core.server.api","api");
var core_api = $.timp.core.server.api.api;
var util = core_api.util;
var corePrivileges = core_api.privilegesController;

this.getUserPriv = function(){
    var listOfPrivileges  = corePrivileges.permissionJsonges('TBD');
    var response =  listOfPrivileges;
    return response;
};

var Permission = function(){
	return{
	    "metadata":{
	        "userId":"",
	        "hanaUser":"",
	        "name":"",
	        "lastname":""
	    }
	};
};

// SECONDARY FUNCTIONS

this.getListOfNames = function(resultGetUserPrivileges){
    
    //return 'oooioioioio';
    
    var numerOfPermissions = Object.keys(resultGetUserPrivileges).length;
    var listPriviliegesName = [];
    
    
    if(numerOfPermissions === 0){
        return listPriviliegesName;
    }
    
    for (var idPrivilege in resultGetUserPrivileges) {
        listPriviliegesName.push(resultGetUserPrivileges[idPrivilege]['privilegeName']);
    }
    
    return listPriviliegesName;
};


// runs the permission list for the user and checks whether it can proceed.
this.verifyPermissionFor = function(namePermision){
	var listOfPrivileges  = corePrivileges.getUserPrivileges('TBD');
	var permisionsForThisUser = this.getListOfNames(listOfPrivileges);
	var result = permisionsForThisUser.indexOf(namePermision);
	
	if(result > -1 ){
		return true;
	}else{
		return false;
	}

};

//verify the result of the permission and set the status for each response
this.verifyPermissionToAccess = function(access){
	if(access){
		 $.response.status = 200;
		 return true;
	}else{
	     $.response.status = 401;
	     
	     return false;
	}
};

this.getAllPermissions = function(){

	var privileges = corePrivileges.getComponentPrivileges('TBD');
    return privileges;

};

