---
layout: page
title: "Q67795: EXE Checksum Incorrect If linked with /CO or /E"
permalink: /pubs/pc/reference/microsoft/kb/Q67795/
---

## Q67795: EXE Checksum Incorrect If linked with /CO or /E

	Article: Q67795
	Version(s): 3.xx 4.0x 4.10 5.0x 5.10 5.13 | 5.0x 5.10 5.13
	Operating System: MS-DOS                        | OS/2
	Flags: ENDUSER |
	Last Modified: 6-FEB-1991
	
	According to "The MS-DOS Encyclopedia," a DOS .EXE file contains a
	checksum value in the .EXE file header. This checksum value should
	allow the summation of all words in the .EXE file to equal FFFFh.
	However, if you use the /Exepack or the /COdeview options when linking
	a program, the checksum value will not be calculated correctly.
	Current versions of MS-DOS ignore this checksum so this will not cause
	any noticeable problems.
	
	Sample Code:
	------------
	
	#include <stdio.h>
	#include <stdlib.h>
	
	main (int argc, char * argv[])
	{
	   FILE * fp;
	   unsigned int nxt= 0, sum= 0;
	   unsigned char bl, bh;
	
	   if (argc != 2)
	      exit (-1);
	   if ((fp= fopen (argv[1], "rb"))== NULL)
	      exit (-1);
	   while (! feof(fp))
	   {
	      bl= fgetc (fp);
	      if (! feof(fp))
	         bh= fgetc (fp);
	      else
	         {
	         bl= 0;
	         bh= 0;
	         }
	      sum= sum+ nxt;
	      nxt= (unsigned int) bh* 256U+ (unsigned int) bl;
	   }
	   nxt&= 0xFF;
	   sum+= nxt;
	   printf ("sum = %X\n", sum);
	}
