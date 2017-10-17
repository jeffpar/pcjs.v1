---
layout: page
title: "Q50351: mktemp() Creates a Maximum of 27 Unique Filenames"
permalink: /pubs/pc/reference/microsoft/kb/Q50351/
---

## Q50351: mktemp() Creates a Maximum of 27 Unique Filenames

	Article: Q50351
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | S_QuickC docerr
	Last Modified: 30-NOV-1989
	
	It is unclear in the documentation for the mktemp() function in the
	Version 5.10 "Microsoft C Optimizing Compiler for the MS-DOS Operating
	System Run-Time Library Reference" (Page 432) exactly how many
	filenames mktemp() creates. The reference states the following:
	
	   When creating new names, mktemp uses, in order, "0" and the
	   lowercase letters "a" to "z".
	
	This is correct; however, the documentation fails to mention that
	these are the only filenames that are created. Any further calls to
	mktemp (after "z" has already been placed in the template) fail.
	Therefore, this limits the number of unique filenames to 27.
