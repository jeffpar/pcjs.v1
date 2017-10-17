---
layout: page
title: "Q68446: WIDTH &quot;CONS:&quot; or &quot;SCRN:&quot; Uses Only 40 or 80 in BASIC 7.00/7.10"
permalink: /pubs/pc/reference/microsoft/kb/Q68446/
---

## Q68446: WIDTH &quot;CONS:&quot; or &quot;SCRN:&quot; Uses Only 40 or 80 in BASIC 7.00/7.10

	Article: Q68446
	Version(s): 7.00 7.10
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S901023-92 buglist7.00 buglist7.10 docerr
	Last Modified: 29-JAN-1991
	
	In BASIC PDS 7.00 and 7.10, the WIDTH for the screen device is
	restricted to 40 or 80 characters across all the different WIDTH
	syntaxes.
	
	The WIDTH statement fails to set widths other than 40 or 80 for the
	"CONS:" device name in QuickBASIC 4.50 (buglist4.50) and BASIC PDS
	7.00 and 7.10. The WIDTH statement also fails to set widths other than
	40 or 80 for the "SCRN:" device name for BASIC PDS 7.00 and 7.10, but
	succeeds in QuickBASIC 4.50. (The problem occurs both in the
	environment and in a compiled .EXE program.) The documentation does
	not explicitly say what is expected for the WIDTH dev$,wid% syntax.
	
	This may be a design restriction. Microsoft is researching this
	problem and will post new information here as it becomes available.
	
	This information applies to QuickBASIC version 4.50 and to Microsoft
	BASIC Professional Development System (PDS) versions 7.00 and 7.10 for
	MS-DOS.
	
	BASIC PDS 7.00 and 7.10 only lets you use WIDTH of 40 or 80 for the
	WIDTH dev$,wid% syntax when dev$ is the screen device name "CONS:" or
	"SCRN:". (This behavior actually matches the documented restriction
	for the separate WIDTH wid%,height% syntax for screen output.)
	
	The following code example demonstrates this behavior:
	
	Code Example
	------------
	
	CLS
	WIDTH "scrn:", 11   ' Sets screen width to 11 characters.
	OPEN "scrn:" FOR OUTPUT AS #1                ' OK in 4.50, but
	PRINT #1, "123456789012345678901234567890"   ' WIDTH ignored in BASIC
	CLOSE                                        ' 7.x in .EXE and QBX.EXE
	OPEN "scrn:" FOR OUTPUT AS #2
	WIDTH #2, 11                                 ' OK in 4.50, but WIDTH
	PRINT #2, "123456789012345678901234567890"   ' ignored in BASIC 7.x
	CLOSE
	WIDTH "cons:", 11
	OPEN "cons:" FOR OUTPUT AS #3
	PRINT #3, "123456789012345678901234567890"  ' WIDTH ignored, 7.x, 4.50
	CLOSE
	OPEN "cons:" FOR OUTPUT AS #4
	WIDTH #4, 10
	PRINT #4, "123456789012345678901234567890"  ' WIDTH ignored, 7.x, 4.50
	CLOSE
	
	' Note that the problem doesn't occur with the "LPT1:" device:
	WIDTH "lpt1:", 11   ' Sets printer width to 11 characters.
	OPEN "lpt1:" FOR OUTPUT AS #1
	PRINT #1, "123456789012345678901234567890"  ' Works find in all versions.
	CLOSE
	
	Reference:
	
	The following partial description of the WIDTH statement is taken from
	the QBX.EXE online help:
	
	   WIDTH {#filenumber% | device$}, width%
	
	WIDTH {#filenumber% | device$}, width%
	  The WIDTH #filenumber%, width% form:
	    - Sets the line width of an output device already opened as a file
	      (for example, LPT1: or CONS:).
	    - The argument filenumber% is the number associated with the
	      file in the OPEN statement.
	    - The "#" character in front of filenumber% is not optional.
	    - The width assignment takes place immediately.
	  The WIDTH device$, width% form:
	    - Sets to width% the line with of device$ (a device filename).
	      The device should be a string expression (for example, "LPT1:").
	    - The width assignment is deferred until the next OPEN statement
	      affecting the device.
	    - The assignment does not affect output for an already open file.
