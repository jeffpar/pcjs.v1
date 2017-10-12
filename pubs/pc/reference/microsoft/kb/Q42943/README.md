---
layout: page
title: "Q42943: Problem with Floats in While Loop"
permalink: /pubs/pc/reference/microsoft/kb/Q42943/
---

	Article: Q42943
	Product: Microsoft C
	Version(s): 1.00 1.01 2.00
	Operating System: MS-DOS
	Flags: ENDUSER | buglist1.00 buglist1.01 buglist2.00
	Last Modified: 2-MAY-1989
	
	The program below will execute the while loop once when it should not
	execute it at all, when compiled in either the QuickC environment or
	using the QCL command. The workaround is to replace the "while"
	statement with the following:
	
	   while (test < 1.0)
	
	In C Version 5.00 or 5.10, the program works correctly without
	modification.
	
	The problematic program is as follows:
	
	#include <stdio.h>
	
	void main (void)
	{
	    static float test = 4276.0;
	
	    while (test < (float) 1)
	       printf("Should not have entered loop, but did\n");
	}
