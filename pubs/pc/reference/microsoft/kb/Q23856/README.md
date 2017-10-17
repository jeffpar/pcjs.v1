---
layout: page
title: "Q23856: Code that Will Hang IBM XTs or Compatibles"
permalink: /pubs/pc/reference/microsoft/kb/Q23856/
---

## Q23856: Code that Will Hang IBM XTs or Compatibles

	Article: Q23856
	Version(s): 1.00
	Operating System: MS-DOS
	Flags: ENDUSER | TAR57675 buglist1.00
	Last Modified: 8-NOV-1988
	
	Problem:
	
	The following code will hang IBM XTs or compatibles if specific
	commands are issued when inside of CodeView:
	
	   #include <stdio.h>
	   main()
	   {
	        int n;
	        double f;
	
	        while(1)   {
	                   scanf("%d",&n);
	               f=1.0;
	               while (n>1) f=f*n--;
	                  printf("%.101g%c",f,'\n');
	                   }
	   }
	
	For the program to fail in CodeView, first set a breakpoint at
	instruction f=1.0. Issue the Go command, then the P command.
	
	Response:
	
	This is corrected in CodeView version 2.20.
	
	A workaround is to place a breakpoint at the instruction before or
	after the assignment to f.
