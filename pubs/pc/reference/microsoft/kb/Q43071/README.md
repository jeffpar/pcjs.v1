---
layout: page
title: "Q43071: QuickC 2.00 Editor Err Msg: Cannot Load Binary File"
permalink: /pubs/pc/reference/microsoft/kb/Q43071/
---

## Q43071: QuickC 2.00 Editor Err Msg: Cannot Load Binary File

	Article: Q43071
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 2-MAY-1989
	
	Problem:
	
	When I try to load my file into the Microsoft QuickC Compiler Version
	2.00 editor I get the error message "Cannot load binary file." My
	program works properly when I use QCL to compile.
	
	Response:
	
	The QuickC 2.00 editor will load standard ASCII files. However, it
	will not load .EXE, .COM, or ASCII files containing certain control
	characters.
	
	The QuickC 2.00 editor assumes that a file is a binary file if it
	contains a null (ASCII 0) control character.
	
	To remove control characters from a file, use the CRLF.EXE utility
	provided on the QuickC 2.00 utilities disk.
	
	The syntax for the command is as follows :
	
	   crlf <infile> <outfile> [/c<ascii>]
	
	The /c option allows you to specify what ASCII character the control
	characters will be converted to. This switch is optional.
