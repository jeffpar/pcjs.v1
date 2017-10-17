---
layout: page
title: "Q45051: Set Paths Menu in QB 4.50 Finds &#36;INCLUDE and Library Files"
permalink: /pubs/pc/reference/microsoft/kb/Q45051/
---

## Q45051: Set Paths Menu in QB 4.50 Finds &#36;INCLUDE and Library Files

	Article: Q45051
	Version(s): 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890523-116 B_BasicCom
	Last Modified: 27-DEC-1989
	
	The Set Paths menu item in the Options menu is a feature new to the
	QuickBASIC Version 4.50 environment. (Earlier versions of the
	QuickBASIC editor do not have an Options menu or a Set Paths option.)
	QBX.EXE for Microsoft BASIC PDS Version 7.00 also has this feature.
	
	The Set Paths option lets you establish the search path that the
	QB.EXE environment will use for finding executable (.EXE, .COM) files,
	$INCLUDE files, library files (.LIB, .QLB), and the help file (.HLP).
	The search paths specified in Set Paths work in addition to any paths
	that were SET with MS-DOS environment variables (such as SET PATH=,
	SET INCLUDE=, and SET LIB=).
	
	Note that QuickBASIC Versions 1.00, 1.01, 1.02, 2.00, 2.01, 3.00,
	4.00, and 4.00b for MS-DOS and Microsoft BASIC Compiler Versions 6.00
	and 6.00b for MS-DOS do NOT support the MS-DOS SET INCLUDE search path
	(for QB.EXE or BC.EXE). The support for SET INCLUDE is added for
	QuickBASIC Version 4.50 and BASIC PDS 7.00.
	
	More information about the Set Paths menu is on Pages 220-221 and
	271-272 of the "Microsoft QuickBASIC: Learning to Use" manual for
	QuickBASIC Version 4.50.
	
	The SET command in MS-DOS can also specify a subdirectory path with
	the INCLUDE environment variable to search for $INCLUDE files. Both
	QB.EXE and BC.EXE (in QuickBASIC Versions 4.00, 4.00b, and 4.50 and in
	BASIC PDS 7.00) find $INCLUDE files along the path specified by the
	INCLUDE environment variable.
	
	The following is an example of the MS-DOS SET command that specifies
	the INCLUDE file path. It can be invoked in an AUTOEXEC.BAT batch file
	or typed at the DOS prompt.
	
	   SET INCLUDE=D:\QB45\INCLUDE
	
	The Set Paths menu item is an additional method for finding $INCLUDE
	files when compiling in the QB.EXE Version 4.50 environment and in the
	QBX.EXE Version 7.00 environment.
