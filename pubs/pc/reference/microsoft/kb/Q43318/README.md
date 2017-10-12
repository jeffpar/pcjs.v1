---
layout: page
title: "Q43318: C: Spawned Program Accessing Parent's Functions"
permalink: /pubs/pc/reference/microsoft/kb/Q43318/
---

	Article: Q43318
	Product: Microsoft C
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 18-MAY-1989
	
	It is possible for a program spawned with the P_WAIT modeflag to
	successfully call functions within its parent. The functions must be
	set up in such a way that CPU registers are preserved and the data
	segment register is loaded as necessary. It is also vitally important
	that all necessary start-up code and C run time are present whenever
	the parent functions are called.
	
	Warning: This procedure is neither recommended nor supported. This
	article is for informational purposes only.
	
	The programs below, PARENT.C and CHILD.C, demonstrate this technique.
	This method of sharing functions may be useful as a primitive form of
	overlaying when there is a need for a common set of functions to be
	accessed by a sequence of spawned child processes. The method of
	communication from the parent to the child is through command-line
	arguments. In the parent, a far pointer to the function that will be
	called is converted to a string and passed as a parameter through a
	spawn. In the child, it is then converted back into a far pointer.
	
	There are several considerations to be made when writing code of this
	nature.
	
	For any variables in the parent to be accessed, the routines to be
	called must use the _loadds keyword. Not loading DS for the called
	function results in the child's DS being used rather than the DS
	associated with the function in the parent.
	
	Even if _loadds is used, however, DS will not be equal to SS, since
	the child's stack is the one that is used and there is no mechanism in
	C for changing stacks. It is necessary to ensure that the functions
	called by the child do not blow out the child's stack.
	
	Many of the run-time library routines rely on SS equaling DS;
	therefore, one must obviously avoid those routines.
	
	Preservation of the child's state can be accomplished by using the
	_saveregs keyword. This is not necessary when calling C from C;
	however, it may be vital if C is being called from MASM.
	
	All calls must be far since the parent and child were loaded
	separately. Different memory models may be used for parent and child.
	
	This process obviously produces a general-protection fault in OS/2.
	Use dynamic link libraries to duplicate this functionality with
	greater ease, portability, and safety.
	
	The following is the parent program:
	
	/*
	 *   PARENT.C
	 */
	
	#include <stdio.h>
	#include <stdlib.h>
	#include <process.h>
	
	int far _saveregs _loadds foo( void );
	void main( void );
	
	int         k = 0,
	            l = 0;              /* Globals to be accessed inside foo */
	
	int far _saveregs _loadds foo()
	{
	    int         i,              /* Return value */
	                j;              /* Indexing */
	
	    for( j = 1; j < 10; j++ )
	    {
	        k = k + j;
	        l = k * j;
	    }
	    i = k + l;
	    return( i );
	}
	
	void main()
	{
	    int         (far _saveregs _loadds *fooaddr)();  /* foo() pointer */
	    char        address[16];                         /* address to pass */
	
	    printf( "Now inside parent main().\n" );
	    fooaddr = foo;
	    ultoa( (unsigned long)fooaddr, address, 10 );
	    printf( "Address of foo(): %s\n", address );
	
	    spawnlp( P_WAIT, "child.exe", "child.exe", address, NULL );
	    printf( "Back inside parent main().\n" );
	}
	
	The following is the child program:
	
	/*
	 *   CHILD.C
	 */
	
	#include <stdio.h>
	#include <stdlib.h>
	
	void main(
	    int         argc,
	    char        **argv )
	{
	    int         (far *fooaddr)();      /* Pointer to parent's function */
	    int         i;                     /* Function return value */
	
	    printf( "    Now in child.\n" );
	    fooaddr = (void far *)atol( argv[1] );
	    printf( "    Received: %ld\n", fooaddr );
	    printf( "    Calling foo().\n" );
	    i = fooaddr();
	    printf( "        Result of foo(): %d\n", i );
	    printf( "    Leaving child.\n" );
	}
