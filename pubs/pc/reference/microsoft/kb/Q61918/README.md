---
layout: page
title: "Q61918: Internal Compiler Error: C1001, regMD.c, Line 1017"
permalink: /pubs/pc/reference/microsoft/kb/Q61918/
---

## Q61918: Internal Compiler Error: C1001, regMD.c, Line 1017

	Article: Q61918
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist6.00
	Last Modified: 13-JUN-1990
	
	The code sample shown below generates the following internal compiler
	error when compiled with /Oe in either small or medium memory model:
	
	   foo2.c(16) : fatal error C1001: Internal Compiler Error
	                   (compiler file '@(#)regMD.c:1.100', line 1017)
	                   Contact Microsoft Product Support Services
	
	Sample Code
	-----------
	
	#include <dos.h>
	#include <malloc.h>
	
	typedef struct {
	   unsigned    offset ;
	   unsigned    usize ;
	} struct1 ;
	
	void foo (unsigned handle, struct1 *pdata)
	{
	   unsigned char far *buffer ;
	   unsigned numbytes ;
	
	   FP_OFF (buffer) = pdata->offset = (unsigned) malloc (pdata->usize) ;
	
	   _dos_read (handle, buffer, (unsigned) pdata->usize, &numbytes) ;
	}
	
	There are three workarounds possible for this specific problem:
	
	1. Do not compile with the /Oe switch.
	
	2. Use the optimize pragma to disable the /Oe optimization for this
	   particular routine. Above the routine foo, add the following line:
	
	      #pragma optimize ("e", off)
	
	   After the closing curly bracket of foo, you can turn the optimization
	   back on with the following:
	
	      #pragma optimize ("e", on)
	
	3. Use a temporary variable for the return value of malloc, as
	   follows:
	
	      unsigned offset ;
	
	      offset = (unsigned) malloc (pdata->usize) ;
	      FP_OFF (buffer) = pdata->offset = offset ;
	
	Microsoft has confirmed this to be a problem with C version 6.00. We
	are researching this problem and will post new information here as it
	becomes available.
