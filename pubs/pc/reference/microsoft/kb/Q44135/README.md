---
layout: page
title: "Q44135: BASIC Program That Passes a STATIC or DYNAMIC Array to MASM"
permalink: /pubs/pc/reference/microsoft/kb/Q44135/
---

## Q44135: BASIC Program That Passes a STATIC or DYNAMIC Array to MASM

	Article: Q44135
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890425-35 B_BasicCom H_MASM
	Last Modified: 20-DEC-1989
	
	Below is a QuickBASIC program that passes a STATIC or DYNAMIC array to
	an assembly routine assembled with the Microsoft Macro Assembler
	(MASM). The assembly routine assigns a 1 to each element in the array.
	In the QuickBASIC program, the array can be initially defined as
	DYNAMIC or STATIC, using REM $DYNAMIC or REM $STATIC.
	
	This QuickBASIC program can be compiled with QuickBASIC Versions 4.00,
	4.00b, and 4.50, Microsoft BASIC Compiler Versions 6.00 and 6.00b, and
	with Microsoft BASIC PDS Version 7.00. The assembly program should be
	assembled with MASM Version 5.10.
	
	Code Examples
	-------------
	
	The following is the QuickBASIC program, MAIN.BAS, which calls the
	assembly routine:
	
	REM Program that calls an assembly routine that fills each
	REM element with a 1. The segment, offset, and number of elements
	REM in the array need to be passed BYVAL.
	REM
	
	DEFINT A-Z
	DECLARE SUB MasmSub (BYVAL segment, BYVAL offset, BYVAL number)
	
	'REM $DYNAMIC     'Can be either STATIC (the default) or DYNAMIC
	DIM x%(1 TO 10)   'Remove comment to define array DYNAMICally
	
	CLS
	PRINT "Calling assembly routine to fill array elements..."
	CALL MasmSub(VARSEG(x%(1)), VARPTR(x%(1)), 10)
	PRINT "Values in array:"
	FOR i = 1 TO 10
	    PRINT x%(i);
	NEXT
	END
	
	The following is the assembly program, MASMSUB.ASM, which assigns 1
	to each array element:
	
	;-------------------------------------------------------------------
	; This assembly program loops through the array elements of an
	; integer array that is passed to it via QuickBASIC and assigns a 1
	; to each element. The segment, offset, and number of elements of
	; the array need to be passed BYVAL from the QuickBASIC main module.
	;
	;-------------------------------------------------------------------
	
	          .model medium
	          .code
	          public MasmSub
	MasmSub   proc                 ;can use proc far here too
	begin:    push bp              ;save registers for BASIC
	          mov  bp,sp           ;get the stack pointer
	
	          mov  es,[bp+10]      ;get segment of array
	          mov  bx,[bp+8]       ;get offset of array
	
	          mov  cx,[bp+6]       ;get length of array
	          mov  al,1            ;fill array elements with 1's
	
	next:     mov  es:[bx],al      ;put one in the array element
	             add  bx,2   ;increment counter to next array element
	                               ; -- add two bytes for integers, four bytes
	                               ; -- for single precision and long integers,
	                               ; -- and 8 bytes for double precision numbers
	          loop next               ;loop to assign next array element
	          pop  bp              ;restore bp for BASIC
	          ret  6               ;restore stack
	MasmSub   endp
	          end
	
	To compile and LINK each program, type the following MS-DOS commands:
	
	   BC MAIN;
	   MASM MASMSUB;
	   LINK MAIN+MASMSUB;
	
	To run the resulting executable, type the following (at the MS-DOS
	prompt):
	
	   MAIN
