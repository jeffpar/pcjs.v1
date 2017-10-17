---
layout: page
title: "Q65307: M6110: MATH Floating-Point Error: Stack Overflow"
permalink: /pubs/pc/reference/microsoft/kb/Q65307/
---

## Q65307: M6110: MATH Floating-Point Error: Stack Overflow

	Article: Q65307
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist6.00
	Last Modified: 31-AUG-1990
	
	When compiled with global register allocation optimization turned on,
	the program produces the following error when executed:
	
	   run-time error M6110: MATH
	   - floating-point error: stack overflow
	
	This error should not occur. This problem occurs in both DOS and OS/2
	with either the emulator or 8087 math libraries.
	
	You can work around the problem by doing the following:
	
	1. Turn off global register allocation globally by not including the
	   /Oe switch on the compile line, or turn it off locally with the
	   #pragma optimize("e",off).
	
	2. Compile with the /Op switch. This improves the accuracy of floating
	   point calculations, but also slows execution.
	
	Sample Code
	-----------
	
	#include <malloc.h>
	
	//#pragma optimize("e",off) //uncomment this line and no error occurs
	
	void func(float *x1,float *y1,float *x2,float *y2,float *x3,float *y3,
	          unsigned size,float *xc1,float *yc1)
	    {
	    float   tx,ty ;
	
	    while (size--)
	        {
	        //_asm nop          //uncomment this line and no error occurs
	        tx = (*xc1 * *x1) - (*yc1 * *y1) ;
	        ty = (*xc1 * *y1++) + (*yc1 * *x1++) ;
	        *x3++ = (tx * *x2) - (ty * *y2) ;
	        *y3++ = (tx * *y2++) + (ty * *x2++) ;
	        }
	    }
	
	void main(void )
	    {
	    float   xx1[7],xx2[7],xx3[7],yy1[7],yy2[7],yy3[7] ;
	    float   xn,yn ;
	    unsigned    tsize = 7 ;
	
	    xn = 1 ;
	    yn = 0 ;
	    func (xx1,xx2,xx3,yy1,yy2,yy3,tsize,&xn,&yn) ;
	    }
	
	Microsoft has confirmed this to be a problem with C version 6.00. We
	are researching this problem and will post new information here as it
	becomes available.
