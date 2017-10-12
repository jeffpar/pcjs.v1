---
layout: page
title: "Q51768: spawn Ignores arg0 with DOS 3.00 and Later"
permalink: /pubs/pc/reference/microsoft/kb/Q51768/
---

	Article: Q51768
	Product: Microsoft C
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | S_QuickC S_QuickASM
	Last Modified: 16-JAN-1990
	
	Question:
	
	Why is arg0 ignored when I use a spawn command under DOS?
	
	Response:
	
	Under DOS Versions 3.00 and later, the first argument (arg0) is used
	to hold the path and name of the program. The third parameter in a
	spawn command is arg0. Regardless of what you specify arg0 to be, DOS
	passes the path and name of the program to the child function. Under
	DOS 2.x, arg0 is not defined.
	
	Under OS/2, this is not the case; arg0 is passed as specified with the
	spawn command.
