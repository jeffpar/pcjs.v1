---
layout: page
title: "Q42448: Unwanted R6013: Illegal Far Pointer Use"
permalink: /pubs/pc/reference/microsoft/kb/Q42448/
---

## Q42448: Unwanted R6013: Illegal Far Pointer Use

	Article: Q42448
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 2-MAY-1989
	
	Problem:
	
	When I set a far pointer to an absolute address, such as Video memory,
	I get a run-time error "R6013 Illegal far pointer use".
	
	Response:
	
	To set pointers to an address below your program's data segment(s),
	you must first disable pointer checking in Compiler Flags, which can
	be accessed from Make Option under the Options menu; or use the
	check_pointer pragma to turn pointer checking on and off.
	
	QuickC 2.00 has a feature that adds code to the executable to check
	for null pointer assignments and out-of-range pointers. Any attempt to
	store data into a pointer that points into the program's code
	segment(s) or any place before the data segment(s) produces this
	run-time error. This information is documented in the "Microsoft
	QuickC Tool Kit Version 2.0" manual, Section 4.3.34 /Zr (Check
	Pointers), Page 104-105.
