---
layout: page
title: "Q29833: C 5.10 MTDYNA.DOC: Multiple-Thread Programs"
permalink: /pubs/pc/reference/microsoft/kb/Q29833/
---

## Q29833: C 5.10 MTDYNA.DOC: Multiple-Thread Programs

	Article: Q29833
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 10-DEC-1990
	
	The following information is from "Section 2: Multiple-Thread
	Programs" of the Microsoft C version 5.10 MTDYNA.DOC file.
	
	Multiple-Thread Programs
	------------------------
	
	The simplest multiple-thread program is an independent self-contained
	program that is created by the static linking method.
	
	The support library LLIBCMT.LIB is a large-model library that supports
	the creation of multiple-thread programs. A multiple-thread program
	created with this library can be any memory model although all calls
	to the C run-time library must use the large-model calling interface.
	In other words, all pointers must be far.
	
	NOTE: The support library library LLIBCMT.LIB is a large model
	library. If you want to use pointers returned by the C run-time
	library, you must use the far keyword in the declaration of your
	variables. For example, if you want to call fopen(), you would need to
	say:
	
	                FILE far * fp;
	                fp = fopen (...);
	
	This C run-time library is used to create a program that is entirely
	self contained and that does not share C run-time code or data with
	any other programs or dynamic-link libraries.
	
	A multiple-thread program that uses this library must be linked with
	only LLIBCMT.LIB and DOSCALLS.LIB. No other C run-time libraries
	should be used in linking.
	
	NOTE: This restriction on library use means that the compiler option
	/Lp must not be used with LLIBCMT.LIB. If you are building objects for
	use with LLIBCMT.LIB, you should use compiler option /Zl to suppress
	default library search records in the object file. If not, you then
	must link with /NOD (/NODEFAULTLIBRARYSEARCH) so that you do not get a
	default library (such as SLIBCE.LIB) linked in as well.
	
	Programs created for this simple multiple-thread environment should
	use the special include files provided for this purpose. These files
	are normally stored in the MT subdirectory of your normal include
	directory and the constituent .h files have the same name as their
	regular C run-time counterparts.
	
	These special include files should only be used for creating
	multiple-thread programs. If the regular (that is, the include files
	in the \INCLUDE subdirectory) are used, multiple-thread programs will
	not work. Conversely, the multiple-thread include files should not be
	used to create nonthreaded C programs.
	
	Threads are managed in a multiple-thread program by the C functions
	_beginthread() and _endthread(). A description of these two functions
	is given below in Section 3.0. The OS/2 Applications Program Interface
	(API) call DosCreateThread should not be used. If the low-level API
	calls (DosCreateThread and DosExit) are used, the results are
	unpredictable.
	
	In a multiple-thread program, stack checking is done for each thread.
	
	Signal handling is complicated in a multiple-thread environment. In a
	multiple-thread environment, the C run-time function signal is not
	supported. Since OS/2 always gives thread 1 control when a signal is
	handled, thread 1 must not be executing in the C run-time library code
	when a signal is received. If this precaution is not followed, the
	possibility of deadlock arises. A deadlock occurs if a thread is
	waiting for a particular event that does not occur.
	
	Signal handling is managed in a multiple-thread environment by using
	the OS/2 API call DosSetSigHandler with the following restrictions:
	
	1. Thread 1 should be dedicated to signal handling and this thread
	   should not call the C run-time library. When a signal is detected
	   by thread 1, some type of semaphore or flag that will be polled
	   from the other threads in the program should be set.
	
	2. The other threads check the status of semaphores set by thread 1
	   and respond accordingly.
