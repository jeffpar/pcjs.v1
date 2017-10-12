---
layout: page
title: "Q50714: R6009 Not Enough Space for Environment -- Possible Workarounds"
permalink: /pubs/pc/reference/microsoft/kb/Q50714/
---

	Article: Q50714
	Product: Microsoft C
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | s_quickasm s_quickc
	Last Modified: 21-FEB-1990
	
	The "Not Enough Space For Environment" error is caused when a program
	successfully loads into memory and then attempts to load a copy of the
	environment and the argument list into the near heap. If the near heap
	does not have enough room for one or the other, or both, R6009 is
	generated.
	
	In standard Microsoft C programs, the functions _setargv and _setenvp
	attempt to set up the argument vector and the environment vector,
	respectively. Both of these vectors are allocated in the near heap. If
	the program has a full or nearly full near heap, the vectors will not
	be set up, thereby giving the error.
	
	A few ways to get around the problem are as follows:
	
	1. Lower the amount of environment space, with the following statement
	   in the CONFIG.SYS file. This assumes that environment space is
	   being allocated.
	
	      shell=command.com /p /e:xxxx
	
	2. Use the large memory model when compiling in conjunction with the
	   /Gt switch to get some of the global data out of DGROUP, thus
	   freeing up room for the environment and/or the argument list.
	
	3. If there is no need for command line arguments, _setargv can be
	   rewritten as follows:
	
	      _setargv() {}
	
	4. If there is no need for a copy of the environment, and if the
	   spawn or exec function is not needed, _setenvp can be rewritten
	   as follows:
	
	      _setenvp() {}
	
	For more information on workarounds 3 and 4, see Section 5.2.2,
	"Suppressing Command Line Processing," in the C user's guide.
