---
layout: page
title: "Q27299: Passing BASIC Array of Variable-Length Strings to C"
permalink: /pubs/pc/reference/microsoft/kb/Q27299/
---

## Q27299: Passing BASIC Array of Variable-Length Strings to C

	Article: Q27299
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom S_C S_QuickC
	Last Modified: 6-NOV-1989
	
	The following example demonstrates how to pass an array of
	variable-length strings from compiled BASIC to Microsoft C.
	
	This information about inter-language calling applies to QuickBASIC
	Versions 4.00, 4.00b, and 4.50 for MS-DOS and to Microsoft BASIC
	Compiler Versions 6.00 and 6.00b for MS-DOS and MS OS/2.
	
	For more information about passing other types of parameters between
	BASIC and C, and a list of which BASIC and C versions are compatible
	with each other, query in the Software/Data Library on the following
	word:
	
	   BAS2C
	
	Code Example
	------------
	
	REM ===== BASIC PROGRAM =====
	
	DECLARE SUB StringArray CDECL (_
	            BYVAL p1o AS INTEGER,_
	            BYVAL p2s AS INTEGER)
	CLS
	DIM array$(10)
	FOR i = 0 TO 10
	  array$(i) = STRING$(9, 65 + i) + CHR$(0)
	NEXT i
	CALL StringArray(VARPTR(array$(0)), VARSEG(array$(0)))
	END
	
	/* ===== C ROUTINE ===== */
	
	#include <stdio.h>
	struct struct_string{      /* structure that looks like a */
	     int length;           /* string descriptor           */
	     char *address;
	     };
	void StringArray(string)
	   struct struct_string far *string;
	 {
	    int i;
	    printf(" Index  Length    String\n");
	    for (i=0;i < 10; i++)
	       {
	         printf("  %2d     %3d     %s\n",i,string->length,
	                string->address);
	         string++;
	       };
	 }
	
	===== OUTPUT =====
	
	 Index  Length    String
	   0      10     AAAAAAAAA
	   1      10     BBBBBBBBB
	   2      10     CCCCCCCCC
	   3      10     DDDDDDDDD
	   4      10     EEEEEEEEE
	   5      10     FFFFFFFFF
	   6      10     GGGGGGGGG
	   7      10     HHHHHHHHH
	   8      10     IIIIIIIII
	   9      10     JJJJJJJJJ
