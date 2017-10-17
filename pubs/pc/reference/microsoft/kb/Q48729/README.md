---
layout: page
title: "Q48729: Absolute Coordinate of Top Left Corner for _settextwindow"
permalink: /pubs/pc/reference/microsoft/kb/Q48729/
---

## Q48729: Absolute Coordinate of Top Left Corner for _settextwindow

	Article: Q48729
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER | S_C S_QuickASM 2.01
	Last Modified: 10-OCT-1989
	
	The absolute coordinate of the top left corner for _settextwindow() is
	(1,1) and NOT (0,0).
	
	Attempting to _settextwindow() with the top left corner as (0,0) and
	using _settextposition() along with _outtext() causes the program to
	function abnormally. The text is either placed in an incorrect area or
	the machine hangs. The top and left absolute address is (1,1). This is
	not documented in the "Microsoft QuickC Run-Time Library Reference" or
	the on-line help. However, it is documented in the "Microsoft QuickC
	Graphics Library Reference" in Section 2.2 on Pages 42 and 43.
