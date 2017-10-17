---
layout: page
title: "Q23868: How to Do &quot;Peeks&quot; and &quot;Pokes&quot; in a C Program"
permalink: /pubs/pc/reference/microsoft/kb/Q23868/
---

## Q23868: How to Do &quot;Peeks&quot; and &quot;Pokes&quot; in a C Program

	Article: Q23868
	Version(s): 3.00 4.00 5.00 5.10 6.00 6.00a
	Operating System: MS-DOS
	Flags: ENDUSER | s_quickc
	Last Modified: 6-FEB-1991
	
	The sample code below contains two functions that simulate what are
	commonly known as "peek" and "poke" functions. The peek() function
	allows you to look at the contents of any memory location while the
	poke() function allows you to place a value into any memory location.
	
	Sample Code
	-----------
	
	/* The following function will stuff a value into any location in
	   addressable memory. seg:ofs = val.
	*/
	
	void poke(unsigned int seg, unsigned int ofs, char val)
	{
	    unsigned char far *ptr;
	
	    ptr = (unsigned char far *) (((long)seg<<16)|(long)ofs);
	    *ptr = val;
	}
	
	/* The following function will return the contents of any location in
	   addressable memory. return(seg:ofs).
	*/
	
	unsigned char peek(unsigned int seg, unsigned int ofs)
	{
	    unsigned char far *ptr;
	
	    ptr = (unsigned char far *) (((long)seg<<16)|(long)ofs);
	    return(*ptr);
	}
