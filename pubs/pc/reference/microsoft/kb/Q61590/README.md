---
layout: page
title: "Q61590: Passing a LONG INT in C to an Assembly Module"
permalink: /pubs/pc/reference/microsoft/kb/Q61590/
---

## Q61590: Passing a LONG INT in C to an Assembly Module

	Article: Q61590
	Version(s): 5.10 5.10a
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 21-MAY-1990
	
	The following code demonstrates passing a LONG INT (4 bytes) via a
	LONG pointer (4 bytes) to an assembly routine that accesses the LONG
	integer.
	
	Each integer is incremented in the assembly routine and its new value
	returned to the calling C program.
	
	The code is as follows:
	
	*********************************************************
	
	#include <stdio.h>
	#include <process.h>
	#include<conio.h>
	
	 extern void stuff (long *, long *);
	
	main()
	{
	  long *n1,*n2;               /*4 byte pointers*/
	
	  long int t1 = 9999999L; /*4 byte variables*/
	  long int t2 = 2256789L;
	
	 n1 = &t1;
	 n2 = &t2;
	
	                              /*initial values*/
	  printf("The values are  %ld and  %ld\n ", *n1, *n2);
	
	  printf("Incrementing values...\n");
	  stuff(n1,n2);
	
	              /*values returned by the assembly routine*/
	  printf("The values are  %ld and  %ld\n ", *n1, *n2);
	
	}
	
	========================================================
	
	.LALL
	.model large,C
	.data
	.code
	  stuff proc far arg1:dword, arg2:dword
	    push es                ;save registers
	    push si
	    les si,arg1            ;load in es:si the seg:offset of
	                           ; n1
	    inc word ptr es:[si]
	    jnc doarg2
	    inc word ptr es:[si+2] ;if carry then increment the high
	                           ; word of n1
	doarg2:
	    les si,arg2            ;load in es:si the seg:offset of
	                           ; n2
	    inc word ptr es:[si]
	    jnc finis
	    inc word ptr es:[si+2] ;if carry then increment the high
	                           ;word of n2
	finis:
	    pop si                 ;restore registers
	    pop es
	    mov sp,bp
	    ret
	  stuff endp
	
	  end
	
	*********************************************************
	*Makefile 'new':-
	*
	*all=1.obj 2.obj    (macro for all the obj's)
	*
	*1.obj: 1.c         (compiles the C module)
	*  cl /AL /c 1.c
	*
	*2.obj: 2.asm       (assembles the Assembler module)
	*  masm 2.asm,,2;
	*
	*1.exe: $(all)      (links modules with library)
	*   link /co $(all),,1,/nod llibcer;  (emulator lib name)
	*
	*Command Line to run makefile:  MAKE new
	*
	*********************************************************
