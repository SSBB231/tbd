try {
    //Config
    $.import('timp.tbd.server.models', 'config');
    this.config = $.timp.tbd.server.models.config;

    $.import('timp.tbd.server.install','install');
    this.install = $.timp.tbd.server.install.install;

    $.import('timp.tbd.server.models','documentTypeConfig');
    this.documentTypeConfig = $.timp.tbd.server.models.documentTypeConfig;
    
    $.import('timp.tbd.server.models','keyFieldsConfig');
    this.keyFieldsConfig = $.timp.tbd.server.models.keyFieldsConfig;
    
    $.import('timp.tbd.server.models','storageLocationConfiguration');
    this.storageLocationConfiguration = $.timp.tbd.server.models.storageLocationConfiguration;

    $.import('timp.tbd.server.models','fileStorage');
    this.fileStorage = $.timp.tbd.server.models.fileStorage;
    
    $.import('timp.tbd.server.models','documentApproval');
    this.documentApproval = $.timp.tbd.server.models.documentApproval;
    
    $.import('timp.tbd.server.models','documentConsulting');
    this.documentConsulting = $.timp.tbd.server.models.documentConsulting;
    
    $.import('timp.tbd.server.controllers','external');
    this.external = $.timp.tbd.server.controllers.external;
    
} catch (e) {
    this.componentActions = e;
}