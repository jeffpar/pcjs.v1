---
layout: page
title: "Q41531: How to Calculate Absolute Address; DEF SEG and PEEK Example"
permalink: /pubs/pc/reference/microsoft/kb/Q41531/
---

## Q41531: How to Calculate Absolute Address; DEF SEG and PEEK Example

	Article: Q41531
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BASICCOM  SR# S890216-196
	Last Modified: 18-APR-1989
	
	The DEF SEG statement in BASIC sets the current segment address for a
	subsequent PEEK function, or a subsequent POKE, BLOAD, BSAVE, or CALL
	ABSOLUTE statement. PEEK, POKE, BLOAD, BSAVE, and CALL ABSOLUTE can
	all specify an offset (from the current segment) as an argument.
	
	You can calculate the absolute address (the n'th byte) in memory from
	the segment and offset as follows:
	
	1. Multiply the segment address by 16 (or shift the hexadecimal
	   representation 1 to the left, adding zero to the right-most
	   digit; for example, &H40 times 16 equals &H400).
	
	2. Add this value to the offset.
	
	In the 8086 chip architecture, the addressable memory space is divided
	into segments, each of which can contain up to 64K of memory. Segments
	can only start on a paragraph address. A paragraph address is a byte
	location that is evenly divisible by 16 bytes. Every 16th byte in
	memory contains segment number n. To access specific bytes or words in
	memory, you must use an offset relative to the beginning of a
	specified segment.
	
	Together, a segment and an offset provide a segmented address that can
	locate any byte in the 1 megabyte of address space in the 8086
	processor.
	
	The following PEEK function returns 1 byte located at an
	offset from the paragraph address of the current segment:
	
	   DEF SEG=paddress   ' Sets paragraph address of "current" segment
	   x% = PEEK(offset)  ' A byte is returned in integer variable x%
	
	The following book contains more information about 8086-segmented
	architecture and memory addressing:
	
	   "The New Peter Norton Programmer's Guide to the IBM PC & PS/2," by
	   Peter Norton and Richard Wilton (published by Microsoft Press,
	   1988).
	
	Example 1
	
	The following two PEEK functions access the same location in memory
	starting from two different segments (using decimal notation):
	
	   DEF SEG = 0
	   x% = PEEK(256)      'PEEKs at address 0000:0256 decimal
	   print x%
	
	   DEF SEG = 1         'The next segment is 16 bytes higher.
	   y% = PEEK(240)      'PEEKs at address 0001:0240 decimal
	   print y%
	
	The previous lines of code print the same PEEKed value because
	(0 * 16) + 256 equals (1 * 16) + 240.
	
	Example 2
	
	The following is another example of two PEEK functions accessing the
	same location in memory starting from two different segments, this
	time using hexadecimal notation:
	
	   DEF SEG = 0
	   x% = PEEK(&H417)     'PEEKs at address 0000:0417 Hexadecimal
	   print x%
	
	   DEF SEG = &H40
	   y% = PEEK(&H17)     'PEEKs at address 0040:0017 Hexadecimal
	   print x%
	
	The previous lines of code accesses the same values and prints them
	because they have the same absolute address: (0 hex + 417 hex) equals
	(400 hex + 17 hex).
	
	Remember, when you calculate the absolute address, you shift the
	segment address 1 digit to the left in hexadecimal notation (i.e.,
	multiply by 16 decimal, or 10 hex) and then add to the offset: 40 hex
	times 10 hex equals 400 hex, which is added to 17 Hex.
