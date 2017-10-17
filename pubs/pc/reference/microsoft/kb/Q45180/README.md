---
layout: page
title: "Q45180: Initialization and Discarding of DLLs Built with C Run Time"
permalink: /pubs/pc/reference/microsoft/kb/Q45180/
---

## Q45180: Initialization and Discarding of DLLs Built with C Run Time

	Article: Q45180
	Version(s): 5.10
	Operating System: OS/2
	Flags: ENDUSER | softlib CRTDLL.ARC S12104.EXE
	Last Modified: 5-OCT-1989
	
	Question:
	
	Is there a C run-time DLL de-install function provided with
	LLIBCDLL.LIB that, among other things, removes the DosExitList
	functions? Using DosFreeModule doesn't work properly.
	
	Response:
	
	You must do some DLL initialization and cleanup to prevent our default
	DLL initialization and exit code from including the exit list set up
	by LLIBCDLL.LIB, and we have files and suggested procedures for this
	purpose.
	
	The OnLine Software/Data Library file CRTDLL contains the files
	DLLINIT.OBJ and DLLTERM.OBJ, which contain initialization and
	termination functions for LLIBCDLL. Link these functions in with your
	own DLL's initialization and termination functions. (CRTDLL also
	contains CRTDLL_I.OBJ, but this is to replace CRTDLL.OBJ for use with
	the multiple thread CRTLIB.DLL.)
	
	CRTDLL can be found in the Software/Data Library by searching on the
	keyword CRTDLL, the Q number of this article, or S12104. CRTDLL was
	archived using the PKware file-compression utility.
	
	The prototypes for the functions in DLLINIT.OBJ and DLLTERM.OBJ are,
	respectively, the following:
	
	   void far pascal C_INIT(void);
	   void far pascal C_TERM(void);
	
	To specify the entry point into your own DLL initialization routine,
	you must have a MASM file specifying the name of your DLL
	initialization function with the MASM "END" InitRoutineName statement,
	as in the following:
	
	; MASM routine
	...
	END InitRoutineName
	
	The InitRoutineName can specify a MASM or C routine. For C, the DLL
	initialization routine would appear similar to the following:
	
	void far pascal C_INIT(void);
	
	int _export _loadds InitRoutineName() {
	        C_INIT();
	
	        // ... your own initialization code
	
	        return(1);  //Indicates to OS/2 that the DLL init succeeded.
	                 //If return(0), OS/2 won't load .EXE's using the DLL
	        }
	
	Your own initialization code must not use C run-time library function
	calls before C_INIT() is called.
	
	Link the MASM entry code .OBJ, the module containing the above
	InitRoutineName() and other DLL functions, and DLLINIT.OBJ together
	with LLIBCDLL and DOSCALLS.LIB (for OS/2 1.00, or OS2.LIB for OS/2
	1.10).
	
	The DLL's .DEF file must contain the following statements:
	
	   LIBRARY dllname INITINSTANCE
	   DATA MULTIPLE
	
	To eliminate your DLL, write an initialization function in your DLL
	(or add to the one above) that registers one or more exit routines
	with DosExitList. The exit routines should free all resources acquired
	by the DLL that are no longer needed. The C_TERM() function must be
	called to clean up for LLIBCDLL.
	
	Link in DLLTERM.OBJ with this module. DLLTERM.OBJ will suppress our
	standard use of DosExitList for cleaning up after LLIBCDLL to allow you
	to create your own exit routine list. (For cleaning up after DLL's use
	of the multithread CRTLIB.DLL, you must create your own exit routines
	with C's atexit() or DosExitList.)
	
	All the DLL function entries in the exit list must be removed before
	the .EXE can detach itself from the DLL. To actually discard the DLL,
	your .EXE must call a final termination routine in the DLL. The final
	DLL termination routine must remove the other functions in the exit
	list and then call "DosExitList(EXLST_EXIT, 0L);" to remove itself
	from the exit list. Then, the DosFreeModule of the DLL should succeed.
