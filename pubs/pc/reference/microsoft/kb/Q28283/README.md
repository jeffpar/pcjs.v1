---
layout: page
title: "Q28283: It Is Illegal to Pass a CONST Type Constant in COMMON"
permalink: /pubs/pc/reference/microsoft/kb/Q28283/
---

## Q28283: It Is Illegal to Pass a CONST Type Constant in COMMON

	Article: Q28283
	Version(s): 6.00 6.00b 7.00 | 6.00 6.00b 7.00
	Operating System: MS-DOS          | OS/2
	Flags: ENDUSER |
	Last Modified: 2-FEB-1990
	
	A user-defined CONST constant cannot be passed in COMMON.
	
	CONST constants never need to be passed in COMMON since you can put
	the CONST definitions in a $include file to include for use in any
	desired module.
	
	A given user-defined CONST constant is local to each separately
	compiled module, and can be used throughout a given source file.
	
	The following is an example of illegally passing a CONST type symbol
	in COMMON. In the QB.EXE environment that comes with Microsoft BASIC
	Compiler Versions 6.00 and 6.00b or in the QBX.EXE environment
	supplied with Microsoft BASIC Professional Development System (PDS)
	Version 7.00, the following program correctly gives a "duplicate
	definition" error on x in the COMMON SHARED:
	
	   CONST x = 5
	   COMMON SHARED x, y, z   ' "duplicate definition" error for x
	   TYPE person
	     test AS STRING * x
	   END TYPE
	   DIM joe AS person
	
	Please note that when you use STRING * x, x must be a CONST type or a
	numeric constant, according to the "Microsoft QuickBASIC 4.0: BASIC
	Language Reference" manual on Page 430.
	
	The following shows how the above program can be modified to work
	correctly:
	
	   CONST x = 5
	   COMMON SHARED y, z
	   TYPE person
	     test AS STRING * x
	   END TYPE
	   DIM joe AS person
