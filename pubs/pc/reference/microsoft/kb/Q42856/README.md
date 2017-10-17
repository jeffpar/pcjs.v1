---
layout: page
title: "Q42856: BC.EXE &quot;Line Too long&quot; with ASCII 128 and Fast Load Format"
permalink: /pubs/pc/reference/microsoft/kb/Q42856/
---

## Q42856: BC.EXE &quot;Line Too long&quot; with ASCII 128 and Fast Load Format

	Article: Q42856
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890221-68 buglist4.00 buglist4.00b buglist4.50
	Last Modified: 26-FEB-1990
	
	The BC.EXE compiler in QuickBASIC Versions 4.00, 4.00b, and 4.50
	produces the error message "Line too long" if the character ASCII 128
	is included into a string literal and the file being compiled is in
	Fast Load and Save format. (This character is entered into the QB.EXE
	editor by holding down CTRL+ALT while typing the numbers "128" on
	the numeric keypad and then releasing the keys.)
	
	This problem does not occur when the program is run in the QB.EXE
	editor.
	
	Microsoft has confirmed this to be a problem in QuickBASIC Versions
	4.00, 400b, and 4.50. This problem was corrected in Microsoft BASIC
	Professional Development System (PDS) Version 7.00 for MS-DOS and MS
	OS/2 (fixlist7.00).
	
	BC.EXE correctly compiles the program with the character ASCII 128 if
	it is saved in TEXT format (instead of Fast Load format).
	
	The extended ASCII characters are not legal for BASIC variable names.
	If used, they produce the error message "Expected: end-of-statement"
	when using QB.EXE or "Illegal character" when using BC.EXE.
	
	An ASCII 128 character compiles without errors in QuickBASIC Version
	3.00.
	
	You can use either of the following methods to work around the
	problem:
	
	1. Save the file as text before compiling.
	
	2. This character can be included in strings by using the CHR$
	   function. The following example shows how to print this character
	   as part of a string:
	
	      PRINT "ABCD" + CHR$(128) + "EFG"
	      PRINT "ABCD";CHR$(128);"EFG"
	      END
	
	The following is a code example:
	
	   ' This program produces the compile time error
	   ' "Line too long" if saved in QuickLoad format.
	   PRINT "CTRL+ALT+128"
	   END
	
	Additional reference word: B_BasicCom
