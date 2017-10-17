---
layout: page
title: "Q50695: .EXE Linked with LLIBCMT Cannot Call DLL Linked with CRTLIB"
permalink: /pubs/pc/reference/microsoft/kb/Q50695/
---

## Q50695: .EXE Linked with LLIBCMT Cannot Call DLL Linked with CRTLIB

	Article: Q50695
	Version(s): 5.10
	Operating System: OS/2
	Flags: ENDUSER | CRTLIB DLL
	Last Modified: 14-MAR-1990
	
	A design limitation in the C 5.10 library support of Dynamic Link
	Libraries (DLL) prevents statically linked, multi-threaded (MT)
	.EXE files from calling MT DLL routines. For the present, you
	must create your MT EXE files with the C run-time DLL (i.e.,
	CRTLIB.LIB).
	
	A specific illustration of this would be the following (assume that
	you have the following files):
	
	   TheExe.exe: Contains a call to FOOPER, which is defined in TheDLL.dll
	
	   TheDLL.dll: Contains the function FOOPER
	
	TheDLL.dll is a multi-threaded DLL, which is linked with CRTLIB.LIB
	(the multi-threaded DLL version of the C run time).
	
	In general, the file TheExe.exe can be linked with either LLIBCMT.LIB
	or CRTLIB.LIB (depending upon whether you desire a statically or
	dynamically linked C run-time). The following are examples of both
	link statements:
	
	1. Statically linked with LLIBCMT.LIB:
	
	      link TheExe.obj,,,Doscalls.lib Llibcmt.lib/nod, TheExe.def;
	
	2. Dynamically linked with CRTLIB.LIB:
	
	      link TheExe.obj Crtexe.obj,,,Doscalls.lib Crtlib.lib/nod,TheExe.def;
	
	However, since this example requires that TheExe.exe call FOO, which
	resides in TheDLL.dll, you must link with CRTLIB.LIB as detailed in #2
	above.
	
	The common symptom of linking your .EXE with LLIBCMT.LIB and calling a
	multi-threaded DLL routine is a General Protection violation (GP
	fault) upon entry into the DLL routine. The generated assembly for
	this entry is listed below:
	
	   pop     cx
	   pop     dx
	   mov     bp, sp
	   push    ds
	   push    154F
	   pop     ds
	   jb      02A0
	
	   mov     es, word ptr [005E]     <-- es loaded with trash (0)
	   mov     ax, word ptr es:[0006]  <-- GP fault.
	
	This is an assumption that is not valid. The loading of ES assumes
	that the C run-time DLL data area is already initialized. However, it
	was not.
	
	The reason why this initialization did not take place is explained in
	the following scenarios:
	
	Note: CRT refers to C run-time.
	
	1. There are multiple C start-up initializations that must occur at
	   process creation time:
	
	   a. TheEXE.EXE -- Has its own start up (__astart).
	
	   b. TheDLL.DLL -- Program's DLL must be initialized (C_INIT).
	
	   c. C run-time DLL -- CRT's DLL DGROUP must be initialized
	      (__CRT_INIT).
	
	2. The way these initializations happen are as follows:
	
	   a. TheEXE.EXE -- Start up occurs "normally" when __astart gets
	      control.
	
	   b. TheDLL.DLL -- The user DLL has a starting address specified
	      internally so that OS/2 executes C_INIT each time a new process
	      connects to it.
	
	   c. C run-time DLL -- The CRT DLL initialization needs information
	      from the EXE start up (e.g. arguments, etc.). Thus, the current
	      scheme is that the EXE start up (__astart code) explicitly calls
	      the CRT DLL start-up code (__CRT_INIT).
	
	3. The problem: In this supplied scenario, the problem is that the EXE
	   is not built with the CRT DLL model; thus, CRTEXE.OBJ is not linked
	   into the user's program. It is the CRTEXE.OBJ module that makes the
	   explicit call to __CRT_INIT to init the CRT DLL. Since this init
	   code never gets called, the CRT's DGROUP is not initialized; later,
	   when we load a value out of the CRT's DGROUP into ES,
	
	      mov     es, word ptr [005E]     <-- es loaded with trash (0)
	      mov     ax, word ptr es:[0006]  <-- GP fault.
	
	   the value is invalid and you get the GP fault.
	
	Note: A program is multi-threaded when it is compiled with the
	appropriate include files and linked with the libraries that support
	multiple threads. A program does not have to call _beginthread() or
	DosCreateThread to be multi-threaded.
	
	If a program is compiled and linked as such, then the above problem is
	applicable regardless of the number of threads in the program. This
	means that a program with no calls to DosCreateThread and/or
	_beginthread() will lie within the scope of this problem if it is
	built as a multi-threaded executable.
