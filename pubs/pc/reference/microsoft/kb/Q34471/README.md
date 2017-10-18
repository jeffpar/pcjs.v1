---
layout: page
title: "Q34471: MASM 5.10 MACRO.DOC: Directory Control"
permalink: /pubs/pc/reference/microsoft/kb/Q34471/
---

## Q34471: MASM 5.10 MACRO.DOC: Directory Control

	Article: Q34471
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 12-JAN-1989
	
	The following information was taken from the MASM 5.10 MACRO.DOC file.
	
	DIRECTORY CONTROL
	
	@MkDir, (39h), @RmDir (3Ah), and @ChDir (3Bh)
	
	Creates, deletes, or changes to the specified directory
	
	Syntax:         @MkDir &path [,segment]
	                @RmDir &path [,segment]
	                @ChDir &path [,segment]
	
	Arguments:      path        = Offset of ASCIIZ string to
	                segment     = Segment of path (DS if none given)
	Return:         If carrry set, error code in AX
	Registers used: AX and DX; DS if segment changed
	
	@GetDir (47h)
	
	Returns the current directory of the specified drive
	
	Syntax:         @GetDir &path [,[drive] [,segment]]
	
	Arguments:      buffer      = Offset of buffer to receive ASCIIZ
	directory
	                drive       = 8-bit drive number - 0=current, 1=A,
	2=B,    etc.
	                              (0 if none given)
	                segment     = Segment of path (DS if none given)
	Return:         If carrry set, error code in AX
	Registers used: AX, SI, and DL; DS if segment changes
