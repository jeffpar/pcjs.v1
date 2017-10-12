---
layout: page
title: "Q43913: C: Finding the Length of Double Precision Decimals"
permalink: /pubs/pc/reference/microsoft/kb/Q43913/
---

	Article: Q43913
	Product: Microsoft C
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | SR# G890424-17022 s_quickc
	Last Modified: 22-MAY-1989
	
	Question:
	
	Is there a straightforward way to determine how many decimal digits
	are required to fully represent the integer and fractional portions of
	a double floating-point number?
	
	Response:
	
	The most straightforward method is to convert the double to a string,
	locate the decimal point, and then calculate the length of the
	substrings before and after it.
	
	The following example demonstrates the technique:
	
	        #include <stdio.h>
	        #include <string.h>
	        #include <ctypes.h>
	
	        char str[30];
	        double stuff;
	        int dec_pos, places_after, places_before;
	
	        ...
	
	        sprintf(str, "%f", stuff);
	        dec_pos = strcspn( str, "." );
	        places_after = strlen( str ) - dec_pos - 1;
	        places_before = dec_pos - !isdigit( str[0] );
	
	The strcspn function returns the position in str at which "." is
	found. The isdigit() function accounts for the presence or absence of
	a minus or plus sign. The sequence of steps in the string "-1253.356"
	results in the following values:
	
	    dec_pos == 5
	    places_after == (9 - 5 - 1) == 3
	    places_before == (5 - 1) == 4
