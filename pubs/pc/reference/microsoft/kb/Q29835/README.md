---
layout: page
title: "Q29835: C 5.10 MTDYNA.DOC: Sample MT Program/Description of Operation"
permalink: /pubs/pc/reference/microsoft/kb/Q29835/
---

## Q29835: C 5.10 MTDYNA.DOC: Sample MT Program/Description of Operation

	Article: Q29835
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 15-JAN-1991
	
	The following information is from "Section 4: Sample Multiple-Thread C
	Program" of the Microsoft C version 5.10 MTDYNA.DOC file.
	
	Sample Multiple-Thread C Program
	--------------------------------
	
	The subsections below describe the creation and operation of a
	multiple-thread version of the classic "Hello world" program.
	
	4.1   Description of operation
	
	The multiple-thread "Hello world" program brings up one thread for
	each command-line argument. Each thread will print "Hello world from
	thread <n>!" the number of times specified in the corresponding
	argument. The maximum number of threads supported in the
	multiple-thread library is 32.
	
	To use it, type
	
	   mhello <arg1> <arg2> ... <up to 31 args>
	
	For example,
	
	   mhello 2 4 6
	
	brings up 3 threads; the first thread says hello 2 times, the second
	thread says hello 4 times, the third thread says hello 6 times.
	
	In operation, the program works as follows:
	
	1. Brings up the requested number of threads with _beginthread
	
	2. Waits until all threads have been brought up
	
	3. Begins multiple-thread execution and waits for completion
	
	The explicit synchronization (by means of the flag variable
	Synchronize) is required because of the small time spent in the child
	code. Without this synchronization, all threads would begin as thread
	2. This occurs because the first spawned thread completes execution
	before the next request to create a thread is acted upon. The time
	slice allotted to any of the threads is much larger than the execution
	time spent in each thread. To get around this, bring up all of the
	threads and then simultaneously start them.
	
	An alternative method of synchronization between threads is to use
	semaphores. A semaphore is a software flag used to coordinate the
	activities of two or more threads. The use of semaphores for thread
	control is illustrated in the sample program, snap.c, which is
	included with this release.
	
	Using semaphores is a more elegant and efficient means of
	synchronizing threads. The DosSleep function causes threads to
	periodically wake up and check a flag, and thus, the following can
	occur:
	
	1. The thread wakes up when it doesn't have to and performs some
	   processing only to find out it has to go to sleep again.
	
	2. The thread sleeps longer than it has to (i.e., the event it's
	   waiting for has already occurred, but the thread is still sleeping
	   until the sleep request expires).
	
	Programs should generally use semaphores, particularly when the wait
	time is non deterministic and potentially long (or forever).
	
	For the mhello.c example program, the use of DosSleep is appropriate
	for the following reasons:
	
	1. DosSleep is easily understood and has self-evident functionality.
	
	2. The program is not particularly time dependent, and the above two
	   disadvantages will not hurt. Also, we know that this is a one time
	   event, and that main code "quickly" wakes up the child-code portion
	   of the program. That is, the DosSleep code path occurs once at
	   start-up time and is never entered again during child execution.
	
	   Also, the sleep time is short and deterministic. That is, we know
	   the parent code sets the flag as soon as all the threads have been
	   started. In other words, there is no chance for the parent code to
	   do other things and leave the thread waiting for DosSleep for long
	   periods of time.
