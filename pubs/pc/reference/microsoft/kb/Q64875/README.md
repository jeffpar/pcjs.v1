---
layout: page
title: "Q64875: C's _getvideoconfig Returns Incorrect Mode If Set from BASIC"
permalink: /pubs/pc/reference/microsoft/kb/Q64875/
---

## Q64875: C's _getvideoconfig Returns Incorrect Mode If Set from BASIC

	Article: Q64875
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom S_C S_QuickC SR# S900808-148
	Last Modified: 4-SEP-1990
	
	The C graphics function _getvideoconfig will not correctly return the
	current video mode set by a BASIC program. To work around this
	problem, the BIOS interrupt 10 (hex) function 0F (hex) can be used in
	place of the _getvideoconfig function. This is shown in the sample
	programs below.
	
	This information applies to QuickBASIC versions 4.00, 4.00b, and 4.50;
	to Microsoft BASIC Compiler versions 6.00 and 6.00b; and to Microsoft
	BASIC Professional Development System (PDS) versions 7.00 and 7.10 for
	MS-DOS and MS OS/2.
	
	The following BASIC program, TEST.BAS, sets the video to screen mode 9
	(EGA) and then calls a C function to return the current graphics mode:
	
	   DECLARE FUNCTION CProc% CDECL ()
	   SCREEN 9
	   CLS
	   PRINT "Video mode: "; CProc%
	   while inkey$="" : wend
	   END
	
	The following C program, CVID.C, uses the C graphics function
	_getvideoconfig, which returns an incorrect value when the video mode
	has been set by BASIC.
	
	#include <graph.h>
	
	int CProc(void) {
	   struct videoconfig vc;
	   _getvideoconfig(&vc);
	   return(vc.mode);
	}
	
	Compile and link as follows:
	
	   BC TEST.BAS ;
	   CL /c /AL CVID.C ;
	   LINK /NOE TEST CVID ;
	
	Normally, the returned video mode will be 3, which is incorrect. The
	following C routine replaces CVID.C. When this is compiled and linked
	to TEST.BAS, the correct video mode, 16, is returned.
	
	#include <dos.h>
	
	int CProc(void) {
	   union REGS inregs, outregs;
	   inregs.h.ah = 0xF;
	   int86(0x10, &inregs, &outregs);
	   return(outregs.h.al);
	}
