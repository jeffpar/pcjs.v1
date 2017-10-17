---
layout: page
title: "Q57362: Variable Length String Passed from BASIC PDS 7.00 to C"
permalink: /pubs/pc/reference/microsoft/kb/Q57362/
---

## Q57362: Variable Length String Passed from BASIC PDS 7.00 to C

	Article: Q57362
	Version(s): 7.00   | 7.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | SR# S891017-100
	Last Modified: 17-JAN-1990
	
	The example below demonstrates how to pass a variable-length string
	from a compiled BASIC program to a C program. This information applies
	to Microsoft BASIC Professional Development System (PDS) 7.00 for
	MS-DOS and MS OS/2.
	
	BASIC to C Example
	------------------
	
	Compile and link as follows:
	
	Compile:  BC /Fs/d Bastest.bas;
	          QCL /AM Ctest.c /c
	
	Link:     LINK /noe/nod Bastest+Ctest,,,BRT70EFR+MLIBCE;
	
	REM ===== BASIC PROGRAM =====
	DECLARE SUB StringFar CDECL (BYVAL p1o AS INTEGER, BYVAL p1s AS
	INTEGER, SEG p3 AS INTEGER)
	CLS
	a$ = "This is a test" + CHR$(0)
	CALL StringFar(SADD(a$), SSEG(a$), LEN(a$))
	PRINT "Back from C"
	END
	/* C sub-program */
	#include <e:\qc2\include\stdio.h>
	void StringFar(a,len)
	   char far *a;
	    int *len;
	 {
	    int i;
	    printf("The string is : %s \n\n",a);
	    printf(" Index       Value       Character\n");
	    for (i=0;i < *len; i++)
	       {
	         printf("  %2d          %3d
	%c\n",i,a[i],a[i]);
	       };
	 }
