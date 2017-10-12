---
layout: page
title: "Q41673: QuickC 2.00 README.DOC: Linking QC 2.00 Programs for Windows"
permalink: /pubs/pc/reference/microsoft/kb/Q41673/
---

	Article: Q41673
	Product: Microsoft C
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER| |
	Last Modified: 28-FEB-1989
	
	The following information is taken from the QuickC Version 2.00
	README.DOC file, part 4, "Notes For Windows and OS/2 Programmers."
	
	The following is for Windows Programmers:
	
	1. Special Instructions for Linking
	
	   If you own the Windows Software Development Kit (SDK) and want to
	   use QuickC 2.00 to write Windows programs, you cannot use either
	   the standard QuickC linker or the SDK linker. Instead, replace the
	   QuickC linker LINK.EXE (version 4.06, which is installed by the
	   SETUP program), with the 120K LINK.EXE file (version 5.02 of the
	   Microsoft Segmented-Executable Linker for MS-DOS, Windows, and
	   OS/2). You can find it on the distribution disk labeled "Learning
	   the Microsoft QuickC Environment". This linker works with QuickC,
	   C 5.10, and the Software Development Kit. It replaces all earlier
	   versions of the linker.
	
	2. Linker Warning Message L4042
	
	   L4024  name : multiple definitions for export name
	
	   This warning occurs if you declare a name exported in both the
	   .DEF file and with the _export keyword in a .C file. It can be
	   safely ignored. You can eliminate it by removing one or the other
	   of the export declarations for the name.
