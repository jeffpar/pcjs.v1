---
layout: page
title: "Q64353: With the &quot;deflang&quot; Switch PWB Prompts for Setting Program List"
permalink: /pubs/pc/reference/microsoft/kb/Q64353/
---

## Q64353: With the &quot;deflang&quot; Switch PWB Prompts for Setting Program List

	Article: Q64353
	Version(s): 1.00   | 1.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | docerr
	Last Modified: 3-AUG-1990
	
	As documented on Page 79 of the "Microsoft C Reference" shipped with C
	version 6.00 and in the online help, the "deflang" switch in the
	Programmer's WorkBench (PWB) sets the default filename extension for
	list boxes in PWB dialog boxes. Another (undocumented) feature of this
	switch is to enable you to be prompted to "Set Program List?" when
	loading a source file with a .MAK file associated with it in the
	current directory.
	
	By default, "deflang" is not set. You can set the deflang switch in
	the [PWB] tagged section of the TOOLS.INI file, for example:
	
	   deflang:C
	
	This changes the default filename extension in the PWB's dialog boxes
	(such as Open in the File menu) from "*.*" to "*.c", so that only
	files with the .c extension show up by default. Other languages can be
	specified as well, as shown below:
	
	   Switch Setting     Extension
	   --------------     ---------
	
	   no value            .*
	   C                   .c
	   Asm                 .asm
	   BASIC               .bas
	   FORTRAN             .for
	   Pascal              .pas
	   COBOL               .cbl
	   LISP                .lsp
	
	Note that the online documentation specifies "Assembler" as the switch
	to use for .ASM files, but this is incorrect. "Asm" is the correct
	switch to use to make Assembler the default language.
	
	The deflang switch also enables you to be prompted as to whether or
	not the program list should be set automatically. If you load a file
	that has the extension specified by the "deflang" switch and you also
	have a .MAK file with the same base filename in the same directory,
	the PWB will prompt you about loading the program list.
	
	For example, assume that deflang is set to C and FOO.MAK and FOO.C are
	in the same directory. If you type PWB FOO.C at the command-prompt,
	the PWB will pause when loading and prompt with "Set Program List?
	FOO.MAK". At this point you can specify <yes> or <no>.
	
	When already in the PWB, if you select Open from the File menu, and
	select FOO.C as the file to open, the PWB will also prompt you at this
	point regarding whether or not you want FOO.MAK loaded as the program
	list, but only if NO program list is currently set.
