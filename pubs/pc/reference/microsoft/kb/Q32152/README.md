---
layout: page
title: "Q32152: Corrections for LOCATE Statement"
permalink: /pubs/pc/reference/microsoft/kb/Q32152/
---

## Q32152: Corrections for LOCATE Statement

	Article: Q32152
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | docerr B_BasicCom ptm336
	Last Modified: 20-DEC-1989
	
	Corrections 1 and 2 below apply to the LOCATE statement on Page 255 of
	the following manuals:
	
	   "Microsoft QuickBASIC 4.00: BASIC Language Reference"
	
	   "Microsoft BASIC Compiler Version 6.00 for MS-DOS and OS/2: BASIC
	   Language Reference"
	
	1. The manuals incorrectly claim that any argument of the LOCATE
	   statement can be omitted. For example, "Illegal function call"
	   results if the "stop" parameter is specified while "start" is
	   defaulted with a comma, as demonstrated in the example below.
	
	2. The following incorrect sentence on Page 256 should be deleted:
	
	      "When 'start' is less than 'stop', LOCATE produces a two-part
	       cursor."
	   This sentence should be replaced with the following:
	
	      "When 'stop' is less than 'start', LOCATE produces a two-part
	       cursor."
	
	Note that Page 110 of the "Programming in BASIC: Selected Topics"
	manual correctly states that a "start" larger than "stop" makes LOCATE
	produce a split cursor. Helpful examples also are shown.
	
	The following is an example:
	
	CLS
	print "display the split cursor"
	locate ,,1,6,2
	print "the next line will result in an Illegal Function call error message"
	locate ,,1,,4
	print "end of the test"
