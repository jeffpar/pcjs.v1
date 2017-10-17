---
layout: page
title: "Q59289: BASIC 7.00 ISAM Cannot Store Single-Precision Numbers"
permalink: /pubs/pc/reference/microsoft/kb/Q59289/
---

## Q59289: BASIC 7.00 ISAM Cannot Store Single-Precision Numbers

	Article: Q59289
	Version(s): 7.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 2-MAR-1990
	
	When using the ISAM file-handling feature of Microsoft BASIC
	Professional Development System (PDS) Version 7.00 for MS-DOS, you
	cannot use a single-precision variable in the TYPE ... END TYPE record
	structure. To store real numbers (numbers with a decimal point), you
	must use a CURRENCY or a double-precision variable. (You may also use
	an INTEGER and a LONG integer if you do not need a number with a
	decimal point.)
	
	This is not a software problem, but is a design limitation of BASIC
	PDS 7.00.
	
	For more information on this topic, see Pages 333-334 of the
	"Microsoft BASIC 7.0: Programmer's Guide."
