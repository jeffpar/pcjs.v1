---
layout: page
title: "Q43743: Cannot Search and Replace String Longer Than 39 Characters"
permalink: /pubs/pc/reference/microsoft/kb/Q43743/
---

## Q43743: Cannot Search and Replace String Longer Than 39 Characters

	Article: Q43743
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890410-125 buglist4.50
	Last Modified: 31-JAN-1990
	
	In the QB.EXE environment in Microsoft QuickBASIC Version 4.50,
	searching for and replacing a string does not work correctly if the
	replacement string is longer than 39 characters. A longer replacement
	string can be entered, but the editor truncates this string to 39
	characters.
	
	Microsoft has confirmed this to be a problem in QuickBASIC Version
	4.50. We are researching this problem and will post new information
	here as it becomes available.
	
	This problem does not occur in the QBX.EXE editor provided with
	Microsoft BASIC Professional Development System (PDS) Version 7.00.
	
	QuickBASIC Versions 2.00 and 3.00 correctly make the substitution for
	strings longer than 39 characters. QuickBASIC Versions 4.00 and 4.00b
	do not allow a string longer than 39 characters to be entered as the
	replacement string, so the problem doesn't occur in these versions.
	
	To duplicate this problem, do the following:
	
	1. Start a new program in QB.EXE from QuickBASIC 4.50 and enter the
	   following line:
	
	      PRINT
	
	2. Choose the Search menu by pressing ALT+S, then press C.
	
	3. Enter "PRINT" as the string to find and
	   "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1234567890" as the
	   replacement string (39 a's, followed by numbers).
	
	4. Choose Change All by pressing ALT+C.
	
	The editor will replace PRINT with the given string, but it will
	truncate the numbers off of the end.
