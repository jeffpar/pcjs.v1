---
layout: page
title: "Q57500: Redirecting NMAKE 1.00/1.01 Output with -p Gives False Errors"
permalink: /pubs/pc/reference/microsoft/kb/Q57500/
---

	Article: Q57500
	Product: Microsoft C
	Version(s): 1.00 1.01
	Operating System: MS-DOS
	Flags: ENDUSER | buglist1.00 buglist1.01 fixlist 1.11
	Last Modified: 24-JAN-1991
	
	Redirecting the output of NMAKE version 1.00 or 1.01 can cause
	inference rules to fail if all of the following conditions are met:
	
	1. The inference rules are in uppercase letters.
	2. The -p option is used.
	3. The output is redirected.
	
	This problem is somewhat obscure, and it can be frustrating if you
	unwittingly meet all of these conditions. The error message displayed
	depends on the inference rule used, but it resembles the following:
	
	   NMAKE : warning U4017: ignoring rule .C.OBJ (extension not in
	           .SUFFIXES)
	
	The above error message is displayed with the following description
	file initiated with the command "NMAKE -p > out.txt":
	
	Description File
	----------------
	
	# start
	
	.C.OBJ:
	  cl $*
	
	main.obj : main.c
	
	# end
	
	Microsoft has confirmed this to be a problem in NMAKE versions 1.00
	and 1.01. This problem was corrected in NMAKE version 1.11.
