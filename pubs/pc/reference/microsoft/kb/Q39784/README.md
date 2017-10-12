---
layout: page
title: "Q39784: &quot;D&quot; Incorrectly Defined as a printf/scanf Format Specifier"
permalink: /pubs/pc/reference/microsoft/kb/Q39784/
---

	Article: Q39784
	Product: Microsoft C
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | docerr
	Last Modified: 29-DEC-1988
	
	On Page 80 of the "Microsoft C 5.1 (and 5.0) Quick Reference Guide"
	(spiral bound), the capital letter "D" is incorrectly defined as a
	printf/scanf format specifier representing a signed long-decimal
	integer. The printf/scanf format specifier for a long-decimal integer
	is "ld". Using %D will print/return garbage characters.
