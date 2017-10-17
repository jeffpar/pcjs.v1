---
layout: page
title: "Q41153: &quot;AS Clause Required&quot; Error for REDIM Not Detected in QB 4.50"
permalink: /pubs/pc/reference/microsoft/kb/Q41153/
---

## Q41153: &quot;AS Clause Required&quot; Error for REDIM Not Detected in QB 4.50

	Article: Q41153
	Version(s): 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.50 SR# S890115-2
	Last Modified: 17-FEB-1989
	
	In the QB.EXE environment, if you REDIM an array of any type (which
	had been previously DIMensioned using an AS clause) without
	re-specifying the type with the AS clause, the error is not reported.
	The error is correctly reported when the program is compiled using
	BC.EXE.
	
	Microsoft has confirmed this to be a problem in Version 4.50. We are
	researching this problem and will post new information as it becomes
	available.
	
	The program example below demonstrates the problem. When run as shown
	below inside the QuickBASIC environment, the program executes
	without error. However, if it is compiled using BC.EXE, the error
	message "AS clause required" is generated. This error message
	also properly displays if the program is run inside the QuickBASIC
	Version 4.00 or 4.00b environment.
	
	The following is a code example:
	
	TYPE Test
	  a AS STRING * 40
	  b AS STRING * 40
	END TYPE
	
	REDIM a(1 TO 100) AS Test
	PRINT LBOUND(a), UBOUND(a), LEN(a(LBOUND(a)))
	
	REDIM a(20 TO 50)                     'This line contains the error
	PRINT LBOUND(a), UBOUND(a), LEN(a(LBOUND(a)))
