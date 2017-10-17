---
layout: page
title: "Q67373: CLEAR Can Cause &quot;Subscript out of Range&quot; with &#36;DYNAMIC Array"
permalink: /pubs/pc/reference/microsoft/kb/Q67373/
---

## Q67373: CLEAR Can Cause &quot;Subscript out of Range&quot; with &#36;DYNAMIC Array

	Article: Q67373
	Version(s): 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 5-DEC-1990
	
	Increasing the stack space with the CLEAR statement also reinitializes
	all variables. This includes erasing the memory for any $DYNAMIC
	arrays and initializing the elements of a $STATIC array to zero or
	null strings. For this reason, CLEAR should normally be used only as
	the very first executable statement in a program. Using it anywhere
	else can cause problems. For example, once you have used CLEAR, if you
	attempt to access an element of a $DYNAMIC array, the error "Subscript
	out of range" will be generated. This is expected behavior because the
	CLEAR statement deallocates all memory for the dynamic array. After a
	CLEAR, all $DYNAMIC arrays must be re-created with the REDIM
	statement.
	
	This information applies to Microsoft QuickBASIC versions 2.00, 2.01,
	3.00, 4.00, 4.00b, and 4.50 for MS-DOS; to Microsoft BASIC Compiler
	versions 6.00 and 6.00b for MS-DOS and MS OS/2; to Microsoft BASIC
	Professional Development System (PDS) versions 7.00 and 7.10 for
	MS-DOS and MS OS/2; and to all versions of GW-BASIC (such as 3.20,
	3.22, 3.23) for MS-DOS.
	
	The following code block produces the error "Subscript out of range"
	on the "x(11) = 34" assign statement:
	
	COMMON x()
	DIM x(30)
	CLEAR , , 4000
	x(11) = 34
	
	Suggested Solution #1
	---------------------
	
	Create a dynamic variable and redimension the variable.
	
	' $DYNAMIC
	COMMON x()
	DIM x(30)
	CLEAR , , 4000
	REDIM x(30)
	x(11) = 34
	
	Suggested Solution #2
	---------------------
	
	In QuickBASIC version 4.00 or later, or BASIC compiler version 6.00 or
	later, use the LINK /ST[ACK]:n option, where n is the amount of bytes
	to allocate to the stack space out of DGROUP (maximum allowable stack
	is somewhere less than 64K).
	
	Reference
	---------
	
	For related articles, query on the following words:
	
	   LINK and STACK and default and size and 3.00 and 4.00 and QuickBASIC
