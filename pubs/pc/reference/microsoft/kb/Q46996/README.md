---
layout: page
title: "Q46996: L1074 Name: Group Larger Than 64K Bytes"
permalink: /pubs/pc/reference/microsoft/kb/Q46996/
---

## Q46996: L1074 Name: Group Larger Than 64K Bytes

	Article: Q46996
	Version(s): 4.06
	Operating System: MS-DOS
	Flags: ENDUSER | S_C S_QuickC
	Last Modified: 24-JUL-1989
	
	The Microsoft QuickC Compiler Version 2.00 returns the following
	linker error message when the size of DGROUP (the default data
	segment) exceeds 64K:
	
	   L1074 name: group larger than 64K bytes
	
	This error is documented on Page 282 of the "Microsoft QuickC Tool
	Kit" manual as follows:
	
	   The given group exceeds the limit of 65,536 bytes.
	
	   Reduce the size of the group, or remove any unneeded segments from
	   the group (refer to the map file for a listing of segments).
	
	There are four ways to resolve this data segment overflow when using
	QuickC:
	
	1. Reduce the stack size in order to reduce the size of DGROUP. In the
	   environment this can be done in the Options.Make.Linker Flags menu.
	   Outside the environment this can be done at compile time with the
	   "/F hexnum" switch, where hexnum is the size of the requested stack
	   in hexadecimal format. Outside the environment, at link time, this
	   can be done with the "/ST:decnum" switch, where decnum is the size
	   of the requested stack in decimal format.
	
	2. Declare data with the FAR keyword to move it out of DGROUP.
	
	   Note: In the small and medium memory models the Microsoft run-time
	   library functions can no longer be used with this data. You must
	   copy this far to a near heap location, before you use the run-time
	   routines on this data.
	
	3. Outside the environment, compile in the compact, large, or huge
	   memory models with the "/GtX" switch, where X is a data threshold.
	   All data items larger than X bytes are moved out of DGROUP into a
	   far data segment.
	
	4. Reduce the amount of data declared in the program. In the compact,
	   large, and huge memory models, try dynamically allocating space for
	   the data. Memory can also be dynamically allocated outside DGROUP
	   in the small and medium memory models by using _fmalloc() but, as
	   stated in Number 2, the run-time library functions do not work with
	   this data.
	
	   Reduce the amount of string literals in this default data segment by
	   reading from a data file at run time, or in C 5.00, by using the
	   /Gt patch to allow string literals to be moved from the _CONST
	   segment in DGROUP into a far segment.
