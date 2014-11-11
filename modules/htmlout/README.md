HTMLOut
===
This module provides a filter() function for [server.js](../../../server.js),
our Express-based web server.  The function is installed like so:

	app.use(HTMLOut.filter);
	
The filter function examines the URL, and if it corresponds to a directory on the server,
the function will generate an "index.html" in that directory, based on the contents of a
default template file (currently [common.html](../shared/templates/common.html)).
