---
layout: page
title: "Q28165: &quot;String Formula Too Complex&quot; with Recursive String Function"
permalink: /pubs/pc/reference/microsoft/kb/Q28165/
---

## Q28165: &quot;String Formula Too Complex&quot; with Recursive String Function

	Article: Q28165
	Version(s): 6.00 6.00b 7.00 | 6.00 6.00b 7.00
	Operating System: MS-DOS          | OS/2
	Flags: ENDUSER | B_QuickBas
	Last Modified: 2-FEB-1990
	
	The program below, which recursively invokes a string function, causes
	a "String Formula Too Complex" run-time error. This program shows a
	design limitation in Microsoft BASIC Compiler Version 6.00 and 6.00b,
	Microsoft BASIC Professional Development System (PDS) Version 7.00,
	and in QuickBASIC that is not usually encountered.
	
	In the following program, QuickBASIC is computing RIGHT$(TEXT$,1),
	assigning the value to a temporary string descriptor, and then
	recursing on REVERSE$(LEFT$(TEXT$,LEN(TEXT$)-1)):
	
	   DECLARE FUNCTION Reverse$ (Text$)
	   CLS
	   PRINT Reverse$ ("123456789 1234567890")
	
	   FUNCTION Reverse$ (Text$)
	   IF LEN(Text$) = 0 THEN
	     EXIT FUNCTION
	   ELSE
	     Reverse$ = RIGHT$(Text$, 1) + Reverse$ (LEFT$(Text$, LEN(Text$) -1))
	   END IF
	   END FUNCTION
	
	The temporary string descriptor is not released until the recursion is
	completed. Each recursive REVERSE$ function call locks one string
	descriptor. Because QuickBASIC allows only 20 temporary descriptors
	(more than enough for most applications), after around 20 function
	calls the program gives the error "String Formula Too Complex."
	
	The workaround is to use a real string descriptor as follows (which
	will be allocated from stack space):
	
	   Temp$ = Reverse$(LEFT$(Text$,LEN(Text$)-1))
	   Reverse$ = RIGHT$(Text$,1) + Temp$
