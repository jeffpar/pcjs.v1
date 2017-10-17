---
layout: page
title: "Q59761: &quot;Permission Denied&quot; with &gt; 20 LOCKs with SHARE Loaded"
permalink: /pubs/pc/reference/microsoft/kb/Q59761/
---

## Q59761: &quot;Permission Denied&quot; with &gt; 20 LOCKs with SHARE Loaded

	Article: Q59761
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900221-77 B_GWBasicI B_BasicCom
	Last Modified: 26-MAR-1990
	
	With the DOS SHARE utility loaded, the error message, "Permission
	Denied" occurs when a program attempts to LOCK more than the available
	number of LOCKs. The number of LOCKs is specified with the /L:n option
	for the SHARE command. The default number of LOCKs is 20.
	
	This information applies to Microsoft GW-BASIC Versions 3.23, 3.22,
	and 3.20, to Microsoft QuickBASIC Versions 4.00, 4.00b, and 4.50, to
	Microsoft BASIC Compiler Versions 6.00 and 6.00b, and to Microsoft
	BASIC Professional Development System (PDS) Version 7.00 for MS-DOS.
	
	Without SHARE loaded, GW-BASIC gives "Permission Denied" on the first
	LOCK statement. With QuickBASIC and the BASIC compilers (listed
	above), 3120 LOCKs can be performed without SHARE loaded before the
	"Permission Denied" error occurs.
	
	For more information about the SHARE statement, please see the MS-DOS
	reference manual.
	
	Code Example
	------------
	
	The following code example tests the number of LOCKs available on a
	system:
	
	   10  ON ERROR GOTO 100
	   20  REM Note: File does not need to exist before run to LOCK records.
	   30  OPEN "xxxx.xxx" FOR RANDOM AS #1
	   40  FOR i%=1 TO 32767
	   50    LOCK #1,i%
	   60  NEXT
	   70  PRINT "More than 32767 LOCKs available!"
	   80  END
	   100 PRINT "Permission Denied (";ERR;")"
	   110 PRINT "Number of locks = ";i%-1
	   120 END
