---
layout: page
title: "Q58799: Microsoft GRAPHICS.LIB Does Not Support Extended VGA"
permalink: /pubs/pc/reference/microsoft/kb/Q58799/
---

	Article: Q58799
	Product: Microsoft C
	Version(s): 5.00 5.10 6.00
	Operating System: MS-DOS
	Flags: ENDUSER | s_quickc 2.00 s_quickasm 2.01
	Last Modified: 19-APR-1990
	
	Question:
	
	Is there any way I can set my video mode to 640 x 480 in 256 colors or
	higher resolution?
	
	Response:
	
	Microsoft C and QuickC graphics libraries do not support any
	nonstandard BIOS graphics modes or video modes that are not available
	on IBM video subsystems. To set your video mode to a nonstandard mode,
	you can make a direct call to DOS.
	
	"The Manifest Constants for Screen Mode," a table associated with
	_setvideomode(), shows a table of the video modes available on IBM
	video subsystems. These are the screen modes supported by
	GRAPHICS.LIB. You can find the table on Page 539 in the "Microsoft C
	Run-Time Library Reference," for Versions 5.00 and 5.10. If you have
	QuickC Version 2.00 or QuickC with QuickAssembler Version 2.01, you
	can find the table in the Advisor's online help for _setvideomode().
	
	Microsoft QuickC Version 2.00 and QuickAssembler Version 2.01 support
	an additional video mode, _ORESCOLOR (640 x 400 in 1 of 16 colors).
	This mode is not supported in the Microsoft C Versions 5.00 and 5.10
	or Microsoft QuickC Versions 1.0x packages.
	
	To set the video mode to 640 x 480 in 256 colors, use interrupt 10h
	function 00h. This interrupt can also be used to set the video modes
	to other extended VGA modes. The following example demonstrates how to
	set the video modes using the int86() run-time function. Consult your
	video card's user's manual to determine the mode number. For example,
	mode 67 sets the Video Seven FastWrite VGA to 640 x 480 in 256 colors.
	Most VGA cards require 512K memory on the card.
	
	The graphics library routines supplied with Microsoft C and QuickC
	work properly only if the video mode is from 1 to 19 (plus 64 for
	QuickC Versions 2.00 and 2.01).
	
	Sample Code
	-----------
	
	#include <graph.h>
	#include <dos.h>
	#include <stdio.h>
	#include <conio.h>
	
	void main (void)
	{
	   union REGS inregs;
	
	   /* Set to desired video mode */
	
	   inregs.h.ah = 0x00;
	   inregs.h.al = { Desired Video Mode }
	
	{  inregs.h.al = 40;  for Video Seven FastWrite VGA }
	
	   int86 (0x10, &inregs, &inregs);
	
	   /* Get current video mode */
	
	   inregs.h.ah = 0x0f;
	   int86 (0x10, &inregs, &outregs);
	   printf ("Current video mode : %d\n", outregs.h.al);
	   getch();
	}
