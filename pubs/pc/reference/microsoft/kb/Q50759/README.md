---
layout: page
title: "Q50759: Calling C Run-Time from a Single-Threaded DLL Init Routine"
permalink: /pubs/pc/reference/microsoft/kb/Q50759/
---

	Article: Q50759
	Product: Microsoft C
	Version(s): 5.10
	Operating System: OS/2
	Flags: ENDUSER |
	Last Modified: 17-JUL-1990
	
	You can call the C run-time routines from within your initialization
	code for a single threaded dynamic link library (DLL).
	
	To accomplish this, you must ensure that the C run time itself is
	initialized prior to any run-time function call. This is easiest to do
	if you write your base initialization in assembly (as required), but
	then call a routine written in C that will perform the majority of
	your init code. This C routine must be declared as a extrn, far call
	in your assembly code, and defined/prototyped as such in your C init
	code.
	
	The following is a code example:
	
	extrn   MYINIT: far                 in the assembly init module.
	int far pascal MYINIT (...) ;       in the C init module.
	
	Once you have satisfied these items, you must then call C_INIT() from
	within your C init module. This must be done before any C run-time
	calls have been made. The C_INIT routine must also be prototyped as
	follows:
	
	   int far pascal C_INIT (void) ;
	
	Note: This information applies to single-threaded DLLs only. You
	cannot call the C run time from the init code of a multi-threaded DLL.
	
	The example below details the steps necessary to call any C run-time
	routine from within your single-threaded DLL initialization code.
	
	This example involves the following files:
	
	   PROJ.C          Source to the EXE that calls the DLL routine
	   PROJ.LIB        Library created by IMPLIB (based on DLL.DEF)
	                   [resolves the exported routine(s) from DLL.DLL]
	   DLL.C           Source to the DLL, and the function FOOPER()
	   DLL.DEF         Definitions file for the DLL
	   ASMINIT.ASM     Assembly Init code
	   CINIT.C         C Init code
	
	The source files to the .EXE and .DLL are standard for this type of
	programming.
	
	The initialization routines and their requirements are discussed
	below:
	
	ASMINIT.ASM
	-----------
	
	     .model large
	     extrn  MYINIT:far        ; Declare the C init routine as far.
	     .code
	     INIT    proc    far      ; Declare init proc....
	
	             call    MYINIT   ; Call my C init code..
	             ret              ; MYINIT exit code is in AX, so return.
	
	     INIT    endp
	             end     INIT     ; <--Specifies Entry Point for Init
	                              ;    routine (reason why this must be
	                              ;    in assembly).
	
	CINIT.C
	-------
	
	#include <stdio.h>
	
	     // Prototype C Run-Time init function, and my C init code...
	     int far pascal C_INIT (void) ;
	     int far pascal MYINIT (void) ;
	
	     int far pascal MYINIT (void)
	     {
	       int RetVal ;
	
	       // Call the C Run-Time Initialization code..
	       RetVal = C_INIT () ;
	
	       // Calls to the C Run-Time are now valid...
	       printf ("Hello from the DLL init code...\n") ;
	
	       // other C Run-Time calls can be made here...
	
	       // exit with return value from this initialization code...
	       return (RetVal) ;
	     }
	
	The source to the remaining files are listed below:
	
	PROJ.C
	------
	
	#include <stdio.h>
	
	void far pascal FOOPER (int, int) ;
	void main (void)
	{
	  printf ("Hello from Main().  Calling DLL routine...\n") ;
	  FOOPER (1, 2) ;
	  printf ("\nDone.\n") ;
	}
	
	DLL.C
	-----
	
	#include <stdio.h>
	
	void far pascal FOOPER (int, int) ;
	void far pascal FOOPER (int x, int y)
	{
	  printf ("Hello from DLL routine 'Fooper'.\n") ;
	}
	
	DLL.DEF
	-------
	
	LIBRARY     DLL  INITINSTANCE
	DESCRIPTION 'single threaded DLL showing C Run-Time in Init Code'
	DATA        MULTIPLE
	EXPORTS     FOOPER
	
	These files must be compiled and linked together as follows:
	
	  cl   /Alfu /G2s /c dll.c
	  masm /mx asminit.asm;
	  cl   /Od /AL /G2 /c cinit.c
	
	  link /CO dll asminit cinit,dll.dll/NOI,, \
	           llibcdll.lib doscalls.lib, dll.def;
	  copy dll.dll  c:\os2\dll
	
	  cl      /AS /G2 /c proj.c
	  implib  proj.lib  dll.def
	
	  link /CO proj.obj, /NOI,, slibcep.lib proj.lib doscalls.lib/NOD ;
