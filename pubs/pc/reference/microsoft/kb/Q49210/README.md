---
layout: page
title: "Q49210: &quot;Subscript Out of Range&quot; Using ERASEd Array in a SUB"
permalink: /pubs/pc/reference/microsoft/kb/Q49210/
---

## Q49210: &quot;Subscript Out of Range&quot; Using ERASEd Array in a SUB

	Article: Q49210
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist4.00b buglist4.50 B_BasicCom
	Last Modified: 27-FEB-1990
	
	In the QuickBASIC editor, the ERASE statement frees the memory for an
	array DIMensioned in a non-STATIC SUBprogram, even if the $STATIC
	metacommand is used. Because the memory for the array has been
	deallocated, a "Subscript out of range" error results the next time an
	attempt is made to access the array beyond element 10.
	
	Microsoft has confirmed this to be a problem in QB.EXE in QuickBASIC
	Versions 4.00, 4.00b, and 4.50 for MS-DOS. This problem was corrected
	in the QBX.EXE environment of Microsoft BASIC Professional Development
	System (PDS) Version 7.00 for MS-DOS and MS OS/2 (fixlist7.00).
	
	This behavior does not occur in a compiled .EXE program. In an .EXE
	program, a $STATIC array DIMensioned in a SUBprogram that is ERASEd
	remains allocated, and the ERASE initializes all elements to their
	default value (0 or "").
	
	Workarounds
	-----------
	
	The best workaround is to reinitialize the array without using the
	ERASE statement. Alternatively, you can DIM the array at the main
	module level and share it with the SUBprogram with the SHARED
	statement. Both methods ensure that memory for the array is not freed
	by ERASE.
	
	Another possible workaround for this problem is to make the SUBprogram
	STATIC by placing the STATIC clause on the SUB or FUNCTION statement.
	This method should be used with caution. Normally, BASIC allocates
	memory for variables in SUBprograms on the stack, and the memory is
	released when the SUB is exited. Making the SUBprogram STATIC causes
	all variables in the SUBprogram to be permanently allocated, which
	permanently reduces the space available for other variables and
	strings. A STATIC SUBprogram also has to initialize its own variables,
	and a STATIC SUBprogram cannot be recursive.
	
	Code Example
	------------
	
	The following program demonstrates the "Subscript out of range" error
	caused by erasing an array that was DIMensioned in a non-STATIC
	SUBprogram in the QuickBASIC QB.EXE environment:
	
	DECLARE SUB Test ()
	CALL Test
	END
	
	SUB Test
	  DIM A$(100)
	  ERASE A$
	  PRINT A$(80)           ' "Subscript Out of Range" occurs.
	END SUB
	
	Workaround 1
	------------
	
	Initialize the array without ERASE, as follows:
	
	DECLARE SUB Test ()
	CALL Test
	END
	
	SUB Test
	  DIM A$(100)
	  FOR I = 1 TO 100
	      A$(I) = ""
	  NEXT
	  PRINT A$(80)
	END SUB
	
	Workaround 2
	------------
	
	DIM the array in the main level of the module and SHARE it in the SUB,
	as follows:
	
	DECLARE SUB Test ()
	DIM A$(100)
	CALL Test
	END
	
	SUB Test
	  SHARED A$()
	  ERASE A$
	  PRINT A$(80)
	END SUB
	
	Workaround 3
	------------
	
	Use a STATIC SUBprogram, as follows:
	
	DECLARE SUB Test ()
	CALL Test
	END
	
	SUB Test STATIC          'Added STATIC
	  DIM A$(100)
	  ERASE A$
	  PRINT A$(80)
	END SUB
