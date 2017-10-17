---
layout: page
title: "Q48208: Example Passing char from C to BASIC"
permalink: /pubs/pc/reference/microsoft/kb/Q48208/
---

## Q48208: Example Passing char from C to BASIC

	Article: Q48208
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom S_C S_QuickC
	Last Modified: 7-FEB-1990
	
	The two programs shown below demonstrate how a Microsoft C routine can
	pass a char to BASIC.
	
	This information about interlanguage calling applies to QuickBASIC
	Versions 4.00, 4.00b, and 4.50 for MS-DOS, to Microsoft BASIC Compiler
	Versions 6.00 and 6.00b for MS-DOS and MS OS/2, and to Microsoft BASIC
	Professional Development System (PDS) Version 7.00 for MS-DOS and MS
	OS/2.
	
	For more information about passing other types of parameters between
	BASIC and C, and a list of which BASIC and C versions are compatible
	with each other, query in the Software/Data Library for the following
	word:
	
	   BAS2C
	
	Code Example
	------------
	
	The following BASIC program is BSUB.BAS, which invokes a C routine
	that passes a char to a BASIC subroutine, which then prints out the
	received character (and its length):
	
	DECLARE SUB CSUB CDECL()
	TYPE char                  ' must declare user-defined TYPE to hold
	   character AS STRING *1  '  char, as there are no single-byte
	END TYPE                   '  TYPEs in BASIC
	CALL CSUB
	END
	
	SUB BASSUB(cchar AS char) ' subroutine called by C routine
	   PRINT cchar.character
	   PRINT LEN(cchar.character)
	END SUB
	
	The following program is CSUB.C, which passes a char to a BASIC
	subroutine:
	
	#include <stdio.h>
	struct character         /* must declare as struct so type casting */
	       {                 /* won't affect value */
	          char thechar;
	       };
	extern void pascal bassub(struct character *baschar);
	struct character *c_char;
	
	void csub()
	{
	   c_char->thechar = 'A';
	   bassub(c_char);
	
	}
	
	To demonstrate these programs from an .EXE program, compile and link
	as follows:
	
	   BC BSUB.BAS;
	   CL /c /AM CSUB.C;
	   LINK /NOE BSUB CSUB;
	
	BSUB.EXE produces the following output:
	
	   A
	   1
