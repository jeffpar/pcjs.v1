---
layout: page
title: "Q49130: &quot;SELECT Without END SELECT&quot; Flagged in Wrong Place by QB 4.00"
permalink: /pubs/pc/reference/microsoft/kb/Q49130/
---

## Q49130: &quot;SELECT Without END SELECT&quot; Flagged in Wrong Place by QB 4.00

	Article: Q49130
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist4.00b buglist4.50 B_BasicCom
	Last Modified: 27-FEB-1990
	
	The QB.EXE editor in QuickBASIC Versions 4.00, 4.00b, and 4.50 flags
	the error "SELECT without END SELECT." However, the editor does not
	correctly locate and highlight the area of the code where the error
	occurs. The editor incorrectly places the cursor (or highlighting) at
	the top right corner or "home" of the current window, even though the
	error may have occurred several pages down.
	
	Microsoft has confirmed this to be a problem in QB.EXE in QuickBASIC
	Versions 4.00, 4.00b, and 4.50 for MS-DOS. This problem was corrected
	in the QBX.EXE environment supplied with Microsoft BASIC Professional
	Development System (PDS) Version 7.00 for MS-DOS and MS OS/2
	(fixlist7.00).
	
	Whenever a mismatch occurs with two paired statements, the editor
	should highlight the other member of the pair when it reports an error
	message. For example, if a program contains a multiple-line IF
	statement but fails to include the END IF statement, the editor should
	locate the error, highlight the IF keyword, and then display the error
	message in a dialog box. However, for the error "SELECT without END
	SELECT," the editor incorrectly fails to highlight the SELECT
	statement that is missing a matching END SELECT phrase.
	
	Code Example
	------------
	
	The following code example demonstrates the problem:
	
	REM <-- The QB.EXE editor misleadingly highlights this topmost REM
	REM     statement when the "SELECT without END SELECT" error
	REM     occurs, no matter where the SELECT error is located in
	REM     this window.
	SELECT CASE x%
	CASE 1
	CASE 2
	   ' END SELECT  ' Adding this END SELECT corrects the syntax error.
	
	The error-flagging location problem does not occur for IF statements,
	as in the following example:
	
	REM  QB.EXE correctly highlights "IF" for the following
	REM  "Block IF Without END IF" error:
	IF x% THEN
	   PRINT "hello"
	      ' END IF ' Adding this END IF corrects the syntax error.
