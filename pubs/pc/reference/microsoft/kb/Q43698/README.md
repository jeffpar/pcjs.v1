---
layout: page
title: "Q43698: &quot;COMMON in Quick Library Too Small&quot; -- Use NAMED COMMON"
permalink: /pubs/pc/reference/microsoft/kb/Q43698/
---

## Q43698: &quot;COMMON in Quick Library Too Small&quot; -- Use NAMED COMMON

	Article: Q43698
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890416-1 B_BasicCom
	Last Modified: 14-DEC-1989
	
	If the COMMON block in a main program module is larger than the COMMON
	block of a loaded Quick library subprogram, the error "COMMON in Quick
	library too small" occurs. In an executable (EXE) form (LINKed with an
	equivalent LIB), the error does not occur.
	
	To work around this behavior, use a named COMMON block for the Quick
	library subprograms.
	
	This information applies to QuickBASIC Versions 4.00, 4.00b, and 4.50,
	to the QB.EXE environment shipped with Microsoft BASIC Compiler
	Versions 6.00 and 6.00b, and to the QBX.EXE environment shipped with
	Microsoft BASIC PDS Version 7.00.
	
	Code Example
	------------
	
	The following code example causes the "COMMON in Quick library too
	small" error when run in the environment; the workaround is described
	in comments:
	
	REM Calling program
	COMMON a%, b%, c%        'workaround: COMMON /qlbcommon/ a%, b%
	REM    So other programs can use also: COMMON a%, b%, c%
	CALL test
	END
	
	REM Quick Library TEST.QLB
	COMMON a%, b%            'workaround: COMMON /qlbcommon/ a%, b%
	SUB Test
	PRINT a%, b%
	END SUB
