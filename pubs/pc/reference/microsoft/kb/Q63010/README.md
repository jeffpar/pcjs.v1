---
layout: page
title: "Q63010: Cannot Display Array Pointer or Full BASIC Array with CodeView"
permalink: /pubs/pc/reference/microsoft/kb/Q63010/
---

## Q63010: Cannot Display Array Pointer or Full BASIC Array with CodeView

	Article: Q63010
	Version(s): 6.00 6.00b 7.00 7.10 | 6.00 6.00b 7.00 7.10
	Operating System: MS-DOS               | OS/2
	Flags: ENDUSER | SR# S900606-86 B_QuickBas S_CodeView
	Last Modified: 5-SEP-1990
	
	The BC.EXE compiler in QuickBASIC versions 4.00, 4.00b, and 4.50, in
	Microsoft BASIC Compiler versions 6.00 and 6.00b, and in Microsoft
	BASIC Professional Development System (PDS) versions 7.00 and 7.10 can
	create programs that will run under Microsoft CodeView versions 2.x
	and 3.00. However, arrays or arrays in TYPEd records give "?CANNOT
	DISPLAY" for the CodeView commands ?, ??, or w?. This is not a problem
	with either the BASIC compiler or CodeView, but represents a
	limitation of debugging BASIC programs in CodeView.
	
	This information applies to programs run under CV.EXE and CVP.EXE 2.x
	and 3.00 when compiled with the BC.EXE compiler that comes with
	QuickBASIC versions 4.00, 4.00b, and 4.50, Microsoft BASIC Compiler
	versions 6.00 and 6.00b for MS-DOS and MS OS/2, and Microsoft BASIC
	PDS versions 7.00 and 7.10 for MS-DOS and MS OS/2.
	
	In CodeView, the ? command is used to display an expression. The ??
	command is used to graphically view a variable in a dialog box. ??
	will expand a variable, such as a TYPEd record, to show the fields and
	the value currently assigned to each field.
	
	This limitation also applies to the CodeView 3.00 command ??, where
	the graphical display (??) can expand the elements of an array. For
	example, an array in C (int intarray[10];) can be displayed as a far
	pointer with ? and expanded to its elements with ??. With CodeView 2.x
	and C version 5.10, the ?? command won't display the elements of a C
	array, but will display the far pointer value that is the array's
	address.
