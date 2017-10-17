---
layout: page
title: "Q35965: Which BASIC Versions Can CALL C, FORTRAN, Pascal, MASM"
permalink: /pubs/pc/reference/microsoft/kb/Q35965/
---

## Q35965: Which BASIC Versions Can CALL C, FORTRAN, Pascal, MASM

	Article: Q35965
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom S_C H_Fortran S_PasCal H_MASM S_QuickASM S_QuickC
	Last Modified: 22-OCT-1990
	
	Certain versions of Microsoft QuickBASIC and Microsoft BASIC Compiler
	can CALL routines from certain other Microsoft languages (and pass
	parameters), depending upon the product version number, as explained
	below.
	
	Microsoft BASIC Professional Development System (PDS) version 7.10 can
	be linked with Microsoft C PDS version 6.00 or QuickC version 2.50 or
	2.51.
	
	The following application note, which can be requested from Microsoft
	Product Support Services, is required if you wish to perform BASIC
	7.10 mixed-language programming with C 5.10, FORTRAN 5.00, or Pascal
	4.00:
	
	   "How to Link BASIC PDS 7.10 with C 5.10, FORTRAN 5.00, or
	    Pascal 4.00" (application note number BB0345)
	
	QuickBASIC 4.50 and BASIC PDS 7.00 (but not earlier versions) can
	create .OBJ modules that can be linked with .OBJ modules from
	Microsoft FORTRAN version 5.00 and Microsoft QuickC version 2.01.
	
	QuickBASIC versions 4.00b and 4.50, Microsoft BASIC Compiler versions
	6.00 and 6.00b for MS-DOS and MS OS/2, and Microsoft BASIC PDS version
	7.00 for MS-DOS and MS OS/2 create .OBJ modules that can be linked
	with .OBJ modules from the following languages:
	
	1. Microsoft Pascal version 4.00.
	2. Microsoft FORTRAN version 4.10.
	3. Microsoft C version 5.10 and QuickC versions 1.01 and 2.00.
	4. Microsoft Macro Assembler (MASM) version 5.00 or later recommended,
	   but earlier versions should also work.
	
	For more information on interlanguage CALLing between Microsoft C and
	BASIC, query in this Knowledge Base on the word "BAS2C".
	
	For more information on interlanguage CALLing between Microsoft MASM
	and BASIC, query in this Knowledge Base on the word "BAS2MASM".
	
	For more information about using the CALL statement to pass parameters
	from BASIC to other languages, query in this Knowledge Base on the
	following words:
	
	   CALL and (PASSING or PASS) and [language name]
	
	QuickBASIC 4.00
	---------------
	
	QuickBASIC version 4.00 creates .OBJ modules that can be linked with
	.OBJ modules from the following languages (Microsoft has performed
	successful interlanguage test suites for QuickBASIC version 4.00 with
	these language versions):
	
	1. Microsoft C version 5.00, QuickC version 1.00.
	2. Microsoft FORTRAN version 4.00.
	3. Microsoft Pascal version 4.00.
	4. Microsoft Macro Assembler (MASM) versions 4.00 and later
	   recommended, but earlier versions should also work.
	
	Note that QuickBASIC version 4.00b might link with these earlier
	language versions, but Microsoft cannot guarantee success because the
	4.00b test suites were performed only on the later language versions
	mentioned further above in this article.
	
	QuickBASIC 1.x, 2.x, 3.00
	-------------------------
	
	In QuickBASIC versions 1.00, 1.01, 1.02, 2.00, 2.01, and 3.00, you can
	link only to .OBJ modules from Microsoft Macro Assembler (versions
	1.2x, 2.x, or later) or the given version of QuickBASIC. In other
	words, QuickBASIC versions 3.00 and earlier can CALL only QuickBASIC
	subprograms or assembly routines.
	
	Important Information About Interlanguage CALLing
	-------------------------------------------------
	
	To be compatible with compiled BASIC, programs should be assembled or
	compiled using the medium, large, or huge memory model, and BASIC must
	be linked first (as the main module).
	
	When you link compiled BASIC to other compiled BASIC modules, compiler
	versions should not be mixed. For example, an .OBJ module compiled in
	QuickBASIC version 4.00 should not be linked with an .OBJ module
	compiled in QuickBASIC version 4.00b or 4.50 or Microsoft BASIC
	Compiler version 6.00 or 6.00b or Microsoft BASIC PDS version 7.00 or
	7.10.
	
	As an alternative to the CALL statement for interlanguage invocation,
	you may use the SHELL statement to invoke most (non-TSR) .EXE, .COM,
	or .BAT programs that you can also invoke from DOS. SHELL works
	differently than CALL. SHELL invokes another copy of the DOS
	COMMAND.COM command processor before running a requested executable
	program.
