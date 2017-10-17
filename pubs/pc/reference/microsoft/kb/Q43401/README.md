---
layout: page
title: "Q43401: How to Test for an Error When Using _bios_serialcom Service"
permalink: /pubs/pc/reference/microsoft/kb/Q43401/
---

## Q43401: How to Test for an Error When Using _bios_serialcom Service

	Article: Q43401
	Version(s): 5.00 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | s_quickc docerr
	Last Modified: 14-APR-1989
	
	Problem:
	
	I am using the _COM_RECEIVE function of _bios_serialcom to read data
	from a communications port. How do I determine if an error has
	occurred?
	
	Response:
	
	Referring to the table on Page 144, Page 145 of the "Microsoft
	Optimizing C Run-Time Library Reference" and the "Microsoft QuickC
	Run-Time Library Reference" states the following:
	
	   If an error occurs, at least one of the high-order bits will be
	   set.
	
	While this is correct, it is misleading. It is true that at least one
	of the high-order bits will be set if an error occurs. However, it is
	not true that if ANY high-order bit is set, an error has occurred. An
	error has occurred if, and only if, any of the following four bits are
	set:
	
	   Bit     Meaning if Set
	
	   15      Timed out
	   11      Framing error
	   10      Parity error
	    9      Overrun error
	
	The sentence quoted above would be more accurate if it read as
	follows:
	
	   If an error occurs, any of bits 9, 10, 11, or 15 will be set.
	
	This information is explained on Page 431 of "Advanced MS-DOS" by
	Ray Duncan.
