---
layout: page
title: "Q39446: Division Operators &quot;/&quot; with .186, .286, and .386"
permalink: /pubs/pc/reference/microsoft/kb/Q39446/
---

## Q39446: Division Operators &quot;/&quot; with .186, .286, and .386

	Article: Q39446
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | calculation operator, division
	Last Modified: 12-JAN-1989
	
	To use calculation operators on constant values larger than 17 bits,
	".386" has to be enabled. Otherwise, the assembler may generate error
	"A2029 : Division by 0 or overflow."
	
	Please refer to Page 174 of the "Microsoft Macro Assembler
	Programmer's Guide" in the section "Using Operators" for more specific
	information. The program below demonstrates this information.
	
	When 80386 is enabled by using .386, the program will be assembled
	without any error message. Then the program has to run on a 80386
	machine.
	
	The following is the sample program:
	
	    ; sample program
	    .186
	    .model small
	    .data
	    dd  989680h/4h          ; the constant value is more than 17 bits.
	    .code
	    end
	...................................................................
	masm test,,,;
	Microsoft (R) Macro Assembler Version 5.10
	Copyright (C) Microsoft Corp 1981, 1988.  All rights reserved.
	
	test.ASM(7): error A2029: Division by 0 or overflow
	
	  23918 Bytes symbol space free
	
	      0 Warning Errors
	      1 Severe  Errors
