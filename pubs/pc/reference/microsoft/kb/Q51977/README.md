---
layout: page
title: "Q51977: QuickAssembler Does Not Support 64K Data Segments"
permalink: /pubs/pc/reference/microsoft/kb/Q51977/
---

## Q51977: QuickAssembler Does Not Support 64K Data Segments

	Article: Q51977
	Version(s): 2.01
	Operating System: MS-DOS
	Flags: ENDUSER  | buglist2.01
	Last Modified: 17-JAN-1990
	
	When attempting to create a data segment that is equal to 65536 bytes,
	QuickAssembler (QA) will generate an object file that does not link.
	After assembling a program with 65536 bytes of data, the error L1103
	is generated at link time. This problem occurs with any of the linkers
	provided with Microsoft QuickC with QuickAssembler. The Microsoft
	Macro Assembler produces a valid object module under similar
	conditions.
	
	The following is sample code:
	
	; DATA.ASM
	; To see the problem, uncomment the second declaration and compile
	; using the QCL DATA.ASM
	
	       .model small
	       .data
	ok     db 65535 dup(?)
	; bad  db ?
	  end
	
	The problem lies in the size of data segment the QuickAssembler
	generates. Using the Microsoft Macro Assembler, the segment size
	requested in the object module is 10000 for a 64K segment. This same
	64K segment is given length 0 (zero) (rounded at 16-bits) by the
	QuickAssembler.
	
	Microsoft has confirmed this to be a problem in Version 2.01. We are
	researching this problem and will post new information here as it
	becomes available.
