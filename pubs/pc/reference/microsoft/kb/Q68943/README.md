---
layout: page
title: "Q68943: calloc() Can Return a Pointer to a Zero Length Block of Memory"
permalink: /pubs/pc/reference/microsoft/kb/Q68943/
---

	Article: Q68943
	Product: Microsoft C
	Version(s): 6.00 6.00a | 6.00 6.00a
	Operating System: MS-DOS     | OS/2
	Flags: ENDUSER | docerr
	Last Modified: 6-FEB-1991
	
	There is a documentation error in the description of the calloc()
	function in the "Microsoft C Run-Time Library Reference" manual and in
	the online help that shipped with Microsoft C versions 6.00 and 6.00a.
	
	Page 136 of the "Microsoft C Run-Time Library Reference" states, "The
	_fcalloc and _ncalloc functions return NULL if there is insufficient
	memory available or if num or size is 0." Actually, they will return
	NULL only if there is insufficient memory for the request. If one of
	the arguments is of size zero, calloc(), _ncalloc(), and _fcalloc()
	will return a pointer to a block of size 0 bytes.
	
	Sample Code
	-----------
	
	#include <stdio.h>
	#include <malloc.h>
	
	void _near *foo;
	void _far  *goo;
	
	void main(void)
	{
	   foo = _ncalloc(0,1);
	   goo = _fcalloc(0,1);
	
	   if (NULL == foo) printf("Foo is null.\n");
	
	   else printf("Foo points to a block %d bytes long.\n",_nmsize(foo));
	
	   if (NULL == goo) printf("Goo is null.\n");
	
	   else printf("Goo points to a block %d bytes long.\n",_fmsize(goo));
	}
	
	When this program is executed, the output is as follows:
	
	   Foo points to a block 0 bytes long.
	   Goo points to a block 0 bytes long.
