---
layout: page
title: "Q28684: Mouse Driver Command Line Switches"
permalink: /pubs/pc/reference/microsoft/kb/Q28684/
---

	Article: Q28684
	Product: Microsoft C
	Version(s): 6.00 6.02 6.10 1.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 21-APR-1988
	
	The following are command-line switches for mouse driver 6.00 and above:
	
	   SWITCH       DESCRIPTION
	
	   /B           Look for Bus or InPort mouse at primary address
	   /I1          InPort mouse at primary address
	   /I2          InPort mouse at secondary address
	   /C1          Serial mouse on COM1
	   /C2          Serial mouse on COM2
	   /S <nnn>     Horizontal and vertical sensitivity <nnn> = 0 to 100
	   /H <nnn>     Horizontal sensitivity
	   /V <nnn>     Vertical sensitivity
	   /R0          InPort interupt rate disabled
	   /R1          InPort interupt rate 30Hz (default)
	   /R2          InPort interupt rate 50Hz
	   /R3          InPort interupt rate 100Hz
	   /R4          InPort interupt rate 200Hz
	
	   Example: mouse /s75    <- sets mouse sensitivity to 75 (50 default)
