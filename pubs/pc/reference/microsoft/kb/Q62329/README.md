---
layout: page
title: "Q62329: Internal Compiler Error '@(#)regMD.c:1.100', Line 4634"
permalink: /pubs/pc/reference/microsoft/kb/Q62329/
---

	Article: Q62329
	Product: Microsoft C
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist6.00
	Last Modified: 25-JUL-1990
	
	The two code samples below will produce the following internal
	compiler error when the code is compiled using the compact or large
	memory model:
	
	   fatal error C1001: Internal Compiler Error
	   (compiler file '@(#)regMD.c:1.100', line 4634)
	   Contact Microsoft Product Support Services
	
	This error can occur with various optimizations. In general, compiling
	with /Od (no optimization) or /Ox (maximum save optimization) will
	work correctly. In the following examples, there are various
	"failsafe" optimizations that can cause the error to go away. If one
	of these optimizations is used on a compile line that would otherwise
	cause the internal compiler error, the error will not appear.
	
	 1. /** Code Sample1 **/
	 2.
	 3. struct str
	 4. {
	 5.    int *a;
	 6.    int b;
	 7. };
	 8.
	 9. void foo(struct str * w)
	10. {
	11.    dog( w->a[(*w).b], w->a[w->b+1] & w->a[w->b]);
	12. }
	
	In this example, using any combination that doesn't include /Oe will
	result in the above error. As soon as /Oe is included, the error
	doesn't occur. For example:
	
	   cl /c /AL /Oacgilnprstwz  foo.c    << Fails with error.
	
	   cl /c /AL /Oacgilnprstwze foo.c    << Works correctly, no error.
	   cl /c /AL /Oanprswzx      foo.c    << Also works correctly.
	
	In the second working compile line, remember that /Ox includes /Oe
	(actually /Ox = /Ocegilt /Gs).
	
	 1. /** Code Sample2 **/
	 2.
	 3. struct cat{
	 4.    int x;
	 5.    int y;
	 6.    int dog[7];
	 7. };
	 8.
	 9. void g(struct cat foo[0][1])
	10. {
	11.    int a=0;
	12.    int b=0;
	13.    unsigned int  c=0;
	14.
	15.    char buf[1];
	16.
	17.    if(0);
	18.
	19.    buf[0] = foo[a][b].x << 1 + foo[a][b].y;
	20.    buf[0] = c + foo[a][b].x;
	21. }
	
	In the above example, using /Oe will correct the problem. However, /Ol
	and /Og will also work correctly. Again, any combination of the other
	optimizations will result in the above error until one of the
	"failsafe" optimizations are used.
	
	If you want to change the code in the program, the following are some
	code sequences that seem to cause the error:
	
	1. Global struct
	
	2. Structure passed to function
	
	3. Complex dereference of structure member
	
	Usually, modifying the code to change this sequence will cause the
	error to go away. For instance, in Example 2, any of the following
	changes will eliminate the error:
	
	1. Change dog[7] to dog [6] and declare a dummy int to pad the
	   structure.
	
	2. Change "c" from an unsigned int to int.
	
	3. Change the order of the code or use a temporary variable in the
	   assignment statement.
