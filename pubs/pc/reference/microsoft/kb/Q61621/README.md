---
layout: page
title: "Q61621: Internal Compiler Error '@(#)newcode.c:1.87' Line 551"
permalink: /pubs/pc/reference/microsoft/kb/Q61621/
---

	Article: Q61621
	Product: Microsoft C
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist6.00
	Last Modified: 25-JUL-1990
	
	The following sample code produces an internal compiler error when
	compiled with /Oct (Default Optimization) option under large and
	compact memory models:
	
	   prog.c(18) : fatal error C1001: Internal Compiler Error
	                (compiler file '@(#)newcode.c:1.87', line 551)
	                Contact Microsoft Product Support Services
	
	Sample Code
	-----------
	
	struct AREASTR
	{
	   int *getnum;
	   int **ypos, **xpos, **varnum;
	};
	
	struct AREASTR *z;
	
	// #pragma optimize("ct",off) Disabling optimizations for this function
	//                            will work around problem.
	
	// #pragma optimize("gct",on) Adding global optimization will also work
	//                            around problem.
	sample_func()
	{
	   int i,k,no;
	   int count, tx, ty, tnum;
	
	   if (k<= z->getnum[no] && z->varnum[no][k] == 1)
	   {
	      tnum = z->varnum[no][count];
	      //compiler crashes here
	      tx = z->xpos[no][count];
	      ty = z->ypos[no][count];
	
	      z->varnum[no][count] = z->varnum[no][k];
	      z->xpos[no][count] = z->xpos[no][k];
	      z->ypos[no][count] = z->ypos[no][k];
	
	      z->varnum[no][k] = tnum;
	      z->xpos[no][k] = tx;
	      z->ypos[no][k] = ty;
	   }
	}
	
	/* #pragma optimize("ct",on)  enable time optimizations  */
	
	Placing the #pragma optimize("ct",off) in the code causes the compiler
	to disable default optimizations, thus working around the problem.
	
	If optimizations are really needed then they may be turned back on
	with the #pragma optimize("ct",on).
	
	Also, instead of turning off optimizations for the function you may
	add global optimizations (/Og) to the default optimizations to work
	around the problem.
	
	Microsoft has confirmed this to be a problem with C version 6.00. We
	are researching this problem and will post new information here as it
	becomes available.
