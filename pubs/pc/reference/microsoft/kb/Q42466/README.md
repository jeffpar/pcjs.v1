---
layout: page
title: "Q42466: &quot;RETURN Without GOSUB&quot;; Btrieve BTVRFAR Fails with BASIC"
permalink: /pubs/pc/reference/microsoft/kb/Q42466/
---

## Q42466: &quot;RETURN Without GOSUB&quot;; Btrieve BTVRFAR Fails with BASIC

	Article: Q42466
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890227-68 B_BasicCom
	Last Modified: 20-AUG-1990
	
	Btrieve now has a procedure named BTRVFAR, which is intended to allow
	Btrieve to access variables outside of the near heap. This procedure
	is not compatible with BASIC and may cause the error message "RETURN
	without GOSUB" to be displayed, even though no such error exists. In
	some cases, the program may work correctly in the trace mode or even
	in the normal mode after the program has been run once with the trace
	function on.
	
	This information applies to QuickBASIC Versions 4.00, 4.00b, and 4.50,
	Microsoft BASIC Compiler Version 6.00 and 6.00b for MS-DOS and MS
	OS/2, and Microsoft BASIC PDS Version 7.00 for MS-DOS and OS/2. Please
	note that BASIC PDS 7.00 for MS-DOS and has its own ISAM file system,
	making Btrieve, a third-party ISAM support product, unnecessary.
	
	This compatibility problem occurs whether executed from within the
	QB.EXE environment of QuickBASIC, the QBX.EXE environment of the BASIC
	PDS 7.00, or from an executable program compiled with BC.EXE.
	
	The solution to the problem is to use the older Btrieve procedure
	named BTRV. Shown below is the only change necessary for most programs
	using BTRVFAR to convert them to use BTRV.
	
	Code Example
	------------
	
	' This code is incomplete; only the highlights are shown
	OPEN "NULL" FOR RANDOM AS #1 LEN = 40
	FIELD #1 40 AS A$
	OP%=0
	BLK$=SPACES(128)
	BLEN%= 40
	KBUF$ = "FileName"
	KNUM% = 0
	
	FCB% = SADD(A$) - 188
	
	'Use:
	  CALL BTRV( OP%, STAT%, BLK$, FCB%, BLEN%, KBUF$, KNUM%)
	'Instead of:
	'  CALL BTRVFAR(OP%,STAT%,BLK$,SADD(A$),VARSEG(A$),BLEN%,KBUF$,KNUM%);
