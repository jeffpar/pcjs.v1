---
layout: page
title: "Q49245: Error in Macro Example in MASM 5.10 Update Manual"
permalink: /pubs/pc/reference/microsoft/kb/Q49245/
---

## Q49245: Error in Macro Example in MASM 5.10 Update Manual

	Article: Q49245
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | docerr
	Last Modified: 2-MAR-1990
	
	The macro example on Page Update-23 in the "Microsoft Macro Assembler
	5.1: Updates and Microsoft Editor" has an error in it. The macro in
	the example is called RESTREGS.
	
	The current example reads as follows:
	
	   The INSTR directive returns the position of a string within
	   another string.
	
	    restregs    MACRO
	       numloc   instr  regpushed,"#"
	              .
	              .
	              .
	                ENDM
	
	The second line should read as follows:
	
	        numloc  instr  regpushed,<#>
	
	This example does not work correctly on MASM Version 5.10 but does
	work on MASM Version 5.10a. This is due to a problem with the SUBSTR
	directive in MASM 5.10 with regard to assigning a string a substring
	of itself.
