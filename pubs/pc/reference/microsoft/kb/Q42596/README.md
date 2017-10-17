---
layout: page
title: "Q42596: BASIC's SETMEM Doesn't Free C Far Allocation; _fmalloc, _ffree"
permalink: /pubs/pc/reference/microsoft/kb/Q42596/
---

## Q42596: BASIC's SETMEM Doesn't Free C Far Allocation; _fmalloc, _ffree

	Article: Q42596
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890227-157 B_BasicCom S_C S_QuickC
	Last Modified: 21-DEC-1989
	
	When reducing far-heap size with the SETMEM statement in BASIC and
	then calling a Microsoft C or QuickC function that does a far
	allocation, the reduced far-heap memory is not recoverable with SETMEM
	after returning to the QuickBASIC program. C routines do far-memory
	allocation with "_fmalloc" and "_ffree" functions. This is expected
	behavior for the following reasons:
	
	1. The C _fmalloc obtains memory from MS-DOS. Once far memory is
	   obtained by a C program, it becomes part of the C far heap.
	
	2. The _ffree does not release the memory back to MS-DOS, but rather
	   stores it in the C far heap along with a linked-list data structure
	   that C uses to manage its heap space.
	
	Thus, SETMEM cannot recover this memory.
	
	This information applies to Microsoft QuickBASIC Versions 4.00, 4.00b,
	and 4.50 for MS-DOS, to Microsoft BASIC Compiler Versions 6.00 and
	6.00b for MS-DOS and MS OS/2, and to Microsoft BASIC PDS Version 7.00
	for MS-DOS and MS OS/2.
	
	To recover the memory in the BASIC program, the C routine should do a
	huge allocation with the "halloc" and "hfree" functions. The C huge
	allocation routines differ from the far allocation routines. The
	halloc function always requests the memory directly from MS-DOS. The
	hfree function returns the memory directly back to MS-DOS. Once a C
	routine has executed an hfree, this memory can be recovered from a
	BASIC program with SETMEM.
	
	There is one disadvantage to using huge allocation. With huge
	allocation, there is no memory management involved on the part of the
	C routines. This can lead to memory fragmentation if the C routines do
	repeated allocations and frees.
	
	The C routine should be carefully constructed to avoid this
	fragmentation. For more information on C memory management, please see
	Page 114, "Memory Management: A Two-Step Process," "The Waite Group's
	Microsoft C Bible."
	
	Code Example
	------------
	
	/***********************************************************/
	/* The following C function HugeMemTest can be called from */
	/* BASIC to demonstrate that huge allocation returns       */
	/* memory to the BASIC program.                            */
	/***********************************************************/
	
	#include <stdio.h>
	#include <malloc.h>
	
	void
	HugeMemTest(void)
	{
	  long huge *lalloc;
	  printf("Inside of C routine\n");
	
	  lalloc = (long huge *)halloc(10000L,sizeof(long));
	  if (lalloc == NULL)
	     printf("\nInsufficient memory available\n");
	  else
	     printf("Memory successfully allocated\n");
	  hfree(lalloc);
	
	  printf("Leaving C routine\n");
	}
	
	'***********************************************************
	'* This BASIC routine releases memory to DOS using         *
	'* SETMEM. It then calls a C routine that does huge        *
	'* allocation and a huge free. SETMEM is used to recover   *
	'* the memory and success or failure is reported.          *
	'***********************************************************
	DECLARE SUB HugeMemTest CDECL ()
	
	' Report far heap size before the C call.
	CLS
	BeforeCall = FRE(-1)
	PRINT "AVAILABLE MEMORY ON THE FAR HEAP:     ", BeforeCall
	Storage = SETMEM(-50000)
	PRINT "SIZE OF FAR HEAP AFTER SETMEM:        ", FRE(-1)
	
	' Call to the C routine
	PRINT
	CALL HugeMemTest
	PRINT : PRINT : PRINT : PRINT
	
	' Report far heap size after call to C.
	PRINT "SIZE OF FAR HEAP AFTER CALL TO C:     ", FRE(-1)
	Storage = SETMEM(50000)
	AfterCall = FRE(-1)
	PRINT "AVAILABLE MEMORY ON THE FAR HEAP : ", AfterCall
	
	' Report success or failure.
	IF AfterCall <= BeforeCall THEN
	   PRINT "SETMEM FUNCTIONED PROPERLY"
	ELSE
	   PRINT "SETMEM DID NOT FUNCTION PROPERLY"
	END IF
	END
