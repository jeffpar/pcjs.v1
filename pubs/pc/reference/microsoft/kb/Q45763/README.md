---
layout: page
title: "Q45763: Typographical Error in ALMUL.ASM of C Library Source"
permalink: /pubs/pc/reference/microsoft/kb/Q45763/
---

## Q45763: Typographical Error in ALMUL.ASM of C Library Source

	Article: Q45763
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | H_MASM docerr
	Last Modified: 13-SEP-1989
	
	In the "Microsoft C Run-Time Library Source Routines" for C Version
	5.00 or C 5.10, Line 28 of the file ALMUL.ASM in the \HELPER directory
	contains a typographical error. The incorrect statement reads as
	follows:
	
	   assume ds,code
	
	The statement should read as follows:
	
	   assume ds,data
	
	Since no data is defined or referenced in the original ALMUL.ASM, the
	typographical error does not cause problems in the C library. However,
	if you purchased the C library source code from the end user sales
	department, defined and referenced data in ALMUL.ASM, and attempted to
	assemble the modified ALMUL.ASM with MASM, you receive the following
	error:
	
	   error A2068: Cannot address with segment register
	
	Correcting the error in ALMUL.ASM, as noted above, corrects the
	problem.
