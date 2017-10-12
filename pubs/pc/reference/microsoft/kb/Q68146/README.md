---
layout: page
title: "Q68146: QuickC Displays &quot;Incompatible Operands&quot; When Watching Arrays"
permalink: /pubs/pc/reference/microsoft/kb/Q68146/
---

	Article: Q68146
	Product: Microsoft C
	Version(s): 2.00 2.01
	Operating System: MS-DOS
	Flags: ENDUSER | fixlist2.50
	Last Modified: 11-JAN-1991
	
	Attempting to watch individual elements of global arrays in the Debug
	window may result in the message "Incompatible operands" being
	displayed. This problem only occurs when a Program List is created
	containing more than one C module.
	
	The following steps illustrate the problem:
	
	1. Create two C modules similar to the ones below and add them
	   to a program list.
	
	          TEST.C                         DUMMY.C
	    ------------------                -------------
	
	    #include<string.h>                #define dummy
	
	    char str[80];
	
	    void main(void)
	    {
	         strcpy(str, "Hello World");
	    }
	
	2. Rebuild the application with debug (CodeView) information.
	
	3. Trace through the program by pressing F8.
	
	4. Enter str and str[0] into the Watch (Debug) window.
	
	The following lines will be displayed in the Debug window:
	
	   str : <Cannot display>
	   str[0] : <Incompatible operands>
	
	Microsoft has confirmed this to be a problem in QuickC versions 2.00
	and 2.01. The problem does not occur in versions 2.50 and 2.51.
