---
layout: page
title: "Q39523: How to Declare Externals in MASM"
permalink: /pubs/pc/reference/microsoft/kb/Q39523/
---

## Q39523: How to Declare Externals in MASM

	Article: Q39523
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER |
	Last Modified: 12-JAN-1989
	
	The following are the rules for declaring externals in MASM:
	
	1. NEAR code labels must be declared in the code segment
	   from which they are accessed.
	
	2. Although FAR code labels can be declared anywhere in the source
	   code, it is recommended they be declared outside of any segments.
	   You may declare them at the top of your program after the .MODEL
	   directive.
	
	3. Any external data in the DGROUP data segment, must be declared in
	   the segment in which it is defined. You may need to create a dummy
	   data segment for the external declaration.
	
	4. Data items declared in .FARDATA segment, that need to be referenced
	   as externals, should be declared out of any segments. Otherwise,
	   fixup-overflow errors may occur during linking. Note: This
	   conflicts with the rules indicated on Page 162 of "Microsoft Macro
	   Assembler Programmer's Guide" for Versions 5.x.
