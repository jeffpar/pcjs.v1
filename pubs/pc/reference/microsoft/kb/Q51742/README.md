---
layout: page
title: "Q51742: Spawned Process Runs Out of Environment Space"
permalink: /pubs/pc/reference/microsoft/kb/Q51742/
---

## Q51742: Spawned Process Runs Out of Environment Space

	Article: Q51742
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | s_quickc s_quickasm
	Last Modified: 20-DEC-1989
	
	Using spawn to create a child process, then attempting to increase the
	environment space of the child (by adding a new environment variable
	or expanding an existing environment variable) results in an "Out of
	Environment Space" error.
	
	This problem does NOT happen under OS/2.
	
	The following program(s) illustrates this behavior:
	
	/*-----------------------------------------------------------------*/
	/*-----------------------------------------------------------------*/
	parent.c  This will call the child process (child) with the spawnlp
	          function.
	/*-----------------------------------------------------------------*/
	
	#include <stdio.h>
	#include <process.h>
	
	void main (void);
	
	void main (void)
	{
	    printf ("In the parent process\n");
	
	    spawnlp (P_WAIT, "child.exe", "child", NULL);
	
	    printf ("\nAnd back to the parent process.\n");
	}
	
	/*-----------------------------------------------------------------*/
	child.c Called by parent.c, uses the system function to call a batch
	        file (BATCH.BAT) to attempt to set a new environment variable.
	
	/*-----------------------------------------------------------------*/
	#include <stdio.h>
	#include <process.h>
	#include <conio.h>
	#include <errno.h>
	
	void main (void);
	
	void main (void)
	{
	    printf ("At child process...\n");
	    system ("batch.bat");
	    getch ();
	}
	
	/*-----------------------------------------------------------------*/
	BATCH.BAT  The batch file, which is called by the child process
	            (CHILD.EXE). It just shows the environment variables,
	            attempts to set another environment variable, then shows
	            the environment variables one more time.
	/*-----------------------------------------------------------------*/
	set
	set blah=thisisatestonlyatestsoitdoesnotreallymatter
	set
	/*----------------------------------------------------------------------*/
	
	Parent will spawn child, which in turn spawns (through system)
	BATCH.BAT. The idea is to show that when BATCH.BAT is called, an "Out
	of Environment Space" error will be given. Yet, if BATCH.BAT is run
	from DOS, no such error is issued.
	
	To work around this problem, set up a dummy environment variable that
	is large enough to hold the new environment variable you plan to use
	in the spawned process. When the child process is called, you can then
	set the dummy variable to null (with a "set dummy="), then you can set
	your processes environment variable. Please note that this will change
	the dummy environment variable for the child only, not the parent
	process.
	
	Under DOS, the child will get only enough space to hold the current
	environment variables, while under OS/2, the segment that holds the
	environment can usually be expanded.
