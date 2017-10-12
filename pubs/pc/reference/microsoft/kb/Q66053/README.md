---
layout: page
title: "Q66053: fputs() Fails with R6003 When Writing to STDAUX"
permalink: /pubs/pc/reference/microsoft/kb/Q66053/
---

	Article: Q66053
	Product: Microsoft C
	Version(s): 6.00 6.00a
	Operating System: MS-DOS
	Flags: ENDUSER | buglist6.00 buglist6.00a
	Last Modified: 24-OCT-1990
	
	The fputs() run-time library function will fail with the following
	error when you try to put a string to STDAUX:
	
	   run-time error R6003
	   - integer divide by 0
	
	Microsoft has confirmed this to be a problem in Microsoft C versions
	6.00 and 6.00a. We are researching this problem and will post new
	information here as it becomes available.
	
	The following code demonstrates this error when compiled with the
	default options:
	
	#include <stdio.h>
	void main (void)
	{
	   fputs("hello world\n", stdaux);
	}
	
	The fputs() function should have disabled buffering when dealing with
	STDAUX, but it doesn't. To work around this problem, you can disable
	buffering yourself by calling the setvbuf() function as follows:
	
	   setvbuf(stdaux, NULL, _IONBF, 0);
	
	The following code works correctly:
	
	#include <stdio.h>
	void main (void)
	{
	   setvbuf(stdaux, NULL, _IONBF, 0);
	   fputs("hello world\n", stdaux);
	}
