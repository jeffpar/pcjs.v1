---
layout: page
title: "Q43487: QuickC: Cannot Watch Variable with Dollar Sign (&#36;) in Debugger"
permalink: /pubs/pc/reference/microsoft/kb/Q43487/
---

	Article: Q43487
	Product: Microsoft C
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER | buglist2.00
	Last Modified: 2-MAY-1989
	
	Using the QuickC Version 2.00 debugger to watch a variable name
	containing a dollar sign will not work. The variable name will be
	displayed in the watch window, but the value will be displayed as
	"<syntax error>". There is no way to display such a variable in the
	watch window.
	
	Using the dollar sign in variable names is not ANSI C standard. If
	symbol names must have a dollar sign in them, the QuickC 2.00 debugger
	cannot be used to watch them. However, CodeView will display such
	variables.
	
	Microsoft is researching this problem and will post new information as
	it becomes available.
