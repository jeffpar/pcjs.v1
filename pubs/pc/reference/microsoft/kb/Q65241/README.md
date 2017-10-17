---
layout: page
title: "Q65241: CV Limits Input of Period Character (2Eh) into Memory Window"
permalink: /pubs/pc/reference/microsoft/kb/Q65241/
---

## Q65241: CV Limits Input of Period Character (2Eh) into Memory Window

	Article: Q65241
	Version(s): 3.00 3.10 | 3.00 3.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | buglist3.00 buglist3.10 decimal point dot
	Last Modified: 31-AUG-1990
	
	When viewing memory in byte format in a memory window in CodeView
	version 3.00 or 3.10, you cannot change the value of a byte in memory
	to the hexadecimal value 2E. The hex value 2E has an ASCII character
	equivalent of the period ("."). In CodeView, a period is used to
	display any nondisplayable character (for example, null, a carriage
	return, control characters, etc.), which means the period character
	can sometimes have special meaning to CodeView when it appears in a
	memory window.
	
	Because of the special usage of the period character in a memory
	window, CodeView does not allow periods to be typed directly into
	memory. In CodeView 3.00, attempts to change a byte value to 2E
	results in either the 2 or the E being entered and the other digit
	being ignored, depending on which value you enter first. In CodeView
	3.10, both the 2 and the E are returned to their original values once
	they have both been entered. If you move to the right side of the
	memory window where the ASCII equivalents are shown and you try to
	type in a period there, CodeView will also ignore that input.
	
	If you switch the memory window so that you are viewing memory in
	ASCII mode, actual periods can be typed in to any memory location.
	However, there is a problem with this because ALL other periods on the
	same line, which really represent various nondisplayable ASCII
	characters, are all converted to 2Es.
	
	If you use are viewing memory in a format other than bytes or ASCII,
	CodeView will allow a 2E to be entered. The workaround, then, if a
	period needs to be entered into memory, is to choose a different
	viewing mode other than ASCII or byte-mode, and then enter the period
	in the desired location as the value 2E. You can cycle through the
	available memory viewing modes by repeatedly pressing SHIFT+F3, or you
	can select the desired mode from the Memory Window option on the
	Options menu.
	
	Microsoft has confirmed this to be a problem in CodeView versions 3.00
	and 3.10. We are researching this problem and will post new
	information here as it becomes available.
