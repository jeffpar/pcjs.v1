---
layout: page
title: "Q44208: Blink/Intensity Bit Not Restored by Environment in QuickC"
permalink: /pubs/pc/reference/microsoft/kb/Q44208/
---

	Article: Q44208
	Product: Microsoft C
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER | buglist2.00
	Last Modified: 18-MAY-1989
	
	When QuickC restores the output screen (e.g. after pressing F4), the
	palette's blink/intensity bit is not correctly restored when it is set
	to intensity. On an EGA, VGA, or MCGA display, this bit allows a
	palette of 16 background colors without blink capability, rather than
	a palette of eight background colors with blink capability.
	
	This bit is set through interrupt 0x10, function 0x10. The problem
	described can be demonstrated with the program below, by doing the
	following:
	
	1. Run the program below to completion. A red, nonblinking foreground
	   is displayed on an intense white background. This is correct.
	
	2. Press any key to return to the integrated environment.
	
	3. Press F4 to view the output screen. This time, a dim background
	   with a blinking foreground is displayed. This is not correct.
	
	For more information on this subject, refer to Pages 54-55 of the
	"Programmer's Guide to PC & PS/2 Video Systems" by Richard Wilton.
	
	Microsoft has confirmed this to be a problem in Version 2.00. We are
	researching this problem and will post new information as it becomes
	available.
	
	The program is as follows:
	
	/* blink.c - demonstrate usage of palette's blink/intensity bit */
	
	#include <graph.h>
	#include <dos.h>
	
	void main (void)
	{
	  union REGS regs;
	
	  _setvideomode (_TEXTC80);      /* This always sets blink on    */
	  _clearscreen (_GCLEARSCREEN);
	
	  regs.h.bl = 0;                 /* 0=intensity, 1=blink         */
	  regs.x.ax = 0x1003;            /* Function 10h, subfunction 3  */
	  int86 (0x10,&regs,&regs);      /* Turn intensity on, blink off */
	
	  _settextcolor (12+16);         /* 12=red, 16=blink/intensity   */
	  _setbkcolor (7L);              /* White                        */
	
	  _outtext ("\nRed text on a bright white background\n");
	}
