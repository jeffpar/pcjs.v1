---
layout: page
title: "Q30416: Only First LOCAL Variable Generates CodeView Information"
permalink: /pubs/pc/reference/microsoft/kb/Q30416/
---

## Q30416: Only First LOCAL Variable Generates CodeView Information

	Article: Q30416
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | buglist5.10
	Last Modified: 23-MAY-1988
	
	Only the first LOCAL variable on a line will generate CodeView
	information in the following assembler source code:
	
	   .MODEL small
	   .CODE
	   main    proc
	   local   first:word
	   local   second:word,third:word
	   local   fourth:word
	   ret
	   main    endp
	           end main
	
	   Microsoft is researching this problem and will post new information
	as it becomes available.
