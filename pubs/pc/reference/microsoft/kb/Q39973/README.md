---
layout: page
title: "Q39973: Accessing I/O Ports under OS/2 Protected Mode"
permalink: /pubs/pc/reference/microsoft/kb/Q39973/
---

## Q39973: Accessing I/O Ports under OS/2 Protected Mode

	Article: Q39973
	Version(s): 5.10
	Operating System: OS/2
	Flags: ENDUSER | COM1 COM2 serial communication
	Last Modified: 5-JAN-1989
	
	Problem:
	
	I am trying to use the inp(), inpw(), outp(), and outpw() routines in
	the Microsoft C Version 5.10 run-time library. Every time I run my
	program I get the following message:
	
	   SYS1943: A program caused a protection violation.
	
	Response:
	
	To read from or write to ports under OS/2 protected mode you must have
	a .DEF module-definition file that gives IOPL (input/output privilege)
	to the _IOSEG segment. Also, if the intrinsic (/Oi) switch is used
	during compilation, the segments that contain the port functions must
	be given IOPL. You can check the .MAP file for the associated segment
	name or compile with the /NT switch to manually name the segment.
	
	The following must be in your .DEF file if /Oi was not used:
	
	SEGMENTS
	    _IOSEG CLASS 'IOSEG_CODE' IOPL
	
	If /Oi was used, the following must be in your .DEF file:
	
	SEGMENTS
	    (segment name) IOPL
	
	Note: Segments that have IOPL cannot make system calls. If you do,
	you will generate a GP fault, a general protection violation. This
	behavior is discussed on Page 239 of Letwin's "Inside OS/2."
