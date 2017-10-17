---
layout: page
title: "Q37566: CodeView Unexpectedly Exits to DOS"
permalink: /pubs/pc/reference/microsoft/kb/Q37566/
---

## Q37566: CodeView Unexpectedly Exits to DOS

	Article: Q37566
	Version(s): 2.10 2.20
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 8-APR-1990
	
	When debugging a program with CodeView, certain operations cause it to
	exit to DOS without giving any warning or error message. Some of the
	things that cause this behavior are trying to access help, setting a
	watch variable, and returning from a DOS shell.
	
	This problem occurs because not enough file handles are being
	allocated at boot time with "files=XX" in CONFIG.SYS. An error message
	is printed, but then over written before most people can see it.
	
	The solution is to make sure files are set to 20 in CONFIG.SYS.
