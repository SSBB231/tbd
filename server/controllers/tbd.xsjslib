$.import("timp.core.server.api", "api");
var coreApi = $.timp.core.server.api.api;
var corePrivileges = coreApi.privilegesController;

$.import("timp.tbd.server.models", "config");
var config = $.timp.tbd.server.models.config;
$.import('timp.tbd.server.controllers', 'privileges');
var privileges = $.timp.tbd.server.controllers.privileges;

this.getCoreData = function() {
	var object = {
		component: "TBD"
	};
	try {
		return corePrivileges.getCoreData(object);
	} catch (e) {
		return null;
	}
};

this.getVersion = function() {
	return config.version;
};

this.getPrivileges = function() {
	var priv = privileges.getAllPermissions();
	priv.version = this.getVersion();
	return priv;
};

this.alterTableTypes = function(){
    try{
        var SQL = coreApi.sql;
        var schema = coreApi.schema;
        var response = [];
        var errors = [];
        
        try{
            var r1 = SQL.EXECUTE({
                query: 'ALTER TABLE ' + schema.default + '."TBD::DocumentTypeConfig" ALTER (VALID_FROM DATE, VALID_TO DATE)'
            });
            response.push(r1);
        }catch(e){
            errors.push(e);
        }
        
        // try{
        //     var r2 = SQL.EXECUTE({
        //         query: 'ALTER TABLE ' + schema.default + '."TBD::DocumentSecurity" ALTER (VALID_FROM DATE, VALID_TO DATE)'
        //     });
        //     response.push(r2);
        // }catch(e){
        //     errors.push(e);
        // }
        
        try{
            var r3 = SQL.EXECUTE({
                query: 'ALTER TABLE ' + schema.default + '."TBD::KeyFieldsConfig" ALTER (VALID_FROM DATE, VALID_TO DATE)'
            });
            response.push(r3);
        }catch(e){
            errors.push(e);
        }
        
        try{
            var r4 = SQL.EXECUTE({
                query: 'ALTER TABLE ' + schema.default + '."TBD::StorageLocationConfiguration" ALTER (VALID_FROM DATE, VALID_TO DATE)'
            });
            response.push(r4);
        }catch(e){
            errors.push(e);
        }
        
        try{
            var r5 = SQL.EXECUTE({
                query: 'ALTER TABLE ' + schema.default + '."TBD::FileStorage" ALTER (VALID_FROM DATE, VALID_TO DATE)'
            });
            response.push(r5);
        }catch(e){
            errors.push(e);
        }
        
        try{
            var r6 = SQL.EXECUTE({
                query: 'ALTER TABLE ' + schema.default + '."TBD::DocumentApproval" ALTER (VALID_FROM DATE, VALID_TO DATE)'
            });
            response.push(r6);
        }catch(e){
            errors.push(e);
        }
        
        return {
            success:response,
            errors:errors
        };
    }catch (e){
        return {error:e};
    }
    
};
