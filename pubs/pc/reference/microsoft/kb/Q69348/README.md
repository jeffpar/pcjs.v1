---
layout: page
title: "Q69348: CVP May Generate a Trap B with Large Programs Under OS/2 1.30"
permalink: /pubs/pc/reference/microsoft/kb/Q69348/
---

## Q69348: CVP May Generate a Trap B with Large Programs Under OS/2 1.30

	Article: Q69348
	Version(s): 2.20 2.30 3.00 3.10 3.11
	Operating System: OS/2
	Flags: ENDUSER | gp fault protection violation
	Last Modified: 25-FEB-1991
	
	Debugging a large application with CodeView under OS/2 version 1.30
	may result in a Trap B system error. Trap B is a "segment not present"
	exception, which results from changes that were made to this version
	of the operating system.
	
	In version 1.30 of OS/2, the code for DosPTrace() was made swappable,
	while in previous versions it was not. DosPTrace() is part of the OS/2
	API that allows a parent process to control the execution of a child
	process, and to access the child process's memory directly to insert
	breakpoints or change data.
	
	Because CodeView relies heavily on DosPTrace(), problems arise if this
	code is swapped from memory. The majority of problems occur when
	execution reaches a breakpoint while the DosPTrace() code is not
	present; control should then jump to code that is not currently in
	RAM.
	
	Because large programs (or heavily loaded systems) tend to result in
	more swapping, this problem appears much more readily when debugging
	large applications.
	
	The only sure workaround for this problem is to turn off swapping
	while debugging, but it also may help to increase or free up available
	memory. To disable swapping, modify the MEMMAN switch in CONFIG.SYS as
	follows:
	
	   MEMMAN=NOSWAP
	
	To increase available memory, either install more memory in the
	computer itself or terminate all other unnecessary processes before
	debugging (to remove them from memory).
	
	This problem is the result of a design change with OS/2 1.30 and is
	not a problem with CodeView. This change is being reconsidered for
	future versions of OS/2. New information will be posted here as it
	becomes available.
