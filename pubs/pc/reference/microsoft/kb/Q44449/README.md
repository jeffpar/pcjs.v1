---
layout: page
title: "Q44449: QuickC 2.00 Debugger Does Not Support Huge Pointers/Model"
permalink: /pubs/pc/reference/microsoft/kb/Q44449/
---

	Article: Q44449
	Product: Microsoft C
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 18-MAY-1989
	
	The QuickC Version 2.00 debugger does not support the huge-memory
	model. It does not supply any information regarding huge pointers,
	even if the specified model is large, not huge.
	
	The debugger allows a watch to be placed on the pointer, but instead
	of supplying useful values, the following message appears in the debug
	window as soon as the variable is declared:
	
	   image: <Debugger does not support huge model>
	
	This is intentional program design for the product.
