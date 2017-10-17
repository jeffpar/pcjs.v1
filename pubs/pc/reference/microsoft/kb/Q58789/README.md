---
layout: page
title: "Q58789: &quot;Input Run-Time Module Path:&quot; Never Found If BRUN45.EXE Typed"
permalink: /pubs/pc/reference/microsoft/kb/Q58789/
---

## Q58789: &quot;Input Run-Time Module Path:&quot; Never Found If BRUN45.EXE Typed

	Article: Q58789
	Version(s): 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900209-125 buglist4.50 B_BasicCom
	Last Modified: 9-MAR-1990
	
	An executable program that requires but cannot locate the BRUN45.EXE
	run-time module displays the prompt "Input run-time module path:". If
	you type the complete path with the BRUN45.EXE or BRUN45 filename at
	the end, the search is never satisfied and the prompt continues to
	display. You must press CTRL+C or CTRL+BREAK to abort.
	
	Microsoft has confirmed this to be a problem in QuickBASIC Version
	4.50 for MS-DOS. This problem was corrected in Microsoft BASIC
	Compiler Versions 6.00 and 6.00b (fixlist6.00, fixlist6.00b) and in
	Microsoft BASIC Professional Development System (PDS) Version 7.00
	(fixlist7.00).
	
	A QuickBASIC source file compiled without the BC /O option makes
	LINK.EXE link with the BRUN45.LIB run-time library to create an
	executable program. If the resulting code cannot locate the BRUN45.EXE
	run-time module, a prompt displays for you to enter the path to search
	for the module.
	
	If you provide an incorrect path, the prompt displays again. This
	process continues until one of the following two conditions occur:
	
	1. You stop the process with CTRL+C or CTRL+BREAK.
	
	2. You give the correct path WITHOUT the filename BRUN45.EXE or
	   BRUN45 appended. For example, type "C:\QB45\" as a path.
	
	If you give the correct path plus the filename BRUN45 with or without
	the extension .EXE at the end, the prompt is never satisfied (even if
	you next give the correct path WITHOUT the filename BRUN45.EXE or
	BRUN45 appended).
