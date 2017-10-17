---
layout: page
title: "Q35662: &quot;Out of Memory&quot; in MS-DOS 4.00, OK in MS-DOS 3.x; 30K Impact"
permalink: /pubs/pc/reference/microsoft/kb/Q35662/
---

## Q35662: &quot;Out of Memory&quot; in MS-DOS 4.00, OK in MS-DOS 3.x; 30K Impact

	Article: Q35662
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 16-DEC-1989
	
	MS-DOS Versions 4.00 and later take 30K or more memory than MS-DOS
	Versions 3.x. As a result, a memory-intensive application that
	successfully compiled and executed under MS-DOS Versions 3.x may fail
	to run under MS-DOS Version 4.00.
	
	You can check if the problem is caused by memory limitations by adding
	a SETMEM(-30000) to the beginning of the program and running under
	MS-DOS Versions 3.x. If the program runs out of memory with this test,
	it may fail with MS-DOS Version 4.00.
	
	This information applies to Microsoft QuickBASIC Versions 4.00 4.00b
	and 4.50 for MS-DOS, to Microsoft BASIC Compiler Versions 6.00 and
	6.00b for MS-DOS and MS OS/2, and to Microsoft BASIC PDS Version 7.00
	for MS-DOS and MS OS/2.
