---
layout: page
title: "Q41441: Documentation Error Page 136 _bios_equiplist"
permalink: /pubs/pc/reference/microsoft/kb/Q41441/
---

## Q41441: Documentation Error Page 136 _bios_equiplist

	Article: Q41441
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | s_quickc docerr
	Last Modified: 16-MAY-1989
	
	Page 136 of the "Microsoft C 5.10 Run-Time Library Reference" manual
	incorrectly documents the return values for _bios_equiplist. In the
	list of return values, it states that bit 13 is as follows:
	
	    True (1) if and only if a serial printer is installed.
	
	This is only true if you have an IBM PCjr. On PC XT type machines,
	this value reports regardless of whether or not you have an internal
	modem installed.
	
	As a result, for PC XT machines, this line should read as follows:
	
	   True (1) if and only if an internal modem is installed.
	
	This error also exists in the QuickC Versions 1.00 and 1.01 run-time
	library reference manuals and in the QuickC Version 2.00 on-line help.
