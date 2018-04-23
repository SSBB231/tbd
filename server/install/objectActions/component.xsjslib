$.import('timp.core.server.api', 'api');
const coreApi = $.timp.core.server.api.api;

this.component = {
	name: "TBD",
	version: coreApi.systemVersion,
	description: "Tax Business Documents",
	objectTypesActions: {
		"TBD::DocumentTypeConfig": ["create", "read", "update", "delete"],
		"TBD::KeyFieldsConfig": ["create", "read", "update", "delete"],
		"TBD::StorageLocationConfiguration": ["create", "read", "update", "delete"],
		"TBD::FileStorage": ["create", "read", "update", "delete"],
		"TBD::DocumentApproval": ["create", "read", "update", "delete"]
	},
	apps: [{
		name: "Tax Business Documents",
		url: "/timp/tbd/",
		icon: "clippeddoc",
		background: "#4F4F4F",
		iconfont: "File-and-Folders",
		description: "Tax Business Documents",
		usLabel: "Tax Business Documents",
	    brLabel: "Gestor de Documentos",
		privileges: [
		{
				name: "Access",
				description: "Permissão para acessar o TBD",
				descriptionPtBr: "Permissão para acessar o TBD",
				descriptionEnUs: "Permission to access to TBD",
				role: "timp.core.server.role::TBD.Access"
        }, {
				name: "DocumentTypeConfig.create",
				description: "Permissão para criar um registro na tabela de Configuração de Tipo de Documento",
				descriptionPtBr: "Permissão para criar um registro na tabela de Configuração de Tipo de Documento",
				descriptionEnUs: "Permission to create a record in the Document Type Configuration Table",
				role: "timp.core.server.role::TBD.DocumentTypeConfig.create"
        }, {
				name: "DocumentTypeConfig.read",
				description: "Permissão para ler um registro na tabela de Configuração de Tipo de Documento",
				descriptionPtBr: "Permissão para ler um registro na tabela Configuração de Tipo de Documento",
				descriptionEnUs: "Permission to read a record in the Document Type Configuration Table",
				role: "timp.core.server.role::TBD.DocumentTypeConfig.read"
        }, {
				name: "DocumentTypeConfig.update",
				description: "Permissão para atualizar um registro na tabela de Configuração de Tipo de Documento",
				descriptionPtBr: "Permissão para atualizar um registro na tabela de Configuração de Tipo de Documento",
				descriptionEnUs: "Permission to update a record in the Document Type Configuration Table",
				role: "timp.core.server.role::TBD.DocumentTypeConfig.update"
        }, {
				name: "DocumentTypeConfig.delete",
				description: "Permissão para excluir um registro na tabela de Configuração de Tipo de Documento",
				descriptionPtBr: "Permissão para excluir um registro na tabela de Configuração de Tipo de Documento",
				descriptionEnUs: "Permission to delete a record in the Document Type Configuration Table",
				role: "timp.core.server.role::TBD.DocumentTypeConfig.delete"
        } , {
				name: "KeyFieldsConfig.create",
				description: "Permissão para criar um registro na tabela de Configuração de Campos Chaves",
				descriptionPtBr: "Permissão para criar um registro na tabela de Configuração de Campos Chaves",
				descriptionEnUs: "Permission to create a record in the Document Security Classification Table",
				role: "timp.core.server.role::TBD.KeyFieldsConfig.create"
        }, {
				name: "KeyFieldsConfig.read",
				description: "Permissão para ler um registro na tabela de Configuração de Campos Chaves",
				descriptionPtBr: "Permissão para ler um registro na tabela Configuração de Campos Chaves",
				descriptionEnUs: "Permission to read a record in the Key Fields Configuration Table",
				role: "timp.core.server.role::TBD.KeyFieldsConfig.read"
        }, {
				name: "KeyFieldsConfig.update",
				description: "Permissão para atualizar um registro na tabela de Configuração de Campos Chaves",
				descriptionPtBr: "Permissão para atualizar um registro na tabela de Configuração de Campos Chaves",
				descriptionEnUs: "Permission to update a record in the Key Fields Configuration Table",
				role: "timp.core.server.role::TBD.KeyFieldsConfig.update"
        }, {
				name: "KeyFieldsConfig.delete",
				description: "Permissão para excluir um registro na tabela de Configuração de Campos Chaves",
				descriptionPtBr: "Permissão para excluir um registro na tabela de Configuração de Campos Chaves",
				descriptionEnUs: "Permission to delete a record in the Key Fields Configuration Table",
				role: "timp.core.server.role::TBD.KeyFieldsConfig.delete"
        }, {
				name: "StorageLocationConfig.create",
				description: "Permissão para criar um registro na tabela de Configuração de Local de Armazenamento",
				descriptionPtBr: "Permissão para criar um registro na tabela de Configuração de Local de Armazenamento",
				descriptionEnUs: "Permission to create a record in the Document Type Configuration Table",
				role: "timp.core.server.role::TBD.StorageLocationConfig.create"
        }, {
				name: "StorageLocationConfig.read",
				description: "Permissão para ler um registro na tabela de Configuração de Local de Armazenamento",
				descriptionPtBr: "Permissão para ler um registro na tabela de Configuração de Local de Armazenamento",
				descriptionEnUs: "Permission to read a record in the Storage Location Configuration Table",
				role: "timp.core.server.role::TBD.StorageLocationConfig.read"
        }, {
				name: "StorageLocationConfig.update",
				description: "Permissão para atualizar um registro na tabela de Configuração de Local de Armazenamento",
				descriptionPtBr: "Permissão para atualizar um registro na tabela de Configuração de Local de Armazenamento",
				descriptionEnUs: "Permission to update a record in the Storage Location Configuration Table",
				role: "timp.core.server.role::TBD.StorageLocationConfig.update"
        }, {
				name: "StorageLocationConfig.delete",
				description: "Permissão para excluir um registro na tabela de Configuração de Local de Armazenamento",
				descriptionPtBr: "Permissão para excluir um registro na tabela de Configuração de Local de Armazenamento",
				descriptionEnUs: "Permission to delete a record in the Storage Location Configuration Table",
				role: "timp.core.server.role::TBD.StorageLocationConfig.delete"
        }, {
				name: "FileStorage.create",
				description: "Permissão para criar um registro na tabela de Armazenagem de Documentos",
				descriptionPtBr: "Permissão para criar um registro na tabela de Armazenagem de Documentos",
				descriptionEnUs: "Permission to create a record in the File Storage Table",
				role: "timp.core.server.role::TBD.FileStorage.create"
        }, {
				name: "FileStorage.read",
				description: "Permissão para ler um registro na tabela de Armazenagem de Documentos",
				descriptionPtBr: "Permissão para ler um registro na tabela de Armazenagem de Documentos",
				descriptionEnUs: "Permission to read a record in the File Storage Table",
				role: "timp.core.server.role::TBD.FileStorage.read"
        }, {
				name: "FileStorage.update",
				description: "Permissão para atualizar um registro na tabela de Armazenagem de Documentos",
				descriptionPtBr: "Permissão para atualizar um registro na tabela de Armazenagem de Documentos",
				descriptionEnUs: "Permission to update a record in the File Storage Table",
				role: "timp.core.server.role::TBD.FileStorage.update"
        }, {
				name: "FileStorage.delete",
				description: "Permissão para excluir um registro na tabela de Armazenagem de Documentos",
				descriptionPtBr: "Permissão para excluir um registro na tabela de Armazenagem de Documentos",
				descriptionEnUs: "Permission to delete a record in the File Storage Table",
				role: "timp.core.server.role::TBD.FileStorage.delete"
        },{
				name: "DocumentApproval.create",
				description: "Permissão para criar um registro na tabela de Aprovação de Documentos",
				descriptionPtBr: "Permissão para criar um registro na tabela de Aprovação de Documentos",
				descriptionEnUs: "Permission to create a record in the Document Approval Table",
				role: "timp.core.server.role::TBD.DocumentApproval.create"
        }, {
				name: "DocumentApproval.read",
				description: "Permissão para ler um registro na tabela de Aprovação de Documentos",
				descriptionPtBr: "Permissão para ler um registro na tabela de Aprovação de Documentos",
				descriptionEnUs: "Permission to read a record in the Document Approval Table",
				role: "timp.core.server.role::TBD.DocumentApproval.read"
        }, {
				name: "DocumentApproval.update",
				description: "Permissão para atualizar um registro na tabela de Aprovação de Documentos",
				descriptionPtBr: "Permissão para atualizar um registro na tabela de Aprovação de Documentos",
				descriptionEnUs: "Permission to update a record in the Document Approval Table",
				role: "timp.core.server.role::TBD.DocumentApproval.update"
        }, {
				name: "DocumentApproval.delete",
				description: "Permissão para excluir um registro na tabela de Aprovação de Documentos",
				descriptionPtBr: "Permissão para excluir um registro na tabela de Aprovação de Documentos",
				descriptionEnUs: "Permission to delete a record in the Document Approval Table",
				role: "timp.core.server.role::TBD.DocumentApproval.delete"
        }, {
				name: "DocumentApproval.execute",
				description: "Permissão para executar um registro na tabela de Aprovação de Documentos",
				descriptionPtBr: "Permissão para executar um registro na tabela de Aprovação de Documentos",
				descriptionEnUs: "Permission to executar a record in the Document Approval Table",
				role: "timp.core.server.role::TBD.DocumentApproval.execute"
        }, {
				name: "DocumentConsulting.read",
				description: "Permissão para ler um registro na tabela de Consultoria de Documentos",
				descriptionPtBr: "Permissão para ler um registro na tabela de Consultoria de Documentos",
				descriptionEnUs: "Permission to read a record in the Document Consulting Table",
				role: "timp.core.server.role::TBD.DocumentConsulting.read"
        }
        ]
    }]
};