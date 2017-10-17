---
layout: page
title: "Q65083: QBX Incorrectly Initializes Array in TYPE with OPTION BASE 1"
permalink: /pubs/pc/reference/microsoft/kb/Q65083/
---

## Q65083: QBX Incorrectly Initializes Array in TYPE with OPTION BASE 1

	Article: Q65083
	Version(s): 7.00 7.10
	Operating System: MS-DOS
	Flags: ENDUSER | buglist7.00 buglist7.10 SR# S900205-152
	Last Modified: 4-SEP-1990
	
	QBX.EXE may not correctly initialize programs with OPTION BASE 1 and
	arrays in user-defined TYPEs during their initial loading. The array
	in the type is treated as a zero-based array instead of a one-based
	array. This problem is corrected by saving the file or editing either
	the OPTION BASE 1 line or the TYPE statement. This behavior does not
	occur when the program is compiled with BC.EXE.
	
	Microsoft has confirmed this to be a problem with the QBX.EXE
	environment of Microsoft BASIC Professional Development System (PDS)
	versions 7.00 and 7.10 for MS-DOS. We are researching this problem and
	will post new information here as it becomes available.
	
	Code Example
	------------
	
	The following code example will give incorrect results (a length of 3
	and a lower bound of 0) on the initial run of the program, but after
	saving the file (without reloading), or after editing either of the
	indicated lines, the program runs correctly (giving a length of 2 and
	a lower bound of 1):
	
	   OPTION BASE 1                      'Editing here corrects error
	   TYPE ArrayType
	        Array(2) AS STRING * 1        'Editing here also corrects
	   END TYPE
	   DIM varArrayType AS ArrayType
	   PRINT LEN(varArrayType)               'Should be 2 (incorrectly 3)
	   PRINT LBOUND(varArrayType.Array)      'Should be 1 (incorrectly 0)
	   END
