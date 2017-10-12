---
layout: page
title: "Q32057: _beginthread()/_endthread() Coding Multi-Threaded Applications"
permalink: /pubs/pc/reference/microsoft/kb/Q32057/
---

	Article: Q32057
	Product: Microsoft C
	Version(s): 5.10
	Operating System: OS/2
	Flags: ENDUSER |
	Last Modified: 8-JUL-1988
	
	Question:
	   What do _beginthread() and _endthread() do? Do we need to use
	these routines rather than the OS/2 API calls DosCreateThread() and
	DosExit()? Does _beginthread() affect the stack it is passed?
	
	Response:
	   _beginthread() and _endthread() are discussed in MTDYNA.DOC.
	   _beginthread() should be used in place of DosCreateThread() when
	coding multi-threaded applications in C Version 5.10. _endthread()
	should be used rather than DosExit() to terminate a thread before it
	runs to completion.
	   _beginthread() takes care of important thread-creation tasks,
	such as the following:
	
	   1. Initializing the per-thread floating-point package
	   2. Saving/restoring the DGROUP environment
	   3. Ensuring that there are not too many threads being created
	   4. Verifying the validity of the stack generated
	
	   The stack you pass to _beginthread() must meet the following
	requirements:
	
	   1. It must not have null segment.
	   2. It must not start at an odd address.
	   3. It must not have 0 length.
	   4. It must not have an odd length.
	   5. It must not extend past the end of the segment.
	
	   Because of the importance of these tasks, it is important to use
	_beginthread()/_endthread() instead of DosCreateThread()/ DosExit()
	when coding multi-threaded applications in C Version 5.10. Although
	you may be able to use DosCreateThread(), consistent results are not
	guaranteed.
