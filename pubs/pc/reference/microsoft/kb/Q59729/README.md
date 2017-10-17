---
layout: page
title: "Q59729: QB 4.5 Learning to Use Correction; Preserving COMMON in CHAIN"
permalink: /pubs/pc/reference/microsoft/kb/Q59729/
---

## Q59729: QB 4.5 Learning to Use Correction; Preserving COMMON in CHAIN

	Article: Q59729
	Version(s): 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900304-1 docerr
	Last Modified: 26-MAR-1990
	
	This article corrects a documentation error on Page 237 of the
	"Microsoft QuickBASIC 4.5: Learning to Use" manual for Version 4.50.
	
	The following statement on Page 237 near the middle of the page is
	incorrect:
	
	   Also, files created with the EXE requiring BRUN45.EXE option do
	   not preserve open files or variables listed in COMMON statements
	   when a CHAIN statement transfers control to another program.
	
	This statement should be changed to the following:
	
	   Also, files compiled with /O, which uses the BCOM45.LIB library
	   to create a stand-alone .EXE application, do not preserve open
	   files or variables listed in COMMON statements when a CHAIN
	   statement transfers control to another program.
