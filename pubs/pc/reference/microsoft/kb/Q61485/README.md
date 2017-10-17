---
layout: page
title: "Q61485: Maximum Number of ISAM Files Open at Once in BASIC 7.00/7.10"
permalink: /pubs/pc/reference/microsoft/kb/Q61485/
---

## Q61485: Maximum Number of ISAM Files Open at Once in BASIC 7.00/7.10

	Article: Q61485
	Version(s): 7.00 7.10 | 7.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | SR# S900408-3
	Last Modified: 6-FEB-1991
	
	The number of ISAM tables that you can have open at one time is
	determined by the number of database files that you have open. (See
	table below.)
	
	The maximum number of database files that you can have open at once is
	4 files. However, this is not the maximum number of tables you can
	have open at once. The maximum number of tables that you can have open
	at once is 13 tables in 1 database file, 10 tables in 2 database
	files, 7 tables in 3 database files, or 4 tables in 4 database files.
	
	Attempting to open more than the maximum allowed number of tables or
	database files at once gives error 67, "Too many files."
	
	A database file in Microsoft BASIC Professional Development System
	(PDS) version 7.00 or 7.10 is created with the default extension .MDB
	and contains the physical data for each table plus the indexes used to
	define and point to the data.
	
	This information applies to Microsoft BASIC Professional Development
	System (PDS) versions 7.00 and 7.10 for MS-DOS and 7.10 for MS OS/2.
	
	The ISAM engine in Microsoft BASIC PDS 7.00 and 7.10 has a maximum
	number of 16 pointers or ISAM handles that it can use with ISAM files.
	These are NOT the same as DOS file handles.
	
	Each file still takes one DOS file handle for its first open, but it
	doesn't need any additional DOS file handles for additional tables
	opened in the same database file.
	
	Each database file takes four ISAM handles on its initial open: one
	handle for the file, one for the indexes, one for the data, and one
	for the initial table. Each additional table referenced in an already
	opened database takes only one additional ISAM handle and no more DOS
	handles. This is because ISAM handles that point to the same file,
	indexes, and data already exist.
	
	As a result, the number of tables that you can have open at once is
	determined by the number of database files you are using. The
	following table gives the combinations of databases (.MDBs) and
	additional ISAM tables that you can have open at one time:
	
	            Maximum Number of ISAM Files and Tables
	
	   ---------------------------------------------------------
	   # of .MDBs (files):  |    1         2        3        4
	                        |
	   # of additional      |
	   tables in already    |    12        8        4        0
	   opened .MDBs:        |
	                        |
	   Total tables:        |    13        10       7        4
	                        |
	                        |
	   Total ISAM handles:  |    16        16       16       16
	   ---------------------------------------------------------
	
	Therefore, if you have all of your tables in only 1 database file, you
	can open a total of 13 tables at once. However, if you open tables in
	4 database files, you can open only those 4 tables at once.
	
	This information is taken from page 388 of the "Microsoft BASIC 7.0:
	Programmer's Guide" for versions 7.00 and 7.10 (Chapter 10, "Database
	Programming with ISAM").
