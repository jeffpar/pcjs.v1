---
layout: page
title: "Q51764: Debugging DLLs with Codeview"
permalink: /pubs/pc/reference/microsoft/kb/Q51764/
---

	Article: Q51764
	Product: Microsoft C
	Version(s): 2.20 2.30
	Operating System: OS/2
	Flags: ENDUSER |
	Last Modified: 18-DEC-1989
	
	To debug most DLLs (Dynamic Link Libraries) in CodeView, CVP
	(protected mode CodeView) Version 2.20 or later is required. For DLLs
	loaded via DosLoadModule(), CVP Version 2.30 or later is required.
	
	Invoke CodeView with the /L switch as follows:
	
	   cvp /L dll1name /L dll2name main.exe
	
	Make sure that each DLL you want to trace into is specified by the /L
	option.
	
	CodeView cannot debug DLLs that have either IOPL or EXECUTEONLY
	specified with the CODE directive in the associated definition (.DEF)
	file. For DLLs that require these controls, the Kernel Debugger
	supplied with the SDK is required.
	
	Note: With CVP 2.30, pathnames cannot be specified for DLLs;
	therefore, the DLL must reside in the current directory. For more
	information, query on the following:
	
	    CODEVIEW DLL LIBPATH
