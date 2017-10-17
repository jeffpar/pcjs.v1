---
layout: page
title: "Q40190: Same Access Speed for Static, Dynamic Arrays If Debug Is On"
permalink: /pubs/pc/reference/microsoft/kb/Q40190/
---

## Q40190: Same Access Speed for Static, Dynamic Arrays If Debug Is On

	Article: Q40190
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 14-DEC-1989
	
	The code shown below demonstrates that the access time for an array is
	not dependent upon whether the /AH option is used. Furthermore, a
	static array requires the same amount of access time as a dynamic
	array when executed from within QB.EXE or when compiled with the debug
	(BC /d) option. Static-array access is faster than dynamic-array
	access when compiled without the debug (BC /d) compiler switch.
	
	This information applies to QuickBASIC Versions 4.00, 4.00b, and 4.50,
	Microsoft BASIC Compiler Versions 6.00 and 6.00b for MS-DOS and MS
	OS/2, and Microsoft BASIC PDS Version 7.00 for MS-DOS and OS/2.
	
	The following times were required for the sample program below when
	executed under QuickBASIC Version 4.50 using the indicated options on
	an AT compatible running at 10 megahertz with a 6-megahertz 80287
	chip:
	
	   Array Type       QB.EXE      BC.EXE /d      BC.EXE No Debug
	   ----------       ------      ---------      ---------------
	                    With an 80287 coprocessor:
	
	   Huge             23.22       38.05           30.02
	   Static           23.17       38.10           17.96
	   Dynamic          23.24       38.07           30.32
	
	                    Without an 80287 coprocessor:
	
	   Huge             88.65       105.39          97.5
	   Static           88.64       105.40          82.6
	   Dynamic          88.64       105.45          97.49
	
	Earlier versions do not allow huge (larger than 64K) arrays.
	
	The following is sample code:
	
	' $DYNAMIC
	DIM ar0(20000)
	
	' $STATIC
	DIM ar1(2000)
	' $DYNAMIC
	DIM ar2(2000)
	
	s# = TIMER
	FOR j = 1 TO 100000
	   ar0(1) = ar0(1) + ar0(0)
	NEXT
	PRINT TIMER - s#; " seconds elapsed  FOR HUGE"
	
	s# = TIMER
	FOR j = 1 TO 100000
	   ar1(1) = ar1(1) + ar1(0)
	NEXT
	PRINT TIMER - s#; " seconds elapsed FOR STATIC"
	
	s# = TIMER
	FOR j = 1 TO 100000
	   ar2(1) = ar2(1) + ar2(0)
	NEXT
	PRINT TIMER - s#; " seconds elapsed FOR DYNAMIC"
