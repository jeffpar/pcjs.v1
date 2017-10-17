---
layout: page
title: "Q42323: &quot;Symbol Defined More Than Once&quot; Linking to QuickC 2.00 Routine"
permalink: /pubs/pc/reference/microsoft/kb/Q42323/
---

## Q42323: &quot;Symbol Defined More Than Once&quot; Linking to QuickC 2.00 Routine

	Article: Q42323
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom S_QuickC S_C
	Last Modified: 19-OCT-1990
	
	Calling C routines compiled with Microsoft QuickC Compiler version
	2.00 works correctly only from BASIC routines compiled with Microsoft
	QuickBASIC version 4.50 or Microsoft BASIC PDS version 7.00. Using
	versions of QuickBASIC earlier than 4.50 or using BASIC compiler 6.00
	or 6.00b results in numerous LINK errors of "Symbol Defined More Than
	Once" (L2025).
	
	If the QuickC library includes the C Graphics or Pgchart library
	routines, then QuickBASIC version 4.50 calling programs must be
	compiled without the /O option (using the BRUN45 library instead of
	BCOM45); otherwise, you will get many "Symbol Defined More Than Once"
	errors at link time.
	
	The presence of the Graphics or Pgchart libraries does not affect
	LINKing with Microsoft BASIC PDS 7.00.
	
	QuickBASIC versions 4.00 and 4.00b and Microsoft BASIC Compiler
	versions 6.00 and 6.00b require QuickC version 1.00 or 1.10.
	
	QuickBASIC version 4.50 requires QuickC version 2.00.
	
	For more information about linked Microsoft QuickBASIC or compiled
	BASIC with Microsoft C, search in this Knowledge Base using the
	following word:
	
	   BAS2C
