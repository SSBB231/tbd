/*
Clase que se encarga de salvar e imprimir archivos
*/
function newPrintAndSaveManager(){
	
	var instance = {

        //Datos miembro

		//Arreglo que contiene la información de los archivos a salvar o a imprimir
        allFiles: null,

		//Arreglo de solamente los archivos seleccionados de la tabla
		selectedFiles: null,

        //Constructor de la clase
		_init(){
			this.allFiles = [];
			this.selectedFiles = [];
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
            console.log(`rowId:\t${file.rowId}\nname:\t${file.name}\nlink:\t${file.link}\n\n`)
		},
		
		//Imprime todos los archivos especificados
		printAllSelected(){
			this.selectedFiles.forEach((file)=>this.printFile(file));
		}
	};
	
	instance._init();
	
	return instance;
}

//Esta función descargará los archivos en un zip
function saveAsZip(files){
	files.forEach(f=>console.log(f));
}

//Esta función descargará los archivos uno por uno
function saveSeparately(files){
	
}