---
layout: page
title: "Q50333: Specifying Link Options with "-" Causes L4046, L1083, or U1013"
permalink: /pubs/pc/reference/microsoft/kb/Q50333/
---

	Article: Q50333
	Product: Microsoft C
	Version(s): 5.01.21
	Operating System: OS/2
	Flags: ENDUSER |
	Last Modified: 10-NOV-1989
	
	LINK command line switches must begin with the linker's option
	character, the forward slash (/). While it is valid to begin
	compilation switches with a dash (-), the same is not true for the
	linker.
	
	Code Example
	------------
	
	#--------------------
	# test make file
	#--------------------
	
	test.obj : test.c test.h
	     cl -c -Zi -G2sw -W3 test.c
	
	test.exe : test.obj test.def
	     link test, -CO -align:16, NUL, os2, test
	
	You type:
	        make test
	
	Microsoft (R) Program Maintenance Utility  Version 4.07
	Copyright (C) Microsoft Corp 1984-1988. All rights reserved.
	
	  link test, -CO -align:16, NUL, os2, test
	
	Microsoft (R) Segmented-Executable Linker  Version 5.01.21
	Copyright (C) Microsoft Corp 1984-1988.  All rights reserved.
	
	TEST.DEF(12) : warning L4046: module name different from output file name
	LINK : fatal error L1083: cannot open run file
	test(16) : fatal error U1013: 'link test, -CO -align:16, NUL, os2, test'
	         : error 2
