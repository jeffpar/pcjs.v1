---
layout: page
title: "Q43219: scanf, sscanf, fscanf Functions Fail When Scanning All Zeros"
permalink: /pubs/pc/reference/microsoft/kb/Q43219/
---

	Article: Q43219
	Product: Microsoft C
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER | buglist2.00
	Last Modified: 2-MAY-1989
	
	The functions scanf, sscanf, and fscanf fail when all of the following
	conditions are satisfied:
	
	1. The format specifier for a field is any of the following, where "w"
	   is the maximum input field width:
	
	      %wX    %wI    %wD
	      %wx    %wi    %wO
	      %wlx   %wli   %wU
	
	2. The field being scanned is all zeros and has a length of w.
	
	3. The field being scanned is immediately followed by a valid digit
	   (no intervening white space).
	
	Under the above conditions, these functions read one extra digit from
	the input buffer as if the "skip leading zeros" routine doesn't
	realize that it is scanning past the maximum length specified (w).
	
	To work around this problem, for the format specifiers %wD, %wO, and
	%wU, use %wld, %wlo, and %wlu, respectively. For the remaining
	specifiers, there is no workaround other than to scan the buffer
	character by character.
	
	Microsoft has confirmed this to be a problem in Version 2.00. We are
	researching this problem and will post new information as it becomes
	available.
	
	The following program demonstrates this problem:
	
	#include <stdio.h>
	
	void main (void)
	 { int a, b;
	
	   /* There are 2 zeros, and w=2. */
	   sscanf ( "0012", "%2x%d", &a, &b );
	
	   /* This should output:   a=0 b=12
	    * Instead, it outputs:  a=1 b=2
	    */
	   printf ( "a=%x b=%d\n", a, b );
	 }
