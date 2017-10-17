---
layout: page
title: "Q64163: /Zp Default Values with and without Specifying the Switch"
permalink: /pubs/pc/reference/microsoft/kb/Q64163/
---

## Q64163: /Zp Default Values with and without Specifying the Switch

	Article: Q64163
	Version(s): 5.10 6.00 | 5.10 6.00
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER |
	Last Modified: 31-AUG-1990
	
	When specifying the /Zp switch with either version 5.10 or 6.00 of the
	Microsoft C Optimizing Compiler, it should be observed that the
	default functionality when using the /Zp switch without a numeric
	argument is equivalent to /Zp1 (that is, structure members will be
	packed on one-byte boundaries).
	
	Additionally, if the /Zp switch is not specified, the structure
	members will be packed on two-byte boundaries (that is, the equivalent
	of using /Zp2).
