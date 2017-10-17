---
layout: page
title: "Q66508: -Aw/-Au Uses Wrong Segment When Passing Pascal Function Return"
permalink: /pubs/pc/reference/microsoft/kb/Q66508/
---

## Q66508: -Aw/-Au Uses Wrong Segment When Passing Pascal Function Return

	Article: Q66508
	Version(s): 6.00 6.00a  | 6.00 6.00a
	Operating System: MS-DOS      | OS/2
	Flags: ENDUSER | buglist6.00 buglist6.00a
	Last Modified: 9-NOV-1990
	
	When compiling for DS!=SS (-Au or -Aw) and when passing the return
	value of a Pascal function that returns a structure to another
	function, the compiler will use the BX register for accessing the
	returned structure without an SS override. (Memory accesses default to
	the DS register unless the BP or SP register is involved in the
	address calculation, in which case SS is the default.)
	
	The compiler does correctly issue the following warning in this
	situation:
	
	   test.c(18): warning C4059: segment lost in conversion
	
	Code Example
	------------
	
	#include <stdio.h>
	
	struct s {int i,j,k,l; };
	
	struct s pascal foo(void)
	{
	struct s b = {1, 2, 3, 4};
	
	    return b;
	}
	
	void foobar(struct s b)
	{
	    printf("%d %d %d %d\n", b.i, b.j, b.k, b.l);
	}
	
	void main () {
	   foobar(foo());       /* this line causes warning C4059 */
	}
	
	The problem is shown in the following excerpt of the .COD (/Fc)
	listing. Note the structure was returned on the stack, not in DGROUP.
	Without /Au or /Aw, this is acceptable because the stack is IN DGROUP.
	However, when /Au or /Aw is used, this will cause the words to be
	read from the wrong segment.
	
	;| |***    foobar(foo());         /* this line causes warning C4059 */
	; Line 18
	   *** 00006d      8d 46 f8                lea     ax,WORD PTR [bp-8]
	   *** 000070      50                      push    ax
	   *** 000071      e8 8c ff                call    FOO
	   *** 000074      8b d8                   mov     bx,ax
	   *** 000076      ff 77 06                push    WORD PTR [bx+6]
	   *** 000079      ff 77 04                push    WORD PTR [bx+4]
	   *** 00007c      ff 77 02                push    WORD PTR [bx+2]
	   *** 00007f      ff 37                   push    WORD PTR [bx]
	   *** 000081      e8 c0 ff                call    _foobar
