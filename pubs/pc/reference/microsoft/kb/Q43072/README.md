---
layout: page
title: "Q43072: Switching from Reading to Writing Files Can Garble Data"
permalink: /pubs/pc/reference/microsoft/kb/Q43072/
---

## Q43072: Switching from Reading to Writing Files Can Garble Data

	Article: Q43072
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | s_quickc sequence locate position
	Last Modified: 17-JAN-1990
	
	When switching from reading to writing of C Version 5.10 files, it is
	necessary to do an fsetpos, fseek, or rewind. If you do not use one of
	these library functions, the file pointer may not be updated and you
	could get some erroneous results. This also applies when switching
	from writing to reading. This is documented on Page 275 of the
	"Microsoft C Run-Time Library Reference" manual.
	
	The following program will attempt to read in the first character of a
	file and to write it out as the second character:
	
	#include <stdio.h>
	void main(void)
	{
	  FILE *fp;
	  char a;
	
	  if (( fp = fopen("text.fil","r+")) != NULL)
	  {
	    fscanf(fp,"%c",a);      /* read one character */
	    fprintf(fp,"%c",a);     /* write to the next location */
	    fclose(fp);
	  }
	}
	
	The above program will fail because there is no fseek, fsetpos, or
	rewind between the fscanf and fprintf. The following program will
	perform the desired operation:
	
	#include <stdio.h>
	void main(void)
	{
	  FILE *fp;
	  char a;
	  fpos_t loc;     /* storage for the current location */
	
	  if (( fp = fopen("text.fil","r+")) != NULL)
	  {
	    fscanf(fp,"%c",a);    /* read one character */
	    fgetpos(fp,&loc);     /* get current file pointer pos */
	    fsetpos(fp,&loc);     /* set current file pointer pos */
	    fprintf(fp,"%c",a);   /* write to next location */
	    fclose(fp);
	  }
	}
