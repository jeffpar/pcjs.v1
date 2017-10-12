---
layout: page
title: "Q42791: QuickC: Tracking Down Null Pointer Assignments"
permalink: /pubs/pc/reference/microsoft/kb/Q42791/
---

	Article: Q42791
	Product: Microsoft C
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 2-MAY-1989
	
	When a program modifies memory at location 0 (NULL) in the small or
	medium memory models, the following error message is reported at
	program termination:
	
	   run-time error R6001
	   - null pointer assignment
	
	You can find the location of null pointer assignments in the small and
	medium memory models using either the debugger in QuickC Versions 2.00
	and later or the CodeView debugger.
	
	To detect null pointer assignments in QuickC 2.00 and later, do the
	following:
	
	1. Select the Watchpoint option under the Debug menu.
	
	2. Input the following:
	
	      * (long *) 0
	
	This watchpoint will cause QuickC to stop executing your program when
	the memory location 0 (NULL) is modified. QuickC will immediately
	display the following pop-up and will highlight the line of code
	directly following the line that modified memory location 0:
	
	   Watchpoint reached:
	       * (long *) 0
	
	The null segment is 66 bytes long, and only four (4) bytes are watched
	with the above watchpoint. However, most cases of null pointer
	assignment occur when the first four bytes of the null segment are
	modified. Those cases will be caught with this watchpoint.
	
	Note that this technique does not apply to the compact, large, and
	huge memory models because their data pointers are far, by default.
	
	Information for using the CodeView debugger is provided in the
	"Microsoft CodeView and Utilities Software Development Tools for the
	MS-DOS Operating System" manual.
