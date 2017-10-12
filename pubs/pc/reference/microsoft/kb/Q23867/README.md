---
layout: page
title: "Q23867: Sending 1Ah to a Printer Requires Setting "Raw" Mode"
permalink: /pubs/pc/reference/microsoft/kb/Q23867/
---

	Article: Q23867
	Product: Microsoft C
	Version(s): 3.00 4.00 5.00 5.10 6.00 6.00a
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 4-FEB-1991
	
	Problem:
	
	I am trying to output a graphics file to a printer. I have opened the
	printer as a binary file, but the output stops every time I try to
	output hexadecimal character 1A. I assumed that anything could be
	output to a binary file.
	
	Response:
	
	If you open a device, such as PRN, as a binary file using fopen() or
	open(), the device will not translate carriage return/line feed
	combinations. However, DOS will continue to interpret CTRL+Z (1Ah) as
	an end-of-file character.
	
	You must use interrupt 21h function 44h to set the raw-mode bit for
	the device to disable checking for CTRL+Z characters. This way, all
	characters will be allowed to pass.
	
	The following example was taken from page 351 of "Advanced MS-DOS
	Programming," which gives an assembly language program example for
	setting raw mode.
	
	Sample Code
	-----------
	
	void setrawmode(void)
	{
	   union REGS inregs, outregs;
	
	   inregs.x.ax = 0x4400;
	   inregs.x.bx = 0x04;         /* specify the printer */
	   int86(0x21, &inregs, &outregs);
	
	   outregs.h.dh = 0x00;
	   outregs.h.dl = 0x20;        /* set raw mode bit */
	   outregs.x.ax = 0x4401;
	   int86(0x21, &outregs, &inregs);
	}
