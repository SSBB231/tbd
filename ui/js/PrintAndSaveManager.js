/*
Class in charge of printing or saving files
*/
function newPrintAndSaveManager() {

    var instance = {

        //Data members-------------------------------------------------------

        //Array of file objects
        allFiles: null,

        //Array of only selected files from the table row
        //Each file has the following properties
        /*
            rowId: id of the row within the Consulta de Documentos's table
            name: name of file, including its extension
            link: URL used to access file on backend server
            contents: reference to the file's contents. May be null
        */
        selectedFiles: null,

        //Instance of a FileFetcher
        fileFetcher: null,
        //End data members----------------------------------------------------

        //Constructor
        _init: function(){

            this.allFiles = [];
            this.selectedFiles = [];

            //
            this.fileFetcher = newFileFetcher(this.selectedFiles, this);
        },

        //Methods--------------------------------------------------------------------------------
        //Returns true if there were no files selected after calling applySelectionFilter
        noFiles: function() {
            return this.selectedFiles.length === 0;
        },

        //Adds only selected files, as represented by the ids array, to a separate array
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
        //Default is save as zip
        saveAllStrategy: {save: saveAsZip},

        //Adds file to the array of all files
        addFile: function(file){
            this.allFiles.push(file);
        },

        //Removes specified file from the allFiles array and the selectedFiles array
        removeFile: function(file){

            var index = this.allFiles.indexOf(file);

            //If index exists, use splice to remove from allFiles
            if(index > -1)
                this.allFiles.splice(index, 1);
            else
                console.log("No files removed. File was not in file list.");

            index = this.selectedFiles.indexOf(file);

            //If index exists, use splice to remove from selectedFiles
            if(index > -1)
                this.selectedFiles.splice(index, 1);
            else
                console.log("No files removed. File was not in file list.");
        },

        //Uses FileFetcher instance to fetch and save the files
        fetchAndSave: function(){
            this.fileFetcher.fetchFilesAndSave();
        },

        //Saves all files using the specified Strategy.
        //WARNING: Do not use this function directly but use fetchAndSave instead
        saveAllSelected: function(){
            this.saveAllStrategy.save(this.selectedFiles);
        },

        //Prints the specified file
        printFile: function(file){

            /*
            * Current implementation is for testing purposes
            * Will be changed.
            */

            var contents = "";

            if(file.contents !== null)
                contents = "Have Some STUFF";
            else
                contents = "Nope. Nothing fetched"

            console.log(`rowId: ${file.rowId}\nname: ${file.name}\nlink: ${file.link}\ncontents: ${contents}`);
        },

        //Uses FileFetcher to fetch files and print them out
        fetchAndPrint: function(){
            this.fileFetcher.fetchFilesAndPrint();
        },

        //Prints out each of the files
        //WARNING: Do not use this function directly. Instead, use fetchAndPrint
        printAllSelected: function(){

            var _self = this;
            _self.selectedFiles.forEach(function(file){
                _self.printFile(file);
            })
        }
        //End Methods--------------------------------------------------------------------------------
    };

    //Initialize instance
    instance._init();

    return instance;
}

//This function is the Strategy used to put all files together in a zip file
function saveAsZip(files){

    var zipFile = JSZip();

    files.forEach(function(file) {


        zipFile.toString();
        //
        // if (file.contents !== null)
        //     contents = "Have Some STUFF";
        // else
        //     contents = "Nope. Nothing fetched"
        //
        // console.log(`rowId: ${file.rowId}\nname: ${file.name}\nlink: ${file.link}\ncontents: ${contents}`);

    });
}

//This function is the strategy that saves each file as a separate request
//Instead of a package
function saveSeparately(files){

}

/*
This function represents the constructor of a "class" that asks the backend for files
Specified in its files list.
*/
function newFileFetcher(fileList, printerSaver) {

    //A new instance of this class
    var instance = {

        //Constructor
        _init: function() {

            this.setFileList(fileList);
            this.printerSaver = printerSaver;
        },

        //Fields-----------------------------------------------------------------
        //Array of only selected files from the table row
        //Each file has the following properties
        /*
            rowId: id of the row within the Consulta de Documentos's table
            name: name of file, including its extension
            link: URL used to access file on backend server
            contents: reference to the file's contents. May be null
        */
        files: null,

        //Reference to the PrinterSaver that this FileFetcher belongs to
        printerSaver: null,

        //This variable will reflect the current fetching state of the FileFetcher
        fetching: false,
        //Fields-----------------------------------------------------------------

        //This function sets the array that it will be working with
        setFileList: function(newFileList) {

            //If incoming argument is null, set an empty array
            if(fileList === null)
                this.files = [];
            else
                this.files = newFileList;
        },

        //This function returns the file id extracted from the file's URL
        extractFileId: function(link){

            //Split the URL by the "/" separator
            var splitLink = link.toString().split("/");

            //The next to last element of the array is the file id
            //example URL: timp/core/server/endpoint.xsjs/attachments/get/275/
            //Plus sign is to cast string to number
            return +splitLink[splitLink.length-2];
        },

        //Function will enter recursive call to get the files
        fetchFilesAndPrint: function(){

            //This condition prevents multiple requests that result from clicking download many times
            if(!this.fetching) {
                this.fetching = true;
                this.recursiveFetchFileForPrint(0);
            }
            else
                console.log("Already fetching");
        },

        //Recursive function that will download all files
        recursiveFetchFileForPrint: function(index) {

            //Reference to this
            var _self = this;

            //Base Case: if we reached past the last index in the array, printall and return
            if(index >= _self.files.length)
            {
                _self.fetching = false;
                _self.printerSaver.printAllSelected();
                return;
            }

            //If not base case, fetch specified index
            Data.endpoints.attach.get.get(_self.extractFileId(_self.files[index].link))
                .success(function(response){

                    console.log("Fetched in success callback");

                    //Upon receiving response, set the contents of the file
                    _self.setFileContents(_self.files[index], response);

                    //Use setTimeOut for recursive call to prevent stack overflow if too many files
                    setTimeout(_self.recursiveFetchFileForPrint(index+1), 0);
                })
                .error(function(response){

                    console.log("Fetched in error callback");

                    //Upon receiving response, set the contents of the file
                    _self.setFileContents(_self.files[index], response);

                    //Use setTimeOut for recursive call to prevent stack overflow if too many files
                    setTimeout(_self.recursiveFetchFileForPrint(index+1), 0);
                });

        },

        //Recursive function that will download all files
        recursiveFetchFileForSave: function(index){

             //Reference to this
            var _self = this;

            //Base Case: if we reached past the last index in the array, save all and return
            if(index >= _self.files.length)
            {
                _self.fetching = false;
                _self.printerSaver.saveAllSelected();
                return;
            }


            //If not base case, fetch file id from link of file with specified index, and call backend
            Data.endpoints.attach.get.get(_self.extractFileId(_self.files[index].link))
                .success(function(response){

                    console.log("Fetched in success callback");

                    //Upon receiving response, set the contents of the file
                    _self.setFileContents(_self.files[index], response);

                    //Use setTimeOut for recursive call to prevent stack overflow if too many files
                    setTimeout(_self.recursiveFetchFileForSave(index+1), 0);
                })
                .error(function(response){

                    console.log("Fetched in error callback");

                    //Upon receiving response, set the contents of the file
                    _self.setFileContents(_self.files[index], response);

                    //Use setTimeOut for recursive call to prevent stack overflow if too many files
                    setTimeout(_self.recursiveFetchFileForSave(index+1), 0);
                });
        },

        //Temporal
        fetchFilesAndSave: function(){

            //This condition prevents multiple requests that result from clicking download many times
            if(!this.fetching) {
                this.fetching = true;
                this.recursiveFetchFileForSave(0);
            }
            else
                console.log("Already fetching");
        },

        //Temporal
        setFileContents: function(file, contents){
            file.contents = contents;
        }
    };

    //Initialize instance
    instance._init();

    return instance;
}
