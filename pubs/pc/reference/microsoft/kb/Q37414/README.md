---
layout: page
title: "Q37414: Cannot Nest I/O Statements or Functions in I/O Statements"
permalink: /pubs/pc/reference/microsoft/kb/Q37414/
---

## Q37414: Cannot Nest I/O Statements or Functions in I/O Statements

	Article: Q37414
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 17-JAN-1991
	
	With two sequential files open, #1 for INPUT and #2 for OUTPUT, the
	following statement incorrectly sends output to the screen instead of
	to file #2:
	
	   PRINT #2, INPUT$(10, #1)
	
	To work around this behavior, do the INPUT$ into a temporary string
	variable, then PRINT that temporary string into the second file.
	
	This behavior occurs in Microsoft QuickBASIC versions 4.00, 4.00b, and
	4.50, in Microsoft BASIC Compiler versions 6.00 and 6.00b for MS-DOS
	and MS OS/2, and in Microsoft BASIC Professional Development System
	(PDS) versions 7.00 and 7.10 for MS-DOS and MS OS/2. This limitation
	is documented in the README.DOC file for BASIC PDS 7.00 and 7.10.
	
	The general rule to observe is as follows: do not nest input/output
	(i/o) statements or functions within other i/o statements or
	functions. This is a design limitation.
	
	The above limitation is related to the following restriction mentioned
	on Page 146 of the "Microsoft BASIC 7.0: Language Reference" (for 7.00
	and 7.10): "Avoid using I/O statements in a FUNCTION procedure called
	from an I/O statement; they can cause unpredictable results." See also
	Page 201 of "Microsoft QuickBASIC 4.0: Language Reference" for 4.00
	and 4.00b for the same caveat.
	
	QuickBASIC Version 3.00 successfully writes to file #2, not the
	screen. GWBASIC Version 3.22 also writes to file #2, not the screen
	(when you put line numbers in the source file below).
	
	The following code example shows the unexpected behavior:
	
	'This incorrectly writes to the screen.
	OPEN "\practice\test1.dat" FOR INPUT AS #1
	OPEN "test2.dat" FOR OUTPUT AS #2
	PRINT #2, INPUT$(10, #1)
	
	The input file TEST1.DAT is as follows:
	
	123456789012345
	
	The following program shows how to work around the problem by using a
	temporary string variable to accept the input before writing to file
	#2. This program correctly writes to file #2, not the screen:
	
	OPEN "\practice\test1.dat" FOR INPUT AS #1
	OPEN "test2.dat" FOR OUTPUT AS #2
	CopyString$ = INPUT$(10, #1)
	PRINT #2, CopyString$
