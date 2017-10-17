---
layout: page
title: "Q47879: Using the Spawn, Exec, and System Routines to Call Batch Files"
permalink: /pubs/pc/reference/microsoft/kb/Q47879/
---

## Q47879: Using the Spawn, Exec, and System Routines to Call Batch Files

	Article: Q47879
	Version(s): 2.00 2.01
	Operating System: MS-DOS
	Flags: ENDUSER | S_C S_QuickASM
	Last Modified: 10-OCT-1989
	
	Question:
	
	Is it possible to execute a batch file (.BAT) using the C run-time
	routines spawn(), exec(), and system()?
	
	Response:
	
	Yes. The easiest method is to use the system() routine; however, you
	also can use the spawn() and exec() functions.
	
	When using the system() function, you need specify only the name of
	the batch file and its arguments (if any).
	
	The trick when using the spawn() and exec() functions is to create a
	command shell and then submit the batch file to this shell. This can
	be accomplished by spawning or exec'ing COMMAND.COM, and specify the
	/c option along with the name of the batch file.
	
	Shown below are three examples of executing the batch file "BATCH.BAT"
	using the system(), spawn(), and exec() functions.
	
	Example 1: Using the system() Routine
	-------------------------------------
	
	   #include <stdio.h>
	   #include <process.h>
	
	   void main (void)
	   {
	     system ("BATCH.BAT");
	   }
	
	Example 2: Using spawn()
	------------------------
	
	   When using spawn to execute a batch, make sure that you pass
	   COMMAND.COM as the second and third parameter.
	
	   #include <stdio.h>
	   #include <process.h>
	
	   void main (void)
	   {
	   /* Using P_WAIT will cause the child process to return to the parent */
	   /* process and using P_OVERLAY will not return the child process to  */
	   /* the parent process                                                */
	
	     spawnlp (P_OVERLAY, "COMMAND.COM", "COMMAND.COM", "/C",
	              "BATCH.BAT", NULL);
	      /* or */
	     spawnlp (P_WAIT, "COMMAND.COM", "COMMAND.COM", "/C",
	              "BATCH.BAT", NULL);
	   }
	
	Example 3: Using exec() to Execute a Batch File
	---------------------------------------------
	
	When using exec() to execute the batch file, make sure that
	COMMAND.COM is passed as the first and second parameter.
	
	   #include <stdio.h>
	   #include <process.h>
	
	   void main (void)
	   {
	     execlp ("COMMAND.COM", "COMMAND.COM", "/C", "BATCH.BAT", NULL);
	   }
	
	For further information regarding system(), spawn(), and exec(),
	consult the "Microsoft C Run-Time Library Reference Manual."
