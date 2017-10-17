---
layout: page
title: "Q27482: &quot;String Space Corrupt&quot; Within Editor but Not in .EXE File"
permalink: /pubs/pc/reference/microsoft/kb/Q27482/
---

## Q27482: &quot;String Space Corrupt&quot; Within Editor but Not in .EXE File

	Article: Q27482
	Version(s): 4.00 4.00b
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom buglist4.00 buglist4.00b fixlist4.50
	Last Modified: 17-JAN-1990
	
	The following program gives a "String Space Corrupt" error inside the
	QB.EXE editor when it is executed a second time. However, if the
	second to the last line is deleted, the program executes without
	causing the error.
	
	If various other lines are removed, the program will also run without
	giving the error message.
	
	The program executes correctly if compiled and run as an executable
	file.
	
	Microsoft has confirmed this to be a problem in QB.EXE in QuickBASIC
	Versions 4.00 and 4.00b, and in QB.EXE in Microsoft BASIC Compiler
	Versions 6.00 and 6.00b for MS-DOS (buglist6.00, buglist6.00b). This
	problem was corrected in QB.EXE in QuickBASIC Version 4.50 and in
	QBX.EXE in Microsoft BASIC Professional Development System (PDS)
	Version 7.00 (fixlist7.00).
	
	As a workaround, compile and run the program as an executable file.
	
	The following is a code example:
	
	DEFINT A-Z
	INFI = 4: PARTIAL = 0
	P = 27
	OPEN "R", INFI, "LETHDR62", 220
	FIELD INFI, 220 AS FLD$
	BYTUSE = 4095
	FOR i = 1 TO 3
	    J = 220 - P + 1
	    IF J > BYTUSE THEN J = BYTUSE
	    FIELD INFI, P - 1 AS D$, J AS D1$
	    BYTUSE = BYTUSE - J: P = P + J
	    IF P > 220 THEN P = 1
	NEXT
	PRINT "Hello, the next statement fails on the second pass through"
	D$ = CHR$(6)
	CLOSE INFI
