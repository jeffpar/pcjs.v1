---
layout: page
title: "Q42777: mkdir() Followed by chdir() Causes QuickC Debugging Problem"
permalink: /pubs/pc/reference/microsoft/kb/Q42777/
---

## Q42777: mkdir() Followed by chdir() Causes QuickC Debugging Problem

	Article: Q42777
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER | buglist2.00
	Last Modified: 2-MAY-1989
	
	The program below demonstrates a problem with the QuickC 2.00
	debugger. Creating a directory with the mkdir() function and making it
	the current working directory with the chdir() function will, under
	certain conditions, produce the following error:
	
	   File not found: D:\NEW_DIR\BIFF.C
	
	This error will be produced if a breakpoint is set at a line after the
	one in which the chdir() function is called. NEW_DIR is the directory
	that was created and made the current working directory. BIFF.C is the
	current module being executed in the debugger.
	
	Setting a breakpoint on the getch() line in the following sample
	program will demonstrate this problem:
	
	#include <direct.h>
	#include <conio.h>
	
	void main()
	{
	    if( !mkdir( "NEW_DIR" ) )
	    {
	        chdir( "NEW_DIR" );
	        getch();                    /* Set breakpoint here */
	    }
	}
	
	Microsoft has confirmed this to be a problem in Version 2.00. We are
	researching this problem and will post new information as it becomes
	available.
