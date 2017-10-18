---
layout: page
title: "Q39444: The Stack Grows into Low Memory"
permalink: /pubs/pc/reference/microsoft/kb/Q39444/
---

## Q39444: The Stack Grows into Low Memory

	Article: Q39444
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | docerr
	Last Modified: 12-JAN-1989
	
	On Page 300 of the "Microsoft Macro Assembler Programmer's Guide," the
	first paragraph incorrectly states that "it is possible to return the
	stack to its original status by subtracting the correct number of
	words from the SP register." Instead, after pushing values onto the
	stack, it is possible to return the stack to its original status by
	adding the correct number of words to the SP register.
	
	Also, the first example on Page 300 uses the SUB command to restore
	the stack pointer. The ADD command should be used instead.
