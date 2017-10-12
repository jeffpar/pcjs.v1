---
layout: page
title: "Q47780: Blinking Text May Be Eliminated with BIOS Call"
permalink: /pubs/pc/reference/microsoft/kb/Q47780/
---

	Article: Q47780
	Product: Microsoft C
	Version(s): 5.00 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | S_QuickC S_QuickASM EGA
	Last Modified: 16-JAN-1990
	
	Blinking text can be accessed by setting the foreground text color to
	a value of 16 or greater. However, this can be affected by a BIOS call.
	BIOS call 10, subfunction 3 toggles the interpretation of the
	intensity bit of the foreground color. By making a call to this BIOS
	function you can access additional background colors. Without blinking
	foreground text, you can access 16 background colors. With blinking
	text you are limited to 8 background colors. The program shown below
	demonstrates this.
	
	The example prints 16 lines of text with varying background colors.
	The intensity interpretation is then toggled, limiting the output to
	only 8 background colors.
	
	This problem also occurs in Microsoft QuickC Versions 1.00, 1.01,
	2.00, and 2.01.
	
	Sample Program:
	--------------
	
	#include <stdio.h>
	#include <graph.h>
	#include <dos.h>
	#include <conio.h>
	
	#define TRUE 1
	#define FALSE 0
	
	void toggle_intensity(int);
	
	void main(void)  {
	   long i;
	   char buf[80];
	   _clearscreen(_GCLEARSCREEN);
	   toggle_intensity(0);
	   for (i=16; i < 32; i++) {
	      _setbkcolor (i);
	      _settextcolor (i+1);
	      _settextposition (i-15, 10);
	      sprintf(buf, "  Background = %2ld  Foreground = %2d  \n",i,i+1);
	      _outtext (buf);
	   }
	   getch();
	
	   _setbkcolor (_BLACK);
	   _clearscreen(_GCLEARSCREEN);
	   toggle_intensity(1);
	   for (i=16; i < 32; i++) {
	      _setbkcolor (i);
	      _settextcolor (i+1);
	      _settextposition (i-15, 10);
	      sprintf (buf, "  Background = %2ld  Foreground = %2d  \n", i, i+1);
	      _outtext (buf);
	   }
	   getch();
	}
	
	/*  If onoff is True, intesity bit will indicate blinking text  */
	void toggle_intensity(int onoff)  {
	    #define         VIDEO_IO        0x10
	    #define         BIOS_CALL       0x10
	    #define         INTENSITY_TGL   0x03
	    union REGS regs;
	
	    regs.h.ah = VIDEO_IO;
	    regs.h.al = INTENSITY_TGL;
	    if (!onoff)
	       regs.h.bl = 0x0;
	    else
	       regs.h.bl = 0x1;
	    int86 (BIOS_CALL, &regs, &regs);
	}
