---
layout: page
title: "Q66572: NMAKE 1.11 Fails to Stop If Command Is Redirected"
permalink: /pubs/pc/reference/microsoft/kb/Q66572/
---

## Q66572: NMAKE 1.11 Fails to Stop If Command Is Redirected

	Article: Q66572
	Version(s): 1.11
	Operating System: MS-DOS
	Flags: ENDUSER | buglist1.11 fixlist1.12
	Last Modified: 9-NOV-1990
	
	If the command line that NMAKE invokes is redirected to another
	output file and the command returns a non-zero return code, NMAKE
	version 1.11 will not stop the build process.
	
	Microsoft has confirmed this to be a problem in the DOS version of
	NMAKE.EXE. This problem has been corrected in version 1.12.
	
	The following is a sample make file that, with NMAKE version 1.11,
	will fail to stop if the compiler returns an error; with version 1.12,
	it correctly stops the build process:
	
	all: foo.exe
	
	foo.obj: foo.c
	   cl /c /AS foo.c >foo.err
	
	foo.exe: foo.obj
	   link /NOI /NOE foo.obj;
	
	The easiest way to workaround this is to redirect from the command
	line, for example:
	
	   nmake /f foo.mak >foo.err
	
	The drawback to this is that you can only have one error log.
