---
layout: page
title: "Q41368: QuickC 2.00 README.DOC: Using QC 2.00 With C 5.10"
permalink: /pubs/pc/reference/microsoft/kb/Q41368/
---

## Q41368: QuickC 2.00 README.DOC: Using QC 2.00 With C 5.10

	Article: Q41368
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 28-FEB-1989
	
	The following information comes from the QuickC 2.00 README.DOC file,
	Part 1, "Notes on 'Up and Running,'" and refers to Page 12 in the
	file: Third Screen: The Directories (C 5.10 Compatibility).
	
	The following explanation applies only to those who want to use QuickC
	in conjunction with the Microsoft C Optimizing Compiler.
	
	QuickC complements and augments Versions 5.00 and 5.10 of the
	Microsoft C Optimizing Compiler. If you own one of these compilers,
	choose the directories where the Optimizing Compiler stores executable
	files, libraries, and header files: /BIN, /LIB, and /INCLUDE, for
	example, instead of /QC2/BIN, /QC2/LIB, and /QC2/INCLUDE. QuickC's
	programs, libraries, include files, and other files are the latest
	versions available. They are fully compatible with the Optimizing
	Compiler.
	
	To maintain compatibility between the two compilers, both QuickC and
	the Optimizing Compiler use the CL environment variable. If you
	include options that the Microsoft Optimizing Compiler recognizes but
	QuickC does not, QuickC issues an error message. You will have to edit
	the CL environment variable to eliminate this error.
	
	The CodeView debugger cannot handle files that have been incrementally
	compiled or incrementally linked. If you plan to examine QuickC
	programs with CodeView, be sure that these two options (incremental
	compile and incremental link) are turned off. From the command line,
	use QCL without the /Gi or /Li option. From the QuickC environment,
	use the Options menu Make command to turn off incremental compile and
	link and to turn on CodeView Info. This warning applies only to
	CodeView. QuickC's built-in debugger can handle incrementally compiled
	and linked programs.
	
	The -qc option allows you to run the QuickC compiler from the
	Microsoft Optimizing Compiler Version 5.00 or 5.10. If you own C 5.00
	or 5.10, and want to call QuickC Version 2.00, use this command line:
	
	   cl -B1 qccom -qc
	
	In addition, if your hard disk already contains a version of LINK.EXE,
	you are asked if you want to delete the old linker. Answer yes. QuickC
	ships with Version 4.06 of LINK.EXE. It is fully compatible with
	Versions 5.00 and 5.10 of the Microsoft Optimizing Compiler.
	
	If you are writing Windows or OS/2 applications, you should use
	Version 5.02 of the Microsoft Segmented-Executable Linker.
