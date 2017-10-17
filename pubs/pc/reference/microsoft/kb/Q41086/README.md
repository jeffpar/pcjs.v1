---
layout: page
title: "Q41086: IEEE Number Range Correction for QB 4.0 &quot;Learning and Using&quot;"
permalink: /pubs/pc/reference/microsoft/kb/Q41086/
---

## Q41086: IEEE Number Range Correction for QB 4.0 &quot;Learning and Using&quot;

	Article: Q41086
	Version(s): 4.00 4.00b
	Operating System: MS-DOS
	Flags: ENDUSER | DOCERR B_BasicCom
	Last Modified: 17-FEB-1989
	
	The range for IEEE single and double precision numbers is correct in
	the "QuickBASIC 4.0: BASIC Language Reference" manual (Page 16), but
	is incorrect in the "QuickBASIC 4.0: Learning and Using QuickBASIC"
	manual (Page 248).
	
	The IEEE floating-point ranges on Page 248 of the following manuals
	are incorrect:
	
	1. "Microsoft QuickBASIC: Learning and Using" for QuickBASIC
	   Versions 4.00 and 4.00b.
	
	2. "Microsoft BASIC Compiler: Learning and Using QuickBASIC" for
	   BASIC Compiler Versions 6.00 and 6.00b for MS-DOS and MS OS/2.
	
	The IEEE number range limits on Page 16 of the "BASIC Language
	Reference" for QuickBASIC Versions 4.00 and 4.00b and BASIC compiler
	Versions 6.00 and 6.00b are correct (and agree with Page 337 of the
	"Programming in BASIC" manual for QuickBASIC Version 4.50).
	
	The following is a sample test program:
	
	' This program shows that the single precision limit as k goes to
	' zero is k=1.40E-45. Change j# to j! to show the 3.40E+38 limit
	' for single precision j!.
	DEFSNG A-Z
	j# = 1E+36
	t:
	j# = j# * 1.1
	k = 1 / j#
	PRINT j#, k
	IF k = 0 THEN STOP
	GOTO t
