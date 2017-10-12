---
layout: page
title: "Q38375: Thirty-Two-Bit Register Not Visible under OS/2"
permalink: /pubs/pc/reference/microsoft/kb/Q38375/
---

	Article: Q38375
	Product: Microsoft C
	Version(s): 2.20
	Operating System: OS/2
	Flags: ENDUSER |
	Last Modified: 23-NOV-1988
	
	Thirty-two-bit registers are not viewable (using F2) under CVP even if
	you have an 80386-based machine. This is not a problem with CodeView;
	it is a limitation.
	
	Real mode CodeView (CV) DOES support viewing 32-bit registers. This
	is because of the unprotected and generally more flexible nature of
	DOS. Using the full 32-bits of the 80386 under OS/2 is considered
	hazard-prone and is not supported by CVP.
