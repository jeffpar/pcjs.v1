---
layout: page
title: "Q43319: C: exec and spawn (P_OVERLAY) Will Fail When Bound"
permalink: /pubs/pc/reference/microsoft/kb/Q43319/
---

## Q43319: C: exec and spawn (P_OVERLAY) Will Fail When Bound

	Article: Q43319
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | O_OS2SDK
	Last Modified: 15-JAN-1990
	
	The Microsoft C run-time library functions exec and spawn (with a
	P_OVERLAY attribute) do not work correctly when executed in a bound
	application under DOS. This is briefly documented on Page 24 of the
	"Microsoft C for MS OS/2 and MS-DOS Operating Systems: Version 5.1
	Update" manual. The execution will fail with the program returning the
	following error message:
	
	   run-time error R6006
	   - bad format on exec
	
	This occurs only when the dual-mode program is running under DOS. A
	spawn with the P_WAIT attribute will work properly.
	
	Examining the DosExecPgm() API reveals that there is no option to
	overlay the currently executing program. OS/2's protection scheme does
	not support overwriting the code segment; therefore, to exec another
	program, it is necessary to actually spawn the program in a different
	area of memory and terminate the current process.
	
	To create a bound program that uses overlays, not only would a
	remapping of the FAPI function be necessary, but also a complete
	reprogramming to allow for loading over the current code segment. At
	this time, BIND does not support this.
	
	The following functions do not work properly when executed under DOS
	in a bound application:
	
	   execl    execle  execlp   execlpe   execv    execve   execvp
	   execvpe  spawnl  spawnl   spawnle   spawnlp  spawnlpe spawnv
	   spawnve  spawnvp spawnvpe
	
	Note: The spawn functions fail only with the P_OVERLAY attribute.
	
	The following program will fail to spawn PROG.EXE from DOS:
	
	/* Program:  spawn.c                                      */
	/*                                                        */
	/* Compile and bind from OS/2 with:                       */
	/*                                                        */
	/*         cl /Lp spawn.c                                 */
	/*         bind spawn /c/lib/api.lib /c/lib/doscalls.lib  */
	
	#include <stdio.h>
	#include <process.h>
	
	void main(void)
	{
	  spawnl(P_OVERLAY,"c:\\tmp\\prog.exe","prog",NULL);
	}
