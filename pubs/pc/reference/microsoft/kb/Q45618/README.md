---
layout: page
title: "Q45618: CALLTREE Produces No Warnings When Out of Disk Space"
permalink: /pubs/pc/reference/microsoft/kb/Q45618/
---

## Q45618: CALLTREE Produces No Warnings When Out of Disk Space

	Article: Q45618
	Version(s): 1.00   | 1.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | S_C H_MASM H_Fortran S_PasCal
	Last Modified: 23-JUN-1989
	
	The CALLTREE.EXE utility shipped with the Microsoft Editor (included
	with MASM, Optimizing C, FORTRAN, and Pascal) does not produce a
	warning if it runs out of disk space while writing output files. It
	simply closes the file being currently written and attempts to produce
	the next file. If the disk has no space free, the file will be created
	and closed with a length of 0 (zero) bytes. No error messages are
	produced in any case.
	
	Microsoft is aware of this limitation of CallTree. The error checking
	and messages features are under review and will be considered for
	inclusion in a future release.
