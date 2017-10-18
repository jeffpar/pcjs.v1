---
layout: page
title: "Q49705: Labeling Variables with Multiple Names in MASM 5.00, 5.10"
permalink: /pubs/pc/reference/microsoft/kb/Q49705/
---

## Q49705: Labeling Variables with Multiple Names in MASM 5.00, 5.10

	Article: Q49705
	Version(s): 5.00 5.10 | 5.00 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER |
	Last Modified: 29-MAR-1990
	
	You can multiply define a memory location by using the LABEL
	directive. The following information comes from Pages 136-137 of the
	"Microsoft Macro Assembler 5.0 for the MS-DOS Operating System:
	Programmer's Guide":
	
	   name LABEL type
	
	   The name is the symbol assigned to the variable, and type is the
	   variable size. The type can be any one of the following type
	   specifiers:  BYTE, WORD, DWORD, FWORD, QWORD, or TBYTE. It can also
	   be the name of a previously defined structure.
	
	The following is an example of declaring two names for the same
	variable:
	
	rainbow LABEL WORD
	wizard  DW ?
	
	In this case, rainbow and wizard point to the same word in memory.
