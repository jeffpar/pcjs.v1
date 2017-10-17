---
layout: page
title: "Q65330: C1001: Internal Compiler Error: '@(#)newcode.c:1.87', Line 535"
permalink: /pubs/pc/reference/microsoft/kb/Q65330/
---

## Q65330: C1001: Internal Compiler Error: '@(#)newcode.c:1.87', Line 535

	Article: Q65330
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist6.00
	Last Modified: 31-AUG-1990
	
	The code below generates an internal compiler error
	('@(#)newcode.c:1.87', line 535), when compiled with any optimization
	that includes /Oe. This error occurs with any memory model. The
	workaround is to not use the /Oe optimization.
	
	Sample Code
	-----------
	
	#include <stdlib.h>
	
	#pragma intrinsic (_rotl)
	
	void _cdecl ink(unsigned row, int nlines, unsigned char _huge *buff)
	{
	  _segment seg;
	  unsigned char _based(seg) *next_row;
	  union
	  {
	    unsigned char _based(seg) *ptr;
	    unsigned _based(seg) *iptr;
	  }p;
	
	  do
	  {
	    *p.ptr++ &= _rotl(*p.iptr,1) & *next_row++;
	    if ((int)p.ptr > 0xc000)
	       seg += 0xc000;
	  }while(1);
	}
	
	In the case of the above code, the easiest workaround is to use the
	optimize pragma to turn off the "e" optimization. In other cases that
	cause this error, similar solutions may be called for.
	
	Microsoft has confirmed this to be a problem with C version 6.00. We
	are researching this problem and will post new information here as it
	becomes available.
