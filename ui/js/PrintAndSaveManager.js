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

        //Instance of a FileFetcher
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

        //Strategy pattern used to choose between saving as zip or separately
        saveAllStrategy: {save: saveAsZip},

        //Adds file to the array of all files
        addFile: function(file){
            this.allFiles.push(file);
        },

        //Removes specified file from the array
        removeFile: function(file){
            var index = this.allFiles.indexOf(file);

            if(index > -1)
                this.allFiles.splice(index, 1);
            else
                console.log("No files removed. File was not in file list.");
        },

        //Descarga un zip de todos los archivos en el arreglo de archivos
        fetchAndSave: function(){
            this.fileFetcher.fetchFilesAndSave();
        },

        //Saves all files using the specified Strategy.
        //WARNING: Do not use this function directly but use fetchAndSave instead
        saveAllSelected: function(){
            this.saveAllStrategy.save(this.selectedFiles);
        },

        //Imprime el archivo especificado
        printFile: function(file){

            var contents = "";

            if(file.contents !== null)
                contents = "Have Some STUFF";
            else
                contents = "Nope. Nothing fetched"

            console.log(`rowId: ${file.rowId}\nname: ${file.name}\nlink: ${file.link}\ncontents: ${contents}`);
        },

        //Imprime todos los archivos especificados
        fetchAndPrint: function(){
            this.fileFetcher.fetchFilesAndPrint();
        },

        printAllSelected: function(){

            var _self = this;
            _self.selectedFiles.forEach(function(file){
                _self.printFile(file);
            })
        }

    };

    instance._init();

    return instance;
}

//Esta función descargará los archivos en un zip
function saveAsZip(files){
    files.forEach(function(file) {

        var contents = "";

        if (file.contents !== null)
            contents = "Have Some STUFF";
        else
            contents = "Nope. Nothing fetched"

        console.log(`rowId: ${file.rowId}\nname: ${file.name}\nlink: ${file.link}\ncontents: ${contents}`);
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
        _init: function() {

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
        setFileList: function(newFileList) {

            //Si el arreglo de archivos viene nulo, crear uno vacío
            if(fileList === null)
                this.files = [];
            else
                this.files = newFileList;
        },

        //Esta función
        extractFileNumber: function(link){

            //Partimos el URL para separar cada una de sus secciones
            var splitLink = link.toString().split("/");

            //El penúltimo elemento de este arreglo es el número de archivo
            // ejemplo: timp/core/server/endpoint.xsjs/attachments/get/275/
            //El + es para castear la cadena a un número
            return +splitLink[splitLink.length-2];
        },

        //Temporal
        fetchFilesAndPrint: function(){
            this.recursiveFetchFileForPrint(0);
        },

        //Recursive function that will download all files
        recursiveFetchFileForPrint: function(index){

            //Base Case: if we reached past the last index in the array, printall and return
            if(index >= this.files.length)
            {
                this.printerSaver.printAllSelected();
                return;
            }

            //Reference to this
            var _self = this;

            //If not base case, fetch specified index
            Data.endpoints.attach.get.get(_self.extractFileNumber(_self.files[index].link))
                .success(function(response){

                    //Upon receiving response, set the contents of the file
                    _self.setFileContents(_self.files[index], response);

                    //Use setTimeOut for recursive call to prevent stack overflow if too many files
                    setTimeout(_self.recursiveFetchFileForPrint(index+1), 0);
                })
                .error(function(response){

                    //Upon receiving response, set the contents of the file
                    _self.setFileContents(_self.files[index], response);

                    //Use setTimeOut for recursive call to prevent stack overflow if too many files
                    setTimeout(_self.recursiveFetchFileForPrint(index+1), 0);
                });

        },

        //Recursive function that will download all files
        recursiveFetchFileForSave: function(index){

            //Base Case: if we reached past the last index in the array, printall and return
            if(index >= this.files.length)
            {
                this.printerSaver.saveAllSelected();
                return;
            }

            //Reference to this
            var _self = this;

            //If not base case, fetch specified index
            Data.endpoints.attach.get.get(_self.extractFileNumber(_self.files[index].link))
                .success(function(response){

                    //Upon receiving response, set the contents of the file
                    _self.setFileContents(_self.files[index], response);

                    //Use setTimeOut for recursive call to prevent stack overflow if too many files
                    setTimeout(_self.recursiveFetchFileForSave(index+1), 0);
                })
                .error(function(response){

                    //Upon receiving response, set the contents of the file
                    _self.setFileContents(_self.files[index], response);

                    //Use setTimeOut for recursive call to prevent stack overflow if too many files
                    setTimeout(_self.recursiveFetchFileForSave(index+1), 0);
                });
        },

        //Temporal
        fetchFilesAndSave: function(){
            this.recursiveFetchFileForSave(0);
        },

        //Temporal
        setFileContents: function(file, contents){
            file.contents = contents;
        }
    };

    instance._init();

    return instance;
}
