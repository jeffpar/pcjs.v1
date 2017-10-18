---
layout: page
title: "Q39442: asub and ctest Defined Incorrectly in MASM Programmer's Guide"
permalink: /pubs/pc/reference/microsoft/kb/Q39442/
---

## Q39442: asub and ctest Defined Incorrectly in MASM Programmer's Guide

	Article: Q39442
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | docerr
	Last Modified: 12-JAN-1989
	
	There is a documentation error on Page 91 of the "Microsoft Mixed
	Language Programming Guide" for Microsoft C, FORTRAN, and MASM. In
	figure 6.7, the assembly procedure "asub" should be defined as
	
	   _asub PROC
	
	not as follows:
	
	   PROC asub
	
	Also, the call to "ctest" should appear as
	
	   call _ctest
	
	not as follows:
	
	   call ctest
