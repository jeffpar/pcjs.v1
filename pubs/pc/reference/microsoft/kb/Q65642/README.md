---
layout: page
title: "Q65642: getcwd() and _getdcwd Return Backslash for Root Requests"
permalink: /pubs/pc/reference/microsoft/kb/Q65642/
---

	Article: Q65642
	Product: Microsoft C
	Version(s): 5.x 6.00 | 5.x 6.00
	Operating System: MS-DOS   | OS/2
	Flags: ENDUSER | buglist6.00 s_quickc
	Last Modified: 24-OCT-1990
	
	The Microsoft C version 6.00 library functions getcwd() and _getdcwd()
	will append a backslash to the drive specification for requests made
	from a drive's root directory.
	
	General requests made to the getcwd() or _getdcwd() function will not
	place a final backslash after the directory name. For example, when
	called from c:\dos\foo\ the return value of getcwd() will be
	c:\dos\foo. However, when invoked from a drive's root directory, the
	backslash character is appended (for example, when called from d:\ the
	return value is d:\). This inconsistent behavior can cause problems
	when programs append a backslash followed by a filename to the return
	of getcwd() in order to create data files in the current working
	directories. In these cases it is important to check for the root
	directory condition, in which case a backslash need not be appended.
	
	The following code demonstrates the possible conflict; it will fail
	when the default directory is a drive's root directory:
	
	Sample Code
	-----------
	
	#include<stdio.h>
	#include<stdlib.h>
	#include<direct.h>
	#include<string.h>
	
	void main(void)
	{
	   FILE *fp;
	   char buffer[_MAX_DIR+13];
	   if (getcwd(buffer,_MAX_DIR)==NULL)
	      perror("getcwd error");
	   else
	   {
	      strcat(buffer,"\\test.dat");
	      if((fp=fopen(buffer,"w"))!=NULL)
	         fputs("hello",fp);
	      else
	         puts("failure in writing to current drive\n");
	   }
	}
	Microsoft has confirmed this to be a problem in C version 6.00. We are
	researching this problem and will post new information here as it
	becomes available.
