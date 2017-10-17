---
layout: page
title: "Q19972: Jumping into the Middle of a For Loop Is Not Recommended"
permalink: /pubs/pc/reference/microsoft/kb/Q19972/
---

## Q19972: Jumping into the Middle of a For Loop Is Not Recommended

	Article: Q19972
	Version(s): 3.00 4.00 5.00 5.10 6.00 6.00a | 5.10 6.00 6.00a
	Operating System: MS-DOS                         | OS/2
	Flags: ENDUSER | s_quickc
	Last Modified: 15-JAN-1991
	
	Question:
	
	Under what conditions can a program perform a jump (via goto) into the
	middle of a for loop?
	
	Response:
	
	The only restriction on the goto statement is that the goto statement
	and its corresponding label be located in the same function. However,
	because different compilers optimize for loops differently, using a
	goto to jump into the middle of a for loop is not considered safe or
	portable.
	
	Also, if you are jumping into an inner loop that uses auto variables,
	an additional problem may occur because different compilers allocate
	space for auto variables in loops in different ways.
	
	Essentially, it is risky and not advisable for a program to jump into
	the middle of a for loop.
