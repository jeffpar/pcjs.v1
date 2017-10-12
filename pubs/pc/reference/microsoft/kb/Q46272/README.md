---
layout: page
title: "Q46272: Documentation Errors in &quot;Configuring On-Line Help&quot; for M 1.02"
permalink: /pubs/pc/reference/microsoft/kb/Q46272/
---

	Article: Q46272
	Product: Microsoft C
	Version(s): 1.02   | 1.02
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | docerr
	Last Modified: 11-SEP-1989
	
	There are several documentation errors in the section "Configuring
	On-Line Help" on Page 101 of the "Microsoft Editor User's Guide for MS
	OS/2 and MS-DOS Operating Systems." This is the documentation for the
	Microsoft Editor (M) Version 1.02, which first became available with
	FORTRAN Version 5.00. These errors prevent access to M help. The
	documentation says to add the following tagged section to your
	TOOLS.INI file:
	
	   [m-help.mxt mep-help.mxt]
	   helpfiles:path\file.hlp
	
	The tag header should be as follows:
	
	   [m-help mep-mhelp]
	
	Including ".mxt" prevents M from accessing help.
	
	Also, in the paragraph labeled Number 2 that describes installation
	for on-line Help when running under OS/2 protected mode only, there is
	a misprint. The following sentence refers to a nonexistent file
	"MHELP.DLL":
	
	   MHELP.DLL is an extension to the editor.
	
	The correct file is MHELP.PXT, so the sentence should read as follows:
	
	   MHELP.PXT is an extension to the editor.
