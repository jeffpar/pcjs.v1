---
layout: page
title: "Q21899: CALL ABSOLUTE &quot;Unresolved Subprogram Reference,&quot; &quot;Not Defined&quot;"
permalink: /pubs/pc/reference/microsoft/kb/Q21899/
---

## Q21899: CALL ABSOLUTE &quot;Unresolved Subprogram Reference,&quot; &quot;Not Defined&quot;

	Article: Q21899
	Version(s): 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 27-DEC-1989
	
	Problem:
	
	When I attempt to use the CALL ABSOLUTE statement in the QB.EXE
	editor, I get an "Unresolved Subprogram Reference" error message at
	compile time in QuickBASIC Versions 2.00, 2.01, and 3.00. I get a
	"Subprogram not defined" error message in QB.EXE in QuickBASIC
	Versions 4.00, 4.00b, 4.50.
	
	Response:
	
	For QuickBASIC Versions 4.00, 4.00b, 4.50
	-----------------------------------------
	
	The routine named ABSOLUTE is an external assembly language routine
	located in the QB.QLB Quick library (and in the QB.LIB linker
	library). To invoke CALL ABSOLUTE from within the QB.EXE 4.00, 4.00b,
	or 4.50 editor, you must invoke QB /L to load the QB.QLB Quick
	library. If you choose Make EXE File... from the Run menu, QuickBASIC
	then automatically links your program with QB.LIB.
	
	For QuickBASIC Versions 2.00, 2.01, 3.00
	----------------------------------------
	
	The routine called ABSOLUTE is an external assembly language routine
	located in a file called USERLIB.OBJ in QuickBASIC Versions 2.00 and
	2.01, and in a file called ABSOLUTE.OBJ in Version 3.00. To CALL
	ABSOLUTE, you will need to build a user library containing ABSOLUTE's
	.OBJ file, or link your program directly to it, as in the following
	examples:
	
	1. To CALL ABSOLUTE from a user library in Versions 2.00 and 2.01, do
	   the following:
	
	      BUILDLIB USERLIB.OBJ,USELIB1.EXE;
	      QB test.bas/L USELIB1.EXE;
	
	   To LINK TEST.BAS to ABSOLUTE in Versions 2.00 and 2.01, do the
	   following:
	
	      QB test.bas;
	      LINK test.OBJ+USERLIB.OBJ;
	
	2. To CALL ABSOLUTE from a user library in Version 3.00, do the
	   following:
	
	      BUILDLIB ABSOLUTE.OBJ,USELIB1.EXE;
	      QB test.bas/L USELIB1.EXE;
	
	   To LINK TEST.BAS to ABSOLUTE in Version 3.00, do the following:
	
	      QB test.bas;
	      LINK test.OBJ+ABSOLUTE.OBJ;
