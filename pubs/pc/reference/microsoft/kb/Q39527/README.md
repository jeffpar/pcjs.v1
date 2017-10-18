---
layout: page
title: "Q39527: DUP Is a Reserved Word in MASM"
permalink: /pubs/pc/reference/microsoft/kb/Q39527/
---

## Q39527: DUP Is a Reserved Word in MASM

	Article: Q39527
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | docerr
	Last Modified: 12-JAN-1989
	
	The table of reserved words in MASM on Page 69 of the "Microsoft Macro
	Assembler Programmer's Guide" does not include DUP. DUP is an operator
	for defining arrays, buffers and other data structures consisting of
	multiple data objects of the same size. DUP cannot be used as a
	variable. For example, the following statement allocates the string
	"Test " five times for a total of 20 bytes:
	
	   DB   5 DUP ("Test ")
