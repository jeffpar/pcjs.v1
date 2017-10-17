---
layout: page
title: "Q47369: scanf Unable to Match Extended Characters in Format String"
permalink: /pubs/pc/reference/microsoft/kb/Q47369/
---

## Q47369: scanf Unable to Match Extended Characters in Format String

	Article: Q47369
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | S_QuickC
	Last Modified: 9-AUG-1989
	
	Note: In this article, the "??" symbol is used to represent an
	extended ASCII character. Because extended ASCII characters appear
	differently on many systems, it is unreliable to use a real character.
	Therefore, whenever you see the "??" symbol, it is meant to represent
	a character with an ASCII code of 128 to 255.
	
	When using the scanf functions (scanf, cscanf, fscanf, sscanf), you
	may place literal characters in the format string and scanf will read
	an input string as long as the input string matches these characters
	in position and value. Once the input string conflicts with the
	format, scanf terminates. The allowable characters are the standard
	ASCII values only and attempts to use extended ASCII characters in the
	format result in failure. The scanf function terminates as soon as it
	reads an extended character, even if it is the same as the expected
	character in the format. For example, if the format string contains
	"??%d", and "??45" is input, scanf quits reading at "??" even though
	it matches, since it does not recognize the extended ASCII value.
	
	This problem does not occur in QuickC Versions 2.00 and 2.01.
	
	The following program demonstrates this situation. In the first case,
	scanf expects "sqrt" to be typed in followed by a number. If this is
	done correctly, then scanf reads the number and the square root is
	displayed. In the second case, scanf should be expecting the "??"
	symbol followed by a number, but if this is typed in, scanf still
	fails to read the number since it was unable to correctly match the
	"??" to the format string.
	
	/* Before running this program, replace all occurrences of "??" with
	   extended ASCII character 251. (Hold down the ALT key and type 251
	   on the numeric keypad, then release the ALT key.)              */
	
	#include <stdio.h>
	#include <math.h>
	
	void main(void)
	{
	    int    values_read;
	    double num;
	
	    /* THIS PART WORKS - scanf recognizes "sqrt" in format string */
	
	    printf( "Enter sqrtNUMBER by typing \"sqrt\" followed by any "
	            "NUMBER >= 0\n(e.g sqrt87.6) : ");
	    values_read = scanf( "sqrt%lf", &num);
	    printf( "values_read = %d\n", values_read);
	    printf( "sqrt%lf = %lf\n\n", num, sqrt(num));
	    fflush(stdin);
	
	    /* THIS PART DOES NOT WORK - scanf fails to recognize "??" in
	       the format string */
	
	    printf( "Enter ??NUMBER by holding down the <ALT> key while "
	            "typing\n\"251\" on the numeric keypad followed by "
	            "any NUMBER >= 0\n(e.g. ??87.6) : ");
	    values_read = scanf( "??%lf", &num);            /* returns 0 */
	    printf( "values_read = %d\n", values_read);
	    printf( "??%lf = %lf\n\n", num, sqrt(num));
	}
