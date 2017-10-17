---
layout: page
title: "Q66782: Fastcalls (/Gr) Incompatible with Disabled MS Extensions (/Za)"
permalink: /pubs/pc/reference/microsoft/kb/Q66782/
---

## Q66782: Fastcalls (/Gr) Incompatible with Disabled MS Extensions (/Za)

	Article: Q66782
	Version(s): 6.00 6.00a | 6.00 6.00a
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist6.00 buglist6.00a _fastcall
	Last Modified: 15-NOV-1990
	
	The Microsoft C versions 6.00 and C 6.00a compiler options /Za and /Gr
	are not currently compatible. /Gr enables the register calling
	convention for passing function parameters in registers, and /Za
	disables Microsoft-specific extensions to the C language. In C 6.00
	and C 6.00a, the register calling convention relies on Microsoft
	extensions being enabled (/Ze).
	
	If you try to specify both /Gr and /Za, the compiler will halt with
	the following error:
	
	   Command line error D2020 : -Gr option requires extended
	   keywords to be enabled (-Ze)
	
	Removal of this limitation is being considered for a future release of
	the C compiler.
	
	Microsoft has confirmed this to be a problem in C versions 6.00 and
	6.00a. We are researching this problem and will post new information
	here as it becomes available.
