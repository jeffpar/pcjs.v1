---
layout: page
title: "Q68462: ISAM Files Open at Once, &quot;Too Many Files&quot; Error 67, Correction"
permalink: /pubs/pc/reference/microsoft/kb/Q68462/
---

## Q68462: ISAM Files Open at Once, &quot;Too Many Files&quot; Error 67, Correction

	Article: Q68462
	Version(s): 7.00 7.10 | 7.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | docerr
	Last Modified: 29-JAN-1991
	
	Page 673 of the "Microsoft BASIC 7.0: Language Reference" (under the
	"Too many files" error in Appendix D) incorrectly states that ISAM is
	limited to opening 12 databases at once.
	
	This should be corrected to read as follows:
	
	   At run time, the "Too many files" error may occur because:
	
	   ISAM has a limit to the number of databases and tables that can be
	   open at one time and your program has exceeded this limit.
	   The maximum number of database files that you can have open at once
	   is four. Also, the maximum number of tables that you can have
	   open at once is 13 tables in one database file, or 10 tables in 2
	   database files, or 7 tables in 3 database files, or 4 tables in 4
	   database files.
	
	This information applies to Microsoft BASIC Professional Development
	System (PDS) versions 7.00 and 7.10 for MS-DOS and 7.10 for MS OS/2.
	
	Reference:
	
	An ISAM database file in Microsoft BASIC Professional Development
	System (PDS) version 7.00 or 7.10 is created with the default
	extension .MDB and contains the physical data for each table plus the
	indexes used to define and point to the data.
	
	(This correct ISAM information is taken from page 388 of the
	"Microsoft BASIC 7.0: Programmer's Guide" for versions 7.00 and 7.10
	[Chapter 10, "Database Programming with ISAM"].)
