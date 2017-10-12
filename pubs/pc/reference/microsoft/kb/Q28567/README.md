---
layout: page
title: "Q28567: Reference Page 75 Example 9 Causes Error C2147"
permalink: /pubs/pc/reference/microsoft/kb/Q28567/
---

	Article: Q28567
	Product: Microsoft C
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | docerr
	Last Modified: 12-OCT-1988
	
	Using example nine on Page 75 of the "Microsoft C 5.1 Optimizing
	Compiler Language Reference" manual causes the compiler error
	"C2147: array: unknown size" on the line "(int *) p++".
	
	The example is incorrect. Instead of using example nine, use one of
	the two following examples:
	
	1. ((int*) p)++;
	2. p = (void *) ((char *) p + sizeof(int));
	
	Note that the expression "((int *) p)++" is a non-standard extension
	to the language, and the compiler will issue a warning.
	
	See Pages 99-100 of the user's guide for a discussion of enabling
	and disabling language extensions with the /Ze and /Za switches.
	There is an example at the bottom of Page 99, which is almost
	identical.
	
	Example nine on Page 75 is as follows:
	
	        int i;
	        void *p;
	
	        p = &i;
	        (int *) p++;
	
	The expression "(int *) p++" generates the C2147 error because the
	"++" operation is preformed before the "(int *)" cast. Thus, the
	expression is trying to increment a pointer that points to a void.
	Because void has no size, the compiler does not know how many bytes
	"p" should be incremented by.
	
	By using the extra parentheses in the expression "((int *) p)++", you
	are forcing the "(int *)" to convert "p" from a pointer-to-void to a
	pointer-to-int, which can be incremented.
	
	The second workaround, "p = (void *) ((char *) p + sizeof(int))",
	works correctly because you are telling the compiler how many bytes to
	increment the pointer.
	
	The second workaround is standard ANSI C and should compile on any
	standard ANSI C compiler.
