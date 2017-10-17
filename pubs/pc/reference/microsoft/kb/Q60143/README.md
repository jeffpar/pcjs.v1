---
layout: page
title: "Q60143: /FPa, /Lp, and Near Strings Disabled with Quick Library"
permalink: /pubs/pc/reference/microsoft/kb/Q60143/
---

## Q60143: /FPa, /Lp, and Near Strings Disabled with Quick Library

	Article: Q60143
	Version(s): 7.00 7.10
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900321-16
	Last Modified: 17-JAN-1991
	
	If QBX.EXE is invoked with the /L option to load in a Quick library,
	the following compiler options will be disabled when the Make EXE File
	command is chosen from the Run menu:
	
	   Alternate Math        /FPa
	   OS/2 Protected Mode   /Lp
	   Near Strings
	
	This information applies to Microsoft BASIC Professional Development
	System (PDS) versions 7.00 and 7.10 for MS-DOS.
	
	A Quick library must be compiled using 80x87 or Emulator Math (/FPi),
	DOS or OS/2 real mode (/Lr), and Far Strings (/FS). Therefore, even if
	BASIC 7.00 or 7.10 is installed to support the Alternate Math library,
	OS/2 protected mode, and Near Strings, these compiler options cannot
	be selected from the Make EXE File menu option when a Quick library is
	loaded.
