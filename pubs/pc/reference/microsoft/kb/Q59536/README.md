---
layout: page
title: "Q59536: OS/2 Module Definition File Syntax"
permalink: /pubs/pc/reference/microsoft/kb/Q59536/
---

	Article: Q59536
	Product: Microsoft C
	Version(s): 5.01.21 5.02 5.03 5.05
	Operating System: OS/2
	Flags: ENDUSER | S_C
	Last Modified: 16-MAR-1990
	
	The following is extracted from Ray Duncan's "Advanced OS/2
	Programming," Page 737:
	
	   Module definition (DEF) files are simple ASCII text files that are
	   interpreted by the linker during the construction of an application
	   program, dynlink library, or device driver. The directives in DEF
	   files cause information to be built into the executable file's
	   header, which is later interpreted by the system when the program,
	   library, or driver is loaded.
	
	   Enter all DEF file directives and keywords in uppercase letters.
	   File, segment, group, and procedure names can be lowercase or
	   uppercase. Lines beginning with a semicolon (;) are treated as
	   comments.
	
	   Figure E-1. DEF file directives documented in Appendix E
	   --------------------------------------------------------
	
	   CODE        Assigns characteristics to code segments
	   DATA        Assigns characteristics to data segments
	   DESCRIPTION Embeds text in executable file
	   EXETYPE     Specifies host operating system
	   EXPORTS     Names functions exported for dynamic linking by other
	               programs
	   HEAPSIZE    Specifies initial size of local heap (C programs only)
	   IMPORTS     Names functions that will be dynamically linked at load
	               time
	   LIBRARY     Builds dynlink library or device driver
	   NAME        Builds application program
	   OLD         Specifies ordinal compatibility with previous version of
	               dynlink library
	   PROTMODE    Flags file as executable in protected mode only
	   REALMODE    Allows file to be executed in real mode
	   SEGMENTS    Assigns characteristics to selected segments
	   STACKSIZE   Specifies size of stack used by primary thread
	   STUB        Embeds MS-DOS-compatible program in new executable file
	
	For further information, refer to Appendix E, Module Definition File
	Syntax, in "Advanced OS/2 Programming" or Chapter 19, Using Module-
	Definition Files, in the "Microsoft FORTRAN CodeView and Utilities
	User's Guide," packaged with FORTRAN Version 5.00.
