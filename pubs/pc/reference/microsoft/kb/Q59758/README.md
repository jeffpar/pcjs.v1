---
layout: page
title: "Q59758: Single-Line IF...THEN Label, &quot;Syntax Error&quot;; Requires GOTO"
permalink: /pubs/pc/reference/microsoft/kb/Q59758/
---

## Q59758: Single-Line IF...THEN Label, &quot;Syntax Error&quot;; Requires GOTO

	Article: Q59758
	Version(s): 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900313-116 B_BasicCom B_MQuickB
	Last Modified: 26-MAR-1990
	
	A single-line IF statement of the form IF <cond> THEN <label> causes a
	"Syntax Error." In a single-line IF statement, you must use the GOTO
	statement to branch to a line label. This is different from the
	branching rule for line numbers, where the GOTO is optional.
	
	This information applies to Microsoft QuickBASIC Versions 2.00, 2.01,
	3.00, 4.00, 4.00b, and 4.50 for MS-DOS, to Microsoft BASIC Compiler
	Versions 6.00 and 6.00b for MS-DOS and OS/2, and to Microsoft BASIC
	Professional Development System (PDS) Version 7.00 for MS-DOS and MS
	OS/2.
	
	The following is the single-line IF statement syntax. (It is taken
	from the QuickBASIC 4.50 QB Advisor online Help system):
	
	      IF booleanexpression THEN thenpart [ELSE elsepart]
	
	   The thenpart and the elsepart both have the following syntax:
	
	      {statements | [GOTO]linenumber | GOTO linelabel }
	
	   The following list describes the parts of the thenpart and
	   elsepart syntax:
	
	      Part         Description
	      ----         -----------
	
	      statements   One or more BASIC statements, separated by colons
	
	      linenumber   A valid BASIC program line number
	
	      linelabel    A valid BASIC line label
	
	   Note that GOTO is optional with a line number but is required
	   with a line label.
	
	A Related Issue in QuickBASIC for the Apple Macintosh
	-----------------------------------------------------
	
	Note that QuickBASIC for the Apple Macintosh does not require the GOTO
	for a label in an IF statement. This prevents making an implicit CALL,
	as in the IF...THEN subname statement. For more information, query on
	the following words:
	
	   Macintosh and QuickBASIC and GOTO and implicit and subprogram
	             and explicit
	
	Code Example
	------------
	
	The following code example causes a syntax error on the IF statement:
	
	   IF 1 = 1 THEN Label      'Should be: IF 1 = 1 THEN GOTO Label
	   Label: PRINT "Made it!"
