---
layout: page
title: "Q32893: Difference between Huge Pointers"
permalink: /pubs/pc/reference/microsoft/kb/Q32893/
---

## Q32893: Difference between Huge Pointers

	Article: Q32893
	Version(s): 4.00 5.00 5.10 | 5.10
	Operating System: MS-DOS         | OS/2
	Flags: ENDUSER |
	Last Modified: 19-JUL-1988
	
	Problem:
	   I have two huge pointers that are more than 32K apart. However,
	whenever I take the difference between them, I get an incorrect
	answer. I am using the following code:
	
	char huge *ptr1 = (char huge *)0xa0000000;
	char huge *ptr2 = (char huge *)0xb0000000;
	main()
	{
	  long k;
	  k = ptr2-ptr1;
	  printf("difference is %ld\n",k);
	}
	
	Response:
	   This problem occurs because the difference between two pointers is
	considered to be an integer quantity. The arithmetic that is done on
	the huge pointers is 32-bit arithmetic, but the result is truncated to
	an integer, then promoted back to a long value with a sign extension.
	   To retain the original long value returned by the huge-pointer
	arithmetic, cast the result of the subtraction to a long value. For
	example, you will get the expected results with the following code:
	
	char huge *ptr1 = (char huge *)0xa0000000;
	char huge *ptr2 = (char huge *)0xb0000000;
	main()
	{
	  long k;
	  k = (long)(ptr2-ptr1); /* cast the integer to a long */
	  printf("difference is %lp\n",k);
	}
