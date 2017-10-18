---
layout: page
title: "Q34469: MASM 5.10 MACRO.DOC: Device I/O"
permalink: /pubs/pc/reference/microsoft/kb/Q34469/
---

## Q34469: MASM 5.10 MACRO.DOC: Device I/O

	Article: Q34469
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 12-JAN-1989
	
	The following information was taken from the MASM 5.10 MACRO.DOC file.
	
	DEVICE I/O
	
	@Read (3Fh)
	
	Reads data from a file or device
	
	Syntax:         @Read &buffer, length [,[handle] [,segment]]
	
	Arguments:      buffer      = Offset of buffer where data will
	                              be stored
	                length      = Length of data in bytes
	                handle      = File or device handle; if none given,
	                              keyboard (handle 0) is assumed
	                segment     = Segment of address string (DS if not
	                              given)
	Return:         If carry clear, bytes read in AX
	Registers used: Always AX, DX, BX, and CX; DS if segment
	                changed
	
	@Write (40h)
	
	Writes data to a file or device
	
	Syntax:         @Write &buffer, length, [,[handle] [,segment]]
	
	Arguments:      buffer      = Offset of buffer where data is
	                              stored
	                length      = Length of data in bytes
	                handle      = File or device handle; if none given,
	screen
	                              (handle 1) is assumed
	                segment     = Segment of address string (DS if not
	                              given)
	Return:         If carry clear, bytes written in AX
	Registers used: Always AX, DX, BX, and CX; DS if segment
	                changed
