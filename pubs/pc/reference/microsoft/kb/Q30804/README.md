---
layout: page
title: "Q30804: MASM 5.10 OS2.DOC: OS/2 Call Summary - Process Control"
permalink: /pubs/pc/reference/microsoft/kb/Q30804/
---

## Q30804: MASM 5.10 OS2.DOC: OS/2 Call Summary - Process Control

	Article: Q30804
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 26-MAY-1988
	
	The following information is from the Microsoft Macro Assembler
	Version 5.10 OS2.DOC file.
	
	OS/2 Call Summary
	Processes control constant - INCL_DOSPROCESS
	
	   @DosCreateThread - Creates an asynchronous thread
	   Parameters - PgmAddress:D, ThreadID:PW, NewThreadStack:PB
	
	   @DosResumeThread - Restarts a suspended thread
	   Parameters - ThreadID:W
	
	   @DosSuspendThread - Suspends a thread
	   Parameters - ThreadID:W
	
	   @DosCWait - Makes thread wait for child process to terminate
	   Parameters - ActionCode:W, WaitOption:W, ReturnCodes:PS, ProcessIDWord:PD,
	                ProcessID:W
	   Structure - RESULTCODES
	
	   @DosSleep - Suspends current thread for specified interval
	   Parameters - Interval:D
	
	   @DosEnterCritSec - Disables other threads
	   Parameters - none
	
	   @DosExitCritSec - Reenables other threads
	   Parameters - none
	
	   @DosExitList - Maintains list of routines to be executed when thread ends
	   Parameters - FnCode:W, RtnAddress:PW
	
	   @DosExecPgm - Requests execution of a child program
	   Parameters - ObjNameBuf:PB, ObjNameBufL:W, AsyncTraceFlags:W,
	                ArgPointer:PZ, EnvPointer:PZ, ReturnCodes:PD, PgmPointer,PZ
	
	   @DosGetPid - Gets process identification
	   Parameters - Pid:PS
	   Structure - PIDINFO
	
	   @DosGetPrty - Returns the priority of a thread
	   Parameters - Scope:W, Priority:PW, ID:W
	
	   @DosSetPrty - Sets the priority of a child process or thread
	   Parameters - Scope:W, PriorityClass:W, PriorityDelta:W, ID:W
	
	   @DosKillProcess - Terminates a process and returns its termination code
	   Parameters - ActionCode:W, ProcessID:W
