---
layout: page
title: "Q41674: QuickC 2.00 README.DOC: QCL Command-Line Options for OS/2"
permalink: /pubs/pc/reference/microsoft/kb/Q41674/
---

	Article: Q41674
	Product: Microsoft C
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 28-FEB-1989
	
	The following information is taken from the QuickC Version 2.00
	README.DOC file, part 4, "Notes for Windows and OS/2 Programmers."
	
	Page    1   QCL Command Options
	
	QCL supports several command options for compatibility with OS/2.
	These options may not work correctly if you have not installed OS/2
	or the Microsoft C Optimizing Compiler, Version 5.1 or later:
	
	The /Fb Option
	
	If you have installed the C Optimizing Compiler, you can use the /Fb
	option to create bound applications. See Section 4.3.8 of the
	"Microsoft QuickC Tool Kit" or your Microsoft C Optimizing Compiler
	documentation for details.
	
	If the Optimizing C Compiler is not installed, using /Fb causes QCL
	to prompt you to insert BIND.EXE into drive A. BIND.EXE is not
	shipped with QuickC.
	
	The /Lp Option
	
	The /Lp option links programs for OS/2 protected mode. If you have
	installed the C Optimizing Compiler, you can use /Lp to create
	protected mode applications. See Section 4.3.21 of the "Microsoft
	QuickC Tool Kit" or your Microsoft C Optimizing Compiler
	documentation for details. Note that you should not use the standard
	QuickC linker. Instead, use the alternate Windows-compatible linker
	mentioned at the beginning of Part 4 of README.DOC or use the linker
	from the Optimizing Compiler.
	
	If you do not have the C Optimizing Compiler, QCL accepts the /Lp
	option without error. At link time, however, QCL fails because it
	cannot find the OS/2 protected mode library.
	
	The /Zr Option
	
	If you own the Microsoft C Optimizing Compiler, Version 5.1, and
	you're writing OS/2 Protected Mode applications, do not use the
	QuickC /Zr option.
