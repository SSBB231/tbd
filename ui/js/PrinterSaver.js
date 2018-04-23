/*
Clase que se encarga de salvar e imprimir archivos

TODO: Arreglar este archivo para que funcione solamente con los links
*/
function newPrinterSaver() {

    var instance = {
        //Datos miembro

        //Arreglo que contiene la información de los archivos a salvar o a imprimir
        allFiles: null,

        //Arreglo de solamente los archivos seleccionados de la tabla
        //Cada archivo es un objeto con las siguientes propiedades
        /*
            rowId: id de la fila a la que pertenece el archivo en la tabla de consulta de documentos en TBD
            name: nombre del archivo, incluyendo su extensión
            link: URL del backend donde se encuentra el archivo
            contents: referencia al contenido del archivo (usualmente binario)
        */
        selectedFiles: null,

        //Instancia de un FileFetcher
        fileFetcher: null,

        //Constructor de la clase
        _init(){

            this.allFiles = [];
            this.selectedFiles = [];
        },

        noFiles() {
            return this.selectedFiles.length === 0;
        },

        //Función que manda el controlador de la tabla a este objeto
        apllySelectionFilter(ids){

            //Hacer referencia a this
            var _self = this;

            //Eliminamos todos los filtrados archivos ya guardados
            _self.selectedFiles = [];

            //Recorremos el arreglo de todos los archivos y agregamos solo aquellos
            //cuyos rowId se encuentra dentro de los id's de las filas seleccionadas
            _self.allFiles.forEach(function(file) {
                if(ids.includes(file.rowId.toString())) {
                    _self.selectedFiles.push(file);
                }
            });

            //Setear la lista con la que trabajará el FileFetcher
            _self.fileFetcher.setFileList(_self.selectedFiles);
        },

        //Usa el patrón estrategia para cambiar entre salvar uno por uno y salvar en zip
        saveAllStrategy: {save: saveAsZip},

        //Agrega el archivo especificado al arreglo de archivos
        addFile(file){
            this.allFiles.push(file);
        },

        //Quita el archivo especificado del arreglo de archivos
        removeFile(file){

        },

        //Descarga y guarda el archivo especificado en la computadora
        saveFile(file){

        },

        //Descarga un zip de todos los archivos en el arreglo de archivos
        saveAllSelected(){
            this.saveAllStrategy.save(this.selectedFiles);
        },

        //Imprime el archivo especificado
        printFile(file){

            var contents = "";

            if(file.contents !== null)
                contents = "Have Some STUFF";

            console.log(`rowId:\t${file.rowId}\nname:\t${file.name}\nlink:\t${file.link}\ncontents:\t${contents}\n\n`);
        },

        //Imprime todos los archivos especificados
        printAllSelected(){
            this.selectedFiles.forEach((file)=>this.printFile(file));
        },

        fetchFilesFromBackend(){
            this.fileFetcher.fetchFiles();
        }
    };

    instance._init();

    return instance;
}

//Esta función descargará los archivos en un zip
function saveZip(files){

    var zipGenerator = new JSZip();

    files.forEach(f=>console.log(f));
}

//Esta función descargará los archivos uno por uno
function saveSeparateFiles(files){

}

/*
Esta fución representa el constructor de una clase que se encarga de pedir el contenido de
archivos al BE
*/
function newFileFetchManager(fileList, printerSaver) {

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

        //Llama al BE para que devuelva el contenido del archivo mandado como argumento
        fetchFile(file) {

            Data.endpoints.attach.get.get({
                id: this.extractFileNumber(file.link)
            })
                .success((response)=>{
                    alert("SUCCESS");
                    this.setFileContents(file, response);
                    this.printerSaver.printAllSelected();
                })
                .error((e)=>{
                    console.log(`Failed to fetch ${file.link}`);
                    console.log("Details: " + e);
                });

            // this.printerSaver.printAllSelected();
        },

        //Temporal
        fetchFiles(){
            this.fetchFile(this.files[0]);
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
