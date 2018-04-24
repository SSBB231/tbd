/*
Class in charge of printing or saving files
*/
function newPrintAndSaveManager() {

    var instance = {
        //Data members

        //Array of file objects
        allFiles: null,

        //Array of only selected files from the table row
        //Each file has the following properties
        /*
            rowId: id of the row within the Consulta de Documentos's table
            name: name of file, including its extension
            link: URL used to access file from backend server
            contents: reference to the file's contents. May be null
        */
        selectedFiles: null,

        //Instancia de un FileFetcher
        fileFetcher: null,

        //Constructor
        _init: function(){

            this.allFiles = [];
            this.selectedFiles = [];

            //
            this.fileFetcher = newFileFetcher(this.selectedFiles, this);
        },

        //Returns true if there were no files selected after calling applySelectionFilter
        noFiles: function() {
            return this.selectedFiles.length === 0;
        },

        //Adds only files selected, as represented by the ids array, to a separate array
        applySelectionFilter: function(ids){

            //Keep reference to this
            var _self = this;

            //We reempty the selectedFiles array
            _self.selectedFiles = [];

            //Iterate over the array of all files and add only the selected ones
            _self.allFiles.forEach(function(file) {
                if(ids.includes(file.rowId.toString())) {
                    _self.selectedFiles.push(file);
                }
            });

            //Give files to fileFetcher
            _self.fileFetcher.setFileList(_self.selectedFiles);
        },

        //Usa el patrón estrategia para cambiar entre salvar uno por uno y salvar en zip
        saveAllStrategy: {save: saveAsZip},

        //Agrega el archivo especificado al arreglo de archivos
        addFile: function(file){
            this.allFiles.push(file);
        },

        //Quita el archivo especificado del arreglo de archivos
        removeFile: function(file){

        },

        //Descarga y guarda el archivo especificado en la computadora
        saveFile: function(file){

        },

        //Descarga un zip de todos los archivos en el arreglo de archivos
        fetchAndSave: function(){
            this.fileFetcher.fetchFilesAndSave();
        },

        saveAllSelected: function(){},

        //Imprime el archivo especificado
        printFile: function(file){

            var contents = "";

            if(file.contents !== null)
                contents = "Have Some STUFF";

            console.log(`rowId:\t${file.rowId}\nname:\t${file.name}\nlink:\t${file.link}\ncontents:\t${contents}\n\n`);
        },

        //Imprime todos los archivos especificados
        fetchAndPrint: function(){
            this.fileFetcher.fetchFilesAndPrint();
        },

    };

    instance._init();

    return instance;
}

//Esta función descargará los archivos en un zip
function saveAsZip(files){
    file.forEach(function(file){

    });
}

//Esta función descargará los archivos uno por uno
function saveSeparately(files){

}

/*
Esta fución representa el constructor de una clase que se encarga de pedir el contenido de
archivos al BE
*/
function newFileFetcher(fileList, printerSaver) {

    //Instancia de la clase que se deolverá
    var instance = {

        //Constructor de la clase
        init() {

            this.setFileList(fileList);
            this.printerSaver = printerSaver;
        },

        //Datos miembro
        //Lista de archivos
        //Cada archivo es un objeto con las siguientes propiedades
        /*
            rowId: id de la fila a la que pertenece el archivo en la tabla de consulta de documentos en TBD
            name: nombre del archivo, incluyendo su extensión
            link: URL del backend donde se encuentra el archivo
            contents: referencia al contenido del archivo (usualmente binario)
        */
        files: null,

        printerSaver: null,

        //Esta función setea el arreglo de archivos con el que se trabajará
        setFileList(newFileList) {

            //Si el arreglo de archivos viene nulo, crear uno vacío
            if(fileList === null)
                this.files = [];
            else
                this.files = newFileList;
        },

        //Esta función
        extractFileNumber(link){

            //Partimos el URL para separar cada una de sus secciones
            var splitLink = link.toString().split("/");

            //El penúltimo elemento de este arreglo es el número de archivo
            // ejemplo: timp/core/server/endpoint.xsjs/attachments/get/275/
            //El + es para castear la cadena a un número
            return +splitLink[splitLink.length-2];
        },

        //Temporal
        fetchFilesAndPrint(){

            for(var index = 0; i < this.files.length; ) {

                Data.endpoints.attach.get.get({
                    id: this.extractFileNumber(file.link)
                })
                .success(function(response) {

                    this.setFileContents(file, response);

                    if(index === file.length-1) {
                        this.printerSaver.printAllSelected();
                    }

                    index++;
                })
                .error(function(response) {

                    this.setFileContents(file, response);

                    if(index === file.length-1) {
                        this.printerSaver.printAllSelected();
                    }

                    index++;
                });
            }
        },

        //Temporal
        fetchFilesAndSave(){

            for(var index = 0; i < this.files.length; ) {

                Data.endpoints.attach.get.get({
                    id: this.extractFileNumber(file.link)
                })
                    .success(function(response) {

                        this.setFileContents(file, response);

                        if(index === file.length-1) {
                            this.printerSaver.saveAllSelected();
                        }

                        index++;
                    })
                    .error(function(response) {

                        this.setFileContents(file, response);

                        if(index === file.length-1) {
                            this.printerSaver.saveAllSelected();
                        }

                        index++;
                    });
            }
        },

        //Temporal
        setFileContents(file, contents){
            file.contents = contents;
            console.log(contents);
        }
    };

    instance.init();

    return instance;
}
