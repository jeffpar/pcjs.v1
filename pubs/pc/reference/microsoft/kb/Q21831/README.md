---
layout: page
title: "Q21831: Compatibility of Compiled BASIC with Microsoft Windows"
permalink: /pubs/pc/reference/microsoft/kb/Q21831/
---

## Q21831: Compatibility of Compiled BASIC with Microsoft Windows

	Article: Q21831
	Version(s): 1.00 1.01 1.02 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER |  B_BasicCom
	Last Modified: 21-SEP-1990
	
	This article discusses compatibility between Microsoft Windows and the
	following BASIC products and their compiled programs: QuickBASIC for
	the IBM PC, Microsoft BASIC Compiler versions 6.00 and 6.00b for
	MS-DOS, and Microsoft BASIC Professional Development System (PDS)
	versions 7.00 and 7.10 for MS-DOS and MS OS/2.
	
	Windows 3.00 Compatibility
	--------------------------
	
	If you use Microsoft Windows version 3.00 with the special 386
	enhanced mode, you can run a BASIC program in a text window, which you
	could not do in earlier versions of Windows. In 386 enhanced mode,
	BASIC programs can run as background processes in the text window. In
	earlier Windows releases, you could only run BASIC programs as
	full-screen processes. However, in both Windows 3.00 and in earlier
	versions, you cannot run the QB.EXE or QBX.EXE editor in a window; you
	must instead run QB.EXE or QBX.EXE as a full-screen process.
	
	In Windows 3.00 standard mode (WIN /r) and real mode (WIN /s), you can
	run a compiled program, QB.EXE, or QBX.EXE only as full-screen
	processes, which means that they won't run in the background. You
	cannot press the Windows key combinations CTRL+ESC or ALT+ESC to get
	out of the full-screen BASIC program. Furthermore, other Windows
	processes will be stopped while you run the full-screen process. You
	must terminate the BASIC program to return to Windows.
	
	Windows 1.x, 2.x Compatibility
	------------------------------
	
	Compiled BASIC programs, QB.EXE, and QBX.EXE run only as "bad
	applications" in Microsoft Windows versions 1.x and 2.x. "Bad
	applications" require you to create a PIF (Program Information File)
	using the Windows PIFEDIT.EXE program. When you make a PIF for QB.EXE,
	QBX.EXE, or BASIC compiled programs, you need to specify that the
	program directly modifies the screen, the keyboard, COM1, COM2, and
	memory. QuickBASIC version 4.00, 4.00b, and 4.50 programs have been
	successfully tested under Microsoft Windows 1.x and 2.x.
	
	The QB.PIF or QBX.PIF file provided on the QuickBASIC 4.00, 4.00b, and
	4.50, BASIC compiler 6.00 and 6.00b, or BASIC PDS 7.00 and 7.10
	release disks can be studied in PIFEDIT.EXE as a guideline for making
	your own PIF files for your compiled .EXE programs.
	
	Neither QuickBASIC version 3.00 and its earlier versions nor Microsoft
	BASIC Compiler 5.36 or earlier versions have been tested under
	Microsoft Windows. Therefore, they may or may not run successfully as
	bad applications.
