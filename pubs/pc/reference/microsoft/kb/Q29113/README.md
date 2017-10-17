---
layout: page
title: "Q29113: Example of Passing C Strings to Assembly Language"
permalink: /pubs/pc/reference/microsoft/kb/Q29113/
---

## Q29113: Example of Passing C Strings to Assembly Language

	Article: Q29113
	Version(s): 5.00 5.10 6.00 6.00a | 5.10 6.00 6.00a
	Operating System: MS-DOS               | OS/2
	Flags: ENDUSER | h_masm
	Last Modified: 5-FEB-1991
	
	The following code is an example program that passes a string to an
	assembly language routine. The routine will access the string, change
	one character, and return.
	
	Sample Code
	-----------
	
	/*  C program - compile with defaults (small model) */
	
	#include <string.h>
	#include <stdio.h>
	
	void main(void);             /* Prototype for main */
	void extern changit(char *); /* Assembly routine declaration*/
	char s[10];                  /* String to be changed */
	
	void main()
	{
	        strcpy(s,"xxxxxxxxx"); /* Initialize string to x's */
	        printf("s = %s\n",s);
	        changit(s);            /* Call assembly routine */
	        printf("s = %s\n",s);  /* See if string changed */
	}
	
	=============================================================
	
	;Assembly language routine -- assemble with /Mx
	;
	
	.MODEL SMALL
	.CODE
	        PUBLIC  _changit
	_changit PROC
	        push    bp                  ;Entry sequence
	        mov     bp,sp
	
	        mov     bx,[bp+4]           ;Put array address in bx
	        mov     [bx+8],byte ptr 'Y' ;Change the 9th character
	                                    ;0 is the first, 1 is second...
	
	        pop     bp                  ; Exit sequence
	        ret
	
	_changit ENDP
	        END
