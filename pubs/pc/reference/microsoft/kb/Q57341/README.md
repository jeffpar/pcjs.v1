---
layout: page
title: "Q57341: You Can CHAIN Only to an .EXE or .COM in BASIC PDS 7.00"
permalink: /pubs/pc/reference/microsoft/kb/Q57341/
---

## Q57341: You Can CHAIN Only to an .EXE or .COM in BASIC PDS 7.00

	Article: Q57341
	Version(s): 7.00   | 7.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | SR# S891220-87
	Last Modified: 14-JAN-1990
	
	In Microsoft Basic Compiler Versions 6.00 and 6.00b and in QuickBASIC
	Versions 4.00, 4.00b, and 4.50 for MS-DOS, you can CHAIN to an
	executable file that does not have the extension .EXE, and it will not
	generate an error. In BASIC Professional Development System (PDS)
	Version 7.00 for MS-DOS and MS OS/2, the same executable file must
	have the extension .EXE or .COM to run without an error. If the
	CHAINed-to file does not have one of these two extensions, the error
	"Bad File Mode" is generated when the program is executed.
	
	This new extension checking is to help you CHAIN to files that are
	most likely meant to be CHAINed to.
