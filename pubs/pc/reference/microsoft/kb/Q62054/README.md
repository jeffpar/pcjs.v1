---
layout: page
title: "Q62054: Large COMMON in Multiple Modules Uses Up DGROUP in QB/QBX.EXE"
permalink: /pubs/pc/reference/microsoft/kb/Q62054/
---

## Q62054: Large COMMON in Multiple Modules Uses Up DGROUP in QB/QBX.EXE

	Article: Q62054
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900504-81 B_BasicCom
	Last Modified: 19-NOV-1990
	
	Using a large COMMON block with multiple modules requires much more
	static data memory (DGROUP) than a single-module program with a large
	COMMON. This article explains how the QuickBASIC environment handles
	COMMON blocks in a multiple-module program. The information below
	should be carefully considered for programs that are running out of
	room in DGROUP when running in the QB.EXE or QBX.EXE environments.
	Symptoms of this problem are error messages such as "Out of Data,"
	"Out of Memory," "Out of Stack Space," or "Out of String Space."
	
	This information applies to QB.EXE in Microsoft QuickBASIC versions
	4.00, 4.00b, and 4.50; to QB.EXE in Microsoft BASIC Compiler versions
	6.00 and 6.00b for MS-DOS and MS OS/2; and to QBX.EXE in Microsoft
	BASIC Professional Development System (PDS) versions 7.00 and 7.10 for
	MS DOS and MS OS/2.
	
	In the QuickBASIC (QB.EXE) and QuickBASIC extended (QBX.EXE)
	environments, using $INCLUDE to include a COMMON block in multiple
	modules uses much more DGROUP memory than using $INCLUDE to include
	the COMMON block in a one-module program. A program that has a large
	COMMON block and has multiple modules can easily run out of space for
	static data in DGROUP. The same program, when compiled, will have much
	more available memory for static data in DGROUP.
	
	Each time a COMMON block is $INCLUDEd into a new module in a multiple-
	module program, the QB.EXE or QBX.EXE interpreter sets aside a
	correspondingly large block of memory. This block of memory is not a
	new COMMON block memory area, but is called a "variable table." This
	table contains information about the names of the variables and where
	they are located. Therefore, each time a new module is added to a
	program and the COMMON block is $INCLUDEd, a whole new variable table
	is created in DGROUP for that module. As the number of modules grows,
	DGROUP is used up quickly.
	
	Note: The graphs below do not show the actual structure of DGROUP, but
	are illustrations to show the general concept of how variable tables
	use DGROUP memory.
	
	For a five-module program with a 6K common block, a map of DGROUP
	might resemble the following:
	
	            +---- "Simplified" Map of DGROUP ------+
	            |                                      |
	            |  10K Free static data memory         |
	            |--------------------------------------|
	            |  20K Other static data               |
	            |--------------------------------------|
	            |  5K  Variable table for Module #1    |
	            |--------------------------------------|
	            |  5K  Variable table for Module #2    |
	            |--------------------------------------|
	            |  5K  Variable table for Module #3    |
	            |--------------------------------------|
	            |  5K  Variable table for Module #4    |
	            |--------------------------------------|
	            |  5K  Variable table for Module #5    |
	            |--------------------------------------|
	            |  6K        THE COMMON BLOCK          |
	            +--------------------------------------+
	
	For a one-module program with the same 6K COMMON block, a map of
	DGROUP might resemble the following:
	
	            +--- "Simplified" Map of DGROUP -------+
	            |                                      |
	            |  30K    Free static data memory      |
	            |--------------------------------------|
	            |  20K Other static data               |
	            |--------------------------------------|
	            |  5K  Variable table for Module #1    |
	            |--------------------------------------|
	            |  6K        THE COMMON BLOCK          |
	            +--------------------------------------+
	
	When the same program is compiled and linked into an executable
	(.EXE), it will have much more available space in DGROUP. In an .EXE
	program, all references to a variable are resolved into addresses.
	Variable tables are no longer needed to store the names of variables
	and their locations. In an .EXE, this memory in DGROUP for variable
	tables is released and is available for use by the program. In a
	multiple-module program with a large COMMON block, the difference of
	available space in DGROUP when compiled versus when running in the
	QB.EXE or QBX.EXE environment can be as much as 40K or more.
	
	There are two strategies for dealing with this limitation of the
	QB.EXE and QBX.EXE environments. First, the size of the COMMON block
	can be kept to a minimum. However, if a program must contain a large
	COMMON block, the number of modules must be kept to a minimum. In this
	case, a one-module program will produce the best results. The QB.EXE
	and QBX.EXE editors can handle a one-module program with more than 64K
	of code. However, if a large one-module program is compiled with
	BC.EXE, it can produce a "Program memory overflow" error. This means
	that when the program is completely coded, debugged, and a production
	version is ready to be built, the one-module program has to be broken
	up into multiple modules and separately compiled and linked.
	
	Note that in QB.EXE or QBX.EXE, each DECLARE statement for a SUB or
	FUNCTION procedure that is not currently loaded as a source or Quick
	library routine will take up some space in DGROUP to support the
	undefined procedure reference. However, if a procedure is currently
	loaded as a source or Quick library routine, then multiple DECLARE
	statements for that procedure name do not take up additional space in
	DGROUP.
