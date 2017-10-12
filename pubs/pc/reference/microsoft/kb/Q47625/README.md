---
layout: page
title: "Q47625: Trace Stops on Line Following a Loop Before Loop Is Done"
permalink: /pubs/pc/reference/microsoft/kb/Q47625/
---

	Article: Q47625
	Product: Microsoft C
	Version(s): 2.20 2.30 | 2.20 2.30
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | S_C
	Last Modified: 15-SEP-1989
	
	In trace mode, CodeView stops on the line following a loop that does
	not have open and close braces ({}), before the loop is done.
	
	When tracing through a loop without the braces ({}), the trace stops
	on the statement immediately following the loop each time through the
	loop, giving the impression that the statement is being executed
	inside the loop. Actual program execution is correct.
	
	The following program was compiled with C Version 5.10 with the
	command line
	
	   cl /Zi /Od program.c
	
	and run using CodeView 2.20, as follows:
	
	    cv program.exe
	
	The trace stops at the printf each time through the loop even though
	printf is not part of the loop, but does not print anything until the
	end of the program.
	
	Sample Program
	--------------
	
	#include <stdio.h>
	
	void main(void)
	{
	    int i;
	    int count;
	
	    count = 0;
	
	    for(i=0;i<3;i++)
	        if(i)
	            count++;
	
	    printf("Count is %d\n",count);
	}
