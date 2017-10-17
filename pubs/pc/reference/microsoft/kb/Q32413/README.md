---
layout: page
title: "Q32413: Loading More Than Seven QuickLoad Files/&#36;INCLUDE in Editor"
permalink: /pubs/pc/reference/microsoft/kb/Q32413/
---

## Q32413: Loading More Than Seven QuickLoad Files/&#36;INCLUDE in Editor

	Article: Q32413
	Version(s): 4.00 4.00b
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist4.00b fixlist4.50 B_BasicCom
	Last Modified: 12-DEC-1989
	
	When you save eight or more separate subprogram files (each containing
	an $INCLUDE metacommand) in QuickLoad format along with a main program
	in the QB.EXE Version 4.00 editor, the next time you load the main
	program into the editor, only the first seven subprogram files (listed
	in the .MAK file) will be automatically loaded.
	
	Microsoft has confirmed this to be a problem in Microsoft QuickBASIC
	Versions 4.00 and 4.00b and in the version of QuickBASIC provided with
	Microsoft BASIC Compiler Versions 6.00 and 6.00b (buglist6.00,
	buglist6.00b) for MS-DOS and MS OS/2. This problem was corrected in
	QuickBASIC Version 4.50 and in the QBX.EXE environment of Microsoft
	BASIC PDS Version 7.00 (fixlist7.00).
	
	The following are two workarounds for the problem:
	
	1. Save the files in text format instead of in QuickLoad format.
	
	2. Manually load all files after the seventh listed in the .MAK file.
	
	The following code demonstrates the problem:
	
	' This is the main program G.BAS:
	DECLARE SUB g1 ()
	DECLARE SUB g2 ()
	DECLARE SUB g3 ()
	DECLARE SUB g4 ()
	DECLARE SUB g5 ()
	DECLARE SUB g6 ()
	DECLARE SUB g7 ()
	DECLARE SUB g8 ()
	DECLARE SUB g9 ()
	DECLARE SUB g10 ()
	REM $INCLUDE: 'in.bas'
	PRINT "this is the main program"
	CALL g1
	CALL g2
	CALL g3
	CALL g4
	CALL g5
	CALL g6
	CALL g7
	CALL g8
	CALL g9
	CALL g10
	
	' This is the separate $INCLUDE file IN.BAS:
	PRINT "hello"
	
	' This is the separate file G1.BAS:
	SUB g1 STATIC
	REM $INCLUDE: 'in.bas'
	END SUB
	
	' This is the separate file G10.BAS:
	SUB g10 STATIC
	REM $INCLUDE: 'in.bas'
	END SUB
	
	' The other eight subprogram files G2.BAS through G9.BAS have the same
	' structure as G1.BAS and G10.BAS shown above. All files should be
	' saved in QuickLoad format to show the problem. In this case, all the
	' files were loaded into the editor and a SAVE ALL was used to make
	' the .MAK file (G.MAK).
