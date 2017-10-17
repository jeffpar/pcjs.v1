---
layout: page
title: "Q62267: Problem Using SETMEM and SHELL in QuickBASIC 4.50"
permalink: /pubs/pc/reference/microsoft/kb/Q62267/
---

## Q62267: Problem Using SETMEM and SHELL in QuickBASIC 4.50

	Article: Q62267
	Version(s): 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom buglist4.00 buglist4.00b buglist4.50
	Last Modified: 14-JUN-1990
	
	Using the SETMEM function with a parameter less than 0 (zero) in
	Microsoft QuickBASIC versions 4.00, 4.00b, and 4.50 deallocates memory
	from BASIC's far heap. Normally, the memory can be regained with
	another call to SETMEM with a positive parameter. However, if a SHELL
	statement is executed between the two CALLs to SETMEM, the program
	will not be able to reclaim the memory. This happens both when
	executing from the QB.EXE environment or as an executable (.EXE) file
	that uses the BRUNxx.EXE run-time module. The only workaround is to
	compile the program as a stand-alone EXE using BC.EXE with the /O
	option.
	
	Microsoft has confirmed this to be a problem in QuickBASIC 4.00,
	4.00b, and 4.50, and in Microsoft BASIC Compiler versions 6.00 and
	6.00b for MS-DOS (buglist6.00, buglist6.00b). This problem was
	corrected in Microsoft Professional Development System (PDS) version
	7.00 for MS-DOS (fixlist7.00).
	
	The following code sample reproduces this problem:
	
	   before& = FRE(-1)                ' Get original Value.
	   temp& = SETMEM(-30000)           ' Deallocate memory.
	   SHELL "CLS"
	   temp& = SETMEM(30000)            ' Try to Reallocate memory.
	   after& = FRE(-1)                 ' Get New value, which should be
	                                    ' the same value as the original.
	   CLS
	   PRINT "Before Call: "; before&   ' If the difference between these
	   PRINT "After  Call: "; after&    ' two values is 30000 then the
	                                    ' problem is reproduced.
	   differ& = before& - after&
	   PRINT " Difference  ";differ&    ' This should be 0.
