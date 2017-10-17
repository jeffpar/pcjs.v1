---
layout: page
title: "Q58125: &quot;Error Loading File (x.QLB)&quot; After QBX /L x; Must Compile /Fs"
permalink: /pubs/pc/reference/microsoft/kb/Q58125/
---

## Q58125: &quot;Error Loading File (x.QLB)&quot; After QBX /L x; Must Compile /Fs

	Article: Q58125
	Version(s): 7.00
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900126-5
	Last Modified: 26-FEB-1990
	
	The error "Error in loading file (xxx.QLB )" occurs when loading a
	Quick library into QBX.EXE if the Quick library contains BASIC modules
	compiled without the BC /Fs (far strings) option. The BC /Fs option is
	needed because far strings are always used in the QuickBASIC Extended
	(QBX) environment.
	
	To create a Quick library that is usable in QBX, recompile with the BC
	/Fs option and relink (LINK /QU) to make a new Quick library.
	
	This information applies to Microsoft BASIC Professional Development
	System (PDS) Version 7.00 for MS-DOS.
	
	The necessity of using the /Fs option to make Quick libraries is
	documented on Page 617 of the "Microsoft BASIC 7.0: Programmer's
	Guide." For more information on Quick libraries, see Chapter 19,
	"Creating and Using Quick Libraries."
