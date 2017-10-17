---
layout: page
title: "Q42213: Error in Adding Longs Returned by Reference"
permalink: /pubs/pc/reference/microsoft/kb/Q42213/
---

## Q42213: Error in Adding Longs Returned by Reference

	Article: Q42213
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist1.01 fixlist2.00 buglist5.10
	Last Modified: 16-JAN-1990
	
	The program below does not properly perform the addition specified
	when compiled for the compact- or large-memory model.
	
	Any time three or more numbers are added (e.g in the example below)
	all values between the first and last number are incorrectly added.
	The workaround is to use temporary variables as necessary.
	
	Microsoft has confirmed this to be a problem in Version 1.01 and 5.10.
	This problem was corrected in Version 2.00.
	
	The following code demonstrates the problem:
	
	    #include <stdio.h>
	
	    void     * foo( long * num );
	
	    void * foo( long * num )
	    {
	        return( (void *) num );
	    }
	
	    void main()
	    {
	        long num1  = 100,
	             num2  = 200,
	             num3  = 300,
	             total = 0;
	
	        total = * (long *) foo( &num1 ) +
	                * (long *) foo( &num2 ) +
	                * (long *) foo( &num3 );
	        if (total != 600)
	        {
	            printf("Did not compute.\n");
	        }
	    }
	
	The addition is performed incorrectly because of the manner in which
	the compiler generates code to handle the intermediate value obtained
	by dereferencing the pointer returned by foo( &num2 ). In compact
	model, the relevant assembly code appears similar to the following:
	
	    .
	    .
	    .
	    mov     ax, word ptr es:[bx]        ; here we dereference &num2
	    mov     word ptr [bp-22], ax        ;     storing the 200
	    mov     ax, word ptr es:[bx+2]      ;     in bp-22
	    mov     word ptr [bp-20], ax        ;     and bp-20
	    .
	    .
	    .
	    mov     word ptr [bp-24], es    ; store segment of &num2 (this was
	                                    ; moved into es after being
	                                    ; returned in dx earlier)
	    call    _foo                        ; passing &num1 this time
	    add     sp, 4
	    mov     bx, ax                      ; es:bx holds address of num1
	    mov     es, dx                      ; returned from foo
	    mov     ax, word ptr es:[bx]        ; dereference address of
	    mov     dx, word ptr es:[bx+2]      ; num1, store in ax, dx
	*   mov     bx, word ptr [bp-24]        ; here's the bad one:  bp-24
	*   add     ax, word ptr [bx]        ; contains the segment of &num2
	*   adc     dx, word ptr [bx+2]         ; not the contents of &num2
	    add     ax, si                      ; add num3, which was
	    adc     dx, si                      ; stored in si + di
	    .
	    .
	    .
	
	The function foo is called with &num3, &num2, and &num1, in that order.
	The contents of num3 (300 in this case) are stored in the si and di
	registers. The contents of num2 (200 in this case) are stored in bp-22
	and bp-20. At the same time this is done, the segment of &num2 is stored
	in bp-24. The contents of num1 (100 in this case) are stored in the ax,
	dx register pair.
	
	The problem occurs when an attempt is made to add num2. Even though
	it was stored properly, the instructions generated to perform the
	addition try to retrieve the value of num2 by using the segment stored
	in bp-24 as an offset, rather then directly adding what was stored.
	Replacing the three lines marked with an asterisk with these three
	lines produces the correct result, as follows:
	
	   mov     es, [bp-24]
	   add     ax, es:[bp-22]
	   adc     dx, es:[bp-20]
