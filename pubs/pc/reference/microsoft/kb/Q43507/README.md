---
layout: page
title: "Q43507: QuickC: Small and Medium Model Optimization Error"
permalink: /pubs/pc/reference/microsoft/kb/Q43507/
---

	Article: Q43507
	Product: Microsoft C
	Version(s): 1.00 1.01 2.00
	Operating System: MS-DOS
	Flags: ENDUSER | buglist1.00 buglist1.01 buglist2.00
	Last Modified: 2-MAY-1989
	
	When compiling the source code below, the QuickC and QCL compilers
	will produce incorrect code if any optimizations except loop
	optimization are enabled.
	
	If optimizations are disabled or only loop optimization is used, the
	compilers will generate correct code. This problem only occurs in the
	small and medium memory models (near data pointers).
	
	The program shown below will demonstrate the problem when compiled
	with optimizations enabled under the small or medium memory models.
	
	When optimization is enabled,
	
	   ps_ppr->ptr2
	
	is converted to
	
	   *(ps_ppr->ptr2)
	
	The following code demonstrates this problem:
	
	#include <stdio.h>
	
	char *ppr1;
	struct ps
	        {
	          char blank;
	          char *ptr2;
	        } p_s,*ps_ppr;
	
	void main(void)
	{
	  char d = 'A';
	  ppr1   = &d ;
	  ps_ppr = &p_s;
	
	  ps_ppr->ptr2 = ppr1;
	
	  if( ppr1 != ps_ppr->ptr2)
	    {
	      printf("Optimization test..........Failed\n");
	      printf("%Np does not equal %Np \n",ppr1,ps_ppr->ptr2);
	      exit(1);
	    }
	  else
	    {
	      printf("Optimization test..........Passed\n");
	      printf("%Np  = %Np \n",ppr1,ps_ppr->ptr2);
	      exit(0);
	    }
	 }
	
	Microsoft has confirmed this to be a problem in Versions 1.00, 1.01,
	and 2.00. We are researching this problem and will post new
	information as it becomes available.
