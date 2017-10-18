---
layout: page
title: "Q38935: Expressions in Define Statements"
permalink: /pubs/pc/reference/microsoft/kb/Q38935/
---

## Q38935: Expressions in Define Statements

	Article: Q38935
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 12-JAN-1989
	
	In all versions of Microsoft Macro Assembler earlier than Version
	5.10, you could not have greater than 16-bit arithmetic in define
	statements. This has been changed in Version 5.10.
	
	In all versions before Version 5.10, you could use constants of
	greater than 16 bits; however, you could not put an arithmetic
	expression to obtain a number larger than 16 bits.
	
	The following is an example:
	
	DD 86400     <-  correct.
	DD 60*60*24  <-  incorrect. This would be truncated at the
	                            16-bit value.
	
	This feature has been implemented in Version 5.10 so that both of the
	above declarations will yield the same answer.
