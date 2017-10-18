---
layout: page
title: "Q44745: /AT Tiny Model and Quick Assembler"
permalink: /pubs/pc/reference/microsoft/kb/Q44745/
---

## Q44745: /AT Tiny Model and Quick Assembler

	Article: Q44745
	Version(s): 2.01
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 26-JUN-1989
	
	The Tiny model is supported by the Quick Assembler Version 2.01 to
	allow for the creation of .COM files. This support alleviates the
	required use of EXE2BIN. This memory model is supported in the
	following way:
	
	1. Segment _TEXT will be included as the first segment of DGROUP.
	
	2. An "assume" will be done of all segment registers to DGROUP.
	
	3. The code segment will be opened, and an ORG 100h done.
	
	As a result of this change, constructs that result in segment fixups
	will be flagged as errors where possible. This includes use of a
	segment as an immediate value, and the use of the SEG operator, as in
	the following example:
	
	   1. MOV    ax, _DATA
	   2. MOV    ax, SEG MySymbol
	
	In the above example, the following new error message will be
	generated in Tiny model:
	
	   error 116: Segment reference illegal in tiny model.
	
	Please note that this support for .COM files currently resides only in
	the Quick Assembler portion of this package. The possibility of
	embedding this support within Quick C is under review and will be
	considered for inclusion in a future release.
