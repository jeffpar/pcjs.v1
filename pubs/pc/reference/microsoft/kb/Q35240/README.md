---
layout: page
title: "Q35240: On IBM PS/2 MCGA, SCREEN 1 and 2 Are Monochrome"
permalink: /pubs/pc/reference/microsoft/kb/Q35240/
---

## Q35240: On IBM PS/2 MCGA, SCREEN 1 and 2 Are Monochrome

	Article: Q35240
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 16-DEC-1989
	
	The Multi-Color Graphics Array (MCGA) adapter is the video subsystem
	integrated into the IBM PS/2 Models 25 and 30. MCGA combines modes of
	both the Color Graphics Adapter (CGA) and the Video Graphics Array
	(VGA) graphic display cards.
	
	The modes of the MCGA have colors and attributes, but its
	CGA-emulation modes have no way to assign colors to attributes within
	BASIC programs. In other words, there are effectively no colors for
	SCREEN 1 and 2 on the MCGA (or CGA) in BASIC -- the output is white on
	black.
	
	Note that the color capabilities for SCREEN 11 and SCREEN 13 are
	identical for MCGA and VGA.
	
	This information applies to Microsoft QuickBASIC Versions 4.00 4.00b
	and 4.50, to Microsoft BASIC Compiler Versions 6.00 and 6.00b, for
	MS-DOS and MS OS/2, and to Microsoft BASIC PDS Version 7.00 for MS-DOS
	and MS OS/2.
	
	The following book from Microsoft Press describes video details more
	completely:
	
	   "Programmer's Guide to PC & PS/2 Video Systems: Maximum Video
	   Performance from the EGA, VGA, HGC, and MCGA" by Richard Wilton (1987)
