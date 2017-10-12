---
layout: page
title: "Q59071: Changing a Compaq's CPU Speed"
permalink: /pubs/pc/reference/microsoft/kb/Q59071/
---

	Article: Q59071
	Product: Microsoft C
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | s_quickc s_quickasm
	Last Modified: 15-MAR-1990
	
	There are no C run-time functions that change the CPU speed, but there
	is an interrupt that will change the speed of the CPU. This interrupt,
	shown below, works only on Compaq computers.
	
	INT 16h:
	
	     AH = F0h
	     AL = speed
	          00h  equivalent to 6 MHz
	          01h  equivalent to 8 MHz
	          02h  full 16 MHz
	          03h  toggles between 8 MHz -- equivalent and speed set by
	               system board switch (AUTO or HIGH)
	          08h  full 16 MHz except 8 MHz during floppy disk access
	          09h  specify speed directly
	               CX = speed value, 1 (slowest) to 50 (full), 3 ~= 8088
	
	To read the current CPU speed, set AH = F1h and call interrupt 16h.
	
	INT 16h:
	     AH = F1h
	RETURN:
	     AL = speed code (see function F0h for speed code)
	          if AL = 09h, CX = speed code
