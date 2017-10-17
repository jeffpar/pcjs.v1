---
layout: page
title: "Q29830: C 5.10 MTDYNA.DOC: Threads"
permalink: /pubs/pc/reference/microsoft/kb/Q29830/
---

## Q29830: C 5.10 MTDYNA.DOC: Threads

	Article: Q29830
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 15-JAN-1991
	
	The following information is from "Section 1: Introduction" of the
	Microsoft C version 5.10 MTDYNA.DOC file.
	
	1.1   Threads
	
	Three types of multitasking are present in OS/2: screen groups,
	processes, and threads. A screen group, the highest-level multitasking
	element, consists of one or more processes that share a logical screen
	and keyboard. For example, a word processor and a database operating
	simultaneously under OS/2 would represent two screen groups. A process
	is the part of an executing program that is the unit of ownership for
	resources such as memory, open files, and semaphores. Finally, a
	thread is the execution path within a process, and it is the smallest
	multitasking unit managed by OS/2. A process may consist of one or
	more threads.
	
	Two sample programs supplied with this release highlight the use of
	threads. The first example program, mhello.c, is a multiple-thread
	version of the classic "Hello world" program. The second example
	program, snap.c, uses multiple threads to capture screen images to a
	file.
	
	A pictorial representation of screen groups, processes, and threads is
	shown in Figure 1 below. Each screen group consists of two processes.
	These processes are composed of several threads. In any process,
	thread 1 is the main thread. All threads in a process are independent.
	
	Figure 1. Screen Groups, Processes, and Threads
	
	+============================================================================
	|
	|                                    OS/2
	|
	| +----------------------------------+  +----------------------------------+
	| |          Screen Group 1          |  |          Screen Group 2          |
	| | +------------+    +------------+ |  | +------------+    +------------+ |
	| | |  Process 1 |    |  Process 2 | |  | |  Process 1 |    |  Process 2 | |
	| | |            |    |            | |  | |            |    |            | |
	| | | *Thread 1* |    |            | |  | | *Thread 1* |    |  *Thread 1*| |
	| | |            |    | *Thread 1* | |  | | *Thread 2* |    |            | |
	| | | *Thread 2* |    |            | |  | | *Thread 3* |    |  *Thread 2*| |
	| | |            |    |            | |  | |            |    |            | |
	| | +------------+    +------------+ |  | +------------+    +------------+ |
	| |                                  |  |                                  |
	| +----------------------------------+  +----------------------------------+
	|
	+============================================================================
