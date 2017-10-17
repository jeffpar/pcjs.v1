---
layout: page
title: "Q43999: NMAKE Is Case Sensitive"
permalink: /pubs/pc/reference/microsoft/kb/Q43999/
---

## Q43999: NMAKE Is Case Sensitive

	Article: Q43999
	Version(s): 1.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 3-MAY-1989
	
	It is not clearly stated in the manual that NMAKE IS case sensitive.
	Case sensitivity is imposed on the following:
	
	1. Macros
	
	   For instance, if you define "TEXT" as a macro, you must use $(TEXT)
	   to insert it. If $(text) is used, the macro is undefined and
	   nothing happens.
	
	2. Predefined Macros (.SUFFIXES;.PRECIOUS, CC, etc.)
	
	   Predefined macros such as .SUFFIXES must be in all in uppercase
	   letters. If you use .suffixes, NMAKE returns the error ".suffixes
	   too long: truncated to 8.3".
	
	3. File extensions
	
	   When adding file extensions to the .SUFFIXES list, you must
	   preserve case. For example, to add the file extension .dll to the
	   suffix list, you would put the following line in your makefile:
	
	      .SUFFIXES : .dll
	
	   Then, all files with the .dll extension must have the .dll
	   extension in lowercase letters.
