---
layout: page
title: "Q35128: Line Parsing Order for MASM: Looks Up Second Token First"
permalink: /pubs/pc/reference/microsoft/kb/Q35128/
---

## Q35128: Line Parsing Order for MASM: Looks Up Second Token First

	Article: Q35128
	Version(s): 5.x    | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 12-JAN-1989
	
	The Microsoft Macro Assembler always looks up the second token on the
	line first. In the case below, it sees "specb". Because that is a
	structure definition, MASM assumes the line declares a structure
	instance with "MOV" being the label. At this point, MASM errors on
	trying to use reserved symbol "MOV" as a structure instance label. The
	assumption is reasonable and would be hard to modify the way MASM
	parses.
	
	The following sample code demonstrates the problem:
	
	_DATA SEGMENT
	specb STRUC
	        buff  DW  ?
	specb ENDS
	_DATA ENDS
	
	_CODE SEGMENT
	ASSUME CS:code
	start:
	    mov specb.buff,AX
	_CODE ENDS
	
	END start
