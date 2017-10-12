---
layout: page
title: "Q37620: EOH Is Not a Defined Constant for getch or getche"
permalink: /pubs/pc/reference/microsoft/kb/Q37620/
---

	Article: Q37620
	Product: Microsoft C
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER |
	Last Modified: 14-NOV-1988
	
	The "Microsoft C 5.10 Optimizing Compiler Run-Time Library Reference"
	manual for the functions getch and getche states that when reading a
	function or cursor key, the first call to either function will return
	0 or EOH. This is misleading; EOH appears to be a constant that is
	defined in an include file, though it is not. These functions actually
	return 0 or 0xE0. The 0x convention is followed throughout the manual
	for hexadecimal numbers, except in this case.
