---
layout: page
title: "Q23753: fseek() Function Requires a long for the Offset into a File"
permalink: /pubs/pc/reference/microsoft/kb/Q23753/
---

	Article: Q23753
	Product: Microsoft C
	Version(s): 3.00 4.00 5.00 5.10 6.00 6.00a | 5.10 6.00 6.00a
	Operating System: MS-DOS                         | OS/2
	Flags: ENDUSER |
	Last Modified: 6-FEB-1991
	
	Question:
	
	I am using fseek() to seek in a file, but it fails when I try to seek
	beyond 32K. Is this a limit of fseek()?
	
	Response:
	
	The offset parameter to fseek() takes a value of type long, so this
	problem is not likely to be the result of fseek() limits. On the other
	hand, this situation does occur if you are using variables of type int
	to calculate the offset. Because an int is limited to a maximum value
	of 32,767 (32K), values assigned to ints between 32K and 64K are
	treated as negative.
	
	An int will be automatically typecast to a long when passed to fseek()
	but when this occurs, it is sign-extended. Thus, an int value above
	32K that is represented as negative will be sign-extended to a
	negative long. This, in turn, specifies a negative offset into the
	file, which fails to produce the expected results.
	
	When using the fseek() routine, just be sure to use a long for
	specifying the offset into the file.
