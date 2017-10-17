---
layout: page
title: "Q64791: Intrinsic Form of memcpy() Can Produce Incorrect Code"
permalink: /pubs/pc/reference/microsoft/kb/Q64791/
---

## Q64791: Intrinsic Form of memcpy() Can Produce Incorrect Code

	Article: Q64791
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist6.00
	Last Modified: 15-AUG-1990
	
	In rare cases, the intrinsic form of memcpy may produce incorrect code
	in the large memory model.
	
	The code below, if compiled with the large memory model (/AL) and any
	optimization that includes intrinsic functions (/Oi, /Ox, /Oz), will
	cause the machine to hang under DOS and cause a protection violation
	under OS/2.
	
	To work around this problem, either compile without the /Oi option or
	use #pragma "function(memcpy)" to specify the use of the function form
	of memcpy(). The pragma may be turned off for functions following it
	by using #pragma intrinsic(memcpy) to go back to the intrinsic form of
	memcpy.
	
	Sample Code
	-----------
	
	#include <stdio.h>
	#include <string.h>
	#include <malloc.h>
	
	typedef struct
	{
	   int     dummy;
	   char  *f_char[8];
	   char  *f_attr[8];
	} t_field;
	
	void copy_fieldtxt(t_field *, t_field *, int, int);
	
	void main(void)
	{
	
	   t_field *src, *dst;
	   void    *calloc();
	
	   src=(t_field *)calloc(1,sizeof(t_field));
	   dst=(t_field *)calloc(1,sizeof(t_field));
	
	   src->f_char[0]= strdup("Text string");
	   src->f_attr[0]= strdup("attribute string");
	
	   dst->f_char[1]=strdup("Text string");
	   dst->f_attr[1]=strdup("attribute string");
	
	   copy_fieldtxt(src,dst,0,1);
	   printf("dst->attr[1]==>%s\n",dst->f_attr[1]);
	
	}
	/* Copies src->f_char[srcndx] to dst->f_char[dstndx]
	    and src->f_attr[srcndx] to dst->f_attr[dstndx] */
	void copy_fieldtxt(t_field *src, t_field *dst, int srcndx, int dstndx)
	{
	   int maxlen=strlen(dst->f_attr[dstndx]);
	
	   memcpy(dst->f_char[dstndx], src->f_char[srcndx], maxlen);
	   memcpy(dst->f_attr[dstndx], src->f_attr[srcndx],maxlen);
	}
	
	Microsoft has confirmed this to be a problem in C version 6.00. We are
	researching this problem and will post new information here as it
	becomes available.
