---
layout: page
title: "Q64103: CURRENCY Variable of User-Defined TYPE Cannot Use @ Symbol"
permalink: /pubs/pc/reference/microsoft/kb/Q64103/
---

## Q64103: CURRENCY Variable of User-Defined TYPE Cannot Use @ Symbol

	Article: Q64103
	Version(s): 7.00 7.10
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900717-156 buglist7.00 buglist7.10
	Last Modified: 27-JUL-1990
	
	A field in a user-defined TYPE ... END TYPE statement must be defined
	with the "AS VariableType" form. When accessing the variable in the
	program, however, the variable can be referred to with or without the
	appropriate type symbol (for example, % for integer, & for long,
	etc.). However, a variable of type CURRENCY defined in a user-defined
	TYPE cannot be referred to in this manner. If the currency symbol (the
	@ sign) is used when accessing the field, the error message "Equal
	sign missing" is returned by the BC.EXE compiler. No error occurs when
	this format is used in the QBX.EXE environment.
	
	Microsoft has confirmed this to be a problem with the BASIC compiler
	(BC.EXE) in Microsoft BASIC Professional Development System (PDS)
	versions 7.00 and 7.10 for MS-DOS and OS/2. We are researching this
	problem and will post new information here as it becomes available.
	
	To reproduce this problem, no special compiler directives are
	necessary. Use the following command to generate the error:
	
	   BC BasicProgramName ;
	
	The compiler error and output are as follows:
	
	    me(1).a@ = 12
	           ^  Equal sign missing
	
	Sample Code
	-----------
	
	TYPE mytype
	  a AS CURRENCY
	  b AS INTEGER
	  c AS LONG
	  d AS SINGLE
	  e AS DOUBLE
	  f AS STRING * 20
	END TYPE
	
	DIM me AS mytype
	COMMON SHARED me() AS mytype
	
	REDIM me(10)  AS mytype
	me(1).a@ = 12     REM  Remark this line to avoid the compiler error
	                  REM  or remove the currency symbol (@).
	me(1).b% = 12
	me(1).c& = 12
	me(1).d! = 12
	me(1).e# = 12
	me(1).f$ = "12"
	PRINT me(1).a, me(1).b, me(1).c
	PRINT me(1).d, me(1).e, me(1).f
