---
layout: page
title: "Q59936: Linker Error L4047 May Be Benign"
permalink: /pubs/pc/reference/microsoft/kb/Q59936/
---

	Article: Q59936
	Product: Microsoft C
	Version(s): 5.10    | 5.10
	Operating System: MS-DOS  | OS/2
	Flags: ENDUSER |
	Last Modified: 18-APR-1990
	
	The following linker error may be a benign error if it occurs with an
	application that links with the C Version 6.00 start-up code:
	
	   L4047 - Multiple code segments in module of overlayed program
	           incompatible with /CO
	
	This is a new error for LINK Version 5.10 and is to be expected.
	
	If an application is built with the C Version 6.00 run-time library,
	there is a second segment to hold floating-point math routines. This
	segment (EMULATOR_TEXT) does not have any CodeView information in it.
	However, from the linker's perspective, the extra segment MAY be an
	error and it is warning the user of such. In this case, it is a benign
	warning message.
