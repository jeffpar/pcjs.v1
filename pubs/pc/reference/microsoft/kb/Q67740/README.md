---
layout: page
title: "Q67740: Dividing Negative Integers May Give Positive Results"
permalink: /pubs/pc/reference/microsoft/kb/Q67740/
---

## Q67740: Dividing Negative Integers May Give Positive Results

	Article: Q67740
	Version(s): 5.10 6.00 6.00a | 5.10 6.00 6.00a
	Operating System: MS-DOS          | OS/2
	Flags: ENDUSER | buglist5.10 buglist6.00 buglist6.00a
	Last Modified: 30-JAN-1991
	
	In some situations, dividing a negative integer by a positive integer
	may give positive results. For example, when the following code is
	compiled with the /Od option, both printf() statements will generate
	positive answers.
	
	Code Example
	------------
	
	void foo(void)
	{
	    int num1 = -32768,
	        num2 = -32751;
	
	    printf(" %d ",  num1 / 16);
	    printf(" %d ", (num2 & 0xfff0) / 16);
	}
	
	When these calculations are performed, the sign bit is lost. The
	output is incorrect for the first printf() statement when -32768 is
	being divided by a power of 2 (for example, 4,8,16,32,64,...16384).
	
	Workarounds for the first printf() statement are:
	
	1. Compile without the /Od option.
	
	2. Compile with the /qc option.
	
	With the second printf(), the value (num2 & 0xfff0) must be typecast
	to an integer or separated into another statement. For example,
	
	   printf(" %d ", (int)(num2 & 0xfff0) / 16);
	
	-or-
	
	   num3 = num2 & 0xfff0;
	   printf(" %d ", num3 / 16);
	
	Microsoft has confirmed this to be a problem in the C versions 5.10,
	6.00, and 6.00a. We are researching this problem and will post new
	information here as it becomes available.
