---
layout: page
title: "Q42669: LINE INPUT#n Drops Null Characters from File; Use INPUT&#36;"
permalink: /pubs/pc/reference/microsoft/kb/Q42669/
---

## Q42669: LINE INPUT#n Drops Null Characters from File; Use INPUT&#36;

	Article: Q42669
	Version(s): 1.x 2.x 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom B_GWBasicI B_MQuickB B_BasicInt SR# S890306-99
	Last Modified: 16-DEC-1989
	
	The LINE INPUT #n statement strips null characters (CHR$(0)) from
	input files. If you want to input null bytes, you must use the INPUT$
	function instead of the LINE INPUT #n statement.
	
	This information applies to the following products:
	
	1. Microsoft QuickBASIC Version 1.00 for the Apple Macintosh.
	
	2. Microsoft BASIC Compiler Version 1.00 for the Apple Macintosh.
	
	3. Microsoft BASIC Interpreter Versions 1.00, 1.01, 2.00, 2.10, and
	   3.00 for the Apple Macintosh.
	
	4. Microsoft QuickBASIC Compiler Versions 1.00, 1.01, 1.02, 2.00,
	   2.01, 3.00, 4.00, 4.00b, and 4.50 for the IBM PC.
	
	5. Microsoft BASIC Compiler Versions 5.35 and 5.36 for MS-DOS.
	
	6. Microsoft BASIC Compiler Versions 6.00 and 6.00b for MS OS/2
	   and MS-DOS.
	
	7. Microsoft BASIC PDS Version 7.00 for MS-DOS and MS OS/2.
	
	8. Microsoft GW-BASIC Interpreter Versions 3.20, 3.22, and 3.23.
	
	Code Sample
	-----------
	
	The following code segment will print "helloworld" instead of
	"hello world":
	
	OPEN "test.dat" FOR INPUT AS #1
	LINE INPUT #1, a$
	PRINT a$
	CLOSE #1
	
	where the TEST.DAT data file was created as follows:
	
	OPEN "test.dat" FOR OUTPUT AS #1
	PRINT #1, "hello" + CHR$(0) + "world"
	CLOSE #1
