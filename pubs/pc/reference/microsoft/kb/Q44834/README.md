---
layout: page
title: "Q44834: Software/Hardware Required for Writing Windows Applications"
permalink: /pubs/pc/reference/microsoft/kb/Q44834/
---

## Q44834: Software/Hardware Required for Writing Windows Applications

	Article: Q44834
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | S_QuickC P_WinSDK
	Last Modified: 26-MAY-1989
	
	To write programs for Windows, you need the following software
	packages:
	
	1. Microsoft Windows/286 or Windows/386 Version 2.00 or later.
	
	2. Microsoft Windows Software Development Kit (SDK) Version 2.00 or
	   later.
	
	   Note: The version number for the Windows package must match
	   the version number for the SDK, e.g. Windows 2.0x with SDK 2.00
	   or Windows 2.1x with SDK 2.10.
	
	3. Microsoft C Compiler Version 4.00 or later, Microsoft QuickC
	   Version 2.00, or another compiler suitable for compiling Windows
	   programs.
	
	4. Microsoft Macro Assembler 4.00 or later (for writing DLLs).
	
	To run Windows and the Windows Software Development Kit, you need the
	following hardware:
	
	1. An IBM personal computer (or compatible) with a fixed disk and
	   640K of memory running MS-DOS Version 3.00 or later. (A machine
	   based on an 80286 or 80386 microprocessor with a fast fixed disk is
	   best.)
	
	2. A graphics display and video board, preferably an Enhanced Graphics
	   Adapter (EGA) or Video Graphics Array (VGA). A Color Graphics
	   Adapter (CGA), Hercules Graphics Card or compatible, or an IBM 8514
	   can also be used.
	
	3. A mouse (optional).
	
	To debug with CodeView (CVW) you need the following:
	
	1. 1.5 MB of LIM 4.00 expanded memory (2 MB or more is recommended).
	
	2. Either dual monitors (the second of which is monochrome, the first
	   a CGA, EGA, or VGA) or a dumb terminal connected to COM1.
	
	   Note: In a dual-monitor setup, when the primary monitor is a CGA,
	   the Windows on the CGA is in monochrome due to resolution and the
	   monochrome monitor is in text.
	
	Windows/286 can run under DOS or in the DOS compatibility box under
	OS/2 on an 80286 or 80386. Windows/386 requires an 80386 where it can
	run under DOS but not in the DOS compatibility box. Typing "WIN86"
	(without the quotation marks) at the DOS prompt (or DOS box) initiates
	a 80286 (not a 80386) session.
