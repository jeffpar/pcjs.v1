---
layout: page
title: "Q43392: C: Clarification of the &quot;g&quot; Format Specifier"
permalink: /pubs/pc/reference/microsoft/kb/Q43392/
---

## Q43392: C: Clarification of the &quot;g&quot; Format Specifier

	Article: Q43392
	Version(s): 5.00 5.10 | 5.00 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | s_quickc
	Last Modified: 17-MAY-1989
	
	The output format resulting from the printf() format specifier "g"
	does not exactly match the output format resulting from either format
	specifier "e" or "f." Page 459 of the "Microsoft C Run-Time Library
	Reference" states that "g" will use either the "f" or "e" format,
	whichever is more compact.
	
	The precision value is interpreted differently in "g" format than in
	"f" format. Table R.3 on Pages 461-2 states the difference. The
	precision for "f" specifies the number of digits after the decimal
	point. The precision for "g" specifies the maximum number of
	significant digits printed.
	
	The following example demonstrates the difference:
	
	#include <stdio.h>
	
	void main (void)
	{
	  printf ("%.4g\n", 4.0/3.0);    /* Outputs:  1.333  */
	  printf ("%.4f\n", 4.0/3.0);    /* Outputs:  1.3333 */
	}
	
	The results of the above program are correct.
