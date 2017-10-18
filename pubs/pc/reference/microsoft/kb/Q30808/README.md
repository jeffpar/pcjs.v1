---
layout: page
title: "Q30808: MASM 5.10 OS2.DOC: OS/2 Call Summary - Semaphores"
permalink: /pubs/pc/reference/microsoft/kb/Q30808/
---

## Q30808: MASM 5.10 OS2.DOC: OS/2 Call Summary - Semaphores

	Article: Q30808
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 26-MAY-1988
	
	The following information is from the Microsoft Macro Assembler
	Version 5.10 OS2.DOC file.
	
	OS/2 Call Summary
	Semaphore constant - INCL_DOSSEMAPHORES
	
	   @DosSemClear - Unconditionally clears a semaphore
	   Parameters - SemHandle:D
	
	   @DosSemSet - Unconditionally sets a semaphore
	   Parameters - SemHandle:D
	
	   @DosSemWait - Blocks current thread until a specified semaphore is cleared
	   Parameters - SemHandle:D, Timeout:D
	
	   @DosSemSetWait - Sets a specified semaphore and blocks current thread
	                    until the semaphore is cleared
	   Parameters - SemHandle:D, Timeout:D
	
	   @DosSemRequest - Obtains a semaphore
	   Parameters - SemHandle:D, Timeout:D
	
	   @DosCreateSem - Creates a system semaphore
	   Parameters - NoExclusive:W, SemHandle:PD, SemName:PZ
	
	   @DosOpenSem - Opens a semaphore and assigns it a handle
	   Parameters - SemHandle:PD, SemName:PZ
	
	   @DosCloseSem - Closes a system semaphore
	   Parameters - SemHandle:D
	
	   @DosMuxSemWait - Blocks the current thread until one or more specified
	                    semaphores is cleared
	   Parameters - IndexNum:PW, ListAddr:PS, Timeout:D
	   Structure - MUXSEMLIST (which contains MUXSEM structures)
