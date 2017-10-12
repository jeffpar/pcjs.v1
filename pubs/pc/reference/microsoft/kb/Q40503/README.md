---
layout: page
title: "Q40503: Explanation of Linkers Shipped with QuickC Version 2.00"
permalink: /pubs/pc/reference/microsoft/kb/Q40503/
---

	Article: Q40503
	Product: Microsoft C
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 28-FEB-1989
	
	There are three linkers shipped in the QuickC Version 2.00 package.
	The following information explains their abilities and their intended
	uses.
	
	Distribution
	
	Disk 2
	
	1. link.exe "Microsoft Segmented Executable Linker Version 5.02"
	
	This linker is designed for Windows and OS/2 development. Unless you
	are developing for these platforms, you should avoid this linker. It
	can be used on both the DOS and OS/2 operating systems. If you are
	programming for Windows with the SDK, then you should use this
	linker in lieu of LINK4.EXE which is shipped with the Windows SDK
	package.
	
	Disk 3
	
	1. link.exe "Microsoft QuickC Linker Version 4.06"
	
	This linker is designed for the majority of QuickC programs. It is an
	overlay linker and as such is restricted to DOS. This linker
	understands object modules produced by other products such as
	Microsoft C Versions 5.10 and 5.00, Microsoft FORTRAN Versions 4.10
	and 4.01, Microsoft Pascal, and the Microsoft Assembler.
	
	2. ilink.exe "Microsoft Incremental Linker Version 1.10"
	
	This is the incremental linker that links only those object modules
	that require re-linking due to code changes within them.
	
	The ilink linker is not designed to replace Link4.exe, which is
	shipped with the Windows SDK. If you are programming for Windows, you
	must use the linker 5.02, which is discussed above.
	
	The "QuickC Linker" Version 4.06 should be used unless you
	specifically require the Segmented Executable linker for Windows or
	protected-mode applications.
	
	If you are in doubt as to which linker to use, copy "link.exe" from
	Disk 3 into your \QC2\BIN directory (or wherever you have set up your
	QuickC executable files). You also should copy "ilink.exe" to this
	directory.
	
	To ensure that you have the appropriate linker, go to the directory
	where you plan to run QuickC and type "link" at the DOS command line.
	You should see the following on your screen:
	
	   Microsoft (R) QuickC Linker  Version 4.06
	   Copyright (C) Microsoft Corp 1984-1989.  All rights reserved.
	
	   Object Modules [.OBJ]:      <press CTRL+C  to break out>
	
	If you get a different version number, you must check your path
	variable. You may have an additional linker on your disk that was
	found in your path before DOS reached the \QC2\BIN directory. Changing
	your path so that \QC2\BIN is the first directory in your path is the
	easiest and quickest way to correct this problem.
