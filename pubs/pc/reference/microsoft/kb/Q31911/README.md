---
layout: page
title: "Q31911: How to Nest User-Defined TYPE Declarations in Compiled BASIC"
permalink: /pubs/pc/reference/microsoft/kb/Q31911/
---

## Q31911: How to Nest User-Defined TYPE Declarations in Compiled BASIC

	Article: Q31911
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 21-DEC-1989
	
	The following is an example of how to nest user-defined type
	declarations. An element inside a TYPE...END TYPE declaration can be
	declared with a user-defined type.
	
	This information applies to Microsoft QuickBASIC Versions 4.00, 4.00b,
	and 4.50 for MS-DOS, to Microsoft BASIC Compiler Versions 6.00 and
	6.00b for MS-DOS and MS OS/2, and to Microsoft BASIC PDS Version 7.00
	for MS-DOS and MS OS/2.
	
	Code Example
	------------
	
	' Declare one type as follows:
	TYPE foo
	  x AS INTEGER
	  y AS STRING * 5
	END TYPE
	' Declare an element of the following type with the above type (foo):
	TYPE txx
	  n AS foo
	END TYPE
	' Dimension variables with the nested type (txx):
	DIM t(10) AS txx
	DIM k AS txx
	' Elements of the nested type variables can be used as follows:
	k.n.x = 3
	t(1).n.y = "test"
	PRINT k.n.x
	PRINT t(1).n.y
