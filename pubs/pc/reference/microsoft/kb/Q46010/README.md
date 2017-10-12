---
layout: page
title: "Q46010: CodeView Skips Over a Line of Source Code"
permalink: /pubs/pc/reference/microsoft/kb/Q46010/
---

	Article: Q46010
	Product: Microsoft C
	Version(s): 2.20 2.30 | 2.20 2.30
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | S_QuickC
	Last Modified: 14-AUG-1989
	
	After setting a breakpoint on the indicated line in the program below
	and executing the program, CodeView executes that line without
	stopping. Likewise, if you single step through the code, CodeView
	steps past that line. This problem also occurs in the QuickC
	integrated debugger.
	
	The workaround is to flip your source into mixed mode and set the
	breakpoint on the correct assembly line.
	
	This is due to the fact that CodeView is line-based and the C compiler
	is token-based. This will not be corrected; it is a restriction.
	
	Sample Program
	--------------
	
	int i, j, k, l;
	
	void main(void)
	{
	    for(i = 0; i < 20; i++)
	    {
	        j = 0;
	        for(k = 0; k < 20; k++)
	            if(j == 0)
	                break;
	
	        j = 1; /*** set breakpoint here ***/
	    }
	
	    l = 0;
	}
