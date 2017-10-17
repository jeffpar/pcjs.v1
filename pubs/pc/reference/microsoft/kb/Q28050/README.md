---
layout: page
title: "Q28050: QuickBASIC Hangs Using User-Defined Record Greater Than 64K"
permalink: /pubs/pc/reference/microsoft/kb/Q28050/
---

## Q28050: QuickBASIC Hangs Using User-Defined Record Greater Than 64K

	Article: Q28050
	Version(s): 4.00 4.00b
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom buglist4.00 buglist4.00b fixlist4.50
	Last Modified: 22-JAN-1990
	
	QuickBASIC fails to trap a user-defined record type that exceeds 64K
	in size. It is not legal for a user-defined record to exceed 64K in
	size.
	
	The example program below will cause the system to hang.
	
	Microsoft has confirmed this to be a problem in QuickBASIC Versions
	4.00 and 4.00b, and in Microsoft BASIC Compiler Versions 6.00 and
	6.00b for MS-DOS and MS OS/2 (buglist6.00, buglist6.00b). This problem
	was corrected in QuickBASIC Version 4.50 and in Microsoft BASIC
	Professional Development System (PDS) Version 7.00 for MS-DOS and MS
	OS/2 (fixlist7.00).
	
	The following is a code example:
	
	type foo
	   a as string*32500
	   b as string*32500
	   c as string *1000
	end type
	dim x as foo
	x.c=" "
	print x.c
	end
	
	Note: Dynamic arrays of user-defined records may exceed 64K in size
	provided that each record is less than 64K in size. When using an
	array larger than 64K (which requires the /AH option), it is also
	advisable to make the record-array element size a multiple (of any
	power of 2) that terminates exactly on 64K boundaries.
