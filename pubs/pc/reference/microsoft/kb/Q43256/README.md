---
layout: page
title: "Q43256: CALL INTERRUPT RegType in Manual Inconsistent with QB.BI File"
permalink: /pubs/pc/reference/microsoft/kb/Q43256/
---

## Q43256: CALL INTERRUPT RegType in Manual Inconsistent with QB.BI File

	Article: Q43256
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890406-35 docerr B_BasicCom
	Last Modified: 14-DEC-1989
	
	In the following manuals, the RegType (user-defined TYPE) documented
	with the CALL INTERRUPT statement is inconsistent with the TYPE in
	QB.BI, the $INCLUDE file:
	
	1. Page 90 of the "Microsoft QuickBASIC 4.0: BASIC Language Reference"
	   for QuickBASIC Versions 4.00 and 4.00b for MS-DOS and for
	   Microsoft BASIC Compiler Versions 6.00 and 6.00b for MS-DOS and MS
	   OS/2
	
	2. Page 74 of the "Microsoft QuickBASIC 4.5: BASIC Language
	   Reference," which is available for separate purchase after you buy
	   QuickBASIC Version 4.50
	
	To correct the inconsistency, remove the following two statements from
	the RegType in the manual:
	
	   DS AS INTEGER
	   ES AS INTEGER
	
	The RegType shown in the manual is actually the RegTypeX in the QB.BI
	$INCLUDE file.
	
	This documentation error has been corrected in Microsoft BASIC PDS
	Version 7.00 for MS-DOS and MS OS/2. The TYPE descriptions in the
	"Microsoft BASIC 7.0: Language Reference" for RegType and RegTypeX on
	Pages 172-173 agree with the TYPE declarations in the QBX.BI $INCLUDE
	file supplied with BASIC PDS 7.00.
	
	The RegType defined in the QB.BI file (used with $INCLUDE) does not
	contain the DS and ES registers. The DS and ES registers are only
	needed for the CALL INTERRUPTX statement, which uses RegTypeX.
