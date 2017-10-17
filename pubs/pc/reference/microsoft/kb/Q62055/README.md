---
layout: page
title: "Q62055: QBX ISAM Capitalizes the Field Names of a Table in an .EXE"
permalink: /pubs/pc/reference/microsoft/kb/Q62055/
---

## Q62055: QBX ISAM Capitalizes the Field Names of a Table in an .EXE

	Article: Q62055
	Version(s): 7.00
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900508-29
	Last Modified: 22-MAY-1990
	
	Microsoft BASIC Professional Development System (PDS) version 7.00
	ISAM behaves in a slightly different manner in the QBX.EXE environment
	than when compiled. In a compiled program, when a database is created,
	the ISAM engine capitalizes all field names in the TYPE used to create
	the table. In the QBX.EXE environment, the ISAM engine leaves field
	names in whatever case they were coded in. This slight difference in
	behavior of the ISAM engine should not cause any problems in ISAM.
	BASIC variable names are not case sensitive. This includes the
	variable names used to create and access ISAM tables and indexes.
	
	This information applies to Microsoft BASIC PDS version 7.00 for MS-DOS.
	
	The following program displays this behavior. Run the program in the
	QBX.EXE environment, then use the ISAMPACK.EXE utility on the file the
	program creates. ISAMPACK.EXE displays the structure of the database
	as it repairs the file. It also shows the case on all tables, fields
	in the table, and indexes. Compile the program, run it, and use
	ISAMPACK to display the database structure again. This shows the
	difference in the case of the field names.
	
	This difference occurs no matter how ISAM is used. ISAM can be used
	in four different ways: PROISAM(d) TSR with or without the run-time
	module; linked directly into the program itself; or linked into the
	run-time module. All forms of accessing the ISAM engine behave the
	same way.
	
	Code Example
	------------
	
	    TYPE table
	        Field1      AS LONG
	        Field2      AS LONG
	        Field3      AS LONG
	    END TYPE
	    ' Check if the table already exists. If so, delete it.
	    IF (DIR$("db1.mdb") <> "") THEN
	        DELETETABLE "db1.mdb", "Table1"
	    END IF
	    OPEN "db1.mdb" FOR ISAM table "Table1" AS 1
	    CREATEINDEX 1, "Idx", 1, "Field1", "Field2", "Field3"
	    CLOSE
	    END
