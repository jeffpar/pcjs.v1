---
layout: page
title: "Q26707: A Loop Instruction in .386 USE16 Segment Which Decrements ECX"
permalink: /pubs/pc/reference/microsoft/kb/Q26707/
---

## Q26707: A Loop Instruction in .386 USE16 Segment Which Decrements ECX

	Article: Q26707
	Version(s): 5.00 5.10
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 9-FEB-1988
	
	Problem:
	   What is the mnemonic for a LOOP instruction in a .386 USE16 segment
	which decrements ECX?
	
	Response:
	   You can use a cast override to change the operand size for the LOOP
	instruction. For example, "LOOP dword ptr alabel". In a 16-bit
	segment, ECX will be used instead of CX. If you use a WORD override in
	a 32-bit segment, CX will be used instead of ECX.
