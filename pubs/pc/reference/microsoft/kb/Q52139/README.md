---
layout: page
title: "Q52139: Accessing Strings from Local (Stack) Pointers with _asm"
permalink: /pubs/pc/reference/microsoft/kb/Q52139/
---

	Article: Q52139
	Product: Microsoft C
	Version(s): 2.00 2.01
	Operating System: MS-DOS
	Flags: ENDUSER | s_quickasm
	Last Modified: 17-JAN-1990
	
	To access strings and other variables through auto pointers using the
	_asm keyword, WORD PTR should be used in place of OFFSET. The WORD PTR
	keyword will access the memory pointed to by the operand of the WORD
	PTR. This results in the desired indirection. See the program example
	below
	
	Program Example
	---------------
	
	/* STRING.C -- compile with /AS (small memory model)
	/* Notice the added \r and $ are added for int 21  */
	
	char string_var1[] = "This is string 1\r\n$" ;
	
	void main ( void )
	{
	  char *string_var2 = "This is string 2\r\n$" ;
	  _asm {
	    push dx
	
	    mov dx, word ptr string_var2
	    mov ah, 09h
	    mov al, 00h
	    int 21h
	
	; Notice that offset is used properly below (with the array).
	; In the case of *string_var1 (instead of string_var1[]),
	; word ptr should again be used as above.
	    mov dx, offset string_var1 ;
	    mov ah, 09h
	    mov al, 00h
	    int 21h
	
	    pop dx
	  }
	}
