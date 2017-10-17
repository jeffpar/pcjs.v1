---
layout: page
title: "Q47756: Example of C Function Returning a String to BASIC"
permalink: /pubs/pc/reference/microsoft/kb/Q47756/
---

## Q47756: Example of C Function Returning a String to BASIC

	Article: Q47756
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom S_C S_QuickC
	Last Modified: 5-SEP-1990
	
	The two programs shown below demonstrate how a C function can return a
	string to a compiled BASIC program.
	
	This information about interlanguage calling applies to QuickBASIC
	versions 4.00, 4.00b, and 4.50 for MS-DOS, to Microsoft BASIC Compiler
	versions 6.00 and 6.00b for MS-DOS and MS OS/2, and to Microsoft BASIC
	Professional Development System (PDS) versions 7.00 and 7.10 for
	MS-DOS and MS OS/2.
	
	For Microsoft BASIC PDS 7.00 and 7.10, this example applies only to
	near strings. If you are using far strings (BC /Fs on compile or when
	using QBX.EXE), you must use the string-manipulation routines supplied
	with BASIC PDS 7.00 and 7.10 (StringAssign, StringRelease,
	StringAddress, and StringLength). For more information about far
	strings, see Chapter 13 of "Microsoft BASIC 7.0: Programmer's Guide"
	for versions 7.00 and 7.10.
	
	For more information about passing other types of parameters between
	BASIC and C and a list of which BASIC and C versions are compatible
	with each other, query in the Software/Data Library on the following
	word:
	
	   BAS2C
	
	Code Example
	------------
	
	The following BASIC program is BSTRF.BAS, which calls the C function
	and prints out the returned string and its length:
	
	   DECLARE FUNCTION CFUNC$ CDECL ()
	   a$ = CFUNC$
	   PRINT a$
	   PRINT len(a$)
	
	The following program is CSTRF.C, which builds a string descriptor
	that is passed back to the calling BASIC program:
	
	#include <string.h>
	struct stringdesc
	       {
	        int length;        /* length of the string */
	        char *string;      /* near pointer to the string */
	       };
	struct stringdesc *std;
	char thestring[18];      /* In the medium memory model this  */
	                         /* string will be in DGROUP - which */
	                         /* is required for BASIC    */
	struct stringdesc *cfunc()
	{
	  std->length = 18;      /* length of the string */
	  strcpy(thestring, "This is the string");
	  std->string = thestring;
	  return(std);           /* return pointer to string descriptor */
	}
	
	To demonstrate these programs from an .EXE program, compile and link
	as follows:
	
	   BC BSTRF.BAS;
	   CL /c /AM CSTRF.C;
	   LINK /NOE BSTRF CSTRF;
	
	BSTRF.EXE produces the following output:
	
	   This is the string
	   18
