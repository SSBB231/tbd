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

        pageDimensions: null,
        //End data members----------------------------------------------------

        //Constructor
        _init: function(){

            this.allFiles = [];
            this.selectedFiles = [];

            //These are in px. We can subtract 2 inches (must convert to pixels) from each to account for margins
            this.pageDimensions = {width: 595, height: 842};

            //
            this.fileFetcher = newFileFetcher(this.selectedFiles, this);
        },

        //Methods--------------------------------------------------------------------------------
        //Returns true if there were no files selected after calling applySelectionFilter
        noFiles: function() {
            return this.selectedFiles.length === 0;
        },

        setFFLoader: function(loader){
            this.fileFetcher.setLoader(loader);
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
        printFile: function(file) {

            //Check if image
            if (this.isImageExtension(file.extension)) {
                this.printImageOnPDF(file);
            }
            else if (file.extension === "txt") //Just add the text
            {
                this.printTextOnPDF(file);
            }
            else if (this.isOtherSupportedMedia(file.extension))
            {
                //Other formats that are supported

            }

        },

        isOtherSupportedMedia: function(fileExtension) {
            var otherExtensions = ["pdf"];
        },

        printiFrameOnPDF: function(file) {

            //No need for a jsPDF instance, will use iFrame to do the printing
            var _self = this;

            //Create an image HTML element
            var iframe = document.createElement("iframe");
            iframe.setAttribute("id", "myiFrame");

            iframe.onload = function(){

                //Adding image to DOM is not necessary
                // document.body.appendChild(img);

                //Create canvas and append it to main HTML body
                $("body").append('<canvas id=\'myCanvas\' width=' + iframe.naturalWidth + 'px; height=' + iframe.naturalHeight + 'px></canvas>');

                //Ge canvas reference
                var c = document.getElementById("myCanvas");
                //Extract context2D
                var ctx = c.getContext("2d");

                //Draw image on context
                ctx.drawImage(iframe, 0, 0, iframe.naturalWidth, iframe.naturalHeight);
                //Add image to PDF, utilize transform to CM

                var newDimensions = null;

                //Resizing image to 100% of writable area in PDF
                if(iframe.naturalWidth >= _self.pageDimensions.width)
                {
                    newDimensions = _self.resizeOnWidth(iframe.naturalWidth, iframe.naturalHeight, 1);
                }

                //If still doesn't fit, resize again on height
                if(newDimensions.height >= _self.pageDimensions.height)
                {
                    newDimensions = _self.resizeOnHeight(newDimensions.width, newDimensions.height, 1);
                }

                //2.54 is the one inch margin
                pdf.addImage(c.toDataURL(), 'PNG', 0, 0, _self.pxToCM(newDimensions.width), _self.pxToCM(newDimensions.height), 'headerImage');
                //Remove canvas from HTML body
                document.getElementById("myCanvas").remove();

                //No adding, no removing
                // document.getElementById("myimg").remove();

                //This will prompt user for printing as soon as he clicks on file
                pdf.autoPrint();
                //This saves the file to disk. Somewhat undesirable, but necessary for now
                pdf.save();
            };

            //Set image source to prompt download
            iframe.setAttribute("src", (_self.prepareLink(file.link)));
        },

        printTextOnPDF: function(file){

            //Instantiate jsPDF, orientation: portrait, units: inches, format: A4 Letter
            var pdf = jsPDF('p', 'cm', 'a4');

            var size = file.contents.length;

            const maxNumChars = 2300;

            //Will only allow 2300 characters within one page
            var numberOfPages = size/maxNumChars;
            var extraPage = size % maxNumChars ? true : false;

            var page = 1;
            for(; page <= numberOfPages; page++) {

                if(page > 1)
                    pdf.addPage();

                pdf.text(2.54, 2.54, file.contents.substring(page-1*maxNumChars, maxNumChars*page));
            }

            if(extraPage) {
                pdf.addPage();
                pdf.text(2.54, 2.54, file.contents.substring(page-1*maxNumChars));
            }

            pdf.autoPrint();
            pdf.save();
        },

        printImageOnPDF: function(file) {

            //Instantiate jsPDF, orientation: portrait, units: inches, format: A4 Letter
            var pdf = jsPDF('p', 'cm', 'a4');

            var _self = this;

            //Create an image HTML element
            var img = document.createElement("IMG");
            img.setAttribute("id", "myimg");
            img.onload = function(){

                //Adding image to DOM is not necessary
                // document.body.appendChild(img);

                //Create canvas and append it to main HTML body
                $("body").append('<canvas id=\'myCanvas\' width=' + img.naturalWidth + 'px; height=' + img.naturalHeight + 'px></canvas>');

                //Ge canvas reference
                var c = document.getElementById("myCanvas");
                //Extract context2D
                var ctx = c.getContext("2d");

                //Draw image on context
                ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);
                //Add image to PDF, utilize transform to CM

                var newDimensions = null;

                //Resizing image to 100% of writable area in PDF
                if(img.naturalWidth >= _self.pageDimensions.width)
                {
                    newDimensions = _self.resizeOnWidth(img.naturalWidth, img.naturalHeight, 1);
                }

                //If still doesn't fit, resize again on height
                if(newDimensions.height >= _self.pageDimensions.height)
                {
                    newDimensions = _self.resizeOnHeight(newDimensions.width, newDimensions.height, 1);
                }

                //2.54 is the one inch margin
                pdf.addImage(c.toDataURL(), 'PNG', 0, 0, _self.pxToCM(newDimensions.width), _self.pxToCM(newDimensions.height), 'headerImage');
                //Remove canvas from HTML body
                document.getElementById("myCanvas").remove();

                //No adding, no removing
                // document.getElementById("myimg").remove();

                //This will prompt user for printing as soon as he clicks on file
                pdf.autoPrint();
                //This saves the file to disk. Somewhat undesirable, but necessary for now
                pdf.save();
            };

            //Set image source to prompt download
            img.setAttribute("src", (_self.prepareLink(file.link)));
        },

        pxToCM: function(px){
            return px*0.3/10;
        },

        resizeOnWidth: function(itemWidth, itemHeight, factor){
            var newWidth = factor*this.pageDimensions.width;
            var newHeight = newWidth/itemWidth*itemHeight;

            return {width: newWidth, height: newHeight};
        },

        resizeOnHeight: function(itemWidth, itemHeight, factor){
            var newHeight = factor*this.pageDimensions.height;
            var newWidth = newHeight/itemHeight*itemWidth;

            return {width: newWidth, height: newHeight};
        },

        prepareLink: function(fileLink){

            //Prefix for testing grabbing file from td1 environment
            var prefix = "http://localhost";

            return prefix + fileLink;
        },

        isImageExtension: function(fileExtension)
        {
            var extensions = ["png", "jpeg"];

            return extensions.includes(fileExtension);
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


        zipFile.file(file.name, file.contents, {binary: true});

        console.log(""+file.contents);
        //
        // if (file.contents !== null)
        //     contents = "Have Some STUFF";
        // else
        //     contents = "Nope. Nothing fetched"
        //
        // console.log(`rowId: ${file.rowId}\nname: ${file.name}\nlink: ${file.link}\ncontents: ${contents}`);

    });

    saveAs(zipFile.generate({type: "blob"}), "package.zip");
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

        loader: null,
        //Fields-----------------------------------------------------------------

        //This function sets the array that it will be working with
        setFileList: function(newFileList) {

            //If incoming argument is null, set an empty array
            if(fileList === null)
                this.files = [];
            else
                this.files = newFileList;
        },

        /* These are the only image extensions that are being supported so far */
        isImageExtension: function(fileExtension)
        {
            var extensions = ["png", "jpeg"];

            return extensions.includes(fileExtension);
        },

        setLoader: function(loader){
            this.loader = loader;
        },

        showLoader: function(){
            this.loader.open();
        },

        hideLoader: function(){
            this.loader.close();
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
                this.showLoader();
                this.recursiveFetchFileForPrint(0);
            }
            else
                console.log("Already fetching");
        },

        prepareLink: function(fileLink){

            //Prefix for testing grabbing file from td1 environment
            var prefix = "";

            return prefix + fileLink;
        },

        //Recursive function that will download all files
        recursiveFetchFileForPrint: function(index) {

            //Reference to this
            var _self = this;

            //Base Case: if we reached past the last index in the array, printall and return
            if(index >= _self.files.length)
            {
                _self.fetching = false;
                _self.hideLoader();
                _self.printerSaver.printAllSelected();
                return;
            }

            var file = _self.files[index];

            //If file is image, we skip it from being downloaded. Image request will be handled
            //by img HTML element
            if(_self.isImageExtension(file.extension)){

                //Just move on to next
                setTimeout(_self.recursiveFetchFileForPrint(index+1), 0);
            }
            else {
                //If not base case, fetch specified index
                Data.endpoints.attach.get.post(_self.extractFileId(file.link))
                    .success(function(response){

                        console.log("Fetched in success callback");
                        console.log(_self.prepareLink(file.link));

                        //Upon receiving response, set the contents of the file
                        _self.setFileContents(file, response);

                        //Use setTimeOut for recursive call to prevent stack overflow if too many files
                        setTimeout(_self.recursiveFetchFileForPrint(index+1), 0);
                    })
                    .error(function(response){

                        console.log("Fetched in success callback");
                        console.log(_self.prepareLink(file.link));

                        //Upon receiving response, set the contents of the file
                        _self.setFileContents(file, response);

                        //Use setTimeOut for recursive call to prevent stack overflow if too many files
                        setTimeout(_self.recursiveFetchFileForPrint(index+1), 0);
                    });
            }

        },

        getRightData: function(fileExtension, data) {

            if(fileExtension === "txt")
                return data;
            else
                return data;
        },

        /* WARNING: ADDED DATA CHANGER TO SAVE FILE arrayToBase64 */

        //Recursive function that will download all files
        recursiveFetchFileForSave: function(index){

             //Reference to this
            var _self = this;

            //Base Case: if we reached past the last index in the array, save all and return
            if(index >= _self.files.length)
            {
                _self.fetching = false;
                this.hideLoader();
                _self.printerSaver.saveAllSelected();
                return;
            }

            var file = _self.files[index];

            //If not base case, fetch file id from link of file with specified index, and call backend
            Data.endpoints.attach.get.get(_self.extractFileId(file.link))
                .success(function(response){

                    console.log("Fetched in success callback");

                    //Upon receiving response, set the contents of the file
                    _self.setFileContents(file, _self.getRightData(file.extension, response));

                    //Use setTimeOut for recursive call to prevent stack overflow if too many files
                    setTimeout(_self.recursiveFetchFileForSave(index+1), 0);
                })
                .error(function(response){

                    console.log("Fetched in error callback");

                    //Upon receiving response, set the contents of the file
                    _self.setFileContents(file, _self.getRightData(file.extension, response));

                    //Use setTimeOut for recursive call to prevent stack overflow if too many files
                    setTimeout(_self.recursiveFetchFileForSave(index+1), 0);
                });
        },

        //Temporal
        fetchFilesAndSave: function(){

            //This condition prevents multiple requests that result from clicking download many times
            if(!this.fetching) {
                this.fetching = true;
                this.showLoader();
                this.recursiveFetchFileForSave(0);
            }
            else
                console.log("Already fetching");
        },

        //Temporal
        setFileContents: function(file, contents) {
            file.contents = contents;
        }
    };

    //Initialize instance
    instance._init();

    return instance;
}
