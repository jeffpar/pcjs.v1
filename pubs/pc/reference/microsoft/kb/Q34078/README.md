---
layout: page
title: "Q34078: &quot;Internal Error&quot; Using Fixed String in First TYPE Element"
permalink: /pubs/pc/reference/microsoft/kb/Q34078/
---

## Q34078: &quot;Internal Error&quot; Using Fixed String in First TYPE Element

	Article: Q34078
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist4.00b B_BasicCom fixlist4.50
	Last Modified: 12-DEC-1989
	
	When the first element in the user-defined TYPE in the program below
	is a fixed-length string, BC.EXE gives an "Internal error near xxxx"
	at compile time.
	
	Microsoft has confirmed this to be a problem in Microsoft QuickBASIC
	Versions 4.00 and 4.00b, and in Microsoft BASIC Compiler Versions 6.00
	and 6.00b for MS-DOS and MS OS/2 (buglist6.00 and buglist6.00b). This
	problem does not occur in the QB.EXE environment. This problem was
	corrected in QuickBASIC Version 4.50 and in Microsoft BASIC PDS
	Version 7.00 (fixlist7.00).
	
	Note that the TYPE...END TYPE statement is not found in QuickBASIC
	Versions 3.00 or earlier.
	
	The following code example demonstrates the problem:
	
	     Declare sub initialize (e as any)   'declares sub initialize
	
	     Type  REC
	      a as string * 32
	      b as long
	      c as long
	     End Type
	
	     Dim e as REC
	     Call initialize(e)
	     Print e.c
	     print results
	
	     Sub initialize (s as rec)
	        s.b =64
	        s.c = s.b
	     End sub
