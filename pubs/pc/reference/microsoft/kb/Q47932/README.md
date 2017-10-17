---
layout: page
title: "Q47932: C 5.10 Multi-Thread Library or DLL Limited to 32 Threads"
permalink: /pubs/pc/reference/microsoft/kb/Q47932/
---

## Q47932: C 5.10 Multi-Thread Library or DLL Limited to 32 Threads

	Article: Q47932
	Version(s): 5.10
	Operating System: OS/2
	Flags: ENDUSER |
	Last Modified: 16-JAN-1990
	
	The C 5.10 statically linked, multi-thread library LLIBCMT.LIB and
	the dynamically linked, multi-thread CRTLIB.DLL only support a single
	process's threads numbered 1 to 32 inclusive. This limits an
	application that uses C run-time functions to creating 31 threads with
	the _beginthread() function, in addition to the process's initial
	thread 1.
	
	If you call C run-time library (or DLL) functions from thread 33 or
	higher, no error message will be issued, but you will get undefined
	results including incorrect data and segment violations. Note that
	creating threads that call C run-time library functions should be done
	with the _beginthread() function to perform required C-library
	initializations that are not performed by DosCreateThread().
	
	Since the thread maximum number 32 limit is per process, calling
	another DLL does not increase the number of supported threads since
	the instance of the DLL called by the process is effectively part of
	the process. Spawning or exec'ing a child process allows the new
	process a new set of threads 1-32.
	
	A substantially greater number of threads will be considered for
	inclusion in a future release.
