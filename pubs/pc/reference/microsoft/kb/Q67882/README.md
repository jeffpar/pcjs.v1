---
layout: page
title: "Q67882: Error C2213 Occurs When Base Is an Expression"
permalink: /pubs/pc/reference/microsoft/kb/Q67882/
---

	Article: Q67882
	Product: Microsoft C
	Version(s): 6.00 6.00a | 6.00 6.00a
	Operating System: MS-DOS     | OS/2
	Flags: ENDUSER | docerr
	Last Modified: 16-JAN-1991
	
	The following are new to C 6.00:
	
	   _based
	   _segment
	
	Variables of type _segment are defined to hold a memory segment
	address.
	
	With based variables, you name a base to specify where the data
	resides. The base can be of type _segment, or be a near or a far
	pointer. However, if the base is an expression, even of one of the
	types listed above, the following error is produced:
	
	   error C2213: illegal argument to _based
	
	Microsoft has confirmed that this is a restriction, although it is not
	documented as such.
	
	The following examples illustrate the restriction:
	
	This declaration is valid:
	
	   _segment foo;
	   char _based( foo ) *cptr;
	
	The following declaration
	
	   struct sample
	   {
	       _segment foo;
	   }rec;
	   char _based( rec.foo ) *cptr;
	
	produces the following error:
	
	   error C2213: 'rec': illegal argument to _based
	   error C2059: syntax error: '.'
	
	The following declaration
	
	   _segment array[10];
	   char _based( array[0] ) *cptr;
	
	produces the following error:
	
	   error C2059: syntax error: '['
