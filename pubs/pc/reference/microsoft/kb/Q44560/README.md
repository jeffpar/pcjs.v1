---
layout: page
title: "Q44560: More Information on Using _setfont in QuickC"
permalink: /pubs/pc/reference/microsoft/kb/Q44560/
---

	Article: Q44560
	Product: Microsoft C
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER | FYI
	Last Modified: 25-MAY-1989
	
	Setfont is a run-time library routine included with the QuickC
	Version 2.00 graphics library for selecting the active font. The
	_outgtext function uses this font for succeeding output to the screen.
	The setfont function is very versatile and allows you to specify the
	font by name, number, or best-fit for a specified character size.
	
	Setfont brings the font (bit-map or vector) into far memory if the
	specified font exists or the best-fit attribute is given. If the font
	does not exist and best-fit is not given, the setfont function will
	fail and return (-1).
	
	If there is not enough far memory for setfont to load the specified
	font, setfont will return (-4). This is not documented in the graphics
	library reference manual for QuickC 2.00. To be on the safe side,
	always make sure the return value is (0) before continuing with the
	_outgtext.
	
	Note: The best-fit attribute does not check to see which font actually
	fits in memory; it is used only for selecting a font with specific
	character attributes.
	
	To use the setfont function, you must first change to a graphic screen
	and register the fonts on disk. The functions _setvideomode and
	_registerfonts, respectively, are provided for these procedures. After
	these have successfully completed, you can call setfont and outgtext
	as many times as you like. You should end the program by unregistering
	the fonts and returning to the default video mode.
	
	The following program prints "Hello World" to the screen using the
	script font with a height of 20 and a width of 10.
	
	#include <graph.h>
	
	void main(void)
	{
	  _setvideomode(_ERES16COLOR);
	  _registerfonts("d:\\qc2\\samples\\*.fon");
	
	  if (_setfont("t'Script' h20 w10") == 0)
	     _outgtext("Hello World");
	
	  _unregisterfonts();
	  _setvideomode(_DEFAULTMODE);
	}
