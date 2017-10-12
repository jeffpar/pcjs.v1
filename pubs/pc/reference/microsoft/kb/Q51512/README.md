---
layout: page
title: "Q51512: OS/2 1.1 EXE May Fail under 1.2 Due to Small Thread Stack Size"
permalink: /pubs/pc/reference/microsoft/kb/Q51512/
---

	Article: Q51512
	Product: Microsoft C
	Version(s): 5.10
	Operating System: OS/2
	Flags: ENDUSER |
	Last Modified: 20-DEC-1989
	
	If a multithread program runs correctly under OS/2 Version 1.10, but
	the identical program fails under OS/2 Version 1.20, the problem may
	be the size of the thread stack. Under OS/2 1.20, a thread has more
	overhead and requires more space. If you maintain the recommended 2K
	minimum stack size for each thread, then you should never run into
	this problem.
	
	If your program has been running successfully under OS/2 1.10 with a
	thread stack that is smaller than 2K, and the program fails under OS/2
	1.20, then the first thing you should try is a larger thread stack
	size.
	
	Some of the early examples of multithreaded programming that were
	included in the OS/2 SDK used a thread stack size of 400 bytes. These
	programs run fine on the previous versions of OS/2, but fail with a
	trap 000C under OS/2 1.20. A check of the Intel 80286 documentation
	shows that 000C is a stack overflow problem.
	
	The exact increase necessary in thread stack size between OS/2 1.10
	and 1.20 was not determined, but increasing the stack to 1000 bytes
	allowed these SDK examples to run without problem. Regardless of the
	actual difference needed, the best thing to do is to maintain the
	minimum of at least a 2K thread stack to prevent problems in general.
