---
layout: page
title: "Q37413: EXE2BIN Cannot Convert QuickBASIC .EXE Files to .COM Files"
permalink: /pubs/pc/reference/microsoft/kb/Q37413/
---

## Q37413: EXE2BIN Cannot Convert QuickBASIC .EXE Files to .COM Files

	Article: Q37413
	Version(s): 1.00 1.01 1.02 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 12-JAN-1990
	
	With the introduction of the first MS-DOS operating system, the .EXE
	program and file structure came into existence. .EXE files allow much
	more flexibility than .COM files do. .COM files mimic the binary files
	of the earlier CP/M-80 operating system. (CP/M-80 was developed by
	Digital Research, Inc.)
	
	Because .COM files allow the use of only one 64K segment and no stack
	segment (the so-called "tiny" memory model), .EXE files produced in
	QuickBASIC cannot be converted to .COM files. QuickBASIC uses the
	medium-memory model, which utilizes one data segment and one or more
	code segments. QuickBASIC's far addressing capability also makes its
	.EXE files incompatible with the MS-DOS EXE2BIN.EXE program, which
	converts .EXE files to .COM files.
	
	This information applies to all versions of Microsoft QuickBASIC, to
	Microsoft BASIC Compiler Versions 5.35, 5.36, 6.00, and 6.00b for
	MS-DOS, and to Microsoft BASIC PDS Version 7.00 for MS-DOS.
	
	The EXE2BIN.EXE utility gives a "file cannot be converted" error
	message if you attempt to convert a QuickBASIC .EXE compiled program.
	
	Please refer to "The MS-DOS Encyclopedia," published by Microsoft
	Press, for more information on .EXE versus .COM files.
	
	The following is a code example:
	
	'Make a stand-alone .EXE named X.EXE from this program.
	'Give the MS-DOS command: EXE2BIN X.EXE X.COM
	'The "file cannot be converted" message results.
	PRINT "TEST"
