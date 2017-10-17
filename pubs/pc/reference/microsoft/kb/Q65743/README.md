---
layout: page
title: "Q65743: Invalid Offset Generated for jmp After In-Line Assembly"
permalink: /pubs/pc/reference/microsoft/kb/Q65743/
---

## Q65743: Invalid Offset Generated for jmp After In-Line Assembly

	Article: Q65743
	Version(s): 6.00    | 6.00
	Operating System: MS-DOS  | OS/2
	Flags: ENDUSER | buglist6.00 fixlist6.00a
	Last Modified: 24-SEP-1990
	
	The Microsoft C version 6.00 compiler can generate incorrect offsets
	for jmp instructions following the termination of in-line assembly
	blocks in certain situations.
	
	The sample code below will generate the incorrect offset for the
	return statement following the termination of its in-line assembly
	block. The only known workaround is to compile with the /qc option,
	thus invoking the quick compiler.
	
	If the optimize pragma is removed from this code, it will generate the
	following error with any command-line optimization switch.
	
	   fatal error C1001: Internal Compiler Error
	   (compiler file '@(#)main.c:1.176', line 807)
	   Contact Microsoft Product Support Services
	
	Sample Code
	-----------
	
	#pragma optimize("",off)
	
	#include<stdio.h>
	
	long double asin(long double f_in)
	{
	    _asm
	    {
	        fld      f_in
	        fld      st
	        fmul     st,st
	        fld1
	        fcom     st(1)
	        fstsw    ax
	        sahf
	        jc       toobig
	        fsubr
	        fsqrt
	/*      fxch     st(1)  uncomment for acos */
	        fpatan
	        jmp      done
	toobig:
	        fstp     st
	        fstp     st
	        fabs
	        fchs
	        fsqrt
	done:
	        fstp     f_in
	     }
	     return f_in;
	}
	
	main()
	{
	    char s[200];
	    long double f_in,f_out;
	    f_in=0.0;
	    while(gets(s)!=NULL)
	    {
	        if (sscanf(s,"%Lf",&f_in)==1)
	        {
	           f_out=asin(f_in);
	           printf("in %Lf asin %Lf\n",f_in,f_out);
	        }
	    }
	    exit(0);
	}
	
	The following is incorrect code generated as viewed from within
	CodeView's mixed source/assembly mode (compiled with cl /Od /Zi
	file.c):
	
	29:         fstp     f_in
	0047:004C 9B             WAIT
	0047:004D DB7E04         FSTP      TByte Ptr [BP+04]
	30:          }
	31:          return f_in;
	0047:0050 9B             WAIT
	0047:0051 DB6E04         FLD       TByte Ptr [BP+04]
	0047:0054 9B             WAIT
	0047:0055 D9C0           FLD       ST(0)    ; different from below
	0047:0057 9B             WAIT
	0047:0058 DDD9           FSTP      ST(1)    ; perhaps repetitive
	0047:005A 90             NOP
	0047:005B 9B             WAIT
	0047:005C E9FAFF         JMP       0059 ;notice incorrect offset here
	32:     }
	0047:005F 5E             POP       SI
	0047:0060 5F             POP       DI
	0047:0061 8BE5           MOV       SP,BP
	0047:0063 5D             POP       BP
	0047:0064 C3             RET
	33:
	
	The following is correct code (compiled with cl /qc /Od /Zi file.c):
	
	0047:004C 9B             WAIT
	0047:004D DB7E04         FSTP      TByte Ptr [BP+04]
	30:          }
	31:          return f_in;
	0047:0050 9B             WAIT
	0047:0051 DB6E04         FLD       TByte Ptr [BP+04]
	0047:0054 90             NOP
	0047:0055 9B             WAIT
	0047:0056 E90000         JMP       0059              ; offset correct here
	32:     }
	0047:0059 5F             POP       DI
	0047:005A 5E             POP       SI
	0047:005B 8BE5           MOV       SP,BP
	0047:005D 5D             POP       BP
	0047:005E C3             RET
	33:
	
	Microsoft has confirmed this to be a problem in C version 6.00. We are
	researching this problem and will post new information here as it
	becomes available.
