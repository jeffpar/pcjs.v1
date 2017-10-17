---
layout: page
title: "Q35278: Sample Program That Makes MS OS/2 Call to DosBeep Function"
permalink: /pubs/pc/reference/microsoft/kb/Q35278/
---

## Q35278: Sample Program That Makes MS OS/2 Call to DosBeep Function

	Article: Q35278
	Version(s): 6.00 6.00b 7.00
	Operating System: OS/2
	Flags: ENDUSER |
	Last Modified: 1-FEB-1990
	
	Below is a sample program that makes a call to the MS OS/2 function
	DosBeep. This program can be compiled in Microsoft BASIC Compiler
	Versions 6.00 and 6.00b for MS OS/2 and Microsoft BASIC Professional
	Development System (PDS) Version 7.00.
	
	REM $INCLUDE: 'bsedospc.bi'
	DEFINT a-z
	PRINT "Test of DOSBEEP..."
	i = &H25
	WHILE ((INKEY$ = "") and (i < &H7EFF))
	   i = i + &H100
	   x = DOSBEEP(i, 400)
	WEND
