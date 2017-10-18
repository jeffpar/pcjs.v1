---
layout: page
title: "Q30601: Real-Number Data in IEEE Format"
permalink: /pubs/pc/reference/microsoft/kb/Q30601/
---

## Q30601: Real-Number Data in IEEE Format

	Article: Q30601
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 12-JAN-1989
	
	By default, the Microsoft Macro Assembler Version 5.10 assembles
	real-number data in IEEE format. The previous versions of the
	assemblers used the Microsoft binary format by default.
	
	   The following is the IEEE format for encoding 4- and 8-byte real
	numbers.
	
	Short Real Number
	  31      23      15      7       0
	 _________________________________
	|_|_______|_______|_______|_______|
	^ ^       ^                       ^
	| |       |                       |
	| Exponent|                       |
	|         |Mantissa ------------->|
	|Sign
	
	   The parts of the real numbers are described below:
	
	   1. Sign (0 for positive or 1 for negative) is in the upper bit of
	the first byte.
	   2. Exponent is in the next bits in sequence (8 bits for a short
	real number or 11 bits for a long real number).
	   3. All except the first-set bit of Mantissa are in the remaining
	bits of the variable (13 bits for short real numbers, and 52 bits for
	long real numbers). Because the first significant bit is known to be
	set, it does not need to be stored.
	
	   This information is documented on Pages 132-133 of the "Microsoft
	Macro Assembler Programmer's Guide."
