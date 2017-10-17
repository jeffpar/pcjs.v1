---
layout: page
title: "Q21964: &quot;Subscript Out of Range&quot; Dimensioning a Dynamic Numeric Array"
permalink: /pubs/pc/reference/microsoft/kb/Q21964/
---

## Q21964: &quot;Subscript Out of Range&quot; Dimensioning a Dynamic Numeric Array

	Article: Q21964
	Version(s): 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 11-JAN-1990
	
	Problem:
	   I can dimension a single-dimensional dynamic integer array with
	32,000 elements; however, I get the message "Subscript Out of Range"
	dimensioning a two-dimensional integer array with only 30,000
	elements. The following is an example:
	
	   Rem $dynamic
	   dim b%(32000) 'this is okay
	   dim c%(10,2850) 'this is also okay
	   dim a%(10,3000) ' this will give a "subscript out of range" error
	
	Response:
	   The statement DIM A%(10,3000) exceeds the 64K size limit that
	exists for each dynamic numeric array. In QuickBASIC Version 4.00 and
	greater, you can compile with QB /AH or BC /AH to allow dynamic
	numeric (or fixed-length string) arrays to exceed 64K. The /AH switch
	is not implemented in QuickBASIC 3.00 and previous versions.
	   An array dimensioned DIM B%(32000) actually has 32,001 elements
	because the counting begins at element 0 by default, and the array
	will take up 64,002 bytes, since there are two bytes per integer
	element.
	   You may change the default starting element to 1 with the OPTION
	BASE 1 statement. An array dimensioned DIM C%(10,2850) actually has
	31,361 elements (11 multiplied by 2,851) which would take up 62,722
	bytes. An integer array dimensioned (10,3000) gives a "subscript out
	of range" error because it has 33,011 elements, or 66,022 bytes, which
	exceeds the dynamic numeric array size limit of 65,536 bytes (64K).
	   Note that there are 1,024 bytes per Kilobyte (K), therefore 64K
	multiplied by 1024 bytes per Kilobyte equals 65,536 bytes.
