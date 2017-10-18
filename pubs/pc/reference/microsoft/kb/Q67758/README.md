---
layout: page
title: "Q67758: MASM Err Msg: Unable to Open Input File: options.asm"
permalink: /pubs/pc/reference/microsoft/kb/Q67758/
---

## Q67758: MASM Err Msg: Unable to Open Input File: options.asm

	Article: Q67758
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 6-FEB-1991
	
	The MASM fatal error "Unable to open input file: options.ASM" occurs
	when the MASM environment variable "MASM" is set to "options". After
	the variable has been set to "options", it needs to be cleared. This
	can be done as follows:
	
	   SET MASM=<ret>
	
	When the Runme program is executed to install MASM, it tells you
	to set your AUTOEXEC.BAT file as follows:
	
	   MOUSE                 (load mouse driver if you have a mouse)
	   SET PATH=d:\masm...   (directory containing MASM and utilities)
	   SET INCLUDE=d:\masm...(directory containing include files)
	   SET LIB=d:\masm....   (directory containing library and object files)
	   SET MASM=options      (standard assembly options)
	   SET LINK=options      (standard link options)
	   SET TMP=tempDir       (LINK work directory - use RAM disk if available)
	
	People often set their AUTOEXEC.BAT files literally as the Runme program
	shows.
