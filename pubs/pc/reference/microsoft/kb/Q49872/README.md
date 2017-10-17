---
layout: page
title: "Q49872: Fread() Can Read More Than 64K at a Time"
permalink: /pubs/pc/reference/microsoft/kb/Q49872/
---

## Q49872: Fread() Can Read More Than 64K at a Time

	Article: Q49872
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | S_QuickC
	Last Modified: 30-NOV-1989
	
	It is possible to read more than 64K at a time with the fread()
	function by specifying an item size greater than 1 and a count from 1
	to 64K. The resulting number of bytes read will be the product of size
	and count.
	
	The follow code demonstrates how to read a file 200K in length:
	
	/* Must be compiled in huge memory model */
	#include <stdio.h>
	
	char huge buffer[205000];
	
	void main(void)
	{
	     FILE *fp;
	
	     fp=fopen("testfile.dat","r");
	
	     fread(buffer,4,51200,fp);     /* 51200*4=204,800 */
	
	    /* The value returned from the line above will be the number of
	       items read. This number is limited to 64K because it is of
	       type size_t. But remember, the total number of bytes read is
	       equal to the number of items times the size of each item, which
	       is 4 bytes in this case. Therefore, the total bytes read
	       is 4 times 51200 or 204,800 bytes. */
	}
