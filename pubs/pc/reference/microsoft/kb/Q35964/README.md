---
layout: page
title: "Q35964: Passing BASIC Dynamic Arrays of Fixed Strings to MASM 5.x"
permalink: /pubs/pc/reference/microsoft/kb/Q35964/
---

## Q35964: Passing BASIC Dynamic Arrays of Fixed Strings to MASM 5.x

	Article: Q35964
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom H_MASM S_QuickASM
	Last Modified: 5-SEP-1990
	
	This article contains a code example of passing a dynamic array of
	fixed-length strings to an assembly routine that copies the array to
	another array passed back to BASIC.
	
	This information about interlanguage calling applies to QuickBASIC
	versions 4.00 4.00b and 4.50 for MS-DOS, to Microsoft BASIC Compiler
	versions 6.00 and 6.00b for MS-DOS and MS OS/2, and to Microsoft BASIC
	Professional Development System (PDS) versions 7.00 and 7.10 for
	MS-DOS and MS OS/2.
	
	For more information about passing other types of parameters between
	BASIC and MASM, search in the Software/Data Library for the following
	word:
	
	   BAS2MASM
	
	Code Example
	------------
	
	Please note that it is necessary to pass the segment and the offset of
	a dynamic array being passed to assembly using VARSEG and VARPTR
	respectively.
	
	'The following BASIC program passes two arrays to a routine called
	'MASM. The MASM routine copies the first array to the second array,
	'passing it back to BASIC through a parameter.
	REM $DYNAMIC
	DECLARE SUB Masm (
	       BYVAL StrLength AS INTEGER,_
	       BYVAL Length AS INTEGER,_
	       BYVAL SegAddr1 AS INTEGER,_
	       BYVAL Addr1 AS INTEGER,_
	       BYVAL SegAddr2 AS INTEGER,_
	       BYVAL Addr2 AS INTEGER)
	CONST Size% = 20%     'Size of the array (# of elements)
	CONST StrSize% = 11%  'Size of strings stored in array
	CLS
	DIM inArray(1 TO Size%) AS STRING * strsize%
	DIM outArray(1 TO Size%) AS STRING * strsize%
	
	'Load inArray with a 11 character string " *inArray* ":
	FOR i = 1 TO Size%
	  inArray(i) = " *inArray* "
	NEXT i
	
	' Masm will copy the contents of inArray to outArray:
	CALL Masm(StrSize%,_
	          Size%,_
	          VARSEG(inArray(1)),_
	          VARPTR(inArray(1)),_
	          VARSEG(outArray(1)),_
	          VARPTR(outArray(1)))
	
	' Print the inArray:
	PRINT
	PRINT
	PRINT "inArray: "
	FOR i = 1 TO Size%
	  PRINT inArray(i);
	NEXT i
	
	' Print the outArray to see that the contents of inArray
	' were copied to it:
	
	PRINT
	PRINT "outArray: "
	FOR i = 1 TO Size%
	  PRINT outArray(i);
	NEXT i
	END
	
	The following is the assembly routine that copies the array:
	
	;***********************************************************
	; The routine 'Masm' copies a dynamic string array of any
	;   length to another string array.
	; Warnings:
	;   -- Arrays must be adequately dimensioned.
	; Masm takes six parameters from the BASIC routine:
	;   1 - Size of strings in array to be copied (BX)
	;   2 - # of elements in Array
	;   3 - Segment of source array
	;   4 - Offset of first element of source array
	;   5 - Segment of destination array
	;   6 - Offset of first element of destination array
	;***********************************************************
	
	.MODEL MEDIUM
	.CODE
	PUBLIC Masm
	
	Masm    PROC
	     push   bp
	     push   si
	     mov    bp, sp
	
	     mov    bx, [bp+16]   ; Size of strings in array -> bx
	     mov    ax, [bp+14]   ; Elements in array -> ax
	     mul    bx     ; multiply ax by bx and put answer in ax
	     mov    cx,ax  ; Number of bytes in array -> cx
	
	     mov    es, [bp+12]   ; Segment of first array (inArray)
	     mov    bx, [bp+10]   ; Offset of first element in first
	                          ; array
	; body
	     mov    si,0 ; initialize first array index (inArray)
	again:
	     mov    al,es:[bx] ; Load byte to copy to second array
	                       ;  in al
	     push   bx         ; save bx
	     push   es         ; save es
	     mov    es, [bp+8] ; Segment of second array (outArray)
	     mov    bx, [bp+6] ; Offset of second arrays first
	                       ; element
	     add    bx,si ; Get correct offset into 2nd array from
	                  ; index
	     mov    es:[bx],al ; Move the byte into the second array
	     pop    es ; restore es
	     pop    bx ; restore bx
	     add    bx,1 ; point to next element in first array
	                 ; (inArray)
	     add    si,1 ; increment second array (outArray) index
	     loop    again ; Loop until cx is 0
	     pop    si
	     pop    bp
	     ret
	Masm ENDP
	     END
	
	The two programs shown below demonstrate how a Microsoft BASIC program
	can pass a two-dimensional, fixed-length string array to assembly
	language.
	
	Code Example
	------------
	
	The following BASIC program is BTWOFIX.BAS, which passes an
	uninitialized two-dimensional array of fixed-length strings to an
	assembly routine that initializes the array:
	
	   DECLARE SUB TwoFix(BYVAL ASeg AS INTEGER, BYVAL AOff AS INTEGER)
	
	   DIM FixArray(1 TO 2, 1 TO 3) AS STRING * 9
	
	   CALL TwoFix(VARSEG(FixArray(1, 1)), VARPTR(FixArray(1, 1)))
	   FOR row% = 1 TO 2
	      FOR col% = 1 TO 3
	         PRINT FixArray(row%, col%)
	      NEXT
	   NEXT
	   END
	
	The following program is ATWOFIX.ASM, which initializes a
	two-dimensional array of fixed-length strings passed from BASIC:
	
	.MODEL MEDIUM, BASIC
	.DATA
	        Fix11 DB 'String 11'     ; allocate string data
	        Fix21 DB 'String 21'
	        Fix12 DB 'String 12'
	        Fix22 DB 'String 22'
	        Fix13 DB 'String 13'
	        Fix23 DB 'String 23'
	.CODE
	        PUBLIC TwoFix
	TwoFix  PROC
	        push bp
	        mov bp, sp               ; set stack frame
	        push es
	        mov es, [bp+8]           ; segment of string array
	        mov di, [bp+6]           ; offset of string array
	        mov si, OFFSET Fix11     ; get offset to string data
	        mov cx, 54               ; length of all string data
	        rep movsb                ; copy string data to array
	        pop es
	        pop bp
	        ret 4
	TwoFix  ENDP
	        END
	
	To demonstrate these programs from an .EXE program, compile and link
	as follows:
	
	   BC BTWOFIX.BAS;
	   MASM ATWOFIX.ASM;
	   LINK BTWOFIX ATWOFIX;
	
	BTWOFIX.EXE produces the following output:
	
	   String 11
	   String 12
	   String 13
	   String 21
	   String 22
	   String 23
