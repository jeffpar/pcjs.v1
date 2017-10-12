---
layout: page
title: "Q29836: C 5.10 MTDYNA.DOC: Sample MT Program/Compiling and Linking"
permalink: /pubs/pc/reference/microsoft/kb/Q29836/
---

	Article: Q29836
	Product: Microsoft C
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 15-JAN-1991
	
	The following information is from "Section 4: Sample Multiple-Thread C
	Program" of the Microsoft C version 5.10 MTDYNA.DOC file.
	
	4.2   Compiling and Linking a Multiple-Thread Program
	
	The program mhello.c is a statically linked multiple-thread program.
	The process of compiling and linking this program is given below:
	
	1. Ensure that the files LLIBCMT.LIB and DOSCALLS.LIB are available.
	
	   The file LLIBCMT.LIB takes the place of the regular *.LIB files
	   used in linking. It is a large-model library that supports the
	   creation of statically linked multiple-thread programs. A
	   multiple-thread program created with this library can be any memory
	   model, although all calls to the C run-time library must use the
	   large-model calling interface.
	
	   The file DOSCALLS.LIB provides support for any OS/2 calls made in
	   the multiple-thread program. In this example, the DosSleep function
	   is used.
	
	2. Ensure that the special multiple-thread include files are used.
	   These are normally stored in the MT subdirectory of the normal
	   \INCLUDE directory. In this example, this is done by explicitly
	   specifying them within the mhello.c program as shown below:
	
	      #include <mt\malloc.h>
	
	   The multiple-thread files may also be specified by using the \I
	   option on the CL command line. The multiple-thread dynamic-link
	   library example (Section 5.2.3) uses this method to specify an
	   alternate include directory path.
	
	3. Compile the program with the following conditions set:
	
	   a. Large code-pointer size
	   b. Far data-pointer size
	   c. Segment setup of SS not equal to DS; DS fixed
	
	   These conditions are specified by setting up a customized memory
	   model using the following CL command option:
	
	      /Alfw
	
	   The complete CL invocation is shown below:
	
	      CL  /Alfw /c  mhello.c
	
	4. Link the resulting object file with LLIBCMT.LIB and DOSCALLS.LIB
	   only. The default .LIB file should not be used. Specify the
	   /NODEFAULTLIBRARY search option (/NOD) to ignore the default
	   libraries.
	
	   The complete LINK invocation is shown below:
	
	      LINK  /NOD thread LLIBCMT.LIB DOSCALLS.LIB;
	
	   An alternative invocation that invokes both the compiler and linker
	   is shown below:
	
	      CL /Alfw /Zl mhello.c /link llibcmt doscalls
	
	5. Run the program under OS/2.
