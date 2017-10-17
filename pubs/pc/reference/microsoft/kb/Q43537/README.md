---
layout: page
title: "Q43537: Critical Error during Spawn Will Lose Parent"
permalink: /pubs/pc/reference/microsoft/kb/Q43537/
---

## Q43537: Critical Error during Spawn Will Lose Parent

	Article: Q43537
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | s_quickc
	Last Modified: 17-MAY-1989
	
	A critical error occurs when spawning another program using one of the
	C Version 5.10 run-time library's spawn functions that can prevent the
	child program from returning to the parent process. A sample program
	is shown below.
	
	This is not a problem with the run-time library, but is a limitation
	of the spawn family of functions.
	
	A workaround is to attempt to open the .EXE file before the spawn. The
	critical error will occur on the open and allow DOS and the run-time
	library to handle any problems encountered in a more elegant fashion.
	
	The following program can be used to demonstrate the situation:
	
	    #include <stdio.h>
	    #include <process.h>
	
	    void main( void )
	    {
	        spawnlp( P_WAIT, "a:\\test.exe", "a:\\test.exe", NULL );
	    }
	
	If Drive A is ready, TEST.EXE will be spawned correctly and return to
	the parent. However, if the drive door is open, the following prompt
	will be produced by the DOS critical error handler "Abort, Retry,
	Fail?".
	
	If the drive door is closed and "Retry" is selected, TEST.EXE will run
	but not return to the parent, hanging the system. An assembly language
	program that simply calls DOS interrupt 4B to do the same thing will
	work correctly under the same conditions.
