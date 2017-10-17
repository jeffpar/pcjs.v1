---
layout: page
title: "Q65503: No CHAIN with ALL, MERGE, DELETE, or Line # in Compiled BASIC"
permalink: /pubs/pc/reference/microsoft/kb/Q65503/
---

## Q65503: No CHAIN with ALL, MERGE, DELETE, or Line # in Compiled BASIC

	Article: Q65503
	Version(s): 1.00 1.01 1.02 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom B_GWBasicI GWBASIC.EXE BASICA.EXE
	Last Modified: 21-SEP-1990
	
	The <filespec> parameter of the CHAIN statement is a string expression
	that identifies the program to which control is passed. In compiled
	BASIC, the filespec may include a path specification, but does not
	allow any other options. This differs from the GW-BASIC and BASICA
	interpreters. QuickBASIC does not support the ALL, MERGE, DELETE, or
	line-number options of the CHAIN statement available in BASICA and
	GW-BASIC. The ALL option, however, can be simulated by using
	QuickBASIC's COMMON statement to share variables between CHAINed
	programs.
	
	This information applies to Microsoft QuickBASIC versions 2.00, 2.01,
	3.00, 4.00, 4.00b, and 4.50 for MS-DOS; to Microsoft BASIC Compiler
	versions 6.00 and 6.00b for MS-DOS and MS OS/2; to Microsoft BASIC
	Professional Development System (PDS) versions 7.00 and 7.10 for
	MS-DOS and MS OS/2; to Microsoft GW-BASIC Interpreter versions 3.20,
	3.22, and 3.23 for MS-DOS; and to all versions of the BASICA
	Interpreter sold by IBM, Compaq, or other original equipment
	manufacturers (OEMs).
	
	More Information
	
	GW-BASIC and BASICA interpreter programs assume the extension xxxx.BAS
	on a CHAINed-to file. BASIC compiler 6.00 and 6.00b, BASIC PDS 7.00
	and 7.10, and QuickBASIC 4.00, 4.00b, and 4.50 compiled programs
	assume an extension of xxxx.BAS within the QB.EXE or QBX.EXE
	environment, or an extension of xxxx.EXE if compiled and run outside
	the environment. (In the QB.EXE environment of QuickBASIC 2.00, 2.01,
	or 3.00, you can CHAIN only to xxxx.EXE files, so you must either omit
	the filename extension or specify xxxx.EXE.) To simplify using the
	CHAIN filespec argument, just omit the name extension on the filespec,
	which works the same in all versions of compiled or interpreted BASIC.
	
	Compiled BASIC does not support the ALL, MERGE, DELETE, or line-number
	options of the CHAIN statement available in BASICA or GW-BASIC. In
	GW-BASIC and BASICA programs, CHAIN with ALL specifies that all
	variables in the current program are passed to the CHAINed-to program.
	This effectively makes every variable COMMON to each program. CHAIN
	with MERGE leaves any OPENed files open, preserves the current OPTION
	BASE setting, and merges new line numbers from the CHAINed program by
	numerical position. Using CHAIN with MERGE also means that any DEFINT,
	DEFSNG, DEFDBL, DEFSTR, or DEF FN statement need not be restated in
	the CHAINed program. The CHAIN with DELETE allows the programmer to
	delete a range of line numbers from the CHAINing program to make room
	for the new lines in a CHAIN MERGEd program. Without the line-number
	option, execution always starts at the beginning of the program.
	
	The interpreter's CHAIN ALL option can be simulated by using compiled
	BASIC's COMMON blocks.
	
	Files can be left open across a chain if you compile the program to
	require the run-time module (compile without /O).
	
	For more information on the syntactical differences between QuickBASIC
	and GW-BASIC/BASICA programs, see Page 312 in the "Microsoft
	QuickBASIC 4.5: Programming In BASIC" manual for QuickBASIC version
	4.50.
