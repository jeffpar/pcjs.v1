---
layout: page
title: "Q60968: QBX.EXE 7.10 Expanded Memory Usage Better Than 7.00; 32K Table"
permalink: /pubs/pc/reference/microsoft/kb/Q60968/
---

## Q60968: QBX.EXE 7.10 Expanded Memory Usage Better Than 7.00; 32K Table

	Article: Q60968
	Version(s): 7.00 7.10
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900228-5
	Last Modified: 10-AUG-1990
	
	The QuickBASIC Extended environment (QBX.EXE) can use up to 16 MB
	(megabytes) of Lotus-Intel-Microsoft (LIM) 4.0 expanded memory
	under MS-DOS. If the expanded memory is available, QBX.EXE
	automatically stores in it SUBs, FUNCTIONs, and module-level code
	units that are no greater than 16K in size. If QBX.EXE is invoked with
	the /Ea switch, arrays that are no greater than 16K in size are also
	stored in expanded memory.
	
	In QBX.EXE in BASIC PDS version 7.00, the memory is allocated in 16K
	pages; for example, a 2K procedure consumes 16K and wastes 14K (16K
	minus 2K) of expanded memory. Also, when one or more SUBs or FUNCTIONs
	are stored in expanded memory, QBX.EXE makes a one-time allocation of
	32K (two 16K pages) in expanded memory as overhead for its own
	internal tables.
	
	QBX.EXE in BASIC PDS version 7.10 is enhanced so that memory is
	allocated in 1K pages; for example, a 1K procedure or array takes up
	1K, thus using expanded memory much more efficiently than in QBX.EXE
	7.00.
	
	This article applies to Microsoft BASIC Professional Development
	System (PDS) versions 7.00 and 7.10 for MS-DOS.
	
	Examples of Expanded Memory Usage in QBX.EXE 7.00
	-------------------------------------------------
	
	As an example for BASIC PDS 7.00, suppose QBX.EXE is run on a machine
	for which FRE(-3) reports that 2720K of expanded memory is available.
	When the first module-level statement is entered, FRE(-3) would then
	return 2704K, 16K less. When the first SUB or FUNCTION is created
	after that, FRE(-3) would return 2656K, 48K less -- 16K for the SUB or
	FUNCTION itself and 32K for QBX.EXE's internal tables.
	
	When SUBs, FUNCTIONs, module-level code units, or arrays (if /Ea is
	used) are deleted, QBX.EXE deallocates the expanded memory they were
	using. The tables, however, will not be deallocated unless New Program
	is chosen from the File menu.
	
	In 7.00, a single-element integer array takes the same expanded memory
	space (16K) as an array with 8192 elements. Likewise, a SUB with a
	single PRINT statement takes the same space (16K) as a large SUB with
	hundreds of statements. (This is no longer true in 7.10, where
	expanded memory usage is more efficient.)
	
	To use expanded memory to its best potential in the QBX.EXE 7.00
	environment, you should try to make your SUBs as close to the 16K
	limit as possible without exceeding it. (This is not necessary in
	7.10.) The size of the SUBs (in kilobytes) is listed in the View Subs
	(F2) dialog box to the right of each SUB.
	
	Likewise, arrays in QBX.EXE 7.00 will use expanded memory more
	efficiently if they are dimensioned to be just under the 16K page
	size. (This is not necessary in 7.10.)
	
	References:
	
	Microsoft BASIC Professional Development System (PDS) versions 7.00
	and 7.10 offer expanded memory support under the Lotus-Intel-Microsoft
	version 4.0 Expanded Memory Specification (LIM 4.0 EMS) for code and
	data in the QBX.EXE environment under MS-DOS. Earlier versions do not
	offer any expanded memory support. LIM 4.0 EMS support is discussed in
	the "Microsoft BASIC 7.0: Getting Started" manual and in the
	"Microsoft BASIC 7.1: Getting Started" manual.
	
	To be compatible with BASIC PDS 7.00 or 7.10, the expanded-memory
	device driver must observe the LIM 4.0 EMS.
