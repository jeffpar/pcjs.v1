---
layout: page
title: "Q64807: goto Label at End of Block Without &quot;;&quot; Invalid Syntax"
permalink: /pubs/pc/reference/microsoft/kb/Q64807/
---

## Q64807: goto Label at End of Block Without &quot;;&quot; Invalid Syntax

	Article: Q64807
	Version(s): 4.x 5.x 6.00 | 5.10 6.00
	Operating System: MS-DOS       | OS/2
	Flags: ENDUSER | s_quickc 1.x 2.00 2.50 s_quickasm 2.01 2.51
	Last Modified: 15-AUG-1990
	
	If a goto label appears last in a block of code, the following
	compiler error will be generated:
	
	   error C2143:  missing ';' before '}'.
	
	The sample code below illustrates the problem.
	
	The semicolon is required by the ANSI definition of the C programming
	language. In fact, this situation is described in Section 3.6.3 of the
	standard.
	
	To eliminate the error, use proper syntax as described below.
	
	Sample Code
	-----------
	
	#include <stdio.h>
	#include <conio.h>
	
	void main(void)
	  {
	     char ch;
	
	     while(!kbhit())
	        {
	          printf("Want to end this loop?  (y/n)  \n");
	          if((ch = getche()) == 'y')
	             {
	                printf("out of loop\n");
	                goto mybug;
	             }
	          printf("More loop processing here....\n");
	          mybug:   /* This line generates the syntax error      */
	        }          /*       replace with: mybug:  ;             */
	  }
