---
layout: page
title: "Q61406: NOFLTIN.OBJ: Hex Numbers Not Allowed with INPUT, READ, or VAL"
permalink: /pubs/pc/reference/microsoft/kb/Q61406/
---

## Q61406: NOFLTIN.OBJ: Hex Numbers Not Allowed with INPUT, READ, or VAL

	Article: Q61406
	Version(s): 7.00 7.10 | 7.00 7.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | SR# S900409-55
	Last Modified: 21-SEP-1990
	
	When you LINK the stub file NOFLTIN.OBJ into a program compiled with
	the /O switch, or into a custom run-time module built with
	BUILDRTM.EXE, the numeric parsing code will be replaced with an
	integer-only version.
	
	If you link with NOFLTIN.OBJ, all numbers used by INPUT, READ, and VAL
	must be within the range of legal long integers.
	
	Although it seems that a number represented in hexadecimal should fall
	into the category of "legal long integers," it does not. A program
	that INPUTs, READs, or uses the VAL function on a hexadecimally
	represented integer will either generate an error or return incorrect
	results. Hexadecimal number parsing is also eliminated with the
	NOFLTIN.OBJ stub file.
	
	This information applies to Microsoft BASIC Professional Development
	System (PDS) versions 7.00 and 7.10 for MS-DOS and MS OS/2.
	
	The following is an explanation of what happens when a program linked
	with the NOFLTIN.OBJ stub file uses either the INPUT, READ, or VAL
	commands on a hexadecimal number:
	
	   INPUT - returns a "Redo from start"
	   READ  - returns "Syntax error in module <module name>"
	   VAL   - returns a value of 0
