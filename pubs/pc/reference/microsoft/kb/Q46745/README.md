---
layout: page
title: "Q46745: What the /HIGH and /DS Linker Options Do"
permalink: /pubs/pc/reference/microsoft/kb/Q46745/
---

## Q46745: What the /HIGH and /DS Linker Options Do

	Article: Q46745
	Version(s): 3.65
	Operating System: MS-DOS
	Flags: ENDUSER | SR# G890607-19979
	Last Modified: 13-JUL-1989
	
	Question:
	
	I would like information on the /HIGH and /DS options of the linker.
	Specifically, what changes are needed in the .EXE file to tell the
	loader to put it high?
	
	Response:
	
	Basically, these are hold-over features from DOS Version 1.00 and from
	the original Microsoft/IBM Pascal and FORTRAN Compilers -- they're of
	little or no use under DOS 2.00 and later. Specifically, programs
	linked with the /HIGH switch are allocated all of the memory in the
	machine and cannot release unneeded memory back to DOS; therefore, no
	other program can be loaded into memory.
	
	The /HIGH switch sets both the minalloc and maxalloc fields in the .EXE
	header to zero. This combination of values causes the loader to load
	the program in high memory.
	
	/DSALLOCATE (or /DS) causes DGROUP to be "shifted" upwards so that the
	high address in the group is always FFFFh. Offsets into DGROUP are
	adjusted appropriately.
	
	These switches are strictly incompatible with our current high-level
	languages -- the only possible use for them is in a MASM program.
	Microsoft doesn't recommend using them at all unless you know
	precisely what you're doing.
	
	There is good documentation on what the /HIGH and /DSALLOCATE switches
	do, as well as how the loader works, in the "MS-DOS Encyclopedia,"
	starting on Page 719. (This excellent reference manual is now less
	expensive and available in paperback).
