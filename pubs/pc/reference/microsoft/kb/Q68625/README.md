---
layout: page
title: "Q68625: Increasing the Automatic Repeat Rate of the Keyboard"
permalink: /pubs/pc/reference/microsoft/kb/Q68625/
---

	Article: Q68625
	Product: Microsoft C
	Version(s): 2.50 2.51
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 6-FEB-1991
	
	A customer noted that by running Windows and then running QuickC, the
	automatic repeat rate of the keyboard (called the typematic rate)
	increased. Thus, when he held down a key, the speed at which his
	cursor would move across the screen increased. He wanted to know how
	to get this effect without running Windows.
	
	By writing a program that calls int 16h function 03h, you can set this
	repeat rate. The following program will set the keyboard for the
	fastest repeat rate. (Note: This will work only on PS/2- and AT-class
	machines; it will not work on XT-class machines.) More information on
	int 16h can be found in the "IBM ROM BIOS: Programmer's Quick
	Reference" by Ray Duncan.
	
	Sample Code
	-----------
	
	#include <dos.h>
	
	union REGS r;
	
	void main ()
	  {
	  r.h.ah= 3;
	  r.h.al= 5;
	  r.h.bh= 0;
	  r.h.bl= 0;
	  int86 (0x16, &r);
	  }
