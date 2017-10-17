---
layout: page
title: "Q66287: What _getvideoconfig() Returns for Non-Standard Adapters"
permalink: /pubs/pc/reference/microsoft/kb/Q66287/
---

## Q66287: What _getvideoconfig() Returns for Non-Standard Adapters

	Article: Q66287
	Version(s): 6.00
	Operating System: MS-DOS
	Flags: ENDUSER | s_quickc s_quickasm 2.50 2.51
	Last Modified: 24-OCT-1990
	
	The _getvideoconfig() run-time library function returns, among other
	things, the type of the current display adapter. The possible return
	values are documented. However, what if the adapter does not match any
	of the cards represented by the nine manifest constants defined in
	graph.h?
	
	When the adapter is recognized as a "superset" of an adapter that is
	supported, the value of the supported adapter is returned. For
	example, if the adapter is a Super VGA card, the value _VGA is
	returned.
	
	When the active adapter is completely unrecognized, the
	_getvideoconfig() function returns the least common denominator. If
	the adapter supports color, _CGA is returned; otherwise the return
	value is set to _MDPA.
	
	A good programming strategy to reduce device dependencies is to use
	_MAXRESMODE or _MAXCOLORMODE when calling _setvideomode, and using
	_getvideoconfig to determine what mode was actually set. There is more
	information on these topics in the Microsoft Advisor online help
	system, which comes with your C compiler package.
