---
layout: page
title: "Q65245: C1001: Internal Compiler Error: '@(#)regMD.c:1:100', Line 4634"
permalink: /pubs/pc/reference/microsoft/kb/Q65245/
---

## Q65245: C1001: Internal Compiler Error: '@(#)regMD.c:1:100', Line 4634

	Article: Q65245
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist6.00
	Last Modified: 24-OCT-1990
	
	The sample code below causes an internal compiler error when compiled
	in the large or compact memory model with the "e" and "i" optimization
	options. The exact error is as follows:
	
	   foo.c(42) : fatal error c1001: Internal Compiler Error
	             (compiler file '@(#)regMD.c:1:100', line 4634)
	
	Note: Compile with the following:
	
	   /AL /Oei
	
	Sample Code
	-----------
	
	 1 #include <string.h>
	 2 #include <stdlib.h>
	 3
	 4 void change_value (int *n);
	 5
	 6 typedef struct smpdata_st *SMP;
	 7 typedef struct fdata_st *FDP;
	 8
	 9 struct fdata_st
	10 {
	11   int resolution,
	12       nwaves,
	13       startwv,
	14       endwv;
	15   char fname[13];
	16   SMP data;
	17 };
	18
	19 struct smpdata_st
	20 {
	21   float *abs;
	22   SMP next;
	23 };
	24
	25 void main(void)
	26 {
	27   extern FDP fptr;
	28   FDP fp = fptr;
	29   SMP p;
	30   int count;
	31   int nsamples, nwaves, startwv = 0;
	32   int temp1, temp2;
	33   char fname[13];
	34
	35   change_value(&nsamples);
	36   change_value(&nwaves);
	37
	38   strcpy (fp -> fname, fname);
	39
	40   if (startwv < fp -> startwv)
	41   {
	42     count = (fp->startwv - startwv) / fp->resolution;
	43     p = fp -> data;
	44     while (p != NULL)
	45     {
	46       memmove (p -> abs + count, p -> abs,
	47                fp -> nwaves * sizeof *p -> abs);
	48       p = p -> next;
	49     }
	50   }
	51 }
	
	The following are two workarounds:
	
	1. Avoid using the e and i optimizations together.
	
	2. Assign both structure references in line 42 to temp variables and
	   replace them with their respective temp variables.
	
	Microsoft has confirmed this to be a problem with C version 6.00. We
	are researching this problem and will post new information here as it
	becomes available.
