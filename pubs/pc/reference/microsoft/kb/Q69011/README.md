---
layout: page
title: "Q69011: Bad Conditional Jump Generated in Inline Assembly"
permalink: /pubs/pc/reference/microsoft/kb/Q69011/
---

## Q69011: Bad Conditional Jump Generated in Inline Assembly

	Article: Q69011
	Version(s): 6.00 6.00a | 6.00 6.00a
	Operating System: MS-DOS     | OS/2
	Flags: ENDUSER | buglist6.00 buglist6.00a
	Last Modified: 6-FEB-1991
	
	Under the following conditions, C 6.00 and C 6.00a will generate bad
	code for conditional jumps in inline assembly blocks. If, prior to the
	conditional jump, an align or even directive is used that causes NOP
	instructions to be inserted into the code, the conditional jump
	address will be off by the number of NOPs inserted into the code. This
	will happen only when using the /Od switch for disabling optimizations
	on the compile. Optimizations should not have an affect similar to
	this on inline assembly.
	
	Using /Os, /Ot, or /Ox will resolve the problem. Removing any align or
	even directives will also eliminate the source of the problem.
	Finally, using the /qc option will also generate correct code;
	however, the /qc option does not generate the NOP instructions for the
	align and even directives as it should.
	
	Microsoft has confirmed this to be a problem in C version 6.00 and
	6.00a. We are researching this problem and will post new information
	here as it becomes available.
	
	Sample Code
	-----------
	
	void main (void)
	{
	   _asm
	   {
	      even
	      push  ds
	      even
	      jb    foo
	foo:  pop   ds
	   }
	}
