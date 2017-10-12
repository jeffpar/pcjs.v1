---
layout: page
title: "Q59933: Clarification of MTDYNA.DOC: Cooperation on Global Data"
permalink: /pubs/pc/reference/microsoft/kb/Q59933/
---

	Article: Q59933
	Product: Microsoft C
	Version(s): 5.10 6.00
	Operating System: OS/2
	Flags: ENDUSER |
	Last Modified: 17-JUL-1990
	
	Question:
	
	I have read the MTDYNA.DOC file regarding the use of the multithreaded
	libraries with a multithreaded application. However, I am unclear as
	to the exact meaning of the following passage:
	
	   C run-time global data (such as the standard I/O package FILE,
	   pointers of buffer I/O, and memory allocated with malloc functions)
	   is shared. This means that the program and the associated
	   dynamic-link libraries must cooperate on the usage of this data.
	
	What cooperation is required between the application and the DLLs? Does
	this mean that I should put all the functions that use this global
	data in a single thread and call the functions serially?
	
	For example, suppose one thread in the DLL calls printf(), and while
	that is executing, the application calls fprintf(). Will the two
	functions use the same global data area to do their respective data
	manipulations? Is it necessary use semaphores around all the functions
	that use each malloc'ed memory pointer or all functions that access
	FILE pointers?
	
	Response:
	
	There are really two parts to this answer:
	
	1. The run-time library takes care of the synchronization of various
	   threads that use a particular function. So, in the case of internal
	   data a run-time function may need, the data sharing is controlled
	   by the library. There is no need for the user of the library to
	   worry about that.
	
	2. The second part has to deal with the global data that the
	   application and the DLL share. The passage in MTDYNA.DOC is
	   attempting to say that the DLL and the application have to
	   cooperate on the creation, using, and termination of the global
	   data.
	
	Take FILE pointers, for instance. If the DLL issues a fcloseall(), all
	file handles that belong to the ENTIRE process will be closed. If the
	application or other DLLs are still using a particular file pointer,
	that has to be coordinated before the fclosealll() is issued.
	
	Along the same lines, if multiple threads write to the same file
	handle at the same time, all the writes will go out in the order they
	are received by the run time. This is due to the internal
	synchronization of the run time mentioned above and does not require
	any user intervention. However, all the data is written one after
	another in the same file. This may or may not be the desired result.
	
	The same scenario holds true for the other global run-time data.
