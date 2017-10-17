---
layout: page
title: "Q58106: Compiler Options Explained for QBX.EXE's Make EXE File Command"
permalink: /pubs/pc/reference/microsoft/kb/Q58106/
---

## Q58106: Compiler Options Explained for QBX.EXE's Make EXE File Command

	Article: Q58106
	Version(s): 7.00 7.10 | 7.00 7.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER |
	Last Modified: 29-JAN-1991
	
	The following is a complete description of the compiler options
	available when you choose the Make EXE File command from the Run menu
	in the QuickBASIC extended (QBX.EXE) environment. This information is
	also available in the "Microsoft BASIC 7.0: Language Reference" manual
	(for 7.00 and 7.10) under "appendixes," Page 608.
	
	This information applies to Microsoft BASIC Professional Development
	System (PDS) versions 7.00 and 7.10 for MS-DOS and MS OS/2.
	
	Although the QBX.EXE editor can run only under MS-DOS or the DOS real
	mode of MS OS/2, the Make EXE File command in QBX.EXE can use the /Lp
	option to create programs that require MS OS/2 protected mode.
	
	------------------------ Make EXE File -------------------
	                ____________________________________
	EXE File Name: |____________________________________|
	
	This box lets you specify the name of the output .EXE file.
	
	----- EXE Type -----------------------------------------
	[] Stand-Alone EXE           /O
	[] EXE Requiring BRT Module
	--------------------------------------------------------
	
	/O -- Substitutes the default stand-alone library for the default
	run-time library (creates a stand-alone executable file that can run
	without a BASIC run-time module). Stand-alone programs can be
	significantly larger than programs compiled to use the run-time
	module. /O is selected by default in this Make EXE File window.
	
	EXE Requiring BRT Module -- Makes an EXE program that requires the
	presence of BRT70XXX.EXE at run time. The XXX depends upon the /Fpi or
	/Fpa math package, near or far strings, and real or protected mode.
	
	----- Speed -------------------------------------------
	[] 80x87 or Emulator Math   /Fpi
	[] Alternate Math           /Fpa
	[] Code Generation for 286   /G2
	[] Quick Call Optimization   /Ot
	-------------------------------------------------------
	
	/Fpi -- Causes the compiler to generate "in-line instructions" for use
	in floating-point operations. This option is the default.
	
	/Fpa -- Causes your program to use the alternate-math library for
	floating point operations.
	
	/G2 -- This option generates 80286-specific instructions (which
	actually affects size more than speed)
	
	/Ot -- Optimizes execution speed for SUB and FUNCTION procedures and
	DEF FN statements. To use this type of optimizing, certain conditions
	must be met. The frame size generated for SUB and FUNCTION procedures,
	and statements defined by DEF FN, depends on which of the following
	conditions exist in your code:
	
	   For SUB and FUNCTION procedures:
	
	   A reduced frame is generated with /Ot if no module-level handler
	   exists in the code, and the /D or /Fs isn't used. A full frame is
	   generated if your code uses local error handlers, calls a DEF FN or
	   GOSUB statement, has returned (because of a GOSUB or other reason),
	   or contains an ON event GOSUB.
	
	   For statements defined by DEF FN:
	
	   A full frame is generated if the /D, /Fs, /E, or /X option is used.
	   In all other cases, no frame is generated if the /W or /V option is
	   used. In all other cases, no frame is generated.
	
	---- Target Environment --------------------------------
	[] DOS or OS/2 Real Mode     /Lr
	[] OS/2 Protected Mode       /Lp
	--------------------------------------------------------
	
	/Lr -- Creates a real-mode object file (the default). This makes
	.EXE programs that run in MS-DOS or the real mode (the DOS 3.x box)
	of MS OS/2.
	
	/Lp -- Creates a protected-mode object file (to make .EXE programs
	that run in OS/2 protected mode).
	
	---- Size/Capacity -------------------------------------
	[] Far Strings                /Fs
	[] Near Strings
	[] Disable String Compression /S
	--------------------------------------------------------
	
	/Fs -- This option enables far-heap strings in user programs.
	
	Near Strings -- This option enables near (DGROUP) strings in user
	programs.
	
	/S -- Writes quoted strings directly to the object file instead of the
	symbol table in memory. Use this option when an "Out of memory" error
	message is generated while BC.EXE is compiling a program that has many
	string constants.
	
	---- Debug ----------------------------------------------
	[] Run-Time Error Checking    /D
	[] CodeView Information       /Zi
	---------------------------------------------------------
	
	/D -- Generates debugging code for run-time error checking; enables
	CTRL+BREAK. For ISAM programs, causes BASIC to write open database
	buffers to disk after every DELETE, INSERT, UPDATE, and CLOSE
	statement. You must use either /Ah or /D when you are compiling Quick
	library routines that will be loaded into QBX with the /Ea option
	(which moves arrays into expanded memory).
	
	/Zi -- This option adds debugging information to the object file that
	can be used by the Microsoft CodeView (CV.EXE, or CVP.EXE) debugger.
	
	QBX.EXE 7.10 adds an "Additional Options" field (not found in 7.00),
	which lets you specify any additional compiler options for invoking
	BC.EXE.
	
	There are four buttons at the bottom of the window:
	
	Make EXE -- This button shells out to DOS, runs BC.EXE with the
	specified options, runs LINK.EXE, creates an executable BASIC .EXE
	program, and returns to QBX.EXE.
	
	Make EXE and Exit -- This button transfers control to BC.EXE with the
	specified options, runs LINK.EXE, creates an executable BASIC
	.EXE program, and ends control in DOS, where you can run the .EXE.
	
	Cancel -- The Cancel button removes the Make EXE File window and
	returns you to the main QBX.EXE screen.
	
	Help -- The Help button briefly describes a few features of the Make
	EXE File window.
