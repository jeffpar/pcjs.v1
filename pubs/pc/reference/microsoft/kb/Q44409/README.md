---
layout: page
title: "Q44409: Passing Dynamic Array of User-Defined TYPE from QB to MASM 5.x"
permalink: /pubs/pc/reference/microsoft/kb/Q44409/
---

## Q44409: Passing Dynamic Array of User-Defined TYPE from QB to MASM 5.x

	Article: Q44409
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890510-57 B_BasicCom
	Last Modified: 20-DEC-1989
	
	This article contains a code example of passing a dynamic array of
	user-defined TYPEs to an assembly routine that copies the array to
	another array that is passed back to BASIC.
	
	This information applies to Microsoft QuickBASIC Versions 4.00, 4.00b,
	and 4.50, to Microsoft BASIC Compiler Versions 6.00 and 6.00b for
	MS-DOS and MS OS/2, and to Microsoft BASIC PDS Version 7.00 for MS-DOS
	and MS OS/2. The assembly routine requires Microsoft Macro Assembler
	Version 5.00 or later.
	
	The arrays being passed can be larger than 64K when the BASIC program
	is compiled with the BC /AH option (or if the QB.EXE or QBX.EXE editor
	is started with the /AH option).
	
	Code Example
	------------
	
	'Please note that it is necessary to pass the segment and
	'the offset of a dynamic array being passed to assembly using
	'VARSEG and VARPTR respectively.
	
	'The following BASIC program passes two arrays to a routine called MASM.
	'The MASM routine copies the first array to the second array,
	'passing it back to BASIC through a parameter.
	
	REM $DYNAMIC
	
	TYPE testType
	  StrElem AS STRING * 11
	  NumElem AS INTEGER        ' Size of integer is 2
	END TYPE
	
	' The underscore character for BASIC PDS 7.00 must be taken out to
	' use with BC.EXE. QBX.EXE will remove the underscores at load time
	' and concatenate the line.
	
	DECLARE SUB Masm (
	       BYVAL TypeLength AS INTEGER,_
	       BYVAL Length AS INTEGER,_
	       BYVAL SegAddr1 AS INTEGER,_
	       BYVAL Addr1 AS INTEGER,_
	       BYVAL SegAddr2 AS INTEGER,_
	       BYVAL Addr2 AS INTEGER)
	Size% = 20%     'Size of the array (# of elements)
	TypeSize% = 13%  'Size of TYPEs stored in array
	CLS
	DIM inArray(1 TO Size%) AS testType
	DIM outArray(1 TO Size%) AS testType
	
	'Load inArray with a 11 character string " *inArray* " and index:
	FOR i = 1 TO Size%
	  inArray(i).StrElem = " *inArray* "
	  inArray(i).NumElem = i
	NEXT i
	
	' The underscore character for BASIC PDS 7.00 must be taken out to
	' use with BC.EXE. QBX.EXE will remove the underscores at load time
	' and concatenate the line.
	
	' Masm will copy the contents of inArray to outArray:
	CALL Masm(TypeSize%,_
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
	  PRINT inArray(i).StrElem; inArray(i).NumElem
	NEXT i
	
	' Print the outArray to see that the contents of inArray
	' were copied to it:
	
	PRINT
	PRINT "outArray: "
	FOR i = 1 TO Size%
	  PRINT outArray(i).StrElem; outArray(i).NumElem
	NEXT i
	END
	
	The Assembly Routine That Copies the Array
	------------------------------------------
	
	;***********************************************************
	; The routine 'Masm' copies a dynamic TYPE array of any
	;   length to another TYPE array.
	; Warning:
	;   -- Arrays must be adequately and equally dimensioned.
	; Masm takes six parameters from the BASIC routine:
	;   1 - Size of TYPEs in array to be copied (BX)
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
	     mov    bp, sp
	
	     mov    bx, [bp+16]   ; Size of TYPEs in array -> bx
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
	
	     pop    bp
	     ret
	Masm ENDP
	     END
