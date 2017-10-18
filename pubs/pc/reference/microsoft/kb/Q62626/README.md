---
layout: page
title: "Q62626: Passing a Structure from C to Assembly"
permalink: /pubs/pc/reference/microsoft/kb/Q62626/
---

## Q62626: Passing a Structure from C to Assembly

	Article: Q62626
	Version(s): 5.10 5.10a
	Operating System: MS-DOS
	Flags: ENDUSER | Struc
	Last Modified: 12-JUN-1990
	
	The code sample below illustrates how to pass a structure from a C
	module to an assembly module. This code makes it possible to access
	the structure fields within the assembly module using the "." field
	operator.
	
	Within the assembly module a structure is declared. This structure is
	used as a template by the assembler to resolve accessing the fields of
	the structure. The structure may be given any label name.
	
	The following is the sample code:
	
	#include <stdio.h>
	#include "d:\testm\struc\alpha.h" /*include file & path*/
	
	/*Contents of the Header File*/
	/*=================================*/
	/*struct foo{
	 *      int num;
	 *      char one[5];
	 *      }
	 */
	
	struct foo good,*f_ptr;
	extern void ptr_proc(struct foo*);
	
	main()
	
	{
	f_ptr = &good;
	 good.one[0]='R';  /*hex 52*/
	 good.one[2]='O';  /*hex 4F*/
	 good.num=0x0b12;
	 ptr_proc (f_ptr);
	
	/*Incremented Values on returning to C*/
	/*====================================*/
	
	printf("Good.one[0] is now  %c\n", good.one[0]);
	
	printf("Good.one[2] is now  %c\n", good.one[2]);
	
	printf("Good.num is now %x\n",  good.num);
	
	}
	
	/*************************************************/
	
	 ; Contents of the DELTA.INC Include file. The structure provides a
	 ; template that the assembler recognizes.
	
	 ;  delta struc
	 ;        num dw ?
	 ;        one db 5 dup (?)
	 ;  delta ends
	
	.model small,C
	.data
	
	.code
	
	ptr_proc proc
	
	       push bp
	       mov bp,sp
	
	       include d:\testm\struc\DELTA.INC
	
	       mov bx,offset [bp+4].num
	       mov ax, word ptr[bx].num
	       inc [bx].num
	
	       mov di,word ptr[bx].one
	       inc [bx].one
	
	       mov ax, word ptr[bx+2].one
	       inc [bx+2].one
	
	       pop bp
	       ret
	
	ptr_proc endp
	
	       end
	 /**************************************************/
	
	The following MAKE file "new" was used:
	
	all = 1.obj 2.obj
	
	1.obj: 1.c
	     CL /c 1.c
	
	2.obj: 2.asm
	     MASM 2.asm;
	
	1.exe: $(all)
	     link $(all),,,/nod slibcer;
	
	The command line was: MAKE new
	
	/******************************************************/
	
	The output is as follows:
	
	   Good.one[0] is now  S
	   Good.one[2] is now  P
	   Good.num is now b13
