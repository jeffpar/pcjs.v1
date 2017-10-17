---
layout: page
title: "Q42591: &quot;SYS2090&quot; Error Using SETUP, LINK, or LIB with BASIC Compiler"
permalink: /pubs/pc/reference/microsoft/kb/Q42591/
---

## Q42591: &quot;SYS2090&quot; Error Using SETUP, LINK, or LIB with BASIC Compiler

	Article: Q42591
	Version(s): 6.00 6.00b 7.00 | 6.00 6.00b 7.00
	Operating System: MS-DOS          | OS/2
	Flags: ENDUSER |
	Last Modified: 1-FEB-1990
	
	You can receive the error, "SYS2090: Unable to load User Program" when
	trying to run the SETUP.EXE, LINK.EXE, or LIB.EXE program (from
	Microsoft BASIC Compiler Versions 6.00 or 6.00b and Microsoft BASIC
	Professional Development System (PDS) Version 7.00 for MS-DOS and MS
	OS/2) in either the protected or real modes of Microsoft OS/2.
	
	This Microsoft OS/2 error typically occurs when trying to run a bound
	application that is not configured correctly in the real (MS-DOS)
	environment. Because bound applications can run under both real or
	protected mode, these applications are very sensitive to their
	environment.
	
	The following are some possible reasons for this error in real mode:
	
	1. A corrupted or zero-length .EXE file.
	
	2. When running under the standard MS-DOS environment, you may be
	   using MS-DOS Versions 2.x. Running a bound application under MS-DOS
	   2.x requires that the bound programs be placed in the current
	   subdirectory. Using MS-DOS Versions 3.x will also correct the
	   problem.
	
	3. Problems with the specific BIOS, possibly corrected by upgrading
	   the ROM version.
	
	4. Interference by terminate-and-stay-resident (TSR) programs and some
	   unpatched versions of Novell netware has been observed to cause
	   SYS2090 errors. Novell users should contact their dealers to obtain
	   patched versions of the netware that emulate MS-DOS 3.x correctly by
	   preserving the SS and SP registers when spawning processes. Novell
	   netware Version 2.0A++, and Versions 2.10 and later are patched
	   properly, according to Novell.)
