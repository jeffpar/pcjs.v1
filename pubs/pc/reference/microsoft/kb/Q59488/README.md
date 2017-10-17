---
layout: page
title: "Q59488: Don't Use OPTION BASE 1 in UI Toolbox: &quot;Illegal Function Call&quot;"
permalink: /pubs/pc/reference/microsoft/kb/Q59488/
---

## Q59488: Don't Use OPTION BASE 1 in UI Toolbox: &quot;Illegal Function Call&quot;

	Article: Q59488
	Version(s): 7.00
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900228-24
	Last Modified: 12-MAR-1990
	
	When writing programs that utilize the User Interface (UI) Toolbox
	routines, it is not advisable to use the OPTION BASE 1 statement. This
	can create run-time errors, such as "Illegal function call," because
	the UI Toolbox uses index "zero" in arrays that must be in COMMON
	SHARED between your modules.
	
	This information applies to Microsoft BASIC Professional Development
	System (PDS) Version 7.00 for MS-DOS.
