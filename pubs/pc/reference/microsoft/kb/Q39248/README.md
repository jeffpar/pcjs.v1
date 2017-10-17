---
layout: page
title: "Q39248: QB.EXE 4.x Doesn't Save Screen Settings on Hercules Adapter"
permalink: /pubs/pc/reference/microsoft/kb/Q39248/
---

## Q39248: QB.EXE 4.x Doesn't Save Screen Settings on Hercules Adapter

	Article: Q39248
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist4.00b buglist4.50 B_BasicCom SR# S881129-
	Last Modified: 9-MAR-1990
	
	Changes made to the QB.EXE Versions 4.00, 4.00b, or 4.50 environment
	are not saved if a Hercules or compatible adapter is used. After
	changing the editor color options and exiting the environment,
	QuickBASIC always restarts with the default-color attributes. The
	QB.INI file is not correctly updated. Display attributes must be
	reselected every time QuickBASIC is started.
	
	Microsoft has confirmed this to be a problem in Microsoft QuickBASIC
	Versions 4.00, 4.00b, and 4.50, and in the QB.EXE environment that
	comes with Microsoft BASIC Compiler Versions 6.00 and 6.00b for MS-DOS
	(buglist6.00, buglist6.00b). This problem was corrected in the QBX.EXE
	(QuickBASIC Extended) environment that comes with Microsoft BASIC
	Professional Development System (PDS) Version 7.00 (fixlist7.00).
