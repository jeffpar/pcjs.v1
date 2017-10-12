---
layout: page
title: "Q66339: MASM Build Switches for PWB 1.10"
permalink: /pubs/pc/reference/microsoft/kb/Q66339/
---

	Article: Q66339
	Product: Microsoft C
	Version(s): 1.10    | 1.10
	Operating System: MS-DOS  | OS/2
	Flags: ENDUSER |
	Last Modified: 5-DEC-1990
	
	When setting a program list containing .ASM files in Programmer's
	WorkBench (PWB) version 1.10, the following error message occurs:
	
	   Program List: file 'filename' will be ignored
	   File type unused by current build options
	
	The .ASM files are not recognized because PWB 1.10 does not contain
	build switches specific to any language. Build switches are now loaded
	from language extension files (.MXT for DOS and .PXT for OS/2). If you
	have an assembly language extension file, you will not see this error
	message. Language extensions are not necessary and are only a
	convenience for controlling the build process; only the build switches
	are really needed.
	
	The following build switches can be added to a tagged section in your
	TOOLS.INI file. To use these build options, first choose your language
	options from the Options Build Options menu, then initialize this
	section by typing {arg} tag_name {reinitialize} (type the following to
	invoke the sample build switch below:
	
	   ALT+A asm_rules SHIFT+F8
	
	These switches can also be added to a custom set of build options
	saved by Save Current Build Options. They may then be initialized by
	choosing Build Options from the Options menu, and then selecting Set
	Initial Build Options to choose the new custom language options.
	
	Sample Build Switches
	---------------------
	
	[pwb-asm_rules]
	;
	;   MASM build rules
	;
	build:macro ASM "MASM"
	build:macro AFLAGS_G "/Mx /T"
	build:macro AFLAGS_D "/Zi"
	build:macro AFLAGS_R ""
	build:inference .asm.obj as_asm_obj
	build:release command as_asm_obj  \
	            "$(ASM) $(AFLAGS_G) $(AFLAGS_R) $<, $@;"
	build:debug command as_asm_obj  \
	            "$(ASM) $(AFLAGS_G) $(AFLAGS_D) $<, $@;"
	build:include .asm "^[ \t]*include[ \t]+\\([^ \t]+\\)"
	build:include .inc "^[ \t]*include[ \t]+\\([^ \t]+\\)"
	
	These assembly flags can then be modified from PWB by using the
	following macros. The macros must be assigned to keystrokes to be
	activated. This can be done using the <ASSIGN> pseudo file. They can
	then be used to redefine the flags to pass to MASM.
	
	;
	;   MASM option-setting macros
	;
	setAFG:= arg "Global MASM Options?"  prompt -> cancel lasttext home \
	        "build:macro AFLAGS_G \"" endline "\"" assign
	
	setAFD:= arg "Debug MASM Options?"   prompt -> cancel lasttext home \
	        "build:macro AFLAGS_D \"" endline "\"" assign
	
	setAFR:= arg "Release MASM Options?" prompt -> cancel lasttext home \
	        "build:macro AFLAGS_R \"" endline "\"" assign
