---
layout: page
title: "Q69476: stdout/stderr Are Buffered When Stack Is Moved Out of DGROUP"
permalink: /pubs/pc/reference/microsoft/kb/Q69476/
---

## Q69476: stdout/stderr Are Buffered When Stack Is Moved Out of DGROUP

	Article: Q69476
	Version(s): 6.00 6.00a
	Operating System: MS-DOS
	Flags: ENDUSER | buglist6.00 buglist6.00a
	Last Modified: 25-FEB-1991
	
	By following the instructions in the C 6.00 STARTUP.DOC file, you can
	recompile/reassemble the C start-up code and modify existing libraries
	so that the stack will be moved out of DGROUP for programs linked with
	these modified libraries. When using the DOS version of these modified
	libraries, stdout and stderr are unexpectedly buffered. The sample
	code and sample output below illustrate this problem.
	
	The OS/2 versions of the modified libraries perform as expected;
	however, to achieve the correct behavior with the DOS versions of the
	modified libraries, you must add the following line to your code:
	
	   setvbuf(stdout, NULL, _IONBF, 0);
	
	This line sets buffering for streams to none.
	
	Information about the predefined stream pointers can be observed by
	compiling the start-up code with CodeView information and placing a
	watch on the _iob2 array. Information about stdout is in _iob2[1].
	After executing the start-up code, the buffer size on stdout is still
	0 (zero); however, once a function call is made to printf(), the
	buffer size for _iob2[1] is changed to 512 (0x200) bytes. This change
	does not occur when the stack is left in DGROUP.
	
	Microsoft has confirmed this to be a problem in C versions 6.00 and
	6.00a. We are researching this problem and will post new information
	here as it becomes available.
	
	Sample Code
	-----------
	
	/* Compile options needed: /c /ALw /Zi /Od
	      Link options needed: /CO /NOD (plus you must specify the
	                           modified DOS C run-time library)
	*/
	
	#include <stdio.h>
	
	int number;
	
	void main(void)
	{
	    /* Uncomment the following line to obtain the desired results */
	    /* setvbuf(stdout, NULL, _IONBF, 0); */
	
	    printf("\nEnter a number: ");
	    scanf("%d", &number);
	    printf("\nThe number is %1d\n", number);
	}
	
	Program Output
	--------------
	
	22                   /* user enters a number (without prompt) */
	
	Enter a number:      /* printf() output is buffered, so output does */
	The number is 22     /* not appear until exit code flushes buffers  */
