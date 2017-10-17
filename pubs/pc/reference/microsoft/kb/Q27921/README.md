---
layout: page
title: "Q27921: BASIC 6.00 &amp; 7.00 Can't Make Family API (Bound) Applications"
permalink: /pubs/pc/reference/microsoft/kb/Q27921/
---

## Q27921: BASIC 6.00 &amp; 7.00 Can't Make Family API (Bound) Applications

	Article: Q27921
	Version(s): 6.00 6.00b 7.00 | 6.00 6.00b 7.00
	Operating System: MS-DOS          | OS/2
	Flags: ENDUSER |
	Last Modified: 22-JAN-1990
	
	Microsoft BASIC Compiler Versions 6.00 and 6.00b and Microsoft BASIC
	Professional Development System (PDS) Version 7.00 for MS OS/2 cannot
	create "bound" applications (Family API applications). (A given bound
	EXE application can run under OS/2 protected mode, OS/2 real mode,
	and/or MS-DOS.) The compiler can only create EXE files that run under
	either OS/2 protected mode or real mode but not both. ("Real mode"
	includes both the DOS 3.x-compatibility box in OS/2, and straight
	MS-DOS.)
	
	To have the functionality of BASIC, the BASIC run-time module contains
	routines that are outside OS/2's Family API (Applications Programming
	Interface).
