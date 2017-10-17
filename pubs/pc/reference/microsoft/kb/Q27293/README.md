---
layout: page
title: "Q27293: Passing BASIC Fixed-Length String to C by Far Reference"
permalink: /pubs/pc/reference/microsoft/kb/Q27293/
---

## Q27293: Passing BASIC Fixed-Length String to C by Far Reference

	Article: Q27293
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom S_C S_QuickC
	Last Modified: 6-NOV-1989
	
	The example below demonstrates how to pass a fixed-length string from
	compiled BASIC to Microsoft C by far reference.
	
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
	
	REM BASIC Program
	
	DECLARE SUB StringFar CDECL (_
	            BYVAL p1o AS INTEGER,_
	            BYVAL p1s AS INTEGER,_
	            SEG p3 AS INTEGER)
	CLS
	DIM a AS STRING * 15
	a = "This is a test" + CHR$(0)
	CALL StringFar(VARPTR(a), VARSEG(a), LEN(a))
	END
	
	/* C Routine */
	
	#include <stdio.h>
	void StringFar(a,len)
	   char far *a;
	    int *len;
	 {
	    int i;
	    printf("The string is : %s \n\n",array);
	    printf(" Index       Value       Character\n");
	    for (i=0;i < *len; i++)
	       {
	         printf("  %2d          %3d            %c\n",i,a[i],a[i]);
	       };
	 }
	
	Output
	------
	
	The string is : This is a test
	
	 Index       Value       Character
	   0           84            T
	   1          104            h
	   2          105            i
	   3          115            s
	   4           32
	   5          105            i
	   6          115            s
	   7           32
	   8           97            a
	   9           32
	  10          116            t
	  11          101            e
	  12          115            s
	  13          116            t
	  14            0
