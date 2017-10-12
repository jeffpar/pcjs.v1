---
layout: page
title: "Q50644: Adding helpwindow in TOOLS.INI as a Switch"
permalink: /pubs/pc/reference/microsoft/kb/Q50644/
---

	Article: Q50644
	Product: Microsoft C
	Version(s): 1.02   | 1.02
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 30-NOV-1989
	
	To get the Microsoft Editor (M) to recognize helpwindow as a switch in
	the TOOLS.INI file, the switch must be under the [M-MHELP] or
	[MEP-MHELP] tag section. The example below shows what a TOOLS.INI file
	might look like:
	
	   [M-MHELP MEP-MHELP]
	   nohelpwindow:
	
	   [M MEP]
	     .
	     .
	
	The helpwindow switch can also be set in the environment by typing the
	following:
	
	   <arg> nohelpwindow: <assign>
