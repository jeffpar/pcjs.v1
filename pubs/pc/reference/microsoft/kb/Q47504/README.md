---
layout: page
title: "Q47504: MASM Err Msg: REP OUTSW Is a 386-Only Instruction"
permalink: /pubs/pc/reference/microsoft/kb/Q47504/
---

## Q47504: MASM Err Msg: REP OUTSW Is a 386-Only Instruction

	Article: Q47504
	Version(s): 5.00 5.10 | 5.00 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER |
	Last Modified: 30-AUG-1989
	
	Using the REP OUTSW instruction generates the following error:
	
	   A2066: Must have instruction after prefix.
	
	This problem occurs because the default assembly mode is 8086,
	but the REP OUTSW is a 80386 instruction.
	
	To enable the assembler to assemble properly, the .386 or .386P
	directive must be previously placed in the source code.
