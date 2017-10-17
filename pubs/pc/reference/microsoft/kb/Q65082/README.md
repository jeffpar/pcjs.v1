---
layout: page
title: "Q65082: &quot;Error During Run-Time Initialization&quot; Mixing Near/Far Strings"
permalink: /pubs/pc/reference/microsoft/kb/Q65082/
---

## Q65082: &quot;Error During Run-Time Initialization&quot; Mixing Near/Far Strings

	Article: Q65082
	Version(s): 7.00 7.10
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 4-SEP-1990
	
	When you link separate modules together to make an .EXE program, all
	the modules must have been compiled with the same string option (near
	or far strings).
	
	If you LINK modules or libraries together and some were compiled with
	and some without the BC /Fs (far strings) option, the .EXE program can
	hang in version 7.00, or can give the following error message at run
	time in version 7.10:
	
	   Error during run-time initialization
	
	This information applies to Microsoft BASIC Professional Development
	System (PDS) versions 7.00 and 7.10 for MS-DOS and MS OS/2.
	
	Combining string options can cause unpredictable results in the .EXE
	program at run time. After the possible hang in 7.00, a warm boot
	(CTRL+ALT+DEL) may not work. To reboot, you may have to turn the
	computer off, then back on.
	
	To avoid this problem, only LINK routines that were compiled with the
	same string option (BC /Fs or no /Fs).
	
	Also, remember that the QBX.EXE environment of BASIC PDS 7.00 and 7.10
	only supports far strings, not near strings. In other words, all BASIC
	object modules linked into a Quick library (.QLB file) for use in
	QBX.EXE must be compiled with the BC /Fs option.
	
	What Are Far Strings?
	---------------------
	
	The contents of far strings are stored in the far heap, and the
	contents of near strings are stored in near heap (the 64K DGROUP
	segment).
	
	Note that the BC /Fs (far strings) option affects only the storage
	location of variable-length string variables. The far strings option
	does NOT affect fixed-length string variables. (Also, fixed-length
	strings do NOT have a string descriptor.)
	
	Every variable-length string variable (or array element) has a 4-byte
	string descriptor. The 4-byte string descriptor for each
	variable-length string always resides in DGROUP (the 64K near heap)
	regardless of the compiler string option (near or far).
	
	References:
	
	See Pages 719-720, "Variable Storage and Memory Use," and also
	Chapter 11, "Advanced String Storage," in the "Microsoft BASIC 7.0:
	Programmer's Guide" for BASIC PDS versions 7.00 and 7.10.
	
	Code Example 1
	--------------
	
	Compile the following program with the BC /Fs option, as follows:
	
	   BC TEST1/Fs;
	
	REM  TEST1.BAS
	CALL TEST
	
	Compile the following program with BC and no options, as follows:
	
	   BC TEST2;
	
	REM  TEST2.BAS
	SUB TEST STATIC
	PRINT "This is a test"
	END SUB
	
	Link as follows:  LINK TEST1+TEST2;
	
	Now run TEST1.EXE. If compiled in BASIC 7.00, the program may display
	random garbage on the screen and hang. If compiled in BASIC 7.10, the
	program will give the error message "Error during run-time
	initialization."
	
	Code Example 2
	--------------
	
	Compiling and linking any program in BASIC PDS 7.10 as follows gives
	"Error during run-time initialization" when you run the BASFILE.EXE
	program:
	
	   BC /Fs basfile.BAS;
	   LINK basfile.OBJ,,,BRT71ENR.LIB;
	
	Note that "ENR" in BRT71ENR.LIB refers to "E" for IEEE math, "N" for
	near strings, and "R" for MS-DOS (real) mode.
