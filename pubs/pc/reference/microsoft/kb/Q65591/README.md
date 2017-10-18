---
layout: page
title: "Q65591: Screen Output Fails When Using Animate with Assembly Files"
permalink: /pubs/pc/reference/microsoft/kb/Q65591/
---

## Q65591: Screen Output Fails When Using Animate with Assembly Files

	Article: Q65591
	Version(s): 2.51
	Operating System: MS-DOS
	Flags: ENDUSER | buglist2.51
	Last Modified: 17-OCT-1990
	
	While debugging an assembler program under Microsoft QuickAssembler
	version 2.51, if Animate is selected from the Run menu, the code below
	will not print anything to the output screen if Screen Swap is set to
	On in the Options Run/Debug menu.
	
	Sample Code
	-----------
	
	        TITLE   HELLO
	        .MODEL  small, c
	        DOSSEG
	
	        .STACK  100h
	
	        .DATA
	msg     DB      "Hello, world.", 13, 10, "$"
	
	        .CODE
	        .STARTUP
	
	        mov     ah, 9h
	        mov     dx, OFFSET msg
	
	        int     21h
	
	        .EXIT   0
	
	        END
	
	The following are three valid workarounds:
	
	1. In the Run menu, disable Animate.
	
	2. Make sure Screen Swap is set to On, and then trace (F8) or Step
	   (F10) through the program instead.
	
	Microsoft has confirmed this to be a problem with QuickAssembler
	version 2.51. We are researching this problem and will post new
	information here as it becomes available.
