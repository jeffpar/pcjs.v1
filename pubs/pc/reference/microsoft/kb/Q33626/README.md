---
layout: page
title: "Q33626: Assembly Routine Using STD Works in QB 3.00, Not 4.00"
permalink: /pubs/pc/reference/microsoft/kb/Q33626/
---

## Q33626: Assembly Routine Using STD Works in QB 3.00, Not 4.00

	Article: Q33626
	Version(s): 3.00 4.00 4.00B 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 6-DEC-1989
	
	An assembly-language subprogram that uses the STD instruction (sets
	the direction flag to indicate that strings will process down from
	high addresses to low addresses) may not print the string correctly in
	QuickBASIC Version 4.00 unless the flag is first cleared before
	returning, using the CLD instruction. Although this is the recommended
	way to program the assembly language subprogram, QuickBASIC Version
	3.00 prints the string correctly even if the flag was not cleared.
	
	The following is a code example:
	
	'This BASIC program calls the MASM subprogram RTrim, with a string variable
	'and an integer as variables. Rtrim looks at the given string and returns
	'the string's length, minus any trailing blank characters.
	
	DEFINT A-Z
	length = 0
	INPUT "String: ", x$         'Take a string, any string....
	x$ = x$ + STRING$(2, 32)     'Add two trailing blank characters.
	PRINT x$; LEN(x$)            'Print the string and its length.
	CALL RTrim(x$, length)
	x$ = LEFT$(x$, length)       'Chop off any trailing blanks.
	PRINT x$; LEN(x$)            'Print the new string and its new length.
	END
	
	.MODEL  MEDIUM
	.CODE
	        PUBLIC RTrim
	RTrim   PROC
	        push    bp
	        mov     bp,sp
	        push    es
	        push    ds              ;Be sure ES and DS match.
	        pop     es
	        mov     bx,[bp+8]       ;Get the string's descriptor.
	        mov     di,[bx+2]       ;DI points to the string.
	        mov     cx,[bx]         ;Get the string's length in CX.
	        jcxz    exit            ;Length = 0?  If it is, then exit.
	        add     di,cx           ;DI points past the string.
	        dec     di              ;DI now points to the last character in
	                                ;the string.
	        std                     ;Direction: High to Low.
	        mov     al,20h          ;Blank to look for.
	        repe    scasb           ;Repeat until a character other than
	                                ;a blank is found.
	        mov     bx,[bp+6]       ;Now get the word to store the length.
	        jnz     go_on           ;If found then go ahead,
	        mov     word ptr [bx],0 ;else store 0 in the word pushed as 2nd
	        jmp     short exit      ;parameter, then exit.
	go_on:  inc     cx
	        mov     [bx],cx         ;Store it in Arg1.
	exit:   cld                     ;****Need this to run with QuickBASIC 4.00.
	        pop     es              ;Restore the initial values for ES and
	        pop     bp              ;BP as required.
	        ret     4               ;Pop off the two parameters before
	RTrim   ENDP                    ;returning to caller.
	        END
	
	   The following are the results without the CLD instruction in
	QuickBASIC Version 4.00:
	
	   String: abcdefghijklmnopqrstuvwxyz
	   abcdefghijklmnopqrstuvwxyz   28
	   a8   zyxwvutsrqponmlkjif 26
	
	   The following are the results in QuickBASIC Version 3.00, or with
	the CLD instruction in QuickBASIC Version 4.00:
	
	   String: abcdefghijklmnopqrstuvwxyz
	   abcdefghijklmnopqrstuvwxyz   28
	   abcdefghijklmnopqrstuvwxyz 26
