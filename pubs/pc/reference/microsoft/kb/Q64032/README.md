---
layout: page
title: "Q64032: NMAKE Predefined Macro &#36;(@D) Has Same Value As &#36;@"
permalink: /pubs/pc/reference/microsoft/kb/Q64032/
---

## Q64032: NMAKE Predefined Macro &#36;(@D) Has Same Value As &#36;@

	Article: Q64032
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | docerr
	Last Modified: 31-AUG-1990
	
	On Page 114 of the "Microsoft C Advanced Programming Techniques"
	version 6.0 manual, it states that an example value of $@ is
	"C:\SOURCE\PROG\SORT.OBJ". The macro $(@D) is listed as having a
	sample value of "C:\SOURCE\PROG". In reality, both macros give the
	value of the full path, filename, and extension, or
	"C:\SOURCE\PROG\SORT.OBJ".
	
	This problem can be reproduced by creating a simple test MAKE file.
	The following is an example:
	
	Foo :  c:\autoexec.bat
	   echo $(@D)
	
	Running NMAKE with this file gives the following result:
	
	   echo c:\config.sys
	c:\config.sys
