---
layout: page
title: "Q61189: C 6.00 README: The sizeof Operator Return Value"
permalink: /pubs/pc/reference/microsoft/kb/Q61189/
---

## Q61189: C 6.00 README: The sizeof Operator Return Value

	Article: Q61189
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 25-APR-1990
	
	The sizeof Operator Return Value
	--------------------------------
	
	To comply with ANSI specifications, the sizeof operator now returns an
	unsigned int rather than an int. This may cause problems in statements
	of the following form:
	
	   -sizeof( expression )
	
	For example, the following line of code, used to position a file
	pointer one record from the end, no longer works:
	
	   fseek( file, (long)(-sizeof( record )), SEEK_END );
	
	Because sizeof returns an unsigned int, the record size is zero-
	extended to a long value rather than sign-extended to the appropriate
	signed value.
	
	To avoid this problem, you can cast the record size to a long before
	you negate it, as follows:
	
	   fseek( file, -((long)sizeof( record )), SEEK_END );
