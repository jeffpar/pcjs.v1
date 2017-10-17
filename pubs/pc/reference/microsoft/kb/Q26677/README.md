---
layout: page
title: "Q26677: &quot;Out of Memory,&quot; &quot;Error R6005,&quot; with CHAIN/RUN in DOS 2.x"
permalink: /pubs/pc/reference/microsoft/kb/Q26677/
---

## Q26677: &quot;Out of Memory,&quot; &quot;Error R6005,&quot; with CHAIN/RUN in DOS 2.x

	Article: Q26677
	Version(s): 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist3.00 buglist4.00 buglist4.00b buglist4.50 B_BasicCom
	Last Modified: 4-SEP-1990
	
	Below are some DOS versions 2.x-specific problems with the CHAIN
	and/or RUN statements that can be avoided by running the program under
	DOS version 3.00 or later. The symptoms differ in three different
	cases, depending on whether you have the following:
	
	1. QuickBASIC version 4.00.
	
	2. QuickBASIC version 4.00b or 4.50, or Microsoft BASIC Compiler
	   version 6.00 or 6.00b, which CHAIN correctly in DOS versions 2.x
	   when compiled with the BRUN library (unlike version 4.00). However,
	   as in version 4.00, CHAIN or RUN still fails in these versions when
	   compiled with the BCOM library.
	
	3. QuickBASIC version 3.00.
	
	Microsoft has confirmed this to be a problem in QuickBASIC versions
	3.00, 4.00, 4.00b, and 4.50, and in Microsoft BASIC Compiler version
	6.00 or 6.00b for MS-DOS and OS/2 (buglist6.00, buglist6.00b). This
	problem was corrected in Microsoft BASIC Professional Development
	System (PDS) versions 7.00 and 7.10 (fixlist7.00, fixlist7.10).
	
	Note that to avoid another cause of a DOS or BASIC error message when
	executing CHAIN or RUN, you must put the DOS 2.10 COMMAND.COM (command
	interpreter) on each disk (or floppy) where you use BASIC or
	QuickBASIC .EXE programs under DOS 2.10.
	
	Programs compiled in Microsoft BASIC Professional Development System
	(PDS) versions 7.00 and 7.10 let you work around CHAIN problems under
	DOS versions 2.x. According to the 7.00 and 7.10 README.DOC file, you
	must CHAIN as follows:
	
	   Under DOS 2.1, CHAIN <filespec$> will not work unless <filespec$>
	   provides a path. Also under DOS 2.1, if the run-time module is in
	   the root directory, the root directory must be listed in the PATH
	   environment variable.
	
	Also, you must put the DOS 2.10 COMMAND.COM (command interpreter) on
	each disk (or floppy) where you use .EXE programs under DOS 2.10, or
	else you will get a DOS or BASIC error message.
	
	Another workaround under MS-DOS version 2.10 for programs compiled in
	BASIC PDS 7.00 and 7.10 is, instead of CHAIN or RUN, to LINK with
	overlays and use OVLDOS21.OBJ for DOS 2.10 support. However,
	converting from using CHAIN or RUN to using link overlays requires
	redesigning your program.
	
	Note: QuickBASIC versions 4.00 and later require DOS version 2.10,
	2.11, or later.
	
	The CHAIN statement gives run-time errors such as "Out of Memory,"
	"Error R6005," or MS-DOS "EXEC failure" in QuickBASIC version 4.00
	programs (compiled with the BRUN40.LIB or BCOM40.LIB library) under
	DOS versions 2.x. These problems don't occur in DOS versions 3.00 or
	later.
	
	The following are workarounds for the QuickBASIC version 4.00 CHAIN
	problem under DOS versions 2.x when you compile with the BRUNxx.LIB
	library:
	
	1. Using the RUN statement instead of the CHAIN statement works around
	   the problem in version 4.00 when you compile with the BRUN library
	   (but not if you compile with the BCOM library).
	
	2. When compiled with the BRUN library option in QuickBASIC version
	   4.00b or 4.50, or Microsoft BASIC Compiler version 6.00 or 6.00b for
	   MS-DOS and MS OS/2, CHAIN works properly under DOS versions 2.x
	   (but not if you compile with the BCOM library).
	
	For programs compiled with the BCOM library (BC /O option), the CHAIN
	and RUN statements fail on the SECOND CHAIN or RUN attempt on DOS
	versions 2.x, when compiled in QuickBASIC version 4.00, 4.00b, or
	4.50, or in Microsoft BASIC Compiler version 6.00 or 6.00b.
	
	The following error messages can occur: "Out of Memory," "Error
	R6005," or MS-DOS "Not enough memory to exec."
	
	When compiled with BRUN30.LIB from QuickBASIC version 3.00, the
	programs run properly. However, programs compiled with BCOM30.LIB from
	QuickBASIC version 3.00 incorrectly produce the message "Out of memory
	during CHAIN" when the first program CHAINs to the second.
	
	The following two sample programs demonstrate the above problems:
	
	   ' Prog1
	   PRINT "hello"
	   a$ = INKEY$
	   IF a$ <> "" THEN END
	   CHAIN "prog2"
	
	   ' Prog2
	   PRINT "program 2"
	   a$ = INKEY$
	   IF a$ <> "" THEN END
	   CHAIN "prog1"
	
	The above programs compiled in QuickBASIC version 4.00 with BRUN40.LIB
	produce the message "Out of memory during CHAIN" when the first
	program CHAINs to the second. This error does not occur in QuickBASIC
	version 4.00b or 4.50 or in Microsoft BASIC Compiler version 6.00 or
	6.00b compiled with BRUNxx.LIB.
	
	You can successfully RUN or CHAIN from the first program to the second
	if you compile with BCOMxx.LIB (BC /O). However, the message "Runtime
	Error R6005" or "EXEC Failure" displays when the second program tries
	to RUN or CHAIN back to the first. This problem occurs in programs
	compiled with BCOMxx.LIB in QuickBASIC 4.00, 4.00b, and 4.50 and BASIC
	compiler 6.00 and 6.00b.
