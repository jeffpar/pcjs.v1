---
layout: page
title: "Q65647: Warning C4035 When Compiling with /Zg and Either /W3 or /W4"
permalink: /pubs/pc/reference/microsoft/kb/Q65647/
---

## Q65647: Warning C4035 When Compiling with /Zg and Either /W3 or /W4

	Article: Q65647
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist6.00
	Last Modified: 24-OCT-1990
	
	Compiling with a combination of /Zg and either /W3 or /W4 on the
	code below produces the following warning:
	
	   test.c(4) : warning C4035: 'func' : no return value
	
	Sample Code
	-----------
	
	1: int func(void)
	2: {
	3:     return(1);
	4: }
	
	The compiler generates the warning only when these options are used
	together. Microsoft has confirmed this to be a problem in C version
	6.00. We are researching this problem and will post new information
	here as it becomes available.
