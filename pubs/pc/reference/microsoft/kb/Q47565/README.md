---
layout: page
title: "Q47565: Using Named COMMON /SYMBOL/ May Cause &quot;String Space Corrupt&quot;"
permalink: /pubs/pc/reference/microsoft/kb/Q47565/
---

## Q47565: Using Named COMMON /SYMBOL/ May Cause &quot;String Space Corrupt&quot;

	Article: Q47565
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist4.00b buglist4.50 SR# S890710-48
	Last Modified: 26-FEB-1990
	
	When running a program from the QuickBASIC QB.EXE environment Version
	4.50, 4.00b, or 4.00, a "string space corrupt" error message can
	occur, dumping you back to DOS, when all of the following conditions
	occur together:
	
	1. The program contains a named COMMON block with the name of
	   /SYMBOL/.
	
	2. The named COMMON block contains a variable-length STRING.
	
	3. Any Quick library has been loaded.
	
	Microsoft has confirmed this to be a problem in QuickBASIC Versions
	4.00, 4.00b, and 4.50. We are researching this problem and will
	post new information here as it becomes available.
	
	This problem does not occur in the Microsoft BASIC Professional
	Development System (PDS) Version 7.00 QBX.EXE environment.
	
	This problem can be corrected by any of the following methods:
	
	1. Rename the COMMON block to anything but /SYMBOL/.
	
	2. Remove all variable-length STRINGs from the COMMON block.
	
	3. Changed the variable-length STRINGs to fixed-length STRINGs.
	
	4. Invoke QuickBASIC without loading a Quick library.
	
	Code Example
	------------
	
	The following sample program generates a "String space corrupt" error
	message and then drops you out to DOS if run from within the
	environment with a Quick library loaded:
	
	   COMMON /SYMBOL/ Astring$
	   Print "Hello"
	   END
	
	Additional reference word: B_BasicCom
