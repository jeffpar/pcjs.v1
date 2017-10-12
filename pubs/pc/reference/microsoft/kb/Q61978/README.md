---
layout: page
title: "Q61978: NMAKE U1001 Illegal Character Caused by Corrupted MAKEDIR"
permalink: /pubs/pc/reference/microsoft/kb/Q61978/
---

	Article: Q61978
	Product: Microsoft C
	Version(s): 1.11
	Operating System: MS-DOS
	Flags: ENDUSER | buglist1.11
	Last Modified: 4-DEC-1990
	
	NMAKE version 1.11 may produce a U1001 "syntax error: illegal
	character <character> in macro" while building a project.
	
	NMAKE has an internal macro, MAKEDIR, which contains the full drive
	and path to the directory from where NMAKE was invoked. This macro is
	corrupted in NMAKE version 1.11 under DOS. Rather than the correct
	pathname, the macro contains "garbage" or graphics characters. This
	macro can cause the U1001 "illegal character" error message.
	
	To display the contents of MAKEDIR, invoke NMAKE with the /P switch.
	This switch causes all macros to be displayed to the screen. To work
	around this problem, manually set MAKEDIR in the .MAK file for the
	project. Set it to the drive and path where the project is being
	built. If MAKEDIR is manually set in the .MAK file, it will override
	the default setting and correct the problem.
	
	Microsoft has confirmed this to be a problem with NMAKE version 1.11.
	We are researching this problem and will post new information here as
	it becomes available.
	
	NMAKE version 1.11 comes with Microsoft C Professional Development
	System version 6.00 for MS-DOS and MS OS/2.
	
	This problem does not occur with NMAKE version 1.10. The problem
	occurs only with the DOS version of NMAKE, not the protected mode
	version of NMAKE version 1.11.
