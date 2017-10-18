---
layout: page
title: "Q60072: Multiply Defined Structures and /Zi Option Locks Assembler"
permalink: /pubs/pc/reference/microsoft/kb/Q60072/
---

## Q60072: Multiply Defined Structures and /Zi Option Locks Assembler

	Article: Q60072
	Version(s): 5.10 5.10a | 5.10 5.10a
	Operating System: MS-DOS     | OS/2
	Flags: ENDUSER | buglist5.10a
	Last Modified: 19-APR-1990
	
	If the assembler source file has a structure declared twice with the
	same name, and the /Zi option is used, the assembler will go into an
	infinite loop.
	
	The following file demonstrates the problem:
	
	junk struc     ; Declaration of Structure
	junk ends
	junk struc     ; Repeat Declaration of Structure
	junk ends
	end            ; End of Assembler file
	
	Microsoft has confirmed this to be a problem in MASM 5.10a. We are
	researching this problem and will post new information here as it
	becomes available.
