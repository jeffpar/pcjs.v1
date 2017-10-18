---
layout: page
title: "Q39443: Use of Parentheses for Operator Precedence Necessary"
permalink: /pubs/pc/reference/microsoft/kb/Q39443/
---

## Q39443: Use of Parentheses for Operator Precedence Necessary

	Article: Q39443
	Version(s): 5.00   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 12-JAN-1989
	
	You may be able to correct "Illegal size for operand" errors by
	careful use of parentheses.
	
	Microsoft has confirmed this to be a problem in Version 5.10. We are
	researching this problem and will post new information as it becomes
	available.
	
	The following code demonstrates warnings, errors, and their solution:
	
	dosseg
	.model small,c
	.data
	
	.code
	foo PROC buffer:FAR PTR BYTE
	
	           mov     bx, WORD PTR buffer[0]
	           mov     ds, WORD PTR buffer[2]
	
	; MASM gives an operand-size error. This is a precedence problem that
	; you can correct with parentheses:
	
	           mov     bx, WORD PTR (buffer[0])
	           mov     ds, WORD PTR (buffer[2])
	
	foo ENDP
	
	end
	......................................................................
	masm test,,,;
	Microsoft (R) Macro Assembler Version 5.10
	Copyright (C) Microsoft Corp 1981, 1988.  All rights reserved.
	
	test.ASM(9): warning A4057: Illegal size for operand
	test.ASM(10): error A2057: Illegal size for operand
	
	  23666 Bytes symbol space free
	
	      1 Warning Errors
	      1 Severe  Errors
	.......................................................................
