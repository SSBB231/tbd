//general configurations
this.version = '1.10.7';

this.hasError = function() {
    return $.messageCodes.length > 0;
};

//atribuir determinados valores default para o response:
// type: notPermission - bloquear usuário sem permissão
//       objectVerify  - má formação no objeto enviado pela url
// e: informações sobre o erro retornado pelo try - catch
this.setResponse = function(type, e) {
    switch (type) {
        case 'notPermission':
            e = 'No permission.';
            $.messageCodes.push({
                code: 'TBD201002',
                type: 'E',
                errorInfo: e
            });
            $.response.status = 401;
            break;
    }
    return true;
};