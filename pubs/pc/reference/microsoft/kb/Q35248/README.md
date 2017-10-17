---
layout: page
title: "Q35248: No Data Type for 80-Bit Precision IEEE Real Numbers in BASIC"
permalink: /pubs/pc/reference/microsoft/kb/Q35248/
---

## Q35248: No Data Type for 80-Bit Precision IEEE Real Numbers in BASIC

	Article: Q35248
	Version(s): 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 16-DEC-1989
	
	QuickBASIC's implementation of the ANSI/IEEE Standard 754-1985 for
	binary floating-point arithmetic includes two types of real numbers:
	
	   Single-precision numbers, which use 32 bits (4 bytes)
	   Double-precision numbers, which use 64 bits (8 bytes)
	
	The ANSI/IEEE standard also describes an 80-bit (10-byte)
	floating-point format called Double Extended. QuickBASIC's
	intermediate calculations are performed in the 80-bit format for
	greater accuracy, but the results are stored in single- or
	double-precision variables. There is no data type in QuickBASIC
	associated with the 80-bit format.
	
	This article applies to the following products, which use IEEE binary
	floating-point arithmetic:
	
	1. Microsoft QuickBASIC Versions 3.00 (QB87.EXE only), 4.00, 4.00b,
	   and 4.50 for the IBM PC
	
	2. Microsoft BASIC Compiler Versions 6.00 and 6.00b for MS OS/2 and
	   MS-DOS
	
	3. Microsoft BASIC PDS Version 7.00 for MS-DOS and MS OS/2
	
	ANSI is an acronym for the American National Standards Institute. IEEE
	is an acronym for the Institute of Electrical and Electronics
	Engineers, Inc., which can be reached at the following address:
	
	   IEEE
	   345 East 47th Street
	   New York, NY 10017 USA
