---
layout: page
title: "Q58953: Must LINK 87.LIB Stub File in .OBJ List, NOT in the .LIB List"
permalink: /pubs/pc/reference/microsoft/kb/Q58953/
---

## Q58953: Must LINK 87.LIB Stub File in .OBJ List, NOT in the .LIB List

	Article: Q58953
	Version(s): 7.00   | 7.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | SR# S900215-30
	Last Modified: 1-MAR-1990
	
	Page 612 of the "Microsoft BASIC 7.0: Programmer's Guide" correctly
	states the following concerning the .LIB stub files (87.LIB,
	NOTRNEMR.LIB, and NOTRNEMP.LIB):
	
	   Stub files (including the .LIB files listed) are specified in the
	   <objfiles> field of LINK. You must supply the /NOE
	   (/NOEXTDICTIONARY) option when linking any of the stub files.
	
	If you mistakenly link the 87.LIB, NOTRNEMR.LIB, or NOTRNEMP.LIB stub
	file in the .LIB area instead of the .OBJ area of the LINK.EXE command
	line, the stub file will be ignored, and no code is excluded from your
	.EXE file.
	
	This information applies to Microsoft BASIC Professional Development
	System (PDS) Version 7.00 for MS-DOS and MS OS/2.
	
	Example of Using 87.LIB Stub File
	---------------------------------
	
	To remove floating-point-coprocessor emulation code from a stand-alone
	BASIC PDS 7.00 .EXE program, the 87.LIB file must be placed in the
	.OBJ area in the LINK.EXE command line, as follows:
	
	   BC test/O;
	   LINK test+87.LIB /NOE;
	
	The resulting .EXE program requires the presence of an 8087, 80287, or
	80387 (80x87) numeric coprocessor.
	
	87.LIB should be placed in the linker's objects (.OBJ) list, NOT in
	the libraries (.LIB) list. If you mistakenly link the 87.LIB file in
	the .LIB area of the LINK.EXE command line, 87.LIB is ignored, and no
	code is excluded from your .EXE file. (The resulting .EXE program will
	run on machines with or without a coprocessor.) Below is an example of
	the WRONG way to link the 87.LIB stub file:
	
	   LINK test,,,87.LIB /NOE;
	
	This is wrong because the linker first searches the default BASIC
	libraries for the references it needs and only then searches your
	listed .LIB files for unresolved references (if any). For stub files
	to work, they must appear in the .OBJ area of the LINK command line to
	resolve routine references before the default library reference
	search.
