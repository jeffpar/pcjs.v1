---
layout: page
title: "Q42474: &quot;Array Not Defined&quot;; Must DIMension Array Above Its First Use"
permalink: /pubs/pc/reference/microsoft/kb/Q42474/
---

## Q42474: &quot;Array Not Defined&quot;; Must DIMension Array Above Its First Use

	Article: Q42474
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890313-67 B_BasicCom
	Last Modified: 18-DEC-1989
	
	Microsoft QuickBASIC Versions 4.00 4.00b and 4.50, Microsoft BASIC
	Compiler Versions 6.00 and 6.00b, and Microsoft BASIC PDS Version 7.00
	are single-pass compilers. This means that all arrays (static or
	dynamic) that are to be used within a BASIC program must be
	DIMensioned physically above where they are first used. The exception
	to this is when they are dynamically declared in a COMMON statement.
	
	The program below demonstrates how the array dimension is unknown when
	an attempt is made to pass the array to a SUBprogram, even though it
	is DIMensioned logically before it is used. The resulting error will
	be "Array not defined" on the CALL statement. This is expected
	behavior in QuickBASIC, Microsoft BASIC Compiler, and BASIC PDS. The
	program is as follows:
	
	DECLARE SUB GetStartPos (letterWidth!())
	DEFINT A-Z
	GOSUB DimLetterWidths
	CALL GetStartPos(letterWidth!())
	END
	
	DimLetterWidths:
	  REDIM SHARED letterWidth! (128)  ' REDIM dimensions a dynamic array.
	  RETURN
	
	SUB GetStartPos (letterWidth!())
	  PRINT UBOUND (letterWidth!, 1)
	END SUB
	
	If the array is declared as dynamic by a COMMON statement, the error
	does not occur. Placing the statement COMMON letterWidth!() after the
	DEFINT A-Z line eliminates the error.
