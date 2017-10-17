---
layout: page
title: "Q69045: PRINT TAB Blanks Out Passed-Over Characters in BASIC"
permalink: /pubs/pc/reference/microsoft/kb/Q69045/
---

## Q69045: PRINT TAB Blanks Out Passed-Over Characters in BASIC

	Article: Q69045
	Version(s): 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S910117-30 B_BasicCom B_GWBasicI
	Last Modified: 6-FEB-1991
	
	BASIC's TAB() function will blank out any characters that are being
	passed over on the screen. This feature is by design.
	
	This information applies to Microsoft GW-BASIC versions 3.20, 3.22,
	and 3.23; to Microsoft QuickBASIC versions 2.00, 2.01, 3.00, 4.00,
	4.00b, and 4.50; to Microsoft BASIC Compiler 6.00 and 6.00b; and to
	Microsoft BASIC Professional Development System (PDS) versions 7.00
	and 7.10 for MS-DOS.
	
	Consider the following code:
	
	      CLS
	      PRINT "1234567890"
	      PRINT "abcdefghij"
	      LOCATE 2,1
	      PRINT TAB(4); "DEF"
	
	This program prints the following on the screen:
	
	      1234567890
	         DEFghij
	
	The letters "abc", which TAB passed over, have been overwritten with
	blanks.
	
	An exception to this behavior is if you trace (F8) in the QB.EXE
	editor of QuickBASIC 4.00, 4.00b, or 4.50, or QBX.EXE of BASIC PDS
	7.00 or 7.10, where TAB does not erase passed-over text:
	
	      1234567890
	      abcDEFghij
