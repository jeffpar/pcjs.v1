---
layout: page
title: "Q62926: Using C Compiler /Gs Switch in PM Environment"
permalink: /pubs/pc/reference/microsoft/kb/Q62926/
---

## Q62926: Using C Compiler /Gs Switch in PM Environment

	Article: Q62926
	Version(s): 5.10 6.00
	Operating System: OS/2
	Flags: ENDUSER | SR# G900501-110 P_PRESMAN O_OS2SDK
	Last Modified: 15-AUG-1990
	
	The following information describes stack checking and the use of the
	Microsoft C Compiler /Gs switch.
	
	To address stack checking and the /Gs compile switch, we must first
	build a model that describes why and where stack checking occurs.
	
	This article assumes a basic knowledge of OS/2 multitasking,
	processes, and threads. Processes are essentially a unit of ownership
	under OS/2. As the loader reads a program (an .EXE file) into memory,
	it builds an LDT (Local Descriptor Table) with entries that point to
	all the memory allocated for the process. At a minimum, a process will
	have two memory segments, a code segment and a data segment. The data
	segment has three major areas including a heap, a stack, and static
	areas, respectively:
	
	   Physical Memory Areas   Virtual Memory
	
	     Data Segment              LDT
	   +-----------------+     +---------+
	   |   heap area     |   -<|         | <=-  DS: SS:
	   +-----------------+  |  +---------+
	   |  stack area     |  |  |         |
	   +-----------------+  |  +---------+
	   | static area     |  |  |         |
	   +-----------------+<-   +---------+
	                           |         |
	                           +---------|
	                         -<|         | <=-  CS:
	                        |  +---------+
	       Code Segment     |  |         |
	   +-----------------+  |  +---------+
	   |                 |  |  |         |
	   +-----------------+<-   +---------+
	
	On the other hand, "execution" requires a processor, state
	information, status, priority, and a stack area for arguments,
	parameters, and addresses. The stack area produced by the loader is
	used by thread 1 of the process.
	
	Depending on the application's dependency on C library routines, the
	programmer may choose to either use DosCreateThread() or _beginthread
	to create threads. The API calls used to create and terminate threads
	are DosCreateThread() and DosExit(EXIT_THREAD, 0), whereas the C
	run-time calls are _beginthead and _endthread.
	
	Under OS/2 version 1.20 and the C Compiler version 5.10, we present
	three alternative areas that may be used as stack areas for threads
	(allocated segments, heap, and static). The stack parameter in either
	call should point to the stack area to be used by the new thread. This
	new stack area can be allocated by doing the following:
	
	   Method 1: You can use the DosAllocSeg() function to create a new
	             segment in memory, and a new LDT entry, and allows the 286
	             to monitor faults when the thread exceeds the stack area.
	
	   Method 2: You can use the malloc(...) C function to extend the
	             processes heap area, which results in the creation of an
	             allocation area that the new thread will use as it's stack
	             area. This new area is within the same memory segment as
	             the area used by thread 1.
	
	   Method 3: You can use a global array. A variable declaration such as
	             static CHAR area[4096]; creates a 4K area in the static
	             area of the process's data segment that may be used by the
	             new thread for it's execution. This area is also within the
	             same memory segment as the area used by thread 1.
	
	It is important to understand where these allocations are placed in
	memory before considering stack checking (/Gs). Looking at each
	method, they appear to the process as described below:
	
	     **Method 1                LDT
	   +-----------------+
	   | New Seg from    |
	   | DosAllocSeg()   |
	   +-----------------+<-
	                        |  +---------+
	     Data Segment        -<|         | New LDT Entry (Method 1)
	   +-----------------+     +---------+
	   |   heap area     |   -<|         | <=-  DS: SS:
	   | **Method 2      |  |  +---------+
	   +-----------------+  |  |         |
	   |  stack area     |  |  +---------+
	   +-----------------+  |  |         |
	   | static area     |  |  +---------+
	   | **Method 3      |  |  |         |
	   +-----------------+<-   +---------+
	                         -<|         | <=-  CS:
	                        |  +---------+
	       Code Segment     |  |         |
	   +-----------------+  |  +---------+
	   |                 |  |  |         |
	   +-----------------+<-   +---------+
	
	The address (pointer to the new area) is specified by the pbThrdStack
	parameter in either the DosCreateThread() or _beginthread call. See
	the documentation on these functions for details as to where the
	pointer should actually point within the allocation and remember that
	stacks grow down in memory towards lower addresses.
	
	Finally, we address stack checking and the /Gs switch used in the C
	Compiler. Stack checking is a protective mechanism built into ALL
	computer languages to ensure that during a thread's execution, as
	values are added and removed from the stack area (using PUSH and POP
	instructions respectively), the thread does not accidentally exceed the
	stack area and destroy other data.
	
	In the C Compiler version 5.10 and other languages, the default stack
	checking algorithm has historically only needed to watch one area and
	one execution element. Consequently, the stack checking problem
	arises. The basic assumption is that attempts to add and remove data
	from the stack area using PUSH and POP instructions will only occur in
	the stack area setup for thread 1 in the process's data segment.
	
	Under OS/2, there will typically be multiple threads and multiple
	stack areas, and the basic assumption for the stack is no longer
	valid. Also, SS != DS in most DLLs (Dynamic Linked Libraries) since
	the data segment is changed as the DLL is entered. Once the initial
	assumption is broken, the C Compiler stack checking will start
	reporting false stack overflow errors.
	
	Consequently, you should use the /Gs switch to turn off stack
	checking. Without stack checking, the C Compiler will not include the
	algorithm depicted above. The code generated in the compile step will
	be smaller and faster. It is up to the programmer to ensure that the
	stack area for the new thread is large enough to accommodate all the
	PUSH and POP operations.
	
	As an additional note, even in the single-threaded case where stack
	checking can work, the output will be lost in a Presentation Manager
	(PM) application since standard output is redirected to null. It can be
	recovered by redirecting output with ">" or "|" on the command line.
	
	And finally, ALL the above problems do not occur when using the C
	Compiler version 6.00 and OS/2 version 2.00 because the programmer
	does NOT have to allocate stack areas. OS/2 version 2.00 will do it
	automatically and if a process or thread ever exceeds the stack area,
	OS/2 version 2.00 will expand it on the fly.
