$.import("timp.tbd.server.models", "documentTypeConfig");
$.import("timp.tbd.server.models", "keyFieldsConfig");
$.import('timp.tbd.server.models','storageLocationConfiguration');
$.import('timp.tbd.server.models','fileStorage');
$.import('timp.tbd.server.models','documentApproval');


this.models = [
	$.timp.tbd.server.models.documentTypeConfig.table,
	$.timp.tbd.server.models.keyFieldsConfig.table,
	$.timp.tbd.server.models.keyFieldsConfig.keyTable,
	$.timp.tbd.server.models.storageLocationConfiguration.table,
	$.timp.tbd.server.models.fileStorage.table,
	$.timp.tbd.server.models.fileStorage.tableEEF,
	$.timp.tbd.server.models.fileStorage.tableTax,
	$.timp.tbd.server.models.fileStorage.tableUsers,
	$.timp.tbd.server.models.fileStorage.tableGroups,
	$.timp.tbd.server.models.documentApproval.table
];