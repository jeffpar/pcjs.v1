---
layout: page
title: "Q66105: Code Generation Error with /Gs"
permalink: /pubs/pc/reference/microsoft/kb/Q66105/
---

## Q66105: Code Generation Error with /Gs

	Article: Q66105
	Version(s): 6.00  6.00a | 6.00 6.00a
	Operating System: MS-DOS      | OS/2
	Flags: ENDUSER | buglist6.00 buglist6.00a
	Last Modified: 22-OCT-1990
	
	When the sample code shown below is compiled with stack checking
	disabled (/Gs) and default optimizations, the compiler generates
	incorrect code.
	
	The following code/assembly listing shows that the stack frame is
	never initialized upon entry to the function. In other words, the base
	pointer, BP, is not pushed onto the stack and the stack pointer, SP,
	is not moved into BP.
	
	However, the procedure continues to reference BP to access the
	parameters passed to the function. Furthermore, at the end of the
	assembly procedure, the stack frame is restored; the value of BP is
	moved into SP and BP is popped off the stack.
	
	Turning off default optimizations (/Od) or rearranging portions of the
	code causes the stack frame to be initialized upon entry to the
	function.
	
	Sample Code
	-----------
	
	struct foo {
	     int i;
	};
	
	unsigned u;
	char ch;
	void func(char);
	
	unsigned test(struct foo *a[], int *x, int y)
	{
	     struct foo *tmp;
	
	     u=(ch << 8);
	     func(ch);
	
	     *x=y;
	     tmp=a[y];
	}
	
	Partial .COD listing
	--------------------
	
	Note: The program is compiled with the following: cl /c /Gs /Fc program.c
	
	_test     PROC NEAR
	                                     ; no stack frame set up
	
	     *** 000000     56        push si
	;    tmp = -2
	;    y = 8
	;    x = 6
	;    a = 4
	
	     .
	     .
	     .
	
	;|***      *x=y;
	;|***      tmp=a[y];
	; Line 17
	     *** 000013     8b 5e 08  mov  bx,WORD PTR [bp+8] ;y  *uses bp*
	     *** 000016     8b 76 06  mov  si,WORD PTR [bp+6] ;x
	     *** 000019     89 1c          mov  WORD PTR [si],bx
	;|*** }
	; Line 18
	     *** 00001b     5e        pop  si
	     *** 00001c     8b e5     mov  sp,bp    ; un-does the stack
	     *** 00001e     5d        pop  bp       ; frame it never set up
	     *** 00001f     c3        ret
	
	_test     ENDP
	
	Microsoft has confirmed this to be a problem with the C compiler
	versions 6.00 and 6.00a. We are researching this problem and will post
	new information here as it becomes available.
