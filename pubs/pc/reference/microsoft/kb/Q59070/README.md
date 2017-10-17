---
layout: page
title: "Q59070: Buffer Size for fcvt, ecvt Is 349 Bytes"
permalink: /pubs/pc/reference/microsoft/kb/Q59070/
---

## Q59070: Buffer Size for fcvt, ecvt Is 349 Bytes

	Article: Q59070
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | s_quickc s_quickasm
	Last Modified: 15-MAR-1990
	
	Question:
	
	The run-time references to the ecvt and fcvt routines say that they
	use a single, statically allocated buffer while converting floating
	point numbers to character strings. How large is this buffer?
	
	Response:
	
	The buffer is currently defined as 349 bytes. However, the largest
	double-precision variable that can be used is 309 bytes, with 40 bytes
	for padding.
	
	Note: This size may change in future releases of Microsoft's C
	compilers, so you should not rely on the consistency of this size.
