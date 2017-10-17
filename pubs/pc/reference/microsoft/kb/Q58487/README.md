---
layout: page
title: "Q58487: C 6.00 Utility Support for OS/2 Long Filenames"
permalink: /pubs/pc/reference/microsoft/kb/Q58487/
---

## Q58487: C 6.00 Utility Support for OS/2 Long Filenames

	Article: Q58487
	Version(s): 6.00
	Operating System: OS/2
	Flags: ENDUSER | s_link s_nmake s_c
	Last Modified: 28-JAN-1991
	
	The utilities shipped for Microsoft C version 6.00 provide limited
	support for OS/2 long filenames introduced in OS/2 version 1.20.
	
	The following is a list of the limitations:
	
	1. Long filenames with quotation marks are supported via the command
	   line. For example:
	
	      "fooo bar"
	
	2. Embedded quoted long filenames on the command line are not
	   supported. For example:
	
	      d:\foo\" bar xyzzy"
	
	3. Link supports one quoted long filename per argument. For example
	
	      "foo bar"+"bar foo"
	
	   will resemble the following:
	
	      "foo bar+bar foo"
	
	4. NMAKE provides long filename support inside the makefile with the
	   restriction (beyond 1 and 2 above) that target and dependent names
	   cannot have a period (.) as the first character (conflicts with
	   inference rules). For example:
	
	      ".foo bar.c".".foo bar.exe"
