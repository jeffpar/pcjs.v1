---
layout: page
title: "Q30377: Error Message A2051 Incorrectly Generated"
permalink: /pubs/pc/reference/microsoft/kb/Q30377/
---

## Q30377: Error Message A2051 Incorrectly Generated

	Article: Q30377
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | buglist5.10
	Last Modified: 12-JAN-1989
	
	The code given below generates the following error message:
	
	A2051: Operand not in current CS ASSUME segment
	
	The error is caused by the JE NEAR PTR statement. However, the first
	jump statement assembles without error. Both statements should or
	should not assemble as they generate full 16-bit fixup records.
	
	Microsoft has confirmed this to be a problem in Version 5.10. We are
	researching this problem and will post new information as it becomes
	available.
	
	You can work around this problem by not using the PTR operator in the
	JE instruction.
	
	The following code demonstrates the problem:
	
	   .386
	   PGROUP  group   CODE,NCODE
	   CODE    segment use16 byet public 'prog'
	           assume  cs:PGROUP
	           jmp     SYM
	           je      near ptr SYM
	   CODE    ends
	   NCODE   segment use16 byte public 'prog'
	           assume  cs:PGROUP
	   SYM:
	   NCODE   ends
	           end
