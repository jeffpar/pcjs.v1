---
layout: page
title: "Q36725: Warning C4040 near/far/huge on 'identifier' Ignored"
permalink: /pubs/pc/reference/microsoft/kb/Q36725/
---

	Article: Q36725
	Product: Microsoft C
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | s_quickc s_error
	Last Modified: 14-NOV-1988
	
	This information is from section D.1.3 (Page 340) of the "Microsoft
	QuickC Programmer's Guide and section E.3.3 (Page 269) of the
	"Microsoft C Optimizing Compiler User's Guide" for Versions 5.00 and
	5.10.
	
	This message indicates potential problems but does not hinder
	compilation and linking. The number in parentheses at the end of a
	warning-message description gives the minimum warning level that must
	be set for the message to appear.
	
	The following is the warning:
	
	C4040       near/far/huge on 'identifier' ignored
	
	            The 'near' or 'far' keyword has no effect in the
	            declaration of the given identifier and is ignored.
	
	You cannot declare an array to be huge if it is declared within a
	function because this array will reside on the stack that is limited
	to the default data segment. You can move the declaration of the array
	with the huge keyword outside of all functions, use the "static" or
	"extern" keywords to move the array into a far data segment, or use a
	huge or far pointer.
	
	QuickC Versions 1.00 and 1.01 do not support the huge keyword or the
	huge-memory model.
