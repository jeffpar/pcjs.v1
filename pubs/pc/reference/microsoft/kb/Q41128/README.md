---
layout: page
title: "Q41128: Meaning Of "ILINK: ERROR: Invalid Flag Z""
permalink: /pubs/pc/reference/microsoft/kb/Q41128/
---

	Article: Q41128
	Product: Microsoft C
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 28-FEB-1989
	
	Summary
	
	If the QuickC environment is configured for incremental linking and
	for CodeView information, the error below occurs if the incorrect
	version of the Microsoft Incremental Linker is found along the search
	path. The message flashes quickly in the upper left-hand corner of the
	screen, then disappears. To determine the exact message text, it may
	be necessary to reproduce the error a few times, or use SHIFT+PRTSCRN
	to capture the error message. The error is as follows:
	
	   Microsoft (R) Incremental Linker Version 1.00
	   Copyright (C) Microsoft Corp 1988.  All Rights Reserved.
	
	   ILINK:ERROR: invalid flag Z
	
	The correct version of the Microsoft Incremental Linker is 1.10 for
	QuickC Version 2.00; if the path is reconfigured to place the QuickC
	linker before the older linker (probably from C Version 5.10 or MASM
	Version 5.10), the error will not occur.
	
	The problem lies in the fact that the older Incremental Linker does
	not recognize the CodeView information switch.
