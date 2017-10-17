---
layout: page
title: "Q64428: Assembly Function Returning Variable-Length String to BASIC"
permalink: /pubs/pc/reference/microsoft/kb/Q64428/
---

## Q64428: Assembly Function Returning Variable-Length String to BASIC

	Article: Q64428
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom H_MASM S_QUICKASM SR# S900718-47
	Last Modified: 13-AUG-1990
	
	The two programs below demonstrate how an assembly language function
	can return a variable-length string to a Microsoft BASIC program.
	
	Note: This routine will not work inside the QuickBASIC Extended
	environment (QBX.EXE) or when compiled using the Far Strings option
	(BC /Fs) in Microsoft BASIC Professional Development System (PDS)
	version 7.00 or 7.10. For information on interlanguage programming
	with far strings in Microsoft BASIC PDS, see Chapter 13, "Mixed
	Language Programming with Far Strings," in the "Microsoft BASIC 7.0:
	Programmer's Guide" for versions 7.00 and 7.10.
	
	This information about interlanguage calling applies to QuickBASIC
	versions 4.00, 4.00b, and 4.50 for MS-DOS, to Microsoft BASIC Compiler
	versions 6.00 and 6.00b for MS-DOS and MS OS/2, and to Microsoft BASIC
	PDS versions 7.00 and 7.10 for MS-DOS and MS OS/2.
	
	For more information about passing other types of parameters between
	BASIC and MASM, query in the Software/Data Library or this Knowledge
	Base for the following word:
	
	   BAS2MASM
	
	Code Example
	------------
	
	The following BASIC program is SFUNC.BAS, which displays a
	variable-length string returned from an assembly language function
	(QPrint).
	
	   DECLARE FUNCTION QPrint$(slen%)
	   CLS
	   FOR i% = 1 to 3
	      TString$ = QPrint$(i%)  ' i% is the length of the string
	      PRINT TSTring$, LEN(TString$)
	   NEXT
	
	The following assembly language program is ASTR.ASM, which contains
	the function QPrint. The QPrint function returns a string, and the
	passed integer parameter (argument) returns the length of the string.
	
	; The following handy .MODEL MEDIUM,BASIC directive is found in MASM
	; 5.10 but not in earlier versions:
	.MODEL MEDIUM, BASIC
	.DATA
	        str      db 10 dup (?)    ; my own string
	        mystring dw ?             ; my own descriptor (length)
	                 dw ?             ;  (offset)
	
	.CODE
	        PUBLIC QPrint
	QPrint  PROC
	        push bp
	        mov bp, sp
	        push ds
	        push es
	
	        mov bx, [bp+6]      ; get the ptr to the string descriptor.
	        mov cx, [bx]
	
	        push ds
	        pop es                    ; set es = ds
	
	        mov di, offset dgroup:str ; load the offset into di
	        mov al, 'a'               ; load character to fill
	        rep stosb                 ; store "a" into the string
	        mov cx, [bx]              ; put the length in cx again
	        mov bx, offset dgroup:mystring ; put offset of string
	                                       ;  descriptor in bx
	        mov [bx], cx                   ; length in first two bytes
	        mov [bx+2], offset dgroup:str  ; offset into second two bytes
	        mov ax, bx                     ; load address of descriptor
	                                       ;   into ax
	        pop es
	        pop ds
	        pop bp
	
	        ret 2
	QPrint  ENDP
	        END
	
	To demonstrate these programs from an .EXE program, compile and link
	as follows:
	
	   BC SFUNC.BAS;
	   MASM ASTR.ASM;
	   LINK SFUNC ASTR;
	
	SFUNC.EXE produces the following output:
	
	   a
	   aa
	   aaa
