---
layout: page
title: "Q61483: &quot;Illegal Function Call&quot; CHAINing to Stand Alone, /Fpa, or /Fs"
permalink: /pubs/pc/reference/microsoft/kb/Q61483/
---

## Q61483: &quot;Illegal Function Call&quot; CHAINing to Stand Alone, /Fpa, or /Fs

	Article: Q61483
	Version(s): 6.00 6.00b 7.00 7.10 | 6.00 6.00b 7.00 7.10
	Operating System: MS-DOS               | OS/2
	Flags: ENDUSER | SR# S900416-144 B_QuickBas
	Last Modified: 20-SEP-1990
	
	Attempting to CHAIN from an EXE that requires a run-time module to a
	stand-alone EXE causes the run-time error "Illegal Function Call" on
	the CHAIN statement.
	
	This error message does not occur when CHAINing in the reverse
	direction (from a stand-alone EXE to an EXE that requires a run-time
	module), or when CHAINing between identical EXE types (both stand
	alone, or both run time), or when using the RUN statement instead of
	CHAIN.
	
	"Illegal Function Call" also occurs when CHAINing from an EXE that
	requires a run-time module to an EXE compiled with a different math
	package (/Fpa versus /Fpi; found only in BC.EXE 6.00, 6.00b, 7.00, or
	7.10) or compiled with a different string option (/Fs far strings
	versus near strings; found only in Microsoft BASIC Professional
	Development System (PDS) version 7.00 or 7.10).
	
	This information applies to Microsoft QuickBASIC versions 4.00, 4.00b,
	and 4.50 for MS-DOS; to Microsoft BASIC Compiler versions 6.00 and
	6.00b for MS-DOS and MS OS/2; and to Microsoft BASIC PDS versions 7.00
	and 7.10 for MS-DOS and MS OS/2.
	
	When transferring control to an EXE with a different run-time module,
	the RUN statement is the preferred method. RUN makes no attempt to
	preserve any values on the transfer, whereas CHAIN tries to maintain
	COMMON variables. The CHAIN statement should be used only when
	transferring control to another BASIC program that uses the same BASIC
	run-time library as the one being CHAINed from.
	
	Code Example
	------------
	
	The following code example produces an "Illegal Function Call" on the
	CHAIN statement when the two programs are compiled as indicated:
	
	   'A.BAS
	   'Compile and link lines:
	   '   BC A;
	   '   LINK A;
	   CHAIN "B"         'RUN does not cause the error
	   END
	
	   'B.BAS
	   'Compile and link lines:
	   '   BC /o B;
	   '   LINK B;
	   PRINT "In Program B"
