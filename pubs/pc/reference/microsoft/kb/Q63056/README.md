---
layout: page
title: "Q63056: Fatal Error C1043 When Compiling with C1L.EXE"
permalink: /pubs/pc/reference/microsoft/kb/Q63056/
---

## Q63056: Fatal Error C1043 When Compiling with C1L.EXE

	Article: Q63056
	Version(s): 6.00
	Operating System: MS-DOS
	Flags: ENDUSER | buglist6.00
	Last Modified: 25-JUL-1990
	
	The following compiler command line under Microsoft C version 6.00
	will cause a fatal error C1043:
	
	   cl /B1 C1L /Zi /Fs hello.c
	
	The following error message is produced when any program is compiled
	under DOS with the above command line with no further explanation of
	the error message:
	
	   hello.c
	   fatal error C1043:
	
	Removal of any of the above command-line switches will eliminate the
	error message, which does not occur under OS/2.
	
	Microsoft has confirmed this to be a problem with C version 6.00. We
	are researching this problem and will post new information here as it
	becomes available.
