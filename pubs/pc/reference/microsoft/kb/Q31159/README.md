---
layout: page
title: "Q31159: &quot;Out of Data Space"
permalink: /pubs/pc/reference/microsoft/kb/Q31159/
---

## Q31159: &quot;Out of Data Space

	Article: Q31159
	Version(s): 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 21-DEC-1989
	
	When a program is running, each file OPENed with the OPEN statement
	takes up memory for the file buffer in DGROUP. If you specify a large
	record length (with the LEN= clause), a corresponding large space will
	be taken up in DGROUP.
	   When OPENed file buffers consume all of DGROUP memory at run time,
	one of the following error messages will display:
	
	Version   In QB.EXE Environment     From .EXE Compiled Program
	
	3.00      "Out of memory"             "Out of memory in module"
	4.00      "Out of data space"         "Out of memory in module"
	4.00b     "Out of data space"         "Out of memory in module"
	4.50      "Out of data space"         "Out of memory in module"
	
	   The Microsoft BASIC Compiler Versions 6.00 and 6.00b for MS-DOS and
	OS/2 will behave like QuickBASIC Version 4.00b.
	   To work around this problem, do the following:
	
	   1. CLOSE each file before OPENing the next. Closing the file will
	free up the DGROUP memory that it used.
	   2. Use the CLEAR command to CLOSE all files and erase all
	variables.
	   3. Reduce the record length size (LEN=reclen) in the OPEN
	statement.
	   4. Make numeric arrays $DYNAMIC instead of $STATIC. This will leave
	more space in DGROUP.
	
	   The following code demonstrates the problem:
	
	CLS : CLOSE
	PRINT "Amount of available string space";FRE("")
	OPEN "z1" FOR RANDOM AS 1
	OPEN "z2" FOR RANDOM AS 2 LEN = 5000;
	OPEN "z3" FOR OUTPUT AS 3
	OPEN "z4" FOR OUTPUT AS 4 LEN = 5000
	OPEN "z6" FOR BINARY AS 6
	PRINT "Amount of available string space";FRE("")
