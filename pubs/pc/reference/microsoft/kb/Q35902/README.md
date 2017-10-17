---
layout: page
title: "Q35902: /FPa; &quot;Symbol Defined More Than Once&quot; Linking BASIC and Pascal"
permalink: /pubs/pc/reference/microsoft/kb/Q35902/
---

## Q35902: /FPa; &quot;Symbol Defined More Than Once&quot; Linking BASIC and Pascal

	Article: Q35902
	Version(s): 6.00 6.00b 7.00 | 6.00 6.00b 7.00
	Operating System: MS-DOS          | OS/2
	Flags: ENDUSER | SR# G880915-3308 buglist6.00 buglist6.00b buglist7.00
	Last Modified: 2-MAR-1990
	
	If you compile Microsoft BASIC and Microsoft Pascal modules with the
	alternate-math library (/FPa) option, a "Symbol Defined More than
	Once" error occurs when you LINK the BASIC and Pascal modules. This
	problem occurs in Microsoft BASIC Compiler Versions 6.00 and 6.00b for
	MS-DOS and MS OS/2, and in Microsoft BASIC Professional Development
	System (PDS) Version 7.00 for MS-DOS and MS OS/2.
	
	Microsoft has confirmed this to be a problem in Microsoft BASIC
	Compiler Versions 6.00 and 6.00b and in Microsoft BASIC PDS Version
	7.00. We are researching this problem and will post new information
	here as it becomes available.
	
	The programs correctly link together if you compile the BASIC program
	with the stand-alone (BC /O) option.
	
	To duplicate the problem, follow the steps below:
	
	1. Compile the BASIC program -- BC prog /Fpa;
	
	2. Compile the Pascal routine -- PL /FPa /C  progr.pas
	
	3. Link the BASIC and Pascal modules -- LINK prog + progr /noe;
	
	4. The linker displays the following error:
	
	      LIBPASA.LIB(fcall.ASM) : error L2025: __fpmath : symbol defined
	      more than once
	      pos: 1339E Record type: 7F04
