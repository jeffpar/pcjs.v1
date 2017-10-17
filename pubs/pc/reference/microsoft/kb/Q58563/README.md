---
layout: page
title: "Q58563: 7.10 Correction Passing Far Variable-String Array to MASM"
permalink: /pubs/pc/reference/microsoft/kb/Q58563/
---

## Q58563: 7.10 Correction Passing Far Variable-String Array to MASM

	Article: Q58563
	Version(s): 7.00 7.10 | 7.00 7.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | SR# S900207-62 docerr
	Last Modified: 8-JAN-1991
	
	Page 515 of the "Microsoft BASIC 7.0: Programmer's Guide" (for 7.00
	and 7.10) incorrectly shows how to pass a far variable-length-string
	array to assembly. Page 515 states the following:
	
	   To accomplish this, BASIC could call a MASM procedure, passing it
	   the address of the first string descriptor in the array:
	
	   DECLARE SUB ChangeArray(S$)
	   CALL ChangeArray(A$(1))
	
	This does not, in fact, pass the address of the string descriptor of
	the first array element, but rather passes the near address of the
	descriptor of a copy of the string. To pass the address of the first
	descriptor, use BYVAL and VARPTR as follows:
	
	   DECLARE SUB ChangeArray(BYVAL offset%)
	   CALL ChangeArray(VARPTR(a$(1)))
	
	This information applies to Microsoft BASIC Professional Development
	System (PDS) versions 7.00 and 7.10 for MS-DOS and MS OS/2.
	
	Note that all strings in the QBX.EXE environment are always far. When
	making .EXE programs with BC.EXE, you can enable far strings with the
	BC /Fs option.
	
	The following code example shows the correct way to pass an array of
	BASIC variable-length far strings to assembly language:
	
	   DECLARE SUB ChangeArray(BYVAL offset%)
	   DIM a$(1 TO 10)
	   FOR i% = 1 TO 10
	     a$(i%) = STRING$(i%, ASC("A") + i% - 1)
	     PRINT a$(i%)
	   NEXT
	   CALL ChangeArray(VARPTR(a$(1)))
	   FOR i% = 1 TO 10
	      PRINT a$(i%)
	   NEXT
	   END
	
	To use the above program, the following assembly code (taken from
	Pages 516-517 of "Microsoft BASIC 7.0: Programmer's Guide") should be
	assembled and linked with the above program, or linked into a Quick
	library (.QLB) for use in the QBX.EXE environment:
	
	      .model medium,basic
	      .data
	array       dw 100 dup(0)
	      .code
	; arraydescriptor below is the pointer to the array:
	changearray proc uses si di, arraydescriptor: near ptr
	      extrn stringassign:proc
	      mov   cx, 10
	      mov   si, arraydescriptor
	      lea   di, array
	transferin: push cx
	
	      push  ds
	      push  si
	      xor   ax,ax
	      push  ax
	      push  ds
	      push  di
	      mov   ax, 10
	      push  ax
	      call  stringassign
	      pop   cx
	      add   si, 4
	      add   di,10
	      loop  transferin
	
	      mov   cx,100
	      lea   bx, array
	more: cmp byte ptr[bx], 0
	      jz    skip
	      add byte ptr[bx], 32
	skip: inc   bx
	      loop  more
	
	      mov   cx, 10
	      lea   si, array + 90
	transferout:push   cx
	
	      push  ds
	      push  si
	      push  cx
	      push  ds
	      push  di
	      xor   ax,ax
	      push  ax
	      call  stringassign
	      pop   cx
	      sub   si, 10
	      add   di, 4
	      loop  transferout
	
	      ret
	
	changearray endp
	      end
	
	Use the following Microsoft Macro Assembler command line to assemble
	the above code:
	
	   MASM CHGARRAY.ASM ;
	
	To create a Quick library from CHGARRAY.OBJ, use the following LINK
	line:
	
	   LINK /Q CHGARRAY,,,QBXQLB;
	
	To use this Quick library, enter QBX.EXE with the following statement:
	
	   QBX /L CHGARRAY
	
	The output for the above code example is as follows:
	
	   A
	   BB
	   CCC
	   DDDD
	   EEEEE
	   FFFFFF
	   GGGGGGG
	   HHHHHHHH
	   IIIIIIIII
	   JJJJJJJJJJ
	   jjjjjjjjjj
	   iiiiiiiii
	   hhhhhhhh
	   ggggggg
	   ffffff
	   eeeee
	   dddd
	   ccc
	   bb
	   a
