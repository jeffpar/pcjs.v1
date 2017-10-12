---
layout: page
title: "Q60332: C 6.00 sizeof() Function Returns unsigned Instead of int"
permalink: /pubs/pc/reference/microsoft/kb/Q60332/
---

	Article: Q60332
	Product: Microsoft C
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | s_quickc
	Last Modified: 19-APR-1990
	
	To comply with new ANSI specifications, the sizeof() operator in
	Microsoft C Version 6.00 and QuickC Version 2.50 now returns an
	unsigned integer. In C Version 5.10 and QuickC Version 2.00, this
	function returns a signed int.
	
	The unsigned return value can cause problems in cases using
	-sizeof(type). In the following example, trying to position a file one
	record from the end which worked properly under C Version 5.10, does
	not work properly under C Version 6.00:
	
	   fseek(file,(long)(-sizeof(record)),SEEK_END);
	
	This now gives a location far beyond the file's end because the
	generated value is no longer sign extended. Since the unary minus (-)
	doesn't change the "signedness" of a variable and the sizeof()
	operator is now a unsigned int, the compiler performs a zero extension
	to convert from an unsigned int to a long. This change in
	representation of the sizeof() operator was done to maintain
	compatibility with the ANSI standard.
	
	In other words, if "record" above is of type char, instead of
	returning a long value of -1, the following returns the positive value
	of 0x0000ffff or 32767:
	
	   (long)(-sizeof(record))
	
	One workaround is to cast the sizeof() result to a signed int
	before casting it to a long. For example:
	
	   (long)-(int)sizeof(record)
