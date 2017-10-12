---
layout: page
title: "Q46448: Capabilities and Limits of the /R switch on 80386 Machines"
permalink: /pubs/pc/reference/microsoft/kb/Q46448/
---

	Article: Q46448
	Product: Microsoft C
	Version(s): 2.20 2.30 2.35 3.00 | 2.20 2.30 2.35 3.00
	Operating System: MS-DOS              | OS/2
	Flags: ENDUSER | 386
	Last Modified: 12-APR-1990
	
	The /R command line switch for CodeView beginning with Version 2.20 is
	used only on 80386 machines. The /R switch tells CodeView to use the
	four debug registers available on the 80386 chip, and also allows
	hardware breakpoints. This causes CodeView to run faster when
	performing debugger-intensive steps such as monitoring a tracepoint.
	
	The /R switch works under DOS and OS/2's DOS compatibility box. It is
	an unrecognized switch under OS/2. The /R switch speeds operation of
	Tracepoint but not Watchpoint or Breakpoint commands.
	
	Note: because there are only four debug registers, only four
	tracepoints (of up to 4 bytes each) may be specified when utilizing
	these registers. Specifying any combination of tracepoints greater
	than 16 bytes will require CodeView to use software tracepoints rather
	than the debug registers and all performance gains will be lost.
