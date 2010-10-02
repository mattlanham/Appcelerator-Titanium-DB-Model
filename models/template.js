// This JS file will hold all functions relating to people
Ti.include('includes/phpjs.js');

/*
 * Simple JS Model for Appcelerator Titanium
 * 
 * This is a really simple template for a model to handle database interaction when using
 * Appcelerator Titanium to build iPhone / Android applications, there are some really 
 * useful functions, and you can easily add your own custom functions.
 * 
 * Instructions:
 * Replace all occurances of Singular with your desired name, i.e. Item, Person, Setting etc
 * Replace all occurendes of TABLE with the name of your table, i.e. ITEMS, PEOPLE, SETTINGS
 * Replace all occurences of DB with the name of your DB
 * Enter all your columns in the this.columns array, created and updated will be automatically
 * updated so you just need to include them in your table
 *
 * http://github.com/swanify/Appcelerator-Titanium-DB-Model
 */

function Singular() {	
	// Class variables
	this.table		= 'TABLE';
	this.db			= 'DB';
	this.className  = 'Singular';
	this.idColumn   = 'id';
	this.columns	= ['id', 'name', 'price', 'created', 'updated'];
	this.row		= [];
	this.rows		= [];
	
	/* ########################################################## */
	/* YOU DO NOT NEED TO EDIT ANY OF THE CODE BELOW THIS COMMENT */
	/* ########################################################## */

	/*
	 *	getById
 	 *	This will return a row based on the ID column
	*/
	this.getById = function(id) {
		// Open the DB
		var db = Titanium.Database.open(this.db);
		// Get the person based on id
		var result = db.execute("SELECT * FROM " + this.table + " WHERE " + this.idColumn.toUpperCase() + " = ? LIMIT 1", id);
		if(result.getRowCount() == 1){
			// Set all of this classes variables to the data
			for ( var i=0, len=this.columns.length; i<len; ++i ){
				this[this.columns[i]] = result.fieldByName(this.columns[i]);
			}
			// Close the DB
			db.close();
			// Return result
			return true;
		}else{
			// Close the DB
			db.close();
			// Return result
			return false;
		}
		// Close the DB
		db.close();
	};
	/*
	 *	getAll
	 *	This will return all rows in the DB for this model
	 */
	this.getAll = function() {
		// Set an array
		var rows = [];
		var rowCount = 0;
		// Open the DB
		var db = Titanium.Database.open(this.db);
		// Get all rows
		var result = db.execute("SELECT * FROM " + this.table);
		// Loop through results
		if(result.getRowCount() > 0){
			while (result.isValidRow())
			{
				eval('var thisRow = new ' + this.className + '();');
				// Set all of this classes variables to the data
				for ( var i=0, len=this.columns.length; i<len; ++i ){
					thisRow[this.columns[i]] = result.fieldByName(this.columns[i]);
				}
				rows[rowCount]     = thisRow;
				rowCount++;
				result.next();
			}
			// Close the DB
			db.close();
			// Return the result
			return rows;
		}else{
			// Close the DB
			db.close();
			// Return the result
			return false;
		}

	};


	/*
		countAll
		This function will simply return the integer of how many rows there are
		in the DB
	*/
	this.countAll = function() {
		// Open the DB
		var db = Titanium.Database.open(this.db);
		// Get the person based on id
		var result = db.execute("SELECT * FROM " + this.table);
		// Return number of rows
		return result.getRowCount();
	};
	/*
	 *	Save
	 *	This function will save the information to the database, if an ID
	 *	is present it will update the row
	*/
	this.save = function() {
		Ti.API.info('Function save()');
		// Open the DB
		var db = Titanium.Database.open(this.db);

		if(typeof this.id == 'undefined'){
			Ti.API.info('This record has no ID, perform an INSERT');
			Ti.API.info('Adding new record...');
			// This is a new user
			this.created = date('Y-m-d H:i:s');
			this.updated = date('Y-m-d H:i:s');

			var sql = "INSERT INTO " + this.table + " (";
			// Set all of this classes variables to the data
			for ( var i=0, len=this.columns.length; i<len; ++i ){
				if(this.columns[i] != 'id'){
					sql += this.columns[i].toUpperCase() + ",";
				}
			}
			sql = sql.substr(0, sql.length - 1);

			sql += ") VALUES (";

			// Set all of this classes variables to the data
			for ( var ii=0, leni=this.columns.length; ii<leni; ++ii ){
				if(this.columns[ii] != this.idColumn){
					sql += "'" + this[this.columns[ii]] + "',";
				}
			}
			sql = sql.substr(0, sql.length - 1);
			sql += ")";

			Ti.API.info('SQL was: ' + sql);

			db.execute(sql);
			Ti.API.info('The recorded was added with ID: ' + db.lastInsertRowId);

			// Close the DB
			db.close();
		}else{
		    Ti.API.info('This record has an ID, perform an UPDATE');
			Ti.API.info('Updating existing record...');
			// Update existing record
			this.updated = date('Y-m-d H:i:s');

			var updateSQL = "UPDATE " + this.table + " SET ";
			// Set all of this classes variables to the data
			for ( var x=0, l=this.columns.length; x<l; ++x ){
				if(this.columns[x] != this.idColumn){
					if(this.columns[x] != 'created'){
						updateSQL += this.columns[x].toUpperCase() + " = '" + this[this.columns[x]] + "',";
					}
				}else{
					updateSQLID = " WHERE " + this.idColumn.toUpperCase() + " = " + this[this.columns[x]] + "";
				}
			}
			updateSQL = updateSQL.substr(0, updateSQL.length - 1);
			updateSQL+= updateSQLID;

			Ti.API.info('SQL was: ' + updateSQL);

			db.execute(updateSQL);

			Ti.API.info('The recorded with ID ' + this[this.idColumn] + ' was updated');

			// Close the DB
			db.close();
		}
	};
}
