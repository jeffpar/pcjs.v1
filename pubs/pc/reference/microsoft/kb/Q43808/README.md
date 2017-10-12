---
layout: page
title: "Q43808: C: srand() Sample Program Does Not Print Out the Array Values"
permalink: /pubs/pc/reference/microsoft/kb/Q43808/
---

	Article: Q43808
	Product: Microsoft C
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | DOCERR S_QuickC
	Last Modified: 22-MAY-1989
	
	In the following manuals, the sample program given for the function
	srand() implies that it will print out random values for each of the
	array elements. Although the array is filled with random values, these
	values are not printed because the "for" loop is implemented
	incorrectly. This example is given in both the "Microsoft C for the
	MS-DOS Operating System Run-Time Library Reference" manual for
	Versions 5.00 and 5.10, and the "Microsoft QuickC Run-Time Library
	Reference" manual for Versions 1.00 and 1.10.
	
	The following source code fragment is excerpted from the sample
	program found in the "Microsoft QuickC Run-Time Library Reference"
	manual on Page 564.
	
	    srand(17);
	    for (x = 0; x < 20; ranvals[x++] = rand())
	      printf("Iteration %d, ranvals[%d] =%d\n",x+1, x, ranvals[x]);
	
	If you execute the program as written, it produces a list of all zeros
	instead of a list of the random numbers being put into the array. To
	understand why this is so, the definition of a for loop must be
	considered. The for loop defined by Kernighan and Ritchie is as
	follows:
	
	    for (expr1, expr2, expr3)
	        statement;
	
	    is equivalent to:
	
	    expr1;
	    while (expr2)
	       {
	       statement;
	       expr3;
	       }
	
	If the above sample program is substituted into this definition, then
	the program reads as follows:
	
	    srand(17);
	    x = 0;
	    while (x < 20)
	       {
	       printf("Iteration %d, ranvals[%d] =%d\n",x+1,x,ranvals[x]);
	       ranvals[x++] = rand();
	       }
	
	This program obviously prints the array elements one step before they
	are initialized, which is why the sample program prints out all zeros
	instead of the desired random numbers.
	
	To display the correct results, you must take the call to  the
	function rand() out of expr3 of the for statement. This can be
	accomplished as follows:
	
	    srand(17);
	    for (x = 0; x < 20; x++)
	       {
	       ranvals[x] = rand();
	       printf("Iteration %d, ranvals[%d] =%d\n",x+1, x, ranvals[x]);
	       }
