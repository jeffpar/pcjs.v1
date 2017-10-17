---
layout: page
title: "Q26015: &quot;Type Mismatch&quot; in Editor Changing Size of Array in COMMON"
permalink: /pubs/pc/reference/microsoft/kb/Q26015/
---

## Q26015: &quot;Type Mismatch&quot; in Editor Changing Size of Array in COMMON

	Article: Q26015
	Version(s): 4.00
	Operating System: MS-DOS
	Flags: ENDUSER |  buglist4.00 fixlist4.00b fixlist4.50
	Last Modified: 21-NOV-1988
	
	The program below demonstrates a problem when changing the size of an
	array that is included in a COMMON statement. After running the
	program in the editor once, if the size of the array is changed, a
	type-mismatch error occurs on the COMMON statement. The program must
	be reloaded to change the size of the array. The same error occurs
	regardless of whether the program is run with a SHIFT+F5 or an F5. If
	the variable is explicitly typed, for example, DIM a%(1000), the same
	error occurs. The array may be set back to its original size for the
	error to disappear. The program is as follows:
	
	DIM a(1000)
	COMMON SHARED a()     ' COMMON without SHARED also shows problem.
	
	Microsoft has confirmed this to be a problem in Version 4.00. This
	problem is corrected in QuickBASIC Versions 4.00b and 4.50.
