---
layout: page
title: "Q39812: Replacing Real Mode Family API Functions in Bound Applications"
permalink: /pubs/pc/reference/microsoft/kb/Q39812/
---

	Article: Q39812
	Product: Microsoft C
	Version(s): 1.00 1.10 1.30 | 1.00 1.10 1.30
	Operating System: MS-DOS         | OS/2
	Flags: ENDUSER | s_bind
	Last Modified: 15-JAN-1991
	
	Question:
	
	How do I create a bound application that uses the system calls in
	protected mode and uses my calls in real mode? The real mode call must
	access global data in my program.
	
	I would like to bind a program so that it will use the system
	VioGetConfig() function in protected mode, but will use my rewritten
	VioGetConfig() function when run in real mode. Everything compiles and
	links correctly, using either my function or the system function.
	However, my VioGetConfig accesses an initialized global int that is
	declared above the main(), which still compiles and links error free.
	But when I link the main with the system VioGetConfig, then bind the
	.EXE giving it the user's version of VioGetConfig, I get an unresolved
	external on the external global variable from the assembly routine.
	
	Response:
	
	The original strategy is probably the best method and should work
	correctly in the general case, that is, in the BIND step, specify the
	user version of VioGetConfig(). The problem is the global int
	variable. BIND does a link of the following:
	
	   API stub loader
	   API library modules
	   protected-mode image with no symbols
	
	The key point is that BIND has no access to the internal name space of
	the program. Thus any API routine, including one rewritten by the
	user, cannot see any of the program's data. You should rewrite your
	VioGetConfig() so it does not use the global variable, if possible.
	Otherwise you will have to use one of the methods discussed below.
	
	Rather than using BIND, do it yourself. In the main program, use code
	such as the following:
	
	    /* Under what operating system we are running ? */
	
	    if (_osmode == DOS_MODE)
	    {
	        /* We are running under DOS - real mode */
	
	        VioGetConfigUser(); /* User version */
	    }
	    else
	    {
	        /* We are running under OS/2 - protected mode */
	
	        VioGetConfig();     /* System version */
	    }
	
	Another way to do this is to build a dual-mode .EXE, as follows:
	
	1. Build your real-mode program using user VioGetConfig.
	
	2. Write protected-mode main program using OS/2 VioGetConfig.
	
	3. In the .DEF file for the protected-mode program, add the following
	   statement:
	
	      STUB '<name-of-your-real-mode-app>'
	
	4. Link your protected-mode application. You will get two programs in one
	   .EXE file. In protected mode, the system will load only the
	   protected-mode version. In real-mode, the system will load only
	   real-mode applications.
