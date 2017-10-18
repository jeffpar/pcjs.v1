---
layout: page
title: "Q30800: MASM 5.10 OS2.DOC: Calling OS/2 Macros"
permalink: /pubs/pc/reference/microsoft/kb/Q30800/
---

## Q30800: MASM 5.10 OS2.DOC: Calling OS/2 Macros

	Article: Q30800
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 25-MAY-1988
	
	The following information is from the Microsoft Macro Assembler
	Version 5.10 OS2.DOC file.
	
	Calling OS/2 Macros
	   You can simplify calls of OS/2 systems services by using the
	macros. The OS/2 macros are organized into groups that can be enabled
	by including the file OS2.INC and defining constants associated with
	each group. For example, to enable file management macros, put the
	following lines in the source file where the macros will be used:
	
	INCL_DOSFILEMGR EQU 1
	INCLUDE os2.inc
	
	   Note that the constant must be defined before the include file is
	specified. The groups of macros and the constants associated with each
	are described later in this file.
	   Macros have the name of the OS/2 call preceded by an at sign (@).
	For example, the macro to call the DosFindNext service is called
	@DosFindNext.
	   Parameters are passed to macros by listing them on the same line as
	the macro name in much the same way as in most high-level languages.
	For example, you could use the following lines to call the
	@DosFindNext macro:
	
	dHandle   DW      -1            ; Directory handle
	dResult   FILEFINDBUF <>        ; Structure for results
	dlResult  EQU     $ - dResult   ;   length of result
	dCount    DW      1             ; Find one file at a time
	          .
	          .
	          .
	          @DosFindNext [dHandle], dResult, dlResult, dCount
	
	   When passing memory locations as arguments, you can specify the
	contents of the specified variable by enclosing it in brackets. In the
	command line above, the value of the word variable dHandle (-1) is
	passed as the first argument.
	   To pass the far address of a variable, give the argument without
	brackets. The addresses of dResult and dCount are passed in the
	command-line above. Note that dResult is defined as a structure of
	type FILEFINDBUF. The FILEFINDBUF structure is defined in the include
	file.
	   You can pass word values in registers or constants by listing them
	without brackets. For example, dlResult is a constant in the example.
	If the file handle were in register DX instead of in the variable
	dHandle, you could substitute the register name. You cannot pass
	doubleword constants. For example, to pass a doubleword zero, you must
	first store the value in a variable.
	   The macros do type checking. An error will be generated if you pass
	an argument of an invalid size or if you pass the wrong number of
	arguments. All arguments are expected to be word or doubleword values.
	Addresses are always far, and are thus passed as doublewords.
	   Note that the macros cannot check to see that you are actually
	passing an an address when required, since the macro has no way of
	knowing whether you are passing the address as a doubleword pointer
	variable or as a label specifying an address.
	   If you wish to pass a value stored in a byte variable or register,
	you must expand this value to a word before passing. For example, use
	CBW to expand a byte in AL to a word in AX.
	   Most valid operands can be passed as arguments. For example, the
	following are valid arguments:
	
	    [es:[di]]              ; Contents of a word indirect memory operand
	    <[DWORD PTR es:[di]]>  ; Contents of a doubleword indirect memory operand
	    <SIZE var1>            ; A constant
	    es:table[bx]           ; Address of an indirect memory operand
	
	   Note that arguments containing spaces or tabs must be enclosed in
	angle brackets so that the macro will see them as a single argument.
	   The macros assume that DS=SS. If you change either of these
	registers temporarily, you should restore the register before passing
	arguments. The macros may change the contents of AX or BX, so you
	should save any important values in these registers before using an
	OS/2 macro.
