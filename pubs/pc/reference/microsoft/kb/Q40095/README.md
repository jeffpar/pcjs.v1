---
layout: page
title: "Q40095: Intra-Segment Near Calls in MASM"
permalink: /pubs/pc/reference/microsoft/kb/Q40095/
---

## Q40095: Intra-Segment Near Calls in MASM

	Article: Q40095
	Version(s): 4.00 5.00 5.10
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 12-JAN-1989
	
	Question:
	
	When there is an intra-module near call in a MASM program, as in the
	following example, why does the assembler generate a self-relative,
	intra-segment fixup?
	
	foo proc near
	    ...
	foo ends
	
	bar proc near
	    call foo
	bar endp
	
	These are unnecessary as indicated in Intel's "8086 Relocatable
	Object Module Formats," Appendix 4, which states the following:
	
	   "Self-Relative references within a single LSEG do not require a fixup,
	   the translator puts the appropriate value in LOCATION."
	
	The assembler does not have this problem with near JMPs, only with
	CALLs.
	
	Response:
	
	It is correct that Intel states that it is not necessary to perform a
	fixup for intra-segment calls. However, it is not forbidden to do so.
	Microsoft is making efforts to optimize the assembler without causing
	a lack of control by the programmer over the code. While some people
	desire a given optimization, there are others who would decry it as a
	loss of control over their code. There are keywords that allow you to
	force various types of calls and jumps such as the SHORT keyword. Yu
	may want to check these to see if they offer the control you need.
	
	The workaround for generation of any special opcode is to use the
	"dw" or "db" directive in the code segment. The following can be
	assembled [2A D2] or [28 D2]:
	
	   sub dl,dl
	
	To get the second generation, you must enter the following:
	
	   db 28h, 0d2h
