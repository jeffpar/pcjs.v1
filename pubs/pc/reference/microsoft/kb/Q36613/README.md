---
layout: page
title: "Q36613: 43- and 50-Line Modes"
permalink: /pubs/pc/reference/microsoft/kb/Q36613/
---

	Article: Q36613
	Product: Microsoft C
	Version(s): 1.00   | 1.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 20-OCT-1988
	
	The M editor can make use of the 43-line EGA text mode and 50-line VGA
	text mode. The "height" numeric switch in the TOOLS.INI file specifies
	the number of lines used in the editing window; however, this number
	does NOT include the dialog and status display lines. Thus, to use 43
	lines of text you must set height=41; to use 50 lines you must set
	height=48.
