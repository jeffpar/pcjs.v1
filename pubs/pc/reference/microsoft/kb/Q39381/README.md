---
layout: page
title: "Q39381: BASIC Supports MASM 5.10 Update .MODEL and PROC Extensions"
permalink: /pubs/pc/reference/microsoft/kb/Q39381/
---

## Q39381: BASIC Supports MASM 5.10 Update .MODEL and PROC Extensions

	Article: Q39381
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom SR# S881213-30
	Last Modified: 21-DEC-1988
	
	The Microsoft Macro Assembler Version 5.10 includes several new
	features (not found in MASM Version 5.00 or earlier) that simplify
	assembly-language routines linked with high-level language programs
	Two of these features are as follows:
	
	1. An extension to the .MODEL directive that automatically sets up
	   naming, calling, and return conventions for a given high-level
	   language; for example, .MODEL MEDIUM,BASIC
	
	2. A modification of the PROC directive that handles most of the
	   procedure entry automatically. The PROC directive saves specified
	   registers, defines text macros for passed arguments, and generates
	   stack setup code on entry and stack tear-down code on exit.
	
	These new features are supported by QuickBASIC Versions 4.00, 4.00b,
	and 4.50 and the Microsoft BASIC Compiler Versions 6.00 and 6.00b.
	
	Section 5 of the "Microsoft Macro Assembler 5.1: 5.1 Update" manual
	discusses the new features.
	
	Page 332 of the "Microsoft QuickBASIC Version 4.00: Learning and Using
	QuickBASIC" manual provides an example of an assembly-language
	function called by BASIC. The example from Page 332 is modified below
	to demonstrate the new features in the Microsoft Macro Assembler
	Version 5.10.
	
	Compile and Link Instructions are as follows:
	
	   BC power.bas;
	   MASM power.asm,powera;
	   LINK power + powera;
	
	The following is the BASIC Program, POWER.BAS, which invokes the
	assembly language function POWER2:
	
	   DEFINT A-Z
	   DECLARE FUNCTION power2 (x%, y%)
	   PRINT power2(3, 5)
	   END
	
	The following is POWER2.ASM, an example of using the extended .MODEL
	and .PROC directives in MASM 5.10:
	
	.model medium,BASIC  ;Adds the language option ",BASIC"
	.code
	                     ;PUBLIC directive was removed. The label on
	                     ;the PROC directive is now the function name.
	Power2 PROC arg1:word, arg2:word  ;parameters added to PROC
	
	   ;Note: PUSH BP and MOV BP,SP are no longer needed.
	   ;The arguments are refered to by the names supplied on the
	   ;PROC list instead of their offset from BP (Base Pointer):
	       mov   bx,arg1
	       mov   ax,[bx]
	       mov   bx,arg2
	       mov   cx,[bx]
	       shl   ax,cl
	   ;Note, POP BP is no longer needed.
	       ret      ;RET is used now, instead of RET n, (where n is
	                ;two times the number of passed arguments.)
	Power2 endp
	       end
	
	For comparison, the following is the equivalent, earlier (MASM Version
	5.00) form for POWER2.ASM, taken from Page 332 of "Learning and Using
	QuickBASIC" (for Versions 4.00 and 4.00b, and BASIC Compiler Versions
	6.00 and 6.00b):
	
	.model medium
	.code
	       PUBLIC Power2
	Power2 PROC
	       PUSH  BP
	       MOV   BP,SP        ; Set stack framepointer
	       mov   bx,[bp+8]    ; Load Arg1 into
	       mov   ax,[bx]      ;   AX
	       mov   bx,[bp+6]    ; Load Arg2 into
	       mov   cx,[bx]      ;   CX
	       shl   ax,cl        ; AX = AX * (2 to power of CX)
	                          ; Leave return value in AX
	       POP   BP           ; Exit sequence -- restore old BP
	       ret   4            ; Return and restore 4 bytes.
	Power2 endp
	       end
