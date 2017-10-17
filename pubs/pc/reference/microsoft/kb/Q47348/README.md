---
layout: page
title: "Q47348: Example of Passing Fixed-Length Strings from C to BASIC"
permalink: /pubs/pc/reference/microsoft/kb/Q47348/
---

## Q47348: Example of Passing Fixed-Length Strings from C to BASIC

	Article: Q47348
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890711-46 B_BasicCom S_C S_QuickC
	Last Modified: 28-DEC-1989
	
	To pass a string from Microsoft C to compiled BASIC, the string must
	originate in BASIC. A fixed-length string works best for this purpose.
	In the C module, you can modify the string, and BASIC will recognize
	this modification because BASIC is referencing the address of the
	string.
	
	This information about interlanguage calling applies to QuickBASIC
	Versions 4.00, 4.00b, and 4.50 for MS-DOS, to Microsoft BASIC Compiler
	Versions 6.00 and 6.00b for MS-DOS and MS OS/2, and to Microsoft BASIC
	PDS Version 7.00 for MS-DOS and MS OS/2.
	
	For more information about passing other types of parameters between
	BASIC and C, and a list of which BASIC and C versions are compatible
	with each other, query in the Software/Data Library on the following
	word:
	
	   BAS2C
	
	Code Example
	------------
	
	The following program is an example of passing a fixed-length string
	from C to BASIC (where the string is first allocated in BASIC). Please
	note that the C module needs to use the medium memory model.
	
	Compile Steps
	-------------
	
	   BC callc.bas /o;
	
	   cl /c /AM stringf.c
	
	Link Step
	---------
	
	   LINK callc+stringf /nod /noe ,,,bcom45+mlibce;
	
	For BASIC PDS 7.00, use the following link step:
	
	   LINK callc+stringf /nod /noe ,,,bcl70enr.lib+mlibce.lib;
	
	BASIC Program
	-------------
	
	'CALLC.BAS
	DECLARE SUB StringFar CDECL (_
	            BYVAL p1o AS INTEGER,_
	            BYVAL p1s AS INTEGER,_
	            SEG p3 AS INTEGER)
	CLS
	DIM array AS STRING * 15
	array = "This is a test" + CHR$(0)
	CALL StringFar(VARPTR(array), VARSEG(array), LEN(array))
	LOCATE 20,20
	PRINT array
	END
	
	C Program
	---------
	
	/* stringf.c */
	#include <stdio.h>
	void StringFar(a,len)
	   char far *a;
	    int *len;
	 {
	    int i;
	    printf("The string is : %s \n\n",a);
	    printf(" Index       Value       Character\n");
	    for (i=0;i < *len; i++)
	     {
	         printf("  %2d       %3d      %c\n",i,a[i],a[i]);
	     };
	
	    /* This loop shows that the string can be modified.
	       It fills the string with the '@' character.
	    */
	    for (i=10;i < *len; i++)
	      {
	         a[i]=64;
	      }
	 }
