---
layout: page
title: "Q30417: Error Message Generated when Include File Has CTRL+Z"
permalink: /pubs/pc/reference/microsoft/kb/Q30417/
---

## Q30417: Error Message Generated when Include File Has CTRL+Z

	Article: Q30417
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | buglist5.10
	Last Modified: 12-JAN-1989
	
	When assembling a source file with an include file that contains a
	CTRL+Z, the assembler generates the error message, "A2106: line too
	long."
	
	A workaround is to use the MS-DOS Copy command with the "/a" option,
	as in the following:
	
	copy /a test.asm test2.asm
	
	Microsoft has confirmed this to be a problem in Version 5.10. We are
	researching this problem and will post new information as it becomes
	available.
