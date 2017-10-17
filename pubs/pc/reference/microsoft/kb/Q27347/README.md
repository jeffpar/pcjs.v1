---
layout: page
title: "Q27347: Explanation of Compiler &quot;Bytes Available&quot; and &quot;Bytes Free&quot;"
permalink: /pubs/pc/reference/microsoft/kb/Q27347/
---

## Q27347: Explanation of Compiler &quot;Bytes Available&quot; and &quot;Bytes Free&quot;

	Article: Q27347
	Version(s): 4.00 4.00 4.50
	Operating System: MS-DOS
	Flags: ENDUSER |  B_BasicCom
	Last Modified: 15-JAN-1991
	
	At the end of a successful compilation, the BC.EXE compiler displays
	the following message:
	
	   nnnnn Bytes Available
	   nnnnn Bytes Free
	
	          0 Warning Error(s)
	          0 Severe Error(s)
	
	This message gives the amount of compiler workspace available before
	(Bytes Available) and after (Bytes Free) a program is compiled.
	
	If the Bytes Free is approaching 1024 or less, then the compiler is
	reaching internal workspace limits in generating code for this module,
	and you should break your program into smaller, separately compiled
	SUBprogram procedures or FUNCTION procedures that can be linked
	together (with LINK.EXE). The CHAIN statement is another alternative.
	
	Note that BC.EXE can give you a "Program-memory overflow" or "Out of
	Memory" error at compile time when there are still plenty of Bytes
	Free. This happens when the compiler has enough workspace but the code
	segment that it generates exceeds 64K. To work around this limitation,
	you need to break the program into separately compiled procedure
	modules, or into separately compiled main programs, that can run each
	other with the CHAIN statement.
	
	This information applies to QuickBASIC Compiler versions 1.00, 1.01,
	1.02, 2.00, 2.01, 3.00, 4.00, 4.00b, and 4.50 for MS-DOS; to Microsoft
	BASIC Compiler versions 5.35 and 5.36 for MS-DOS and versions 6.00,
	6.00b for MS OS/2 and MS-DOS; and to Microsoft BASIC Professional
	Development System (PDS) versions 7.00 and 7.10 for MS-DOS and MS
	OS/2.
	
	The 64K memory segmentation architecture of the 8086 chip has
	influenced design limitations of the BASIC compiler so that it can use
	only 64K blocks for internal compiler workspace, and can generate only
	64K or less for a program's code segment.
	
	Bytes Available is the initial amount of compiler workspace available
	for storing the symbol table and the line number table, and for
	working storage for code generation and optimization.
	
	Bytes Free is the size of unused compiler workspace after the compiler
	has finished.
	
	For a separate article that discusses how code affects compiler
	workspace, search on the following words:
	
	   BASIC and bytes available and free and symbol table and workspace
	
	Note: The number of bytes that BC.EXE generated for a module's code
	segment is NOT indicated by the size of the .OBJ file on disk.
	Instead, you must refer to the .MAP file that can be optionally output
	from the LINK.EXE linker. The program must have been successfully
	compiled and linked to get a valid link .MAP file. Your module will be
	listed by name in the .MAP file under a _Code Class, and its code
	segment size will be shown in hexadecimal (base 16) notation in the
	Length column.
