---
layout: page
title: "Q69350: CHRTDEMO Example Gives C2059 Error with ANSI Compatibility Set"
permalink: /pubs/pc/reference/microsoft/kb/Q69350/
---

## Q69350: CHRTDEMO Example Gives C2059 Error with ANSI Compatibility Set

	Article: Q69350
	Version(s): 6.00 6.00a | 6.00 6.00a
	Operating System: MS-DOS     | OS/2
	Flags: ENDUSER | s_quickc chartdemo pgchart
	Last Modified: 25-FEB-1991
	
	If the C version 6.00 sample Presentation Graphics program CHRTDEMO.C
	is compiled with the ANSI compatibility switch (/Za), the following
	compiler error will be produced:
	
	   chrtdemo.h(140) : error C2059: syntax error : '*'
	
	This is correct behavior due to the use of the Microsoft extension
	"far" found on line 140 of CHRTDEMO.H; /Za disables extensions
	specific to Microsoft C.
	
	The supplied CHRTDEMO.MAK makefile is set up to use the default
	setting of /Ze (Microsoft C extensions enabled). The C2059 error will
	only occur if this option is changed to /Za (ANSI compatibility --
	Microsoft C extensions disabled). This change could be made either
	inside the Programmer's WorkBench from the C Compiler Options dialog
	box or by actually modifying the makefile to include /Za in the
	compiler flags macro.
	
	According to the ANSI specification, all keywords that are extensions
	to the language must begin with a leading underscore. Beginning with C
	version 6.00, the Microsoft supplied header files contain this change
	to all keywords, such as _far, _pascal, etc., but the previous
	versions of these keywords without the leading underscores are
	retained for backwards compatibility.
	
	Most of the sample programs were modified to include the new keywords,
	but the line in CHRTDEMO.H was not changed to include _far, instead of
	far, thus resulting in the C2059 error with /Za. If you modify the far
	keyword on line 140 of CHRTDEMO.H so that it includes a leading
	underscore, this will eliminate the C2059 error even when /Za is
	specified.
	
	The QuickC compiler shares the same ANSI compatibility mode as the
	optimizing compiler, as well as a similar chart example program. Thus,
	the same C2059 error may be encountered with /Za in QuickC versions
	2.00, 2.01, 2.50, and 2.51.
