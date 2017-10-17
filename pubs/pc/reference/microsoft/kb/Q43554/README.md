---
layout: page
title: "Q43554: _outtext() Expects an Unsigned Character Pointer as Parameter"
permalink: /pubs/pc/reference/microsoft/kb/Q43554/
---

## Q43554: _outtext() Expects an Unsigned Character Pointer as Parameter

	Article: Q43554
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER | docerr outtext
	Last Modified: 2-MAY-1989
	
	Page 449 of the "Microsoft QuickC Version 2.00 Run-Time Library
	Reference" manual incorrectly states that the _outtext() function
	expects a "char far *" as the parameter.
	
	The _outtext() function in Microsoft QuickC Version 2.00 actually
	expects an "unsigned char far *" as the parameter. The correct
	information is available in the on-line help and the include file
	GRAPH.H.
	
	This is a change between QuickC Version 2.00 and those versions
	earlier than 2.00. Earlier versions did expect a "char far *" as the
	parameter for the _outtext() function.
