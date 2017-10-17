---
layout: page
title: "Q26710: BC.EXE &quot;Internal Error&quot; Long-Integer Arrays; OK /D or QB.EXE"
permalink: /pubs/pc/reference/microsoft/kb/Q26710/
---

## Q26710: BC.EXE &quot;Internal Error&quot; Long-Integer Arrays; OK /D or QB.EXE

	Article: Q26710
	Version(s): 4.00 4.00b
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom buglist4.00 buglist4.00b fixlist6.00b fixlist4.50
	Last Modified: 21-DEC-1988
	
	The following program, which uses long-integer arrays, gives an
	"Internal Error" when compiled with BC.EXE.
	
	Microsoft has confirmed this to be a problem in QuickBASIC Versions
	4.00 and 4.00b, and in the Microsoft BASIC Compiler Versions 6.00 for
	MS-DOS and MS OS/2. This problem was corrected in QuickBASIC Version
	4.50 and Basic Compiler Version 6.00b.
	
	No error message is generated when this program is run within the
	QB.EXE editor/interpreter.
	
	The workarounds are as follows:
	
	1. Use the debug option (BC /d) when compiling.
	
	2. Convert all long-integer arrays to any other numeric type.
	
	Note: Long integers are not supported in previous versions of
	QuickBASIC.
	
	The following code demonstrates the problem:
	
	DECLARE SUB connect (TransMap%())
	'THIS FILE RETURNS AN <INTERNAL ERROR NEAR 5F15> WHEN
	'COMPILED WITH BC.EXE without the /d (debug) option.
	
	CONST MaxBlob% = 60
	DIM SHARED BlobPrX&(MaxBlob%)
	DIM SHARED BlobUp%(MaxBlob%), BlobDn%(MaxBlob%)
	CALL connect(BlobUp%())
	
	 SUB connect (TransMap%()) STATIC
	     linewidth& = TransMap%(PrNo% + 1)
	     BlobPrX&(BBno%) = BlobPrX&(BBno%) + ABS(TransMap%(PrNo%) -
	          BlobUp%(BBno%)) + ABS(TransMap%(PrNo% + 1) - BlobDn%(BBno%))
	END SUB
