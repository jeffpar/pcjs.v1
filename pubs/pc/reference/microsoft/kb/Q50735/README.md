---
layout: page
title: "Q50735: Linking QuickBASIC 4.50 with QuickC 2.00, 2.01 Font Library"
permalink: /pubs/pc/reference/microsoft/kb/Q50735/
---

## Q50735: Linking QuickBASIC 4.50 with QuickC 2.00, 2.01 Font Library

	Article: Q50735
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom S_C S_QuickC
	Last Modified: 27-DEC-1989
	
	QuickBASIC Version 4.50 and Microsoft BASIC PDS Version 7.00 can call
	routines contained in the QuickC Version 2.00 or 2.01 font library.
	One restriction is that the QuickBASIC program must be compiled with
	the BRUNxx.EXE option, or it will not link with the C program. BASIC
	PDS 7.00 is also restricted and must be linked with the BRT70xxx.EXE
	option. Note also that the QuickBASIC program must make a call to
	SETMEM to release far memory that the C routine will need to use for
	its workspace.
	
	This information about interlanguage calling applies to QuickBASIC
	Versions 4.00, 4.00b, and 4.50 for MS-DOS, to Microsoft BASIC Compiler
	Versions 6.00 and 6.00b for MS-DOS and MS OS/2, and to Microsoft BASIC
	PDS Version 7.00 for MS-DOS and MS OS/2.
	
	The following is a sample program that demonstrates calling a C
	routine to display text in the Times Roman Bold font. This sample is
	based on the sample program given on Page 268 of the "Microsoft C for
	Yourself Version 2.0" manual that comes with QuickC Versions 2.00 and
	2.01.
	
	Code Example
	------------
	
	The following BASIC program is CFONT.BAS, which calls a C routine to
	display text on the screen in the Times Roman Bold font:
	
	DECLARE SUB WriteTMSRB CDECL ()
	' Release the available far memory for the C routine:
	' Note: This releases the entire far heap. This probably should
	' not be done with programs that use $DYNAMIC arrays.
	X = SETMEM(-FRE(-1))
	CALL WriteTMSRB
	END
	
	The following C routine is TMSRB.C, which calls the Font library
	routines to display text on the screen in the Times Roman Bold font:
	
	#include <stdio.h>
	#include <graph.h>
	
	void WriteTMSRB()
	{
	  int mode = _VRES16COLOR;
	
	  /* Read header info from .FON file */
	  if (_registerfonts("TMSRB.FON") < 0)
	  {
	    _outtext("ERROR: can't register fonts");
	    exit (0);
	  }
	
	  /* Set highest available video mode */
	  while(!_setvideomode(mode))
	    mode--;
	  if (mode == _TEXTMONO)
	    exit(0);
	
	  /* Set font and display text */
	  if (!_setfont ("t'helv'h30w24b"))
	  {
	    _moveto(10,10);
	    _outgtext("THIS IS IN TIMES ROMAN BOLD");
	    getch();
	  }
	  else
	  {
	    _setvideomode(_DEFAULTMODE);
	    _outtext("ERROR: can't set font");
	    exit(0);
	  }
	
	  _setvideomode(_DEFAULTMODE);
	  _unregisterfonts();
	}
	
	For QuickBASIC, the steps to compile and link are as follows:
	
	   BC CFONT.BAS;
	   QCL /c /AM TMSRB.C
	   LINK /noe /nod CFONT+TMSRB,,,BRUN45.LIB+MLIBCE.LIB+GRAPHICS.LIB;
	
	For BASIC PDS 7.00, the steps to compile and link are as follows:
	
	   BC CFONT.BAS;
	   QCL /c /AM TMSRB.C
	   LINK /noe /nod CFONT+TMSRB,,,BRT70ENR.LIB+MLIBCE.LIB+GRAPHICS.LIB;
