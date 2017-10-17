---
layout: page
title: "Q68658: NMK Displays Only First of Multiple Commands"
permalink: /pubs/pc/reference/microsoft/kb/Q68658/
---

## Q68658: NMK Displays Only First of Multiple Commands

	Article: Q68658
	Version(s): 1.11
	Operating System: MS-DOS
	Flags: ENDUSER | buglist1.11 S_C S_NMK
	Last Modified: 1-FEB-1991
	
	NMK version 1.11 displays only the first of multiple commands it is
	executing when the exclamation point (!) command modifier is used with
	the predefined macro $? or $**.
	
	The ! command modifier executes the command for each dependent file if
	the command uses the predefined macro $? or $**. The $? macro refers
	to all dependent files that are out-of-date with respect to the
	target. The $** macro refers to all dependent files in the description
	block.
	
	The sample makefile below echoes each filename to the screen. The
	NMAKE output shows the correct result; each ECHO command is displayed
	and executed. Likewise, the NMK output executes each ECHO command;
	however, only the first command is displayed to the screen.
	
	Sample Makefile
	---------------
	
	ALL: foo1.c foo2.c foo3.c
	      !ECHO $**
	
	Output:
	
	      NMAKE                      NMK
	-----------------         -----------------
	      ECHO foo1.c               ECHO foo1.c
	foo1.c                    foo1.c
	      ECHO foo2.c         foo2.c
	foo2.c                    foo3.c
	      ECHO foo3.c
	foo3.c
	
	Microsoft has confirmed this to be a problem in NMK version 1.11. We
	are researching this problem and will post new information here as it
	becomes available.
