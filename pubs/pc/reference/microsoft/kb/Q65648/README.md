---
layout: page
title: "Q65648: Some Windows 3.00 Fonts Don't Work with QuickC"
permalink: /pubs/pc/reference/microsoft/kb/Q65648/
---

	Article: Q65648
	Product: Microsoft C
	Version(s): 2.00 2.01 2.50 2.51
	Operating System: MS-DOS
	Flags: ENDUSER | buglist2.50 buglist2.51 s_c docerr
	Last Modified: 24-OCT-1990
	
	Certain Windows version 3.00 font files do not display correctly when used
	with the QuickC font routines, although the manuals state that the
	.FON files from Windows are identical to the .FON files from QuickC.
	The .FON files from Microsoft Windows versions earlier than 3.00 work
	correctly.
	
	The vector-mapped fonts from Windows version 3.00 work correctly with
	QuickC, but most of the bit-mapped fonts will display corrupted
	characters if used with the QuickC font routines.
	
	Sample Code
	-----------
	
	The following program reproduces this problem by using one of the
	Windows 3.00 bit-mapped font files, HELVE.FON:
	
	#include <graph.h>
	
	void main()
	{
	  _registerfonts("HELVE.FON");
	  _setvideomode( _VRES16COLOR );
	  _clearscreen( _GCLEARSCREEN );
	
	  /* Set font to the first font in the font file (n1) */
	  _setfont("n1");
	  _moveto(0,0);
	  _outgtext("Test abcdefgABCDEFG12345!@#$%");
	}
	
	Compile this program using "qcl test.c graphics.lib" and execute in
	the directory containing the Windows 3.00 font files. The test text
	will be displayed as a line of corrupted characters.
	
	Microsoft has confirmed this to be a problem with QuickC versions 2.50
	and 2.51. We are researching this problem and will post new
	information here as it becomes available.
