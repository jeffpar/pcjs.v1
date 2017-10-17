---
layout: page
title: "Q64495: ISAMIO.EXE /I Imports ASCII Text File into BASIC ISAM File"
permalink: /pubs/pc/reference/microsoft/kb/Q64495/
---

## Q64495: ISAMIO.EXE /I Imports ASCII Text File into BASIC ISAM File

	Article: Q64495
	Version(s): 7.00 7.10
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900531-47
	Last Modified: 6-AUG-1990
	
	You can convert an ASCII text file into a Microsoft BASIC Professional
	Development System (PDS) ISAM database table by using the ISAMIO.EXE
	utility with the /I (Import) option. This article describes how to use
	the ISAMIO /I option.
	
	This information applies to Microsoft BASIC Professional Development
	System (PDS) versions 7.00 and 7.10 under MS-DOS.
	
	The syntax for importing (converting) an ASCII file into an ISAM
	database using the ISAMIO utility is as follows:
	
	   ISAMIO /I ASCIIFIL.TXT DATBASE.MDB TABLNAME SPECFIL.TXT [options]
	
	ASCIIFIL.TXT can have two formats. It can appear in a fixed-width
	format where certain data appears in fixed columns of the file. The
	ISAMIO /F option is required for a file of this type. The file can
	also be comma delimited with string data enclosed in double quotation
	marks. In this format, blank spaces should not be used between the
	fields and the commas. If blank spaces are inserted between the commas
	and the data, an "Unable to Parse column xx of line xx" error may
	occur.
	
	The DATBASE.MDB and TABLNAME are names of the ISAM database and table
	into which the ASCII file is to be imported. If DATBASE.MDB or
	TABLNAME doesn't already exist, PROISAMD support must be available to
	create them. A related ISAMIO.EXE error message is as follows:
	
	   ISAM command is not available" (in 7.00 or 7.10)
	
	This error message displays when PROISAM capability is currently
	installed but PROISAMD capability is needed (to create a new ISAM
	database or table). To avoid this error, do one of the following:
	
	1. If you ran SETUP.EXE with the "ISAM Routines in TSR" option, load
	   PROISAMD.EXE instead of PROISAM.EXE.
	
	2. If you ran SETUP with "ISAM Routines in LIB, Support Database
	   Access Only" option, run SETUP again and choose "ISAM Routines in
	   LIB, Support Database Creation and Access."
	
	If the database and table already exist and you use the ISAMIO /A
	(Append) option, you can use either PROISAM or PROISAMD.
	
	SPECFIL.TXT is the file that ISAMIO uses to specify the data type and
	size for each column of a table. Each line of the file relates to a
	column of the table. The format is as follows:
	
	   [fixedwidthsize,][type,[size],[columnname]]
	
	The fields in SPECFIL.TXT can be separated by spaces or commas. The
	"fixedwidthsize" field is valid only if the /F option is used. It just
	specifies the size of the field to read from ASCIIFIL.TXT.
	
	The "type" field in SPECFIL.TXT is one of the indexable ISAM data
	TYPEs. In the case of arrays, user-defined TYPEs, and strings longer
	than 255 characters, the "type" field must be specified as binary. If
	the "type" field is specified as variabletext (vt) or variablestring
	(vs), the "size" field must appear. The "size" field for string data
	tells ISAMIO the size of the field to put the string data into. The
	"size" field can be smaller, which truncates input data, or larger,
	which allows a larger string to be input later. These two types are
	the same except that variabletext (vt) is case insensitive while
	variablestring (vs) is case sensitive. Note that BASIC PDS' use of
	string data is case insensitive (that is, all comparisons made are
	case insensitive). Therefore, even if variablestring is specified, it
	is converted to variabletext.
	
	The "columnname" field in SPECFIL.TXT is any valid ISAM column name,
	but it is ignored if the /C option is used.
	
	The ISAMIO options that you can use for importing a file (/I) are /C,
	/F, and /A. The following table describes these options:
	
	Option     Description
	------     -----------
	
	/A         Tells ISAMIO that you are importing ASCIIFIL.TXT and
	           appending it to an existing table (TABLNAME). If /A is
	           specified, column names cannot appear in ASCIIFIL.TXT
	           (the /C option), only data. If you use the /A and /C
	           options together, the following error message displays:
	
	              APPEND & COLUMN_NAMES conflicts
	
	           The SPECFIL.TXT file cannot appear on a command line that
	           contains the /A option. ISAMIO uses the format of the
	           existing table that is being appended to. If SPECFIL.TXT
	           is specified along with the /A option, the following error
	           message displays:
	
	              APPEND and specfile conflicts
	
	           If the table does not exist within the specified database
	           (DATBASE.MDB), ISAMIO displays the following error message:
	
	              Can't Open Table "TABLNAME"
	
	/C         Tells ISAMIO that the ISAM table's column names should be
	           taken from the first line of ASCIIFIL.TXT. These column
	           names need to be separated by a space, comma, or any
	           combination thereof. If a column name is not consistent
	           with the ISAM naming convention, ISAM displays the error
	           message "Invalid Name." If this option is not specified
	           when importing a new table, ISAMIO looks at SPECFIL.TXT
	           for the column names. If ISAMIO doesn't find a column name
	           in SPECFIL.TXT, it displays an error message that tells
	           you that you must specify a column name in SPECFIL.TXT.
	
	/F         Tells ISAMIO that the text to be imported is of a
	           fixed-width format (already in columns of a certain
	           length). The size of the fixed-width format must be
	           specified in the first column of SPECFIL.TXT. If the /F
	           option is not used, the data in the fields of ASCIIFIL.TXT
	           are assumed to be delimited by commas, with string data
	           enclosed in double quotation marks. If you use /F and one
	           of the fields is shorter than the specified length, you
	           will receive the error message "Unable to parse column xx
	           of line xx," where "column" refers to the column of a
	           table.
	
	Depending on how you ran SETUP.EXE, the ISAMIO.EXE utility will be
	built either to run as a stand-alone program or to require the
	terminate-and-stay-resident (TSR) form of ISAM. A separate article,
	found by querying in this Knowledge Base on the following words,
	discusses this topic:
	
	   SETUP and builds and ISAMIO
	
	When you run ISAMIO and receive one of the following error messages,
	you must install the PROISAM.EXE or PROISAMD.EXE TSR program if you
	are running MS-DOS; if you are running OS/2, you must put PROISAM.DLL
	or PROISAMD.DLL in your LIBPATH:
	
	   ISAMIO: ISAM TSR is not loaded" (in 7.00 under MS-DOS)
	   ISAMIO : error: ISAM DLL not found" (in 7.10 under MS-DOS or OS/2)
	
	The following are some examples of importing different ASCII files:
	
	Example 1
	---------
	
	The contents of ASCIIFIL.TXT are as follows:
	
	   CustomerName  Address  CustomerNumber
	   Huck Finn   1606 Crest Dr. 3490
	   Joe Henry   893 S. Scenic   5620
	   Billy Bob   143 Maple St    0894
	
	The contents of SPECFIL.TXT are as follows (where BASIC PDS ISAM treats
	vt and vs the same way):
	
	   12,vt,20
	   16,vs,16
	   4,integer
	
	Invoke ISAMIO.EXE in MS-DOS as follows:
	
	   ISAMIO /I ASCIIFIL.TXT CUSTOMER.MDB TABLE1 SPECFIL.TXT /C/F
	
	Example 2
	---------
	
	The contents of ASCIIFIL.TXT are as follows:
	
	   "Huck Finn","1606 Crest Dr.",3490
	   "Joe Henry","893 S. Scenic",5620
	   "Billy Bob","143 Maple St",0894
	
	The contents of SPECFIL.TXT are as follows:
	
	   12,vt,20,CustomerName
	   16,vs,16,Address
	   4,integer,CustomerNumber
	
	Invoke ISAMIO.EXE in MS-DOS as follows:
	
	   ISAMIO /I ASCIIFIL.TXT CUSTOMER.MDB TABLE2 SPECFIL.TXT
	
	Example 3:  Appending a File to an Existing ISAM Table
	------------------------------------------------------
	
	The following example shows how to append an ASCII file to an existing
	ISAM table:
	
	The contents of APENDFIL.TXT are as follows:
	
	   "John Doe","1387 Main Blvd.",2490
	
	Note that a SPECFIL.TXT file is not used when appending a file to the
	ISAM table. Invoke ISAMIO.EXE as follows:
	
	   ISAMIO /I APENDFIL.TXT CUSTOMER.MDB TABLE2 /A
	
	For more information on how to use ISAMIO, see Pages 389-391, Chapter
	10, "ISAM Utilities," of the "Microsoft BASIC 7.0: Programmer's Guide"
	for versions 7.00 and 7.10.
