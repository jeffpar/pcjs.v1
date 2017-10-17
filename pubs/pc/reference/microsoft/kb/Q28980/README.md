---
layout: page
title: "Q28980: &quot;NUL&quot; Device Behaves Different in QB 4.x than 3.00 or GWBASIC"
permalink: /pubs/pc/reference/microsoft/kb/Q28980/
---

## Q28980: &quot;NUL&quot; Device Behaves Different in QB 4.x than 3.00 or GWBASIC

	Article: Q28980
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom buglist4.00 buglist4.00b buglist4.50
	Last Modified: 24-JAN-1990
	
	The NUL device in QuickBASIC Versions 4.00, 4.00b, and 4.50 behaves
	differently than in previous versions of QuickBASIC (or in GW-BASIC
	3.20).
	
	Microsoft has confirmed this to be a problem in QuickBASIC Versions
	4.00, 4.00b, and 4.50, and in Microsoft BASIC Compiler Versions 6.00
	and 6.00b for MS-DOS and MS OS/2 (buglist6.00, buglist6.00b). This
	problem was corrected in Microsoft BASIC Professional Development
	System (PDS) Version 7.00 for MS-DOS and MS OS/2 (fixlist7.00).
	
	When the program below is run (either inside the QB.EXE editor or from
	an executable .EXE program), the (incorrect) output is as follows:
	
	   third
	
	When run inside the QuickBASIC Version 3.00 editor or compiled to an
	EXE file with QB.EXE Version 3.00, or run in GW-BASIC Interpreter
	Version 3.20, the (correct) output is as follows:
	
	   first
	   secondthird
	
	With Version 4.00, the string BUFFER$ appears to be reinitialized with
	each PRINT #1 statement.
	
	If the device name is changed from NUL to anything else, for example
	FOO, then QuickBASIC Versions 3.00 and 4.00 produce the same (correct)
	output.
	
	The following is a code example for this problem:
	
	   open "nul" for random as #1
	   field #1, 65 as buffer$
	   print#1,"first"
	   print#1,"second";
	   print #1,"third"
	   print buffer$
