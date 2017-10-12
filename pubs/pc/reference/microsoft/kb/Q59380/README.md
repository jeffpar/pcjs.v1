---
layout: page
title: "Q59380: How to Do a Print Screen within a Program"
permalink: /pubs/pc/reference/microsoft/kb/Q59380/
---

	Article: Q59380
	Product: Microsoft C
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 7-MAR-1990
	
	The code below demonstrates how to do a print screen from within a
	program under MS-DOS. This is done by executing INT 5 within a
	program.
	
	The interrupt service directs all its output to the default printer.
	The print-screen service prints text or graphics. In graphics mode,
	GRAPHICS.COM must be loaded before invoking the print-screen service.
	
	INT 5 does not return any values but the status code is available at
	memory location 0050:0000. The values are as follows:
	
	   00   no error occurred
	   01   indicates that a print-screen operation is in progress
	   FF   the previous print screen was not successful.
	
	Code Example
	------------
	
	  #include <stdio.h>
	  #include <dos.h>
	
	  void main (void)
	  {
	     int  *result;
	     struct REGS inregs, outregs;
	
	  /* inregs and outregs are never used but necessary
	     for the int86 function.
	  */
	
	     puts("This is a test of prtscr() function.");
	     int86(0x5, &inregs, &outregs);
	
	     *result = (int *) 0x00500000;
	     switch( *result )
	     {
	        case 0:
	          puts("No error occurred.");
	          break;
	        case 1;
	          puts("Print Screen in progress....");
	          break;
	        case 0xFF;
	          puts("ERROR occurred during print screen");
	          break;
	     }
	  }
