---
layout: page
title: "Q59315: CodeView Trace Skips Statement Following Switch Statement"
permalink: /pubs/pc/reference/microsoft/kb/Q59315/
---

	Article: Q59315
	Product: Microsoft C
	Version(s): 2.20 2.30 | 2.20 2.30
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | buglist2.20 buglist2.30
	Last Modified: 7-MAR-1990
	
	CodeView incorrectly maps assembly level instructions to source code
	in the first statement following a switch statement with seven or more
	cases.
	
	As shown in the code sample below, the statement following the switch
	is executed correctly, but CodeView steps over the statement while
	tracing in source mode. In mixed source and assembly mode, the
	statement following the switch may be traced into.
	
	Sample Code
	-----------
	
	# include<stdio.h>
	
	void main(void)
	{
	
	   short tag, marker;
	
	   marker = 0;
	   tag = 5;
	
	   switch(tag){
	      case 1:
	         break;
	      case 2:
	         break;
	      case 3:
	         break;
	      case 4:
	         break;
	      case 5:
	         break;
	      case 6:
	         break;
	      case 7:
	         break;
	      default:
	         break;
	   }
	
	      marker = 2;
	
	}
