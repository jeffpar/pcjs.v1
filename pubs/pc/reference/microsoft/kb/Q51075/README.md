---
layout: page
title: "Q51075: QB 4.x Editor Does Not Flag VARPTR&#36; Error, but BC.EXE Does"
permalink: /pubs/pc/reference/microsoft/kb/Q51075/
---

## Q51075: QB 4.x Editor Does Not Flag VARPTR&#36; Error, but BC.EXE Does

	Article: Q51075
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist4.00b buglist4.50 B_BasicCom
	Last Modified: 30-NOV-1989
	
	VARPTR$ can be used only with simple variables and with arrays of
	variable-length strings. Attempting to use the VARPTR$ function on a
	$DYNAMIC array is a programming error. However, the QB.EXE versions
	4.00, 4.00b, and 4.50 editors will not flag this as an error and will
	interpret and run programs that use VARPTR$ on $DYNAMIC arrays. The
	BC.EXE compiler Versions 4.00, 4.00b, and 4.50 correctly flag this as
	an error and give the error message "Dynamic array element illegal."
	
	This problem has been corrected in QBX.EXE, which comes with Microsoft
	BASIC Compiler Version 7.00 (fixlist7.00).
	
	The VARPTR$ function is used with both the PLAY and the DRAW
	statements to return the string representation of the address of a
	variable. The following code example demonstrates the problem in the
	QuickBASIC editor.
	
	Code Example
	------------
	
	     REM $DYNAMIC
	     CLS
	     TYPE aa
	          a AS INTEGER
	     END TYPE
	     REDIM a(50) AS aa
	     a(1).a = 10
	     PRINT VARPTR$(a(1).a)
	     END
