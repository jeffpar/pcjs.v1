---
layout: page
title: "Q27134: The Purpose of Module Definition Files"
permalink: /pubs/pc/reference/microsoft/kb/Q27134/
---

## Q27134: The Purpose of Module Definition Files

	Article: Q27134
	Version(s): 5.01.21 5.02 5.03 5.05 5.10 5.13 | 5.01.21 5.02 5.03 5.05
	Operating System: MS-DOS                           | OS/2
	Flags: ENDUSER |
	Last Modified: 17-DEC-1990
	
	Module-definition files (.DEF) are used by LINK when building Windows
	and OS/2 programs and dynamic-link libraries (DLLs). A .DEF file
	describes the name, size, format, functions, and segments of an
	application or DLL.
	
	A module-definition file contains one or more module statements. Each
	module statement defines an attribute of the executable file. The
	module statements and the attributes they define are listed below:
	
	Statement         Attribute
	---------         ---------
	
	NAME              Name and type of application
	LIBRARY           Name of dynamic-link library
	DESCRIPTION       One-line description of the module
	CODE              Default attributes for code segments
	DATA              Default attributes for data segments
	SEGMENTS          Attributes for specific segments
	STACKSIZE         Local-stack size, in bytes
	EXPORTS           Exported functions
	IMPORTS           Imported functions
	STUB              Adds a DOS Version 3.x executable file to the beginning
	                  of the module, usually to terminate the program when
	                  run in real mode
	HEAPSIZE          Local-heap size, in bytes
	PROTMODE          Specifies that the module runs only in OS/2 protected
	                  mode
	REALMODE          Specifies that the module is for real-mode Windows.
	OLD               Preserves export ordinal information from a previous
	                  version of the library
	
	The following rules govern the use of these statements in a module-
	definitions file:
	
	1. If you use either a NAME or a LIBRARY statement, it must precede
	   all other statements in the module-definition file.
	
	2. You can include source-level comments in the module-definition
	   file, by beginning a line with a semicolon (;). The OS/2 utilities
	   ignore each such comment line.
	
	3. Module-definition keywords (such as NAME, LIBRARY, and SEGMENTS)
	   must be entered in uppercase letters.
	
	For more information, refer to the utility reference or online help
	that accompanied your particular compiler or assembler.
