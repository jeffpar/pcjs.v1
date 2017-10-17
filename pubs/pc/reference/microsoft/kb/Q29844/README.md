---
layout: page
title: "Q29844: C 5.10 MTDYNA.DOC: Using an MTDYNA Library"
permalink: /pubs/pc/reference/microsoft/kb/Q29844/
---

## Q29844: C 5.10 MTDYNA.DOC: Using an MTDYNA Library

	Article: Q29844
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 15-JAN-1991
	
	The following information is from "Section 5: Creating Dynamic-Link
	Libraries" of the Microsoft C version 5.10 MTDYNA.DOC file.
	
	5.2.3   Using a Multiple-Thread Dynamic-Link Library
	
	Once a C run-time multiple-thread dynamic-link library has been
	created (Section 5.2.2), it can be used by a program and associated
	dynamic-link libraries. The process of using this C run-time
	dynamic-link library is shown below:
	
	1. Compile the main program. When creating executable and dynamic-link
	   library files that will use the dynamically linked C run-time
	   library, the C compiler must be called with the multiple-thread
	   versions of the include files. Additionally, stack checking must be
	   turned off if your code is being compiled as small or compact
	   models. Stack checking can only be supported in the dynamically
	   linked C run-time library using far calls (medium/large memory
	   models).  The C compiler is invoked with something like this:
	
	            cl /I\include\mt /AS /Gs2 /DDLL /c mtmain.c
	
	   The /Gs option specifies no stack checking. The /DDLL option
	   defines the DLL symbol. The /AS option specifies small memory
	   model. The /I\include\mt option specifies that the special
	   multiple-thread include files are to be used.
	
	2. Link the main program to produce MTMAIN.EXE. The following files
	   are linked together:
	
	      mtmain.obj     Output from step 1
	      crtexe.obj     Start-up code for executable files
	      crtlib.lib     Customized C run-time library (Section 5.2.2)
	      doscalls.lib   OS/2 support library
	      mtmain.def     Definition file for mtmain.c
	      mtmain.exe     Output from LINK
	
	   The linker is invoked with something like this:
	
	      link mtmain+crtexe,/noi,,crtlib.lib doscalls.lib/nod,mtmain.def;
	
	3. Compile the dynamic-link-library module. When creating executable
	   and dynamic-link library files that will use the dynamically linked
	   C run- time library, the C compiler must be called with the
	   multiple-thread versions of the include files. Additionally, stack
	   checking must be turned off if your code is being compiled as small
	   or compact model. Stack checking can only be supported in the
	   dynamically linked C run-time library using far calls
	   (medium/large memory models.)  The C compiler is invoked with
	   something like this:
	
	      cl /I\include\mt /Alfw /G2 /DDLL /c mtdll.c
	
	   The /Alfw option specifies large code-pointer size, far
	   data-pointer size and a segment setup of SS not equal to DS; DS
	   fixed. The /DDLL option defines the DLL symbol. The /I\include\mt
	   option specifies that the special multiple-thread include files are
	   to be used.
	
	4. Link the dynamic-link-library module to produce MTDLL.DLL. The
	   following files are linked together:
	
	      mtdll.obj      Output from step 3
	      crtdll.obj     Start-up code for dynamic-link library files
	      crtlib.lib     Customized C run-time library (Section 5.2.2)
	      doscalls.lib   OS/2 support library
	      mtdll.def      Dynamic-link library definition file
	      mtdll.dll      Output from LINK
	
	   The linker is invoked with something like this:
	
	      link mtdll+crtdll,mtdll.dll/noi,,crtlib.lib doscalls.lib/nod,mtdll.def;
	
	5. Place the MTDLL.DLL file (from step 4) and the CRTLIB.DLL file
	   (from Section 5.2.2) in a directory on your LIBPATH so OS/2 can
	   find it. Then run the program MTMAIN.EXE. If either dynamic-link
	   library file is not in your LIBPATH, OS/2 will not be able to run
	   MTMAIN.EXE.
	
	Note: The LIBPATH is set in your CONFIG.SYS or CONFIG.OS2 file,
	depending on which version of OS/2 you are using. LIBPATH is not part
	of your environment strings like the LIB, INCLUDE and PATH variables.
