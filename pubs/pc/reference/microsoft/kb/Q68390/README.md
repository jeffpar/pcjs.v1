---
layout: page
title: "Q68390: "C1063: Stack Overflow" Caused by Taking Address of Constant"
permalink: /pubs/pc/reference/microsoft/kb/Q68390/
---

	Article: Q68390
	Product: Microsoft C
	Version(s): 6.00 6.00a | 6.00 6.00a
	Operating System: MS-DOS     | OS/2
	Flags: ENDUSER | buglist6.00 buglist6.00a
	Last Modified: 1-FEB-1991
	
	If the sample code below is compiled with any memory model or
	optimization level, the C version 6.00 and 6.00a compilers will
	generate the following fatal error message:
	
	   file.c(3) : fatal error C1063: compiler limit : compiler stack
	               overflow
	
	Changing the code from
	
	   foo(&"ABC");
	
	to the following
	
	   char *x = "ABC";
	
	   ...
	
	   foo(&x);
	
	will eliminate the error.
	
	Microsoft has confirmed this to be a problem in C versions 6.00 and
	6.00a. We are researching this problem and will post new information
	here as it becomes available.
	
	Sample Code
	-----------
	
	void main(void)
	{
	   foo(&"ABC");
	}
