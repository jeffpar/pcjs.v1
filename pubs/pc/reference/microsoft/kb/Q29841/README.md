---
layout: page
title: "Q29841: C 5.10 MTDYNA.DOC: Multiple Thread Dynamic-Link libraries"
permalink: /pubs/pc/reference/microsoft/kb/Q29841/
---

	Article: Q29841
	Product: Microsoft C
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 15-JAN-1991
	
	The following information is from "Section 5: Creating Dynamic-Link
	Libraries" of the Microsoft C version 5.10 MTDYNA.DOC file.
	
	5.2   Multiple-Thread Dynamic-Link Libraries
	
	The CDLLOBJS.LIB OS/2 support file is an object-file library used to
	create a dynamically linked C run-time library. This library is
	provided as an object library with an associated definition file. This
	allows the programmer to choose only those run-time modules that are
	required for a particular application.
	
	The C run-time library created with this support file is dynamically
	linked and may be used by a multiple-thread program and an optional
	group of dynamic-link libraries that are closely associated with it.
	
	The "close association" of the multiple-thread program, the C run-time
	library and a group of dynamic-link libraries is shown in Figure 2.
	
	        +----------------------------------------------------+
	        |                                                    |
	        |                +----------+        +----------+    |
	        |                |          |        |          |    |
	        |  +-----------> | DLL1.DLL |<------>| DLL2.DLL |<---+
	        |  |             |          |<-+     |          |<----------+
	        |  |             +----------+  |     +----------+           |
	    +-------------+                    |                            |
	    |             |                    |                            |
	    | PROGRAM.EXE |                    |                            |
	    |             |<---+               |                            |
	    +-------------+    |               |                            |
	                       |               |   +--------------------+   |
	                       |               |   |                    |   |
	                       |               +-->|   C Run-time DLL   |<--+
	                       +------------------>|     CRTLIB.DLL     |
	                                           +--------------------+
	
	     Figure 2. Relationship between Multiple-Thread Program, C
	               Run-Time Library, and Dynamic-Link Libraries
	
	The main program (PROGRAM.EXE) and the two dynamic-link libraries
	(DLL1.DLL and DLL2.DLL) share the C run-time data (in CRTLIB.DLL). The
	PROG.EXE, DLL1.DLL, and DLL2.DLL files each have their own data
	segment that is not shared. The C run-time dynamic-link library is
	closely tied to the program (PROGRAM.EXE) and the other dynamic-link
	libraries (DLL1.DLL and DLL2.DLL), since the file CRTLIB.DLL contains
	such things as shared environment strings, global C run-time data, and
	thread identification numbers.
	
	A program built using the dynamically linked multiple-thread support
	of the C run-time library may share the C run-time library with one or
	more dynamic-link libraries that are closely related to it. C run-time
	global data (such as the standard I/O package FILE, pointers of
	buffered I/O, and memory allocated with malloc functions) is shared.
	This means that the program and the associated dynamic-link libraries
	must cooperate on the usage of this data.
	
	Before compiling any programs using routines from the dynamic-link
	library's object library CDLLOBJS.LIB, ensure that the MT include
	files are being used (rather than the standard include files), and
	that the symbol DLL is defined.
	
	If the multiple-thread include files are placed in a subdirectory of
	the normal INCLUDE directory the following style of include can be
	used:
	
	    #include  <mt\stdio.h>       /* multiple-thread version */
	
	A better approach is to specify a special search path for include
	files by using the /I option on the CL command line. In this method,
	the /I adds the specified directory to the front of the list of
	directories to be searched for include files. A typical use of the /I
	option is shown below:
	
	    cl /I\include\mt /AS /Gs2 /DDLL /c mtmain.c
	
	This method has the advantage that the program can refer to <stdio.h>,
	and the appropriate version can be selected at compile time. This
	approach is used in the sample programs mtmain.c and mtdll.c. If
	multiple include paths are required, you can specify them with
	multiple /I options. The include paths are searched in the order in
	which they appear on the CL command line.
	
	The symbol DLL is used to distinguish between multiple-thread programs
	using LLIBCMT.LIB (where the symbol DLL is not defined) and programs
	using the dynamically linked C run-time library (where the symbol DLL
	is defined), which also supports multiple threads.)  This ensures that
	the appropriate data references (e.g. stdout) are resolved correctly.
	The symbol DLL may be defined in one of the ways shown below:
	
	1. Compile with the /D option on the CL command line. The use of this
	   option is explained in Section 3.3.9.1 of the Microsoft C
	   Optimizing Compiler User's Guide. The syntax of the /D option is
	
	      CL  /DDLL myprog.c
	
	2. Explicitly define the DLL symbol prior to any other preprocessor
	   directives in your source file. This option is shown below:
	
	      #define DLL
	      #include < ... >    /* include files as needed */
	
	Threads are managed in a dynamic-link library created in this
	environment by the C functions _beginthread() and _endthread(). The
	OS/2 API call DosCreateThread should not be used. A description of
	these two functions is given in Section 3.0.
