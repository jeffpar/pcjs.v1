---
layout: page
title: "Q57852: LINK /PAC Switch in 6.00/6.00b Is Now /PACKC in BASIC PDS 7.00"
permalink: /pubs/pc/reference/microsoft/kb/Q57852/
---

## Q57852: LINK /PAC Switch in 6.00/6.00b Is Now /PACKC in BASIC PDS 7.00

	Article: Q57852
	Version(s): 7.00 7.10 | 7.00 7.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | docerr SR# S900116-46
	Last Modified: 8-JAN-1991
	
	The LINK.EXE /PACKCODE switch of the Microsoft Segmented-Executable
	Linker version 5.01.20, shipped with Microsoft BASIC Compiler versions
	6.00 and 6.00b for MS-DOS and MS OS/2, can be abbreviated with /PAC on
	the LINK command line. The same is true for the Microsoft Overlay
	Linker shipped with Microsoft QuickBASIC versions 4.00, 4.00b, and
	4.50.
	
	This abbreviation has changed to /PACKC in the Segmented-Executable
	Linker version 5.05 shipped with Microsoft BASIC Professional
	Development System (PDS) versions 7.00 and 7.10 for MS-DOS and MS
	OS/2.
	
	On Page 589 of the "Microsoft BASIC 7.0: Programmer's Guide" (for
	versions 7.00 and 7.10) the abbreviation for /PACKCODE is incorrectly
	documented as being /PAC. It should be changed to /PACKC.
	
	In addition, eleven occurences of /PAC should be changed to /PACKC on
	Pages 596-597 of the "Microsoft BASIC 7.0: Programmer's Guide" (for
	versions 7.00 and 7.10).
	
	The /PACKCODE switch abbreviation was changed from /PAC to /PACKC
	because a new switch was added to the linker to take advantage of
	Microsoft BASIC PDS's ability to manage multiple data segments (far
	strings). The name of the new switch is /PACKDATA and is used to pack
	small data segments together. Its abbreviation is /PACKD.
	
	Although it is not ambiguous to have one switch abbreviated /PAC and
	another /PACKD, because the switches have similar functions, it is
	more logical for their abbreviations to have the same first 4 letters
	("PACK") followed by a distinguishing letter ("C" or "D").
