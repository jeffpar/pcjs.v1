---
layout: page
title: "Q42079: Getting 43-line Mode for C and QuickC Graphics"
permalink: /pubs/pc/reference/microsoft/kb/Q42079/
---

	Article: Q42079
	Product: Microsoft C
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | s_quickc
	Last Modified: 15-JAN-1990
	
	The Microsoft C Version 5.10 Optimizing Compiler README.DOC file
	states the following:
	
	   The graphics library new functions correctly in 43-line mode on an
	   EGA, and in 43-line, 50-line, and 60-line modes on a VGA.
	
	This information is correct; however, it does not state that you must
	write your own interrupt routine to set the video mode to support
	this.
	
	The following program demonstrates using Int 10H, Function 11H,
	Subfunction 23H to set an EGA system into 43-line mode. The interrupt
	call must be made BEFORE the call to _setvideomode(). If the routine
	is called after _setvideomode(), the text height is changed, but the
	program uses only the first 25 lines of the screen.
	
	The same procedure also works with the QuickC Version 2.00
	Presentation Graphics package, for placing additional text (with
	_outtext) around the chart. It does not change any of the default text
	(which already has the text height of 43-line mode), or change the
	appearance of the chart, but it allows additional text to be added
	around the chart in the smaller font to create a uniform appearance.
	
	The following is a sample program that demonstrates 43-line mode:
	
	/* program line43.c */
	
	#include <conio.h>
	#include <stdio.h>
	#include <graph.h>
	#include <dos.h>
	#include <process.h>
	
	union REGS inregs, outregs;
	struct SREGS segregs;
	int result;
	
	void main(void)
	{
	  inregs.h.ah = 0x11;      /*load Function # into AH register       */
	  inregs.h.al = 0x23;      /*load SubFunc # into AL register        */
	  inregs.h.bl = 0x03;      /*load constant for 43-line mode into BL */
	                           /*For 50-line mode, use                  */
	                           /*       inregs.h.bl=0x00;               */
	                           /*       inregs.h.dl=0x32;               */
	
	  int86x(0x10, &inregs, &outregs, &segregs);  /* call interrupt */
	
	  _setvideomode(_ERESCOLOR);   /* 640x350 EGA graphics mode         */
	                               /* For VGA w/50 lines, change to:    */
	                               /* _setvideomode(_VRES16COLOR);      */
	  _settextposition(30,30);
	  _outtext("this should be tiny text!");
	  while(!kbhit());
	  _setvideomode(_DEFAULTMODE);  /* restore to default mode  */
	
	Note: The "IBM ROM BIOS" quick-reference guide states that this
	function should be used only AFTER a _setvideomode command. However,
	this does not work effectively with the C graphics library.
