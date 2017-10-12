---
layout: page
title: "Q60869: How to Explicitly Reference Command-Line Tail"
permalink: /pubs/pc/reference/microsoft/kb/Q60869/
---

	Article: Q60869
	Product: Microsoft C
	Version(s): 5.x 6.00
	Operating System: MS-DOS
	Flags: ENDUSER | s_quickc s_quickasm
	Last Modified: 19-APR-1990
	
	The following code allows you to explicitly reference the command-line
	tail. The entire command line with spaces intact is referenced at the
	Disk Transfer Area (DTA) address and printed out as one string.
	
	Sample Code
	-----------
	
	#include <stdio.h>
	#include <dos.h>
	
	main()
	{
	   int tail_length;
	   char cmd_tail(128);
	
	   char far *p;             /* far pointer */
	   int i;
	
	   struct SREGS Seg;
	   union REGS Reg;
	
	   Reg.h.ah = 0x2F;         /* DOS call:  Get DTA Address   */
	   segread(&Seg);
	   intdosx(&Reg, &Reg, &Seg);
	
	   FP_SEG(p) = Seg.es;      /* make p point to the DTA */
	   FP_OFF(p) = Reg.x.bx;
	
	   tail_length = *p;        /* First byte is length of tailstring */
	
	   printf("tail_length = %d\n", tail_length);
	
	   p++;                     /* Move to first byte */
	
	   for(i = 0; i<tail_length; i++)
	      cmd_tail[i] = p[i];
	
	   cmd_tail[tail_length] = '\0';  /* Add NULL to make a string */
	   printf("cmd_tail = <%s>\n", cmd_tail);
	
	   return(0);
	}
	
	Note: The command line is limited to 128 bytes.
	
	   cmdline *.c  abc  def  lab7.pas
	
	Output using the above command line is as follows:
	
	tail_length = 24
	cmd_tail = < *.c  abc  def  lab7.pas>
	
	Note: A more portable way of getting this information is to use the
	argv mechanism built into C. This may be easier because the command
	line would be already partially parsed by the setargv() function.
