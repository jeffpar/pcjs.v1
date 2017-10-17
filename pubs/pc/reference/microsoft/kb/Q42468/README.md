---
layout: page
title: "Q42468: QB.EXE Hang or &quot;Division by Zero&quot; with Labeled REM &#36;INCLUDE"
permalink: /pubs/pc/reference/microsoft/kb/Q42468/
---

## Q42468: QB.EXE Hang or &quot;Division by Zero&quot; with Labeled REM &#36;INCLUDE

	Article: Q42468
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist4.00b buglist4.50 B_BasicCom
	Last Modified: 26-FEB-1990
	
	In the QB.EXE environment in QuickBASIC Version 4.50, a statement
	consisting of a line number (or label) followed by two or more spaces
	and then REM $INCLUDE: 'file', where "file" does not exist, displays a
	"Binding" message and hangs your machine at compile time.
	
	In QuickBASIC Versions 4.00 and 4.00b, attempting to compile the same
	program from within the QB.EXE environment generates the error
	"Division By Zero."
	
	Microsoft has confirmed these to be problems in QuickBASIC Versions
	4.00, 4.00b, and 4.50. This problem was corrected in Microsoft BASIC
	Professional Development System (PDS) Version 7.00 (fixlist7.00).
	
	If there is only one space between the line-number or label and REM
	$INCLUDE, the correct error message is generated: "File Not Found."
	
	Your machine will not hang and the correct error message will be
	generated if compiled using BC.EXE.
	
	Code Example
	------------
	
	05  '**** PROGRAM #1 ****
	06  '
	10  ' Compiling this program from within the environment will hang
	20  ' your machine in QB 4.50 and will give "DIVISION BY ZERO ERROR"
	30  ' in QB 4.00 and QB 4.00b.
	40  '
	50   REM $INCLUDE: 'missing'
	55  ' (Two or more spaces between line-number and REM, and 'missing'
	60  ' does not exist in the current directory.)
	
	05 '**** PROGRAM #2
	06 '
	10 ' This program will compile and generate the expected error of
	20 '  "FILE NOT FOUND"
	30 '
	40 REM $INCLUDE: 'missing'       --one space between line number and REM
