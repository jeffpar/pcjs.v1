---
layout: page
title: "Q65598: Differences/Enhancements from BASIC PDS 7.00 to 7.10"
permalink: /pubs/pc/reference/microsoft/kb/Q65598/
---

## Q65598: Differences/Enhancements from BASIC PDS 7.00 to 7.10

	Article: Q65598
	Version(s): 7.00 7.10 | 7.00 7.10
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900730-152
	Last Modified: 21-SEP-1990
	
	In August 1990, Microsoft released the Microsoft BASIC Professional
	Development System (PDS) version 7.10 for MS-DOS and MS OS/2 systems.
	This article documents those features that were added to BASIC PDS
	7.10 that are not supported in BASIC PDS 7.00. The lists below are
	titled "Language Enhancements," "New Utilities and Utility
	Improvements," and "Software Corrections."
	
	This information applies to Microsoft BASIC Professional Development
	System version 7.10 for MS-DOS and MS OS/2.
	
	Language Enhancements
	---------------------
	
	1. REDIM PRESERVE changes the upper bounds (top-right dimension) of an
	   $DYNAMIC array and preserves the data in the array. Previous
	   versions of BASIC initialized the array to zeroes or null strings
	   on a REDIM.
	
	2. It is now possible to pass fixed-length-string arrays as parameters
	   to SUB and FUNCTION procedures.
	
	3. A CALL by value using BYVAL for BASIC SUB and FUNCTION subprograms
	   is now possible. Previously, BASIC only supported CALL by value
	   using BYVAL when calling a non-BASIC language such as C. The BYVAL
	   attribute for passed parameters is now allowed when calling a BASIC
	   SUB or FUNCTION.
	
	4. ISAM is now supported under OS/2. ISAM in PDS 7.10 can be used in
	   OS/2 protected mode. (Note that ISAM in PDS 7.10 is still
	   single-user ISAM as in 7.00.)
	
	5. ISAM support in 7.10 operates up to 50% faster than in 7.00,
	   depending on the program.
	
	6. Communications input is buffered during a SHELL if the program was
	   compiled with BC /O (stand alone) option. All previous versions of
	   BASIC disabled communications support and buffering of communications
	   data during a SHELL. BASIC PDS 7.10 does not, however, buffer
	   communications data during a SHELL if you are using the run-time
	   module (BRT71xxx.EXE).
	
	7. Compatibility with Microsoft C version 6.00 for interlanguage
	   calling. BASIC PDS 7.10 now allows interlanguage calling to
	   functions created with Microsoft C Compiler version 6.00. (BASIC
	   PDS 7.00 only allowed calling to Microsoft C Compiler version 5.10
	   functions.)
	
	New Utilities and Utility Improvements
	--------------------------------------
	
	1. QBX.EXE improvement: The 7.10 QuickBASIC extended (QBX.EXE)
	   environment uses expanded memory more efficiently than 7.00. In
	   BASIC PDS 7.00, each subprogram from 1K to 16K in size uses a full
	   16K of expanded memory. In BASIC PDS 7.10, subprograms smaller than
	   16K will use expanded memory in 1K chunks. In 7.10, if a subprogram
	   is 2K in size, it will use only 2K of expanded memory. (Subprograms
	   larger than 16K are stored in conventional memory in both 7.00 and
	   7.10.)
	
	2. Programmer's WorkBench (PWB), a new utility: The Programmer's
	   WorkBench is the integrated development environment that is
	   provided with Microsoft's newest "high-end" language products. It
	   integrates the following features:
	
	   - Keyboard-driven or mouse-driven control of the WorkBench through
	     use of menus and scroll bars.
	
	   - Other utilities can be launched from PWB such as NMAKE or
	     CodeView.
	
	   - Context sensitive online Help.
	
	   - Multiple windows allow managing multiple files for large
	     projects.
	
	   - Multiple-language development within PWB.
	
	   - Supports development under both DOS and OS/2.
	
	   - Customizable program editor.
	
	   - PWB is a combination of Microsoft's Quick environments (such as
	     QuickBASIC and QuickC) and the Microsoft Editor, providing easier
	     learning for anyone familiar with those environments. However,
	     PWB offers many features over and above the Quick environments
	     and the earlier Microsoft Editor.
	
	3. Source Browser: Source Browser is a powerful cross-referencing tool
	   that can be launched from within PWB.
	
	4. CodeView 3.10 debugger is included.
	
	5. NMAKE facility: A superset of the earlier Microsoft MAKE facility.
	   PWB saves you the inconvenience of remembering makefile syntax by
	   building and maintaining makefiles for you.
	
	6. QuickHelp: QuickHelp allows you to access online documentation
	   without running QBX.EXE or PWB.EXE. QuickHelp can be run from the
	   DOS or OS/2 command line and can also be installed as a keyboard
	   monitor under OS/2. Any Help files with the correct format can be
	   used with QuickHelp.
	
	7. QBX.EXE improvement: In the QBX environment under the Run menu, the
	   Make .EXE File command now lets you set any BC.EXE compiler option
	   in the "Additional Options:" field.
	
	Software Corrections
	--------------------
	
	For a list of known problems with BASIC PDS 7.00 (or QuickBASIC 4.50)
	that are corrected in BASIC PDS 7.10, query in this Knowledge Base on
	the word "fixlist7.10".
