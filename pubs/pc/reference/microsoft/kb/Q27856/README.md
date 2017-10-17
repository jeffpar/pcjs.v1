---
layout: page
title: "Q27856: &quot;Formal Parameter Specification Illegal&quot; from BC But Not QB"
permalink: /pubs/pc/reference/microsoft/kb/Q27856/
---

## Q27856: &quot;Formal Parameter Specification Illegal&quot; from BC But Not QB

	Article: Q27856
	Version(s): 6.00 6.00b 7.00 | 6.00 6.00b 7.00
	Operating System: MS-DOS          | OS/2
	Flags: ENDUSER | B_QuickBas
	Last Modified: 2-FEB-1990
	
	For the following statement, the BC.EXE compiler correctly generates
	the compile-time error message "Formal parameter specification
	illegal," while the QuickBASIC QB.EXE editor does not produce any
	error messages:
	
	   DECLARE SUB prompt (prompt$)
	
	This error message results from the requirement in QuickBASIC Versions
	4.00, 4.00b, and 4.50, in Microsoft BASIC Compiler Versions 6.00 and
	6.00b, and in Microsoft BASIC Professional Development System (PDS)
	Version 7.00 that procedure and variable names must be different.
	Therefore, programs may not contain functions or subprograms whose
	names are the same as those of variables.
	
	Note that the QB.EXE environment of QuickBASIC Versions 4.00, 4.00b,
	and 4.50 and the QBX.EXE environment of BASIC PDS 7.00 correctly gives
	you a "Duplicate Definition" error on the following CALL or SUB
	statement:
	
	   CALL PROMPT(PROMPT$)
	
	Therefore, the lack of warning of "Duplicate Definition" for the
	DECLARE statement is a minor issue.
	
	An error message occurs even in the case in which the variable and
	procedure names differ by a data-typing character (for example, %, &,
	!, #, $). The error message displays because the compiler makes no
	distinction between the variable "prompt$" and the subprogram name
	"prompt".
	
	The requirement that procedure and variable names be different was
	introduced in QuickBASIC Version 4.00 and BASIC compiler Version 6.00.
	This was not a requirement in earlier versions.
