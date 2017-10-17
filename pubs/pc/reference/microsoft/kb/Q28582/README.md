---
layout: page
title: "Q28582: &quot;Function Not Defined&quot; or &quot;Duplicate Definition&quot; Fast Load"
permalink: /pubs/pc/reference/microsoft/kb/Q28582/
---

## Q28582: &quot;Function Not Defined&quot; or &quot;Duplicate Definition&quot; Fast Load

	Article: Q28582
	Version(s): 4.00 4.00b
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom buglist4.00 buglist4.00b fixlist4.50
	Last Modified: 7-FEB-1990
	
	When run in the QuickBASIC Version 4.00 or 4.00b editor, a certain
	large (1880-line) program saved in the Fast Load format can
	generate a "Function not defined" error message on the DIM statement
	for an array having the same name as another variable in the program,
	but of a different type. (The array is named F%() and the string is
	named F$, which is supposed to be legal.) This problem has not been
	demonstrated in smaller programs.
	
	In the case reported, you can work around the problem by renaming the
	array and the string.
	
	Microsoft has confirmed this to be a problem in QuickBASIC Versions
	4.00 and 4.00b, and in Microsoft BASIC Compiler Versions 6.00 and
	6.00b for MS-DOS (buglist6.00, buglist6.00b). This problem was
	corrected in the QB.EXE environment in QuickBASIC Version 4.50 and in
	the QuickBASIC Extended (QBX.EXE) environment provided with Microsoft
	BASIC Professional Development System (PDS) Version 7.00 (fixlist7.00).
	
	This problem does not occur in QuickBASIC Version 3.00.
	
	Program AB10.BAS (not shown) is an 1880-line program containing many
	variables and many GOTO and GOSUB line labels. Two of the variables
	are F%() and F$. The program compiles correctly with BC.EXE.
	
	In the QB.EXE Version 4.00 or 4.00b editor, the program gives a
	"Function not defined" error when it reaches the DIM statement for F%.
	If the array is renamed to FOO%(), this error is resolved, but the
	program goes to where F$ first is used and gives a "Duplicate
	definition" error.
	
	If the program is completely deleted (except for a DIM F%(3)
	statement) the "Function not defined" error still occurs. If this
	smaller program is saved in text format and Opened again, the program
	runs correctly. However, if the small program is saved in Fast Load
	format, the error message still occurs when it is opened in the
	editor.
	
	This article may be useful to customers who are experiencing similar
	symptoms with Fast Load Format. The solutions in this particular case
	are either to upgrade to QuickBASIC 4.50 or BASIC PDS 7.00, to save in
	Text format instead of Fast Load Format, or to name all variables with
	different names.
