---
layout: page
title: "Q63321: C 6.00 STARTUP.DOC Requests Wrong MASM Version"
permalink: /pubs/pc/reference/microsoft/kb/Q63321/
---

	Article: Q63321
	Product: Microsoft C
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | docerr
	Last Modified: 25-JUL-1990
	
	The Microsoft C version 6.00 STARTUP.DOC, under the "C Runtime Library
	Startup Sources" section, states that in order to build the start-up
	object files, MASM version 5.00 or later is required. However, when
	using MASM 5.00, the following error
	
	   A2009: symbol not defined: @F
	
	is produced. To work around this problem, two lines in CRT0DAT.ASM
	must be changed. Lines 701 and 703, which involve a jump to @F, should
	be changed as demonstrated below.
	
	Code Example
	------------
	
	Line 701:      jne    @F           (jump forward to @F)
	should read    jne    FOO          (where foo is any symbol
	                                    other than @F)
	
	Line 703:      @@:
	should read    FOO:
	
	This problem does not occur when MASM version 5.10 or later is used.
