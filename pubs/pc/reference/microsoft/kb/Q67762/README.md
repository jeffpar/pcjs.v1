---
layout: page
title: "Q67762: Invalid Switch and Extensions in Brief Emulation"
permalink: /pubs/pc/reference/microsoft/kb/Q67762/
---

## Q67762: Invalid Switch and Extensions in Brief Emulation

	Article: Q67762
	Version(s): 1.02   | 1.02
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 6-FEB-1991
	
	The M editor version 1.02 comes with a BRIEF.INI file, which contains
	the key settings for Brief emulation. If you want Brief emulation, you
	must rename this file to "TOOLS.INI". This file will generate the
	following three messages when M loads the TOOLS.INI file during
	initialization:
	
	   mhctx is not an editor switch
	   load:$PATH:ulcase - no such file or directory
	   load:$PATH:justify - no such file or directory
	
	The messages are caused by the following three lines:
	
	   Line 223: "mhctx:Alt+H"
	   Line 263: "load:$PATH:ulcase"
	   Line 369: "load:$PATH:justify"
	
	Deleting these three lines will not change the performance of the M
	editor, and will eliminate the messages they cause when M is
	initialized.
	
	
	
	
	
	
	Microsoft NMake [Make Utility]
	=============================================================================
