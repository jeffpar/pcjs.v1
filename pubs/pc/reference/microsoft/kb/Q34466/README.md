---
layout: page
title: "Q34466: MASM 5.10 MACRO.DOC: Calling Macros in DOS.INC, BIOS.INC"
permalink: /pubs/pc/reference/microsoft/kb/Q34466/
---

## Q34466: MASM 5.10 MACRO.DOC: Calling Macros in DOS.INC, BIOS.INC

	Article: Q34466
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 12-JAN-1989
	
	The following information was taken from the MASM 5.10 MACRO.DOC file.
	
	Calling Macros in DOS.INC and BIOS.INC
	
	You are responsible for saving and restoring registers used in macros.
	The "Registers used" field identifies registers to save.
	
	Macros that accept address parameters use internal macros that allow
	you to specify addresses in several ways. The macro automatically
	identifies the type of the argument and handles it appropriately. For
	example, assume the following declarations:
	
	  String    DB   "test$"
	  pString   DW   Str
	  fpString  DD   Str
	
	Given these values, the macro @DispStr (which displays the string at
	DS:DX) has the following effects:
	
	  Kind of argument          Example               Value loaded
	
	  Label of byte variable    @DispStr String       DS:OFFSET String
	  Near pointer variable     @DispStr pString      DS:pString
	  Far pointer variable      @DispStr fpString
	  fpString[2]:fpString[0]
	  Constant                  @DispStr 0            DS:0
	  Pointer in register       @DispStr si           DS:SI
	  Near Pointer with segment @DispStr pString,es   ES:pString
	  Constant with segment     @DispStr 0,es         ES:0
	  Register with segment     @DispStr di,es        ES:DI
	
	Note that if a far pointer or a segment is given, DS must be saved
	before the macro call and restored afterward. Segments may be given as
	registers, constants, or word variables.
	
	In syntax, parameters enclosed in brackets are optional. Paramaters
	sometimes have a leading symbol to indicate that the argument must
	have a certain type, as shown below:
	
	  Leading Symbol   Example      Limitation
	
	        #          #return      Must be constant
	        &          &vector      Must be offset address as described
	                                above
	        $          $terminator  May be constant or register, but not
	                                memory
	
	Parameters with no leading symbol may be constants, registers, or
	variables. Parameters are 16-bit except where noted in the
	description.
	
	Symbols must be previously defined before they can be passed as
	arguments to most of the DOS macros. Generally this means that data
	must be declared before code in the source file.
