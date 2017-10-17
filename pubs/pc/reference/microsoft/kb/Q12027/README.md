---
layout: page
title: "Q12027: &quot;Bad File Name&quot;; OPEN &quot;COM1:&quot;; 8 Data Bits Must Have No Parity"
permalink: /pubs/pc/reference/microsoft/kb/Q12027/
---

## Q12027: &quot;Bad File Name&quot;; OPEN &quot;COM1:&quot;; 8 Data Bits Must Have No Parity

	Article: Q12027
	Version(s): 1.00 1.01 1.02 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 4-SEP-1990
	
	When you use the OPEN "COM" statement with the data bits set to 8 and
	parity set to Even or Odd, you will get a "Bad File Name" error. For
	example, "Bad File Name" occurs at run time when you open the serial
	communications port as follows:
	
	   OPEN "COM1:9600,E,8,1" AS 2
	
	This error disappears using 7 data bits, or No (N) parity.
	
	When you specify 8 data bits, you must specify a parity of N. This is
	a limitation in the design of QuickBASIC versions 1.00, 1.01, 1.02,
	2.00, 2.01, 3.00, 4.00, 4.00b, and 4.50; Microsoft BASIC Compiler
	versions 6.00 and 6.00b for MS-DOS and MS OS/2; and Microsoft BASIC
	PDS versions 7.00 and 7.10 for MS-DOS and MS OS/2.
	
	As a workaround in QuickBASIC versions 4.00 and later, Microsoft BASIC
	Compiler versions 6.00 or 6.00b, or BASIC PDS, you can call a
	Microsoft C version 5.10 routine from BASIC to do the communications
	with 8 bits and odd or even parity. The following book will help in
	doing this:
	
	   "Microsoft C Programming for the IBM" by Robert Lafore (published by
	   the Waite Group)
	
	The QuickBASIC Compiler, BASIC compiler 6.00, and BASIC PDS 7.00 are
	designed with a 10-bit data frame for communications. The frame is as
	follows:
	
	            1 2  -  8 9 A
	            S DDDDDDD P S
	
	Bit  1     = Start Bit    (Always 1)
	Bits 2 - 8 = Data Bits    (7 or 8)
	Bit  9     = Parity       (Odd, Even, or None)
	Bit  A     = Stop Bit(s)  (1 or 2)
	
	The combination of the bits should add up to 10 bits. When you try to
	set 1 start + 8 data + 1 parity + 1 stop, that adds up to an 11-bit
	data frame, which BASIC is not designed for.
