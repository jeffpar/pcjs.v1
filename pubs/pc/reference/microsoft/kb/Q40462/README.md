---
layout: page
title: "Q40462: Include in MASM Source Effects /Z"
permalink: /pubs/pc/reference/microsoft/kb/Q40462/
---

## Q40462: Include in MASM Source Effects /Z

	Article: Q40462
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 24-APR-1989
	
	After the call to the include file, you cannot use /Z options to
	generate source lines when errors occur if a MASM source file contains
	an include instruction.
	
	The following source demonstrates this situation if it is assembled:
	
	masm /Z m9.asm;
	
	dosseg
	.model small
	.data
	.code
	    xxx ds,si
	    include m8.asm
	    xxx ds,si
	
	end
	
	As long as m8.asm contains any characters, the output of the assemble
	is as follows:
	
	Microsoft (R) Macro Assembler Version 5.10
	Copyright (C) Microsoft Corp 1981, 1988.  All rights reserved.
	
	                                    xxx ds,si
	m9.asm(8): error A2105: Expected: instruction, directive, or label
	m9.asm(10): error A2105: Expected: instruction, directive, or label
	
	  49254 Bytes symbol space free
	
	      0 Warning Errors
	      2 Severe  Errors
	
	If the instruction "include m8.asm" is commented out, the output of
	the assembler is as follows:
	
	Microsoft (R) Macro Assembler Version 5.10
	Copyright (C) Microsoft Corp 1981, 1988.  All rights reserved.
	
	                                    xxx ds,si
	m9.asm(8): error A2105: Expected: instruction, directive, or label
	                                    xxx ds,si
	m9.asm(10): error A2105: Expected: instruction, directive, or label
	
	  49390 Bytes symbol space free
	
	      0 Warning Errors
	      2 Severe  Errors
