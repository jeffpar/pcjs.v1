---
layout: page
title: "Q37633: How errno Is Handled in Multi-Threaded Programs"
permalink: /pubs/pc/reference/microsoft/kb/Q37633/
---

	Article: Q37633
	Product: Microsoft C
	Version(s): 5.10
	Operating System: OS/2
	Flags: ENDUSER | docerr
	Last Modified: 16-NOV-1988
	
	The "Microsoft C for MS OS/2 and MS-DOS Operating Systems: Version 5.1
	Update" manual does not explain how errno is handled in multi-threaded
	programs. The following explains this information.
	
	In single-threaded programs, errno is a function returning an int, as
	can be observed by looking at the header file errno.h in the default
	include subdirectory. In the multi-thread case, errno is a function
	returning a pointer representing an array (as usual). This array has
	32 entries, one for each thread. OS/2 API routine calls are used to
	manage the assignation of threads to entries in this array. For the
	multi-thread libraries, errno is defined as follows:
	
	 #define errno  *(__errno())
	
	     where __errno is
	
	 int far * far __errno( void );
	
	     so "errno = EDOMAIN;" becomes "*(__errno()) = EDOMAIN;".
	
	You can determine the behavior at compile time because errno will be
	defined in the multi-thread case, i.e.,  "#ifdef  errno".
