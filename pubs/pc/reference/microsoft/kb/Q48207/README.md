---
layout: page
title: "Q48207: Example of Passing Strings from C to BASIC"
permalink: /pubs/pc/reference/microsoft/kb/Q48207/
---

## Q48207: Example of Passing Strings from C to BASIC

	Article: Q48207
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom S_C S_QuickC
	Last Modified: 10-AUG-1990
	
	The two programs below demonstrate how Microsoft C can create and pass
	both fixed-length and variable-length strings to Microsoft BASIC.
	
	This information about interlanguage calling applies to QuickBASIC
	versions 4.00, 4.00b, 4.50 for MS-DOS, to Microsoft BASIC Compiler
	versions 6.00 and 6.00b for MS-DOS and MS OS/2, and to Microsoft BASIC
	Professional Development System (PDS) versions 7.00 and 7.10 for
	MS-DOS and MS OS/2.
	
	For BASIC PDS 7.00 and 7.10, this example works only with near
	strings. If you are using far strings (BC /Fs compile switch or in
	QBX.EXE), you must use the string-manipulation routines provided with
	BASIC PDS 7.00 and 7.10 to change variable-length strings
	(StringAssign, StringRelease, StringAddress, and StringLength). For
	more information about using far strings, see Chapter 13 of the
	"Microsoft BASIC 7.0: Programmer's Guide" for versions 7.00 and 7.10.
	
	For more information about passing other types of parameters between
	BASIC and C and a list of which BASIC and C versions are compatible
	with each other, search in the Software/Data Library for the following
	word:
	
	   BAS2C
	
	Code Example
	------------
	
	The following BASIC program is BSUB.BAS, which invokes a C routine
	that creates two strings and passes them to a BASIC subroutine. The
	BASIC subroutine prints out the string (and the string's length)
	received from the C routine.
	
	   DECLARE SUB CSUB CDECL()
	   TYPE fixstringtype        ' Must use type to pass fixed-length string
	      B AS STRING * 26       '  in parameter list.
	   END TYPE
	   CALL CSUB
	   END
	
	   SUB BASSUB(A$, B AS fixstringtype)  ' Subroutine called from C
	      PRINT A$
	      PRINT LEN(A$)
	      PRINT B.B
	      PRINT LEN(B.B)
	   END SUB
	
	The following program is CSUB.C, which builds a string descriptor that
	is passed to a called BASIC subroutine:
	
	#include <string.h>
	struct stringdesc
	       {
	        int length;       /* string length */
	        char *string;     /* near address of the string */
	       };
	extern void pascal bassub(struct stringdesc *basstring,
	                          char *basfixstring);
	struct stringdesc *std;
	char thesecondstring[26];
	
	void csub()
	{                                         /* create the strings */
	   std->length = 18;
	   strcpy(std->string, "This is the string");
	   strcpy(thesecondstring, "This is the second string");
	   bassub(std, thesecondstring);          /* call BASIC subroutine */
	}
	
	To demonstrate these programs from an .EXE program, compile and link
	as follows:
	
	   BC BSUB.BAS;
	   CL /c /AM CSUB.C;
	   LINK /NOE BSUB CSUB;
	
	BSUB.EXE produces the following output:
	
	   This is the string
	   18
	   This is the second string
	   26
