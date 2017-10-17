---
layout: page
title: "Q48205: Example of BASIC Function Returning a String to C"
permalink: /pubs/pc/reference/microsoft/kb/Q48205/
---

## Q48205: Example of BASIC Function Returning a String to C

	Article: Q48205
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom S_C S_QuickC
	Last Modified: 10-AUG-1990
	
	The two programs below demonstrate how a Microsoft BASIC function can
	return a string to C.
	
	This information about interlanguage calling applies to QuickBASIC
	versions 4.00, 4.00b, 4.50 for MS-DOS, to Microsoft BASIC Compiler
	versions 6.00 and 6.00b for MS-DOS and MS OS/2, and to Microsoft BASIC
	Professional Development System (PDS) versions 7.00 and 7.10 for
	MS-DOS and MS OS/2.
	
	For BASIC PDS 7.00 and 7.10, this example applies to near strings
	only. If you are using far strings (/Fs during compile or in the
	QBX.EXE environment), you must use the string-manipulation routines
	supplied with BASIC PDS 7.00 and 7.10 (StringAssign, StringRelease,
	StringAddress, and StringLength). For more information about using far
	strings, see Chapter 13 of the "Microsoft BASIC 7.0: Programmer's
	Guide" for versions 7.00 and 7.10.
	
	For more information about passing other types of parameters between
	BASIC and C, and a list of which BASIC and C versions are compatible
	with each other, search in the Software/Data Library for the following
	word:
	
	   BAS2C
	
	Code Example
	------------
	
	The following BASIC program is BSTRF.BAS, which contains a function
	that returns a string to a calling C routine:
	
	   DECLARE SUB CSUB CDECL ()
	   CALL CSUB
	   END
	
	   FUNCTION basvarfunc$(dummy%)
	      basvarfunc$ = "This is the string"
	   END FUNCTION
	
	The following program is CSTRF.C, which calls a BASIC routine that
	returns a string. A string descriptor is created to receive the data
	returned by the BASIC function.
	
	#include <stdio.h>
	struct stringdesc
	       {
	        int length;       /* string length */
	        char *string;     /* string address */
	       };
	extern struct stringdesc * pascal basvarfunc(int *dummy);
	struct stringdesc *std;
	void csub()
	{
	   int i;
	
	   std = basvarfunc(0);
	
	   printf("Length of string: %2d\r\n", std->length);
	
	   for(i = 0; i < std->length; i++)
	      printf("%c", std->string[i]);
	
	   printf("\r\n");
	
	}
	
	To demonstrate these programs from an .EXE program, compile and link
	as follows:
	
	   BC BSTRF.BAS;
	   CL /c /AM CSTRF.C;
	   LINK /NOE BSTRF CSTRF;
	
	BSTRF.EXE produces the following output:
	
	   Length of String: 18
	   This is the string
