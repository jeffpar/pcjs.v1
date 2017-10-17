---
layout: page
title: "Q27799: BC.EXE /T (Terse) Suppresses Warning Messages"
permalink: /pubs/pc/reference/microsoft/kb/Q27799/
---

## Q27799: BC.EXE /T (Terse) Suppresses Warning Messages

	Article: Q27799
	Version(s): 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | docerr B_BasicCom
	Last Modified: 31-JAN-1990
	
	The /T switch is not documented in QuickBASIC Versions 4.00b or 4.50.
	This option needs to be added to the following manuals:
	
	1. Page 211, "Microsoft QuickBASIC 4.0: Learning and Using" for
	   Versions 4.00 and 4.00b
	
	2. Page 211, "Microsoft BASIC Compiler 6.0: Learning and Using
	   Microsoft QuickBASIC" for Versions 6.00 and 6.00b
	
	3. Page 354 "Microsoft QuickBASIC 4.5: Programming in BASIC" for
	   Version 4.50
	
	The /T (terse) option for the BC.EXE compiler Versions 4.00b and 4.50
	(not found in QuickBASIC Version 4.00 or earlier) suppresses warning
	messages during compilation. However, severe error messages are still
	displayed. The /T switch is also supported in Microsoft BASIC Compiler
	Versions 6.00 and 6.00b for MS-DOS and OS/2 and in Microsoft BASIC
	Professional Development System (PDS) Version 7.00 for MS-DOS and MS
	OS/2. The /T switch is correctly documented in BASIC PDS 7.00.
	
	When compiling with the Make EXE File command on the Run menu in the
	QB.EXE Version 4.00b or 4.50 editor, the BC /T option is automatically
	invoked. When you upgrade from QuickBASIC Version 4.00 to Version
	4.00b, you will notice /T automatically added to the BC command line
	in Version 4.00b whenever you choose the Make EXE File command in
	QB.EXE.
	
	The function of the /T switch is to suppress all warning-level
	messages (for example, "array not dimensioned"). However, all
	severe-level messages, which prevent the creation of OBJ files, will
	still be displayed.
	
	Note that the default communications buffer-size switch /C:512 is also
	automatically invoked for BC when you choose Make EXE File in QB.EXE
	in QuickBASIC Version 4.00b. This is not done automatically in QB.EXE
	in QuickBASIC Version 4.00 (even if QB.EXE Version 4.00 is invoked
	with the /C: option).
	
	The BC /T and /C: options are also automatically invoked when you
	choose Make EXE File in the QuickBASIC QB.EXE editor provided with
	Microsoft BASIC Compiler Versions 6.00 and 6.00b, and in the QBX.EXE
	editor provided with Microsoft BASIC PDS Version 7.00.
