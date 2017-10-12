---
layout: page
title: "Q57942: &quot;UNKNOWN WARNING&quot; May Result from Bad Error Message File"
permalink: /pubs/pc/reference/microsoft/kb/Q57942/
---

	Article: Q57942
	Product: Microsoft C
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 8-MAR-1990
	
	If a number of compiler warning messages contain the description
	"UNKNOWN WARNING", the cause may be the use of an incorrect or
	corrupted error message file. The compiler generates the correct error
	number, but since the messages are retrieved from a separate file, the
	compiler displays "UNKNOWN WARNING" when it cannot find a match.
	
	The error message files for C 5.10 should contain messages for all
	errors and warnings generated. If you look up the number of a compiler
	error in the documentation and find a normally documented error, then
	you should be suspicious of your .ERR error message files.
	
	The simplest check is to reinstall the error message files from the
	original C 5.10 disks and then recompile to see if the error messages
	appear correctly. The .ERR files to recopy are CL.ERR and C23.ERR from
	the Setup disk and C1.ERR from the disk labeled Compiler Disk 1.
