---
layout: page
title: "Q48687: Invoking M or MEP with the /D Switch Prevents Initialization"
permalink: /pubs/pc/reference/microsoft/kb/Q48687/
---

## Q48687: Invoking M or MEP with the /D Switch Prevents Initialization

	Article: Q48687
	Version(s): 1.00 1.02 | 1.00 1.02
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | reinitialize
	Last Modified: 26-SEP-1989
	
	Invoking the Microsoft M editor with the /D switch to prevent it from
	initializing from the TOOLS.INI file also prevents the Initialization
	function (SHIFT+F8) from reading the TOOLS.INI file.
	
	There is currently no workaround for this designed limitation other
	than to exit the editor and re-invoke M without using the /D switch.
