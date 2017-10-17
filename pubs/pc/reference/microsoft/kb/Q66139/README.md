---
layout: page
title: "Q66139: ISAMIO /E Cannot Extract Aggregate Types from ISAM Database"
permalink: /pubs/pc/reference/microsoft/kb/Q66139/
---

## Q66139: ISAMIO /E Cannot Extract Aggregate Types from ISAM Database

	Article: Q66139
	Version(s): 7.00 7.10 | 7.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | SR# S901001-69
	Last Modified: 18-OCT-1990
	
	The ISAMIO.EXE utility can extract the data from an ISAM table into an
	ASCII text file by using the /E switch. However, the ISAMIO.EXE
	utility cannot completely extract aggregate items in a table.
	Aggregate items are items in the TYPE record that are not simple
	types. Simple types are INTEGER, LONG, CURRENCY, DOUBLE, and STRING.
	Aggregate types are items such as nested TYPEs or an array in the
	TYPE. This is not a problem with the ISAMIO.EXE utility, but is a
	result of the way in which the ISAM engine stores aggregate types in
	the table and in the data dictionary. This article also describes two
	ways to view a database's data dictionary.
	
	This information applies to Microsoft BASIC Professional Development
	System (PDS) version 7.00 for MS-DOS and version 7.10 for MS-DOS and
	MS OS/2.
	
	This behavior of ISAMIO results from the way in which the ISAM engine
	stores an aggregate item in the database. For an aggregate type, it
	calculates the size of the whole aggregate item, and then inserts an
	entry in the data dictionary describing it as a binary object of that
	many bytes. For example, consider the following TYPE:
	
	TYPE nested ' This gets nested in the TYPE below.
	    junk1 AS DOUBLE
	    junk2 AS STRING * 7
	END TYPE
	
	TYPE record
	   key1 AS STRING * 20
	   key2 AS nested
	   key3 AS INTEGER
	   key4(5) AS INTEGER
	   key5 AS LONG
	   key6(4)  AS DOUBLE
	   key7 AS DOUBLE
	   key8 AS CURRENCY
	END TYPE
	
	If you create a table in a database with this TYPE, the ISAM engine
	will put entries in the data dictionary saying that key2, key4, and
	key6 are "binary" objects of a certain size. Thus, when ISAMIO later
	tries to extract these items, it cannot determine what their original
	data types were; it only knows how big they were. Therefore, ISAMIO
	extracts these binary objects as a string (usually full of graphics
	characters).
	
	You can show what is in a database's data dictionary in two ways, as
	described in the following:
	
	1. ISAMIO can access the data dictionary. When you run ISAMIO to
	   extract a database as a text file, you can specify a <specfile>
	   parameter. For example, to extract the table called "test" in a
	   database called "test.mdb" made with the above TYPEs, you use the
	   following line:
	
	      ISAMIO /E data.txt test.mdb test specfile.txt /C
	
	   After this, DATA.TXT contains the output data. While it's
	   extracting, ISAMIO takes the information in the data dictionary and
	   builds "SPECFILE.TXT". Note that SPECFILE.TXT doesn't have to exist
	   before you run ISAMIO. After running ISAMIO, this specfile will
	   describe the data items in the ASCII text file just created. For
	   instance, for the TYPE example above, the specfile created is as
	   follows:
	
	      variabletext,20,key1
	      binary,,key2
	      integer,,key3
	      binary,,key4
	      long,,key5
	      binary,,key6
	      double,,key7
	      currency,,key8
	
	   This clearly shows key2, key4, and key4 are seen as binary objects
	   by ISAMIO.EXE.
	
	2. The second way to examine the data dictionary is to run the
	   ISAMPACK.EXE utility. If you redirect the output from ISAMPACK into
	   a file, you will have a record of the database's contents. For
	   instance, use the following:
	
	      ISAMPACK test.mdb > report.dat
	
	   This creates a file called REPORT.DAT, which (among other things)
	   has a description of the structure of each table in the database.
	   The structure of the tables is determined by what is in the data
	   dictionary. For the table discussed above, a part of REPORT.DAT
	   will contain the following:
	
	      Column Name               Column Type         Maximum Size
	      -----------               -----------         ------------
	
	      key1                      VarText             20
	      key2                      Binary              64K
	      key3                      Integer             2
	      key4                      Binary              64K
	      key5                      Long                4
	      key6                      Binary              64K
	      key7                      Double              8
	      key8                      Currency            8
	
	   Again, this shows that the data dictionary describes aggregate
	   objects as being "binary".
	
	Code Example
	------------
	
	To build the code example described above, you can use the following
	program. To run this program in QBX.EXE, you must first load the
	PROISAMD.EXE TSR. To compile and run the program, use the following:
	
	   BC test.bas ;
	   LINK test ;
	
	DEFINT A-Z
	TYPE nested
	    junk1 AS DOUBLE
	    junk2 AS STRING * 7
	END TYPE
	
	TYPE record
	   key1 AS STRING * 20
	   key2 AS nested
	   key3 AS INTEGER
	   key4(5) AS INTEGER
	   key5 AS LONG
	   key6(4)  AS DOUBLE
	   key7 AS DOUBLE
	   key8 AS CURRENCY
	END TYPE
	
	DIM Record1 AS record, Record2 AS record, Record3 AS record
	' Code part.
	
	OPEN "test.mdb" FOR ISAM record "test" AS #1
	'SETINDEX #1, "testindex"
	
	FOR i = 1 TO 20
	   PRINT "***********************************"
	   PRINT "*       Get a new record          *"
	   PRINT "***********************************"
	
	   INPUT "Input a STRING * 20: ", Record1.key1
	   INPUT "Input a DOUBLE: ", Record1.key2.junk1
	   INPUT "Input a STRING * 7: ", Record1.key2.junk2
	   INPUT "Input an INTEGER: ", Record1.key3
	   FOR j = 1 TO 5
	     INPUT "Input an INTEGER: ", Record1.key4(j)
	   NEXT
	   INPUT "Input a LONG: ", Record1.key5
	   FOR j = 1 TO 4
	     INPUT "Input an INTEGER: ", Record1.key6(j)
	   NEXT
	   INPUT "Input a DOUBLE: ", Record1.key7
	   INPUT "Input a CURRENCY: ", curr1
	   INSERT #1, Record1
	NEXT
	CLOSE
	END
