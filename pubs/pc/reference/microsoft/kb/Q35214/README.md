---
layout: page
title: "Q35214: Proc Directive with Uses Option and Nine Registers"
permalink: /pubs/pc/reference/microsoft/kb/Q35214/
---

## Q35214: Proc Directive with Uses Option and Nine Registers

	Article: Q35214
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | SR# G880831-2870 buglist5.10
	Last Modified: 13-JAN-1989
	
	The assembler fragment (for MASM Version 5.10) below displays two
	problems when assembled.
	
	The problem seems to be the use of more than eight registers in a
	"proc uses" clause.
	
	A workaround for this problem is to specify only eight registers in
	the uses option and include in your procedure the pushes and pops for
	any other registers to be saved.
	
	Microsoft has confirmed this to be a problem in Version 5.10. We are
	researching this problem and will post new information as it becomes
	available.
	
	The following assembler fragment demonstrates this problem:
	
	foo proc uses ax bx cx dx ds cs ss bp
	foo endp
	end
	
	When assembled as is, MASM returns an out of memory error:
	
	Microsoft (R) Macro Assembler Version 5.10
	Copyright (C) Microsoft Corp 1981, 1988.  All rights reserved.
	
	masm.err(12): Out of memory
	
	When assembled as a part of the complete module, it returns the error:
	
	Microsoft (R) Macro Assembler Version 5.10
	Copyright (C) Microsoft Corp 1981, 1988.  All rights reserved.
	
	rd.ASM(84): warning A4016: Reserved word used as symbol: BP
	rd.ASM(89): error A2009: Symbol not defined: BP(ASCII 016)
	
	  47898 Bytes symbol space free
	
	      1 Warning Errors
	      1 Severe  Errors
