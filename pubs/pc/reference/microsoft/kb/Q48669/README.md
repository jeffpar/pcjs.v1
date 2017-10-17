---
layout: page
title: "Q48669: QB 4.50 .EXE Program Might Print DYNAMIC Arrays Incorrectly"
permalink: /pubs/pc/reference/microsoft/kb/Q48669/
---

## Q48669: QB 4.50 .EXE Program Might Print DYNAMIC Arrays Incorrectly

	Article: Q48669
	Version(s): 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890809-44 buglist4.50
	Last Modified: 17-JAN-1991
	
	DYNAMIC arrays might not PRINT correctly when using the PRINT TAB(nn),
	SPC(nn), or SPACE$(nn) statement in .EXE programs compiled with BC.EXE
	in Microsoft QuickBASIC version 4.50. The problem does not occur in
	the QB.EXE editor environment.
	
	This problem can occur when PRINTing any DYNAMIC array, and compiling
	the program without the /D (DEBUG), /X (RESUME), or /AH (HUGE ARRAYS)
	switch. STATIC arrays print correctly regardless of the compiler
	switches used.
	
	Microsoft has confirmed this to be a problem in version 4.50. This
	problem is corrected in Microsoft BASIC Professional Development
	System (PDS) version 7.00 (fixlist7.00).
	
	This problem does not occur in Microsoft QuickBASIC version 4.00 or
	4.00b or in Microsoft BASIC Compiler version 6.00 or 6.00b.
	
	To work around the problem in 4.50, compile with one or all of the
	following compiler switches: /d /x /ah. For example:
	
	   BC filename /d /x /ah;
	
	The problem can also be corrected by using STATIC arrays rather than
	DYNAMIC arrays.
	
	Code Example
	------------
	
	' $STATIC
	
	DIM SVarStr$(3)
	DIM SFixStr(3) AS STRING * 4
	DIM SInt%(3)
	DIM SSgl!(3)
	
	' $DYNAMIC
	
	DIM DVarStr$(3)
	DIM DFixStr(3) AS STRING * 4
	DIM DInt%(3)
	DIM DSgl!(3)
	
	CLS
	
	FOR A% = 1 TO 3
	    SVarStr$(A%) = STR$(A%)
	    DVarStr$(A%) = STR$(A%)
	
	    SFixStr(A%) = STR$(A%)
	    DFixStr(A%) = STR$(A%)
	
	    SInt%(A%) = A%
	    DInt%(A%) = A%
	
	    SSgl!(A%) = A%
	    DSgl!(A%) = A%
	NEXT A%
	
	PRINT "STATIC AND DYNAMIC ARRAYS USING TAB(nn)"
	PRINT
	PRINT TAB(5); SVarStr$(1); TAB(12); SVarStr$(2); TAB(18); SVarStr$(3)
	PRINT TAB(5); DVarStr$(1); TAB(12); DVarStr$(2); TAB(18); DVarStr$(3)
	PRINT
	PRINT TAB(5); SFixStr(1); TAB(12); SFixStr(2); TAB(18); SFixStr(3)
	PRINT TAB(5); DFixStr(1); TAB(12); DFixStr(2); TAB(18); DFixStr(3)
	PRINT
	PRINT TAB(5); SInt%(1); TAB(12); SInt%(2); TAB(18); SInt%(3)
	PRINT TAB(5); DInt%(1); TAB(12); DInt%(2); TAB(18); SInt%(3)
	PRINT
	PRINT TAB(5); SSgl!(1); TAB(12); SSgl!(2); TAB(18); SSgl!(3)
	PRINT TAB(5); DSgl!(1); TAB(12); DSgl!(2); TAB(18); SSgl!(3)
	PRINT
	PRINT "STATIC AND DYNAMIC ARRAYS USING SPACE(nn)"
	PRINT
	PRINT SPACE$(5); SVarStr$(1); SPACE$(5); SVarStr$(2);
	PRINT SPACE$(5); SVarStr$(3)
	PRINT SPACE$(5); DVarStr$(1); SPACE$(5); DVarStr$(2);
	PRINT SPACE$(5); DVarStr$(3)
	PRINT
	PRINT SPACE$(5); SFixStr(1); SPACE$(5); SFixStr(2);
	PRINT SPACE$(5); SFixStr(3)
	PRINT SPACE$(5); DFixStr(1); SPACE$(5); DFixStr(2);
	PRINT SPACE$(5); DFixStr(3)
	PRINT
	PRINT SPACE$(5); SInt%(1); SPACE$(5); SInt%(2); SPACE$(5); SInt%(3)
	PRINT SPACE$(5); DInt%(1); SPACE$(5); DInt%(2); SPACE$(5); DInt%(3)
	PRINT
	PRINT SPACE$(5); SSgl!(1); SPACE$(5); SSgl!(2); SPACE$(5); SSgl!(3)
	PRINT SPACE$(5); DSgl!(1); SPACE$(5); DSgl!(2); SPACE$(5); DSgl!(3)
	PRINT
	PRINT "STATIC AND DYNAMIC ARRAYS USING SPC(nn)"
	PRINT
	PRINT SPC(5); SVarStr$(1); SPC(5); SVarStr$(2); SPC(5); SVarStr$(3)
	PRINT SPC(5); DVarStr$(1); SPC(5); DVarStr$(2); SPC(5); DVarStr$(3)
	PRINT
	PRINT SPC(5); SFixStr(1); SPC(5); SFixStr(2); SPC(5); SFixStr(3)
	PRINT SPC(5); DFixStr(1); SPC(5); DFixStr(2); SPC(5); DFixStr(3)
	PRINT
	PRINT SPC(5); SInt%(1); SPC(5); SInt%(2); SPC(5); SInt%(3)
	PRINT SPC(5); DInt%(1); SPC(5); DInt%(2); SPC(5); DInt%(3)
	PRINT
	PRINT SPC(5); SSgl!(1); SPC(5); SSgl!(2); SPC(5); SSgl!(3)
	PRINT SPC(5); DSgl!(1); SPC(5); DSgl!(2); SPC(5); DSgl!(3)
	PRINT
	END
	
	The values in the DYNAMIC arrays in the above program will PRINT
	unpredictably on all machines -- the values can vary depending on the
	hardware configuration.
