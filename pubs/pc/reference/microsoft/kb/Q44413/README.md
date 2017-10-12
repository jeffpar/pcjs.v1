---
layout: page
title: "Q44413: How to Spawn C 5.10 Compiler Passes without CL.EXE"
permalink: /pubs/pc/reference/microsoft/kb/Q44413/
---

	Article: Q44413
	Product: Microsoft C
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | SR# G890503-17633 c1.exe c2.exe c3.exe
	Last Modified: 22-NOV-1989
	
	Question:
	
	How can I run the individual compiler passes, C1, C2, and C3, instead
	of CL.EXE? There isn't enough memory available from my editor to spawn
	to CL.EXE, but I suspect there may be enough if I call the individual
	compiler passes.
	
	Response:
	
	There are a number of problems here. First, the CL.EXE program passes
	many flags and command-line options to the various passes. You must
	get these all exactly right. The /d, /Bd, or /Bz CL command-line
	options, or the PEEK.C program below, can help show what is passed
	to the various passes. The PEEK program is easiest to use. To use it,
	we "trick" the CL driver into calling our program instead of the
	various compiler passes. For instance, to find out what is passed on
	each of the three passes, you would use the following commands:
	
	   cl /B1 peek.exe /B2 peek.exe /B3 peek.exe [options] [file]
	
	When you do this, the CL driver spawns your program PEEK.EXE rather
	than the various compiler passes. The switches are too complicated to
	guess at, so either use this program or one of the /B or /d options.
	Note that no compilation will be done because you called PEEK.EXE
	rather than the three compiler passes.
	
	The second major problem is that because these command strings can
	easily exceed the DOS 128-character limit on the length of a command
	line, the CL driver uses the environment string area rather than the
	command line to pass options to the passes. To duplicate this, you
	must do one of the following two things:
	
	1. Write a batch file that sets the environment properly and calls
	   the various passes. This file fails if any of the strings are
	   longer than the DOS command-line limit of 128 characters. Since
	   this is likely to be the case, you'll probably need to use the
	   second method.
	
	2. Write a small C program that spawns (using one of the spawnle,
	   spawnlpe, spawnve, or spawnvpe functions with the P_WAIT option)
	   the three passes, setting up the environment first. This is a
	   simple procedure and provides you with 30K or so in savings. This
	   program is not provided here -- you must write it yourself.
	
	PEEK.C Program
	--------------
	
	#include <stdio.h>
	
	void main(int argc, char **argv, char **envp)
	{
	    int i;
	
	    printf("Command line arguments:\n\n");
	    for (i = 0; i < argc; i++)  {
	        printf("argv[%d]**********\n%s\n\n", i, argv[i]);
	    }
	    printf("**********End of command line arguments\n\n\n");
	
	    printf("Environment strings:\n\n");
	    for (i = 0; envp[i]; i++)  {
	        printf("envp[%d]**********\n%s\n\n", i, envp[i]);
	    }
	    puts("**********End of environment strings\n");
	}
