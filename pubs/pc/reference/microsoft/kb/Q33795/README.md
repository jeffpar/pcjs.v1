---
layout: page
title: "Q33795: Multiple Calls to ctime before Printing Results"
permalink: /pubs/pc/reference/microsoft/kb/Q33795/
---

## Q33795: Multiple Calls to ctime before Printing Results

	Article: Q33795
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 8-AUG-1988
	
	The sample code below will print out the same time for the start and
	finish in the second printf statement; however, the statements should
	be printed two seconds apart. If ctime(&start) is taken out of the
	second printf statement, the finish time is later than the start time,
	as expected.
	   As noted in the C Version 5.10 README.DOC, the ctime function uses
	a single static buffer to store the results of the call; i.e., when
	the second call to the function is made, the results of the first
	call are destroyed.  Therefore the behavior of the example is expected.
	
	   The following sample code illustrates this behavior:
	
	time_t start, finish ;
	main() {
	 time(&start) ;
	 printf("the time is %s\n", ctime(&start) ) ;
	 for ( i =0; i<1000; i++ )
	    time(&finish) ;   /* start and finish should be about 2 sec apart */
	 printf("ending time is %s and %s\n", ctime(&start), ctime(&finish) ) ;
	}
