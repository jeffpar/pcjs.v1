---
layout: page
title: "Q44130: Modifications for an Existing Make File Used with MAKE"
permalink: /pubs/pc/reference/microsoft/kb/Q44130/
---

	Article: Q44130
	Product: Microsoft C
	Version(s): 1.00   | 1.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | s_quickc  s_c  h_FORTRAN
	Last Modified: 16-JAN-1990
	
	Question:
	
	What modifications need to be made to an existing make file that was
	used with MAKE, and why?
	
	Response:
	
	To use NMAKE on make files originally designed for MAKE, the first
	descriptor block (target:dependent) must be a pseudotarget (see QuickC
	Version 2.00 ToolKit, Sections 7.3.5 and 7.5) that lists all of the
	original make targets in the file as the dependent files. The
	following is an example:
	
	   ALL : test.exe test1.exe test2.exe
	
	The reason you must include a pseudotarget descriptor block as the
	first descriptor block in a make file is that the previous MAKE
	utility tested EACH descriptor block sequentially throughout the file.
	NMAKE, however, tests only the FIRST descriptor block unless targets
	are specifically listed on the NMAKE command line. By using a
	pseudotarget, ALL in the above example, NMAKE must now assume
	that each dependent is out of date and attempt to make it. NMAKE now
	searches the make file for each dependent file listed (test.exe,
	test1.exe, and test2.exe) to see if a descriptor block exists for it.
	This causes NMAKE to behave just like MAKE.
	
	Example:
	-------
	
	   ALL : test.exe test1.obj
	
	   test1.obj : test1.c
	           cl /c test1.c
	
	   test.exe : test.obj test1.obj
	           link test test1;
	
	Without the pseudotarget, NMAKE tests only the first descriptor block
	and ignores any following descriptor block.
