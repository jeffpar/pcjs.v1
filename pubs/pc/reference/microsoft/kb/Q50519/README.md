---
layout: page
title: "Q50519: Loader Uses Return Value from a DLL's Initialization Routine"
permalink: /pubs/pc/reference/microsoft/kb/Q50519/
---

	Article: Q50519
	Product: Microsoft C
	Version(s): 5.10
	Operating System: OS/2
	Flags: ENDUSER |
	Last Modified: 21-MAR-1990
	
	Question:
	
	How is the return value from a DLL's initialization routine used?
	
	Response:
	
	The return value from a DLL's initialization is used by the loader.
	
	Using an initialization routine for your DLL is optional. The
	initialization routine can be global or instance. The initialization
	routine is called when the DLL is loaded. [This is not necessarily the
	same time as when a DLL-exported function is called. For example, if
	you load the DLL using DosLoadModule() and DosGetProcAddr(), the
	initialization routine is run and the return value is examined at that
	time.]
	
	Every time you run a program that uses DLLs, the loader goes through
	the import list in the exehdr and attempts to load all the DLLs. As it
	tries to load each DLL, it runs its initialization routine (depending
	on whether the init routine is instance or global). If the
	initialization routine fails (even if the DLL is found) the system may
	display a message, or simply terminate at that point.
	
	Initialization routines are mentioned in Ray Duncan's book, "Advanced
	OS/2 Programming," in Chapter 19, "Dynamic Link Libraries," Pages
	459-469.
