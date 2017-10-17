---
layout: page
title: "Q59429: QB.EXE/QBX.EXE &quot;Identifier Too Long&quot; Using User-Defined TYPE"
permalink: /pubs/pc/reference/microsoft/kb/Q59429/
---

## Q59429: QB.EXE/QBX.EXE &quot;Identifier Too Long&quot; Using User-Defined TYPE

	Article: Q59429
	Version(s): 6.00 6.00b 7.00 7.10
	Operating System: MS-DOS
	Flags: ENDUSER | buglist6.00 buglist6.00b buglist7.00 buglist7.10 B_QuickBas
	Last Modified: 20-SEP-1990
	
	Inside the QuickBASIC environment (QB.EXE or QBX.EXE), an "Identifier
	Too Long" error is incorrectly generated under the following
	circumstances:
	
	1. Create a user-defined TYPE (record). Give it one field with a long
	   name (20 to 40 characters).
	
	2. DIMension a variable of that TYPE. Give the variable a long name
	   (20 to 40 characters).
	
	3. Use the variable in some statement in the program and run the
	   program.
	
	4. If the length of the entire identifier (record name plus the field
	   name) is longer than forty characters, an "Identifier Too Long"
	   error message is generated in the environment.
	
	This error occurs in QB.EXE and QBX.EXE, but does NOT occur with
	BC.EXE.
	
	Microsoft has confirmed this to be a problem in the QB.EXE environment
	of Microsoft QuickBASIC versions 4.00, 4.00b, and 4.50 (buglist4.00,
	buglist4.00b, buglist4.50); in the QB.EXE environment of Microsoft
	BASIC Compiler versions 6.00 and 6.00b; and in QuickBASIC Extended
	(QBX.EXE), the extended environment provided with Microsoft BASIC
	Professional Development System (PDS) versions 7.00 and 7.10. We are
	researching this problem and will post new information here as it
	becomes available.
	
	When using TYPEd variables, both parts of the variable, the variable's
	name and its field name, are supposed to have a limit of 40
	characters. This means that the total possible length of a TYPEd
	variable when used in a statement is 80 characters.
	
	This problem can be worked around by either shortening the name of the
	variable, shortening the name of the field in the TYPE, or by placing
	the single variable into an array of that TYPE.
	
	Code Example
	------------
	
	TYPE temp
	  '012345678901234567890123456789; Forty characters is a legal name:
	   thisisatesttoobutthisistoolong AS INTEGER
	END TYPE
	
	DIM thisisatest AS temp
	
	' The following causes an "identifier too long" error
	' when the entire name exceeds forty characters.
	'012345678901234567890123456789012345678901
	 thisisatest.thisisatesttoobutthisistoolong = 10
	
	DIM thisisatest(1) AS temp
	
	'If you make "thisisatest" an array instead of a single type
	'variable the problem is eliminated.
	thisisatest(1).thisisatesttoobutthisistoolong = 10
