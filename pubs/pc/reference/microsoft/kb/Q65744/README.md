---
layout: page
title: "Q65744: C 6.00 Fails to Generate Symbolic Info for ELSE IF Statement"
permalink: /pubs/pc/reference/microsoft/kb/Q65744/
---

## Q65744: C 6.00 Fails to Generate Symbolic Info for ELSE IF Statement

	Article: Q65744
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist6.00, S_CodeView
	Last Modified: 16-OCT-1990
	
	The following code, when compiled with Microsoft C version 6.00 for
	CodeView debugging, does not stop at breakpoints placed on the ELSE IF
	line of code. Also, any attempt to step onto the line using the trace
	or step command will skip over this line as if no executable code was
	associated with it.
	
	Sample Code
	-----------
	
	/* compile line = cl /Zi /Od file.c */
	
	void main(void)
	{
	   int i=100;
	
	   if (i==2);
	   else if(i==7);  /* cannot stop on this line */
	}
	
	As can be seen by switching into mixed source/assembly mode, there is
	executable code associated with the ELSE IF statement. And, if a
	breakpoint is placed on one of the assembly instructions associated
	with the ELSE IF line, execution will be able to stop on that
	instruction demonstrating that the code is being executed.
	
	The following are two possible workarounds to this problem:
	
	1. Compile with the quick compiler, which generates the correct
	   symbolic information (for example, cl /qc /Zi /Od file.c).
	
	2. Put the ELSE and IF on separate source lines, as follows:
	
	      ELSE
	           IF(i==7);
	
	This method allows stepping through the IF statement.
