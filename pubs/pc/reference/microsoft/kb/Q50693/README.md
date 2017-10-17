---
layout: page
title: "Q50693: Special Macros Not Recognized in NMAKE Inline Files"
permalink: /pubs/pc/reference/microsoft/kb/Q50693/
---

## Q50693: Special Macros Not Recognized in NMAKE Inline Files

	Article: Q50693
	Version(s): 1.00 1.01 | 1.00 1.01
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER |
	Last Modified: 10-NOV-1989
	
	When you use special macros to indicate targets or dependents in
	inline files, NMAKE Version 1.00 will generate the error message
	U4108, "special macro undefined." These special macros are $@, $*,
	$**, and $?.
	
	To prevent the problem, avoid use of these special macros in inline
	files. Instead of using those << inline files, create the response
	file in a separate NMAKE target, and redirect TYPE and ECHO commands
	to the desired file.
	
	$@ refers to the full name of the target, base plus extension. $*
	refers only to the base name of the target.
	
	$** represents the complete list of dependent files for the target. $?
	represents only the dependents that are out of date relative to the
	target.
	
	The following makefile will generate U4018 for $**:
	
	#makefile test
	FOO.EXE: *.OBJ
	    LINK @<<FOO.LRF
	$**;
	<<
	
	To avoid the problem, break this up into two steps, the makefile and a
	linker response file with output redirected:
	
	#makefile test
	FOO.EXE: *.OBJ FOO.LRF
	    LINK @FOO.LRF
	
	FOO.LRF: *.OBJ
	    echo $**; >FOO.LRF
