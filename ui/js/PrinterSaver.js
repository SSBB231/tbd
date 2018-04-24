/*
Clase que se encarga de salvar e imprimir archivos

TODO: Arreglar este archivo para que funcione solamente con los links
*/
function newPrinterSaver() {

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

        //Constructor
        _init: function(){

            this.allFiles = [];
            this.selectedFiles = [];
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
        },

        //Strategy to choose between save as zip and save one by one
        //Default is saveAsZip
        saveAllStrategy: {save: saveZip},

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

        //Downloads and stores the specified file on disk
        saveFile: function(file){
            //Nothing here for now
        },

        //Saves all files using the specified Strategy
        saveAllSelected: function(){
            this.saveAllStrategy.save(this.selectedFiles);
        },

        //Prints the specified file
        printFile: function(file){

            //This implementation is temporary
            var contents = "";

            if(file.contents !== null)
                contents = "Have Some STUFF";

            console.log(`rowId:\t${file.rowId}\nname:\t${file.name}\nlink:\t${file.link}\ncontents:\t${contents}\n\n`);
        },

        //TODO: Implement this
        printAllSelected: function(){}
    };

    //Call constructor
    instance._init();

    return instance;
}

//Function will create a zip package and prompt browser to download it
function saveZip(files){

    var zipGenerator = new JSZip();

    files.forEach(function(f){
        console.log(f);
    });
}

//Esta función descargará los archivos uno por uno
function saveSeparateFiles(files){
    //Nothing here for now
}

/*
This function represents the constructor of a class which asks for files from the backend

This function receives the list of files to fetch and a reference to a PrinterSaver that
will print or save them after they are fetched. This must be done because we choose not to
use Promises to synchronize events, but rather use the Data.endpoints callback construct
*/
function newFileFetchManager(fileList, printerSaver) {

    //Instance to be returned
    var instance = {

        //Constructor
        _init: function() {

            //
            this.setFileList(fileList);
            this.printerSaver = printerSaver;
        },

        //Daa members
        //File list
        //Each file has the following properties
        /*
            rowId: id of the row within the Consulta de Documentos's table
            name: name of file, including its extension
            link: URL used to access file from backend server
            contents: reference to the file's contents. May be null
        */
        files: null,

        //Reference to PrinterSaver instance
        printerSaver: null,

        //This function sets the array of files that it'll be working with
        setFileList: function(newFileList) {

            //If the aray is null, set an empty array
            if(fileList === null)
                this.files = [];
            else
                this.files = newFileList;
        },

        //This function returns the file id extracted from the file's URL
        extractFileNumber: function(link){

            //Split the URL by the "/" separator
            var splitLink = link.toString().split("/");

            //The next to last element of the array is the file id
            // example URL: timp/core/server/endpoint.xsjs/attachments/get/275/
            //Plus sign is to cast string to number
            return +splitLink[splitLink.length-2];
        },

        //Calls backend to get file
        fetchFile: function(file) {

            //Backend requires object with id property to return a file
            Data.endpoints.attach.get.get({
                id: this.extractFileNumber(file.link)
            })
            .success(function(response) {

                /*
                * Temporal implementation. Real one must iterate over file array and do calls.
                * To handle asynchronicity, must devise a workaround with a loop and a control variable
                * that will be incremented only within callback
                */

                //If fetch was successful,
                alert("SUCCESS");
                //Add contents to the file object
                this.setFileContents(file, response);
                //Ask PrinterSaver to print the data
                this.printerSaver.printAllSelected();
            })
            .error(function(e) {

                //Log error in console
                console.log(`Failed to fetch ${file.link}`);
                console.log("Details: " + e);
            });
        },

        //Temporal
        fetchFiles: function(){
            this.fetchFile(this.files[0]);
        },

        //Temporal
        setFileContents: function(file, contents){
            file.contents = contents;
            console.log(contents);
        }
    };

    instance._init();

    return instance;
}
