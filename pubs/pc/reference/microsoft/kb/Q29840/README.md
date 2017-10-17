---
layout: page
title: "Q29840: C 5.10 MTDYNA.DOC: Creating a Single Thread DLL"
permalink: /pubs/pc/reference/microsoft/kb/Q29840/
---

## Q29840: C 5.10 MTDYNA.DOC: Creating a Single Thread DLL

	Article: Q29840
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 15-JAN-1991
	
	The following information is from "Section 5: Creating Dynamic-Link
	Libraries" of the Microsoft C version 5.10 MTDYNA.DOC file.
	
	5.1.2   Creating a Single-Thread Dynamic-Link Library
	
	The process of creating a single-thread dynamic-link library is
	outlined below:
	
	1. Create a definition file (.DEF extension) for the main program
	   (STMAIN.DEF). This definition file specifies which functions it
	   will import from the dynamic-link library. In this simple example,
	   the file STMAIN.DEF contains the following:
	
	      NAME STMAIN
	      IMPORTS STDLL._DynalibTest
	
	2. Create a definition file for the dynamic-link library (STDLL.DEF)
	   that specifies which functions it will export. In this simple
	   example, the file STDLL.DEF contains the following:
	
	      LIBRARY STDLL
	      DESCRIPTION 'Sample Dynamic-Link Library written in Microsoft C'
	      PROTMODE
	      EXPORTS _DynalibTest
	      DATA MULTIPLE
	
	3. Compile the main program. The program may be compiled using any
	   memory model and any math package. Since the sample single-thread
	   dynamic-link library (STDLL.C) uses far data, the sample main
	   program (STMAIN.C) can be compiled as either compact or large
	   memory model. For a compact memory model, the C compiler is invoked
	   with something like this:
	
	      cl /AC /G2 /c stmain.c
	
	4. Link the main program to produce STMAIN.EXE. The following files
	   are linked together:
	
	      STMAIN.OBJ     Output from step 3
	      DOSCALLS.LIB   OS/2 support library
	      CLIBCEP.LIB    Any regular C run-time library (in this
	                     case, compact memory model, emulator math
	                     package)
	      STMAIN.DEF     Main definition-module (single thread)
	      STMAIN.EXE     Output from LINK (single thread)
	
	   The linker is invoked with something like this:
	
	      link stmain.obj/noi,,, clibcep.lib doscalls.lib/nod,stmain.def;
	
	5. Compile the dynamic-link library module. The module should be
	   compiled with the /ALfw option which specifies large-code pointer
	   size, far-data pointer size and a segment setup of SS not equal to
	   DS; DS fixed. Stack checking should also be turned off. The C
	   compiler is invoked with something like this:
	
	      cl /Alfw /G2 /Gs /c stdll.c
	
	6. Link the dynamic-link library module to produce STDLL.DLL. The
	   following files are linked together:
	
	      STDLL.OBJ      Output from step 5
	      DOSCALLS.LIB   OS/2 support library
	      LLIBCDLL.LIB   Single-thread dynamic-link library C
	                     run-time support library
	      STDLL.DEF      Dynamic-link library definition-module
	      STDLL.DLL      Output from LINK
	
	   The linker is invoked with something like this:
	
	      link stdll.obj,stdll.dll/noi,,llibcdll.lib doscalls.lib/nod,stdll.def;
	
	7. Place the STDLL.DLL file (from step 6) in a directory on your
	   LIBPATH so OS/2 is able to find it. Then run the program
	   STMAIN.EXE. If the dynamic-link-library file is not in your
	   LIBPATH, OS/2 is not be able to run STMAIN.EXE.
	
	Note: The LIBPATH is set in your CONFIG.SYS or CONFIG.OS2 file,
	depending on which version of OS/2 you are using. LIBPATH is not part
	of your environment strings like the LIB, INCLUDE and PATH variables.
