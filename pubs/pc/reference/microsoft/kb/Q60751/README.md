---
layout: page
title: "Q60751: Storage Types of Integer Constants Changed in C Version 6.00"
permalink: /pubs/pc/reference/microsoft/kb/Q60751/
---

## Q60751: Storage Types of Integer Constants Changed in C Version 6.00

	Article: Q60751
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | s_quickc
	Last Modified: 19-APR-1990
	
	To maintain ANSI compliance, Microsoft C Version 6.00 stores numeric
	constants in a slightly different manner than C Version 5.10.
	
	The following table summarizes the way constants are now represented
	by the Microsoft C Version 6.00 Compiler:
	
	  Storage Type Is the Smallest of the Following List That
	           Can Represent the Constant's Value
	----------------------------------------------------------
	
	  decimal constant                int
	    w/o suffix                    long
	    (ex. 123 )                unsigned long*
	
	----------------------------------------------------------
	
	  hex or octal constant           int
	    w/o suffix                 unsigned
	   (ex. 0x122 )                   long
	                              unsigned long
	
	----------------------------------------------------------
	
	  all constants **              unsigned
	  u or U suffix               unsigned long
	   (ex. 133u )
	
	----------------------------------------------------------
	
	  all constants **                long
	  l or L suffix               unsigned long
	   (ex. 332l )
	
	----------------------------------------------------------
	
	    all constants **
	u or U and l or L suffix      unsigned long
	   (ex. 0x111ul )
	
	----------------------------------------------------------
	
	* - Unsigned long was not supported for Standard Decimal Constant
	    Representation in Microsoft C Version 5.10 or QuickC 2.00.
	
	** - The maximum value for any decimal constant in Microsoft C
	     5.10/QuickC 2.00 was 2,147,483,647 regardless of type.
	
	All constants in C are stored as positive values. A constant preceded
	by a unary minus is considered an expression rather than a negative
	constant. If the type of the constant as defined above is unsigned,
	then the result of the unary minus expression is also considered
	unsigned.
	
	The exact rules for integer constant storage as taken from the ANSI
	draft dated Dec. 7, 1988, Section 3.1.3.2, are as follows:
	
	   The type of an integer constant is the first of the corresponding
	   list in which its value is represented. Unsuffixed decimal: int,
	   long int, unsigned long int; unsuffixed octal or hexadecimal: int,
	   unsigned int, long int, unsigned long int; suffixed by the letter u
	   or U:  unsigned int, unsigned long int; suffixed by the letter l or
	   L: long int, unsigned long int; suffixed by both the letters u or U
	   and l or L: unsigned long int.
