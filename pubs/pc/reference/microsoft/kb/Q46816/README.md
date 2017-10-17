---
layout: page
title: "Q46816: BC.EXE &quot;Cannot Generate Listing for BASIC Binary Source Files&quot;"
permalink: /pubs/pc/reference/microsoft/kb/Q46816/
---

## Q46816: BC.EXE &quot;Cannot Generate Listing for BASIC Binary Source Files&quot;

	Article: Q46816
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890628-52 B_BasicCom
	Last Modified: 30-MAY-1990
	
	When compiling with BC.EXE in Microsoft QuickBASIC version 4.00,
	4.00b, or 4.50 or in Microsoft BASIC Compiler 6.00 or 6.00b, or
	Microsoft BASIC Professional Development System (PDS) version 7.00,
	the error "Cannot generate listing for BASIC binary source files" can
	occur when creating a listing file.
	
	This error occurs when the source file is saved in Fast Load and Save
	format. To create the listing file, the program must be saved in Text
	format.
	
	The error "Binary source file" occurs if you are trying to compile a
	binary file with Microsoft BASIC PDS 7.00 using the /Zi switch.
	
	To save the file as text, do the following in the QB.EXE or QBX.EXE
	editor:
	
	1. From the File menu, choose Save As.
	
	2. Tab down to the <Text> box.
	
	3. Press SPACEBAR.
	
	4. Press ENTER and the file will be saved as text.
