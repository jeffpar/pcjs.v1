---
layout: page
title: "Q30812: MASM 5.10 OS2.DOC: OS/2 Call Summary - Signal Management"
permalink: /pubs/pc/reference/microsoft/kb/Q30812/
---

## Q30812: MASM 5.10 OS2.DOC: OS/2 Call Summary - Signal Management

	Article: Q30812
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 26-MAY-1988
	
	The following information is from the Microsoft Macro Assembler
	Version 5.10 OS2.DOC file.
	
	OS/2 Call Summary
	Signal management constant - INCL_DOSSIGNALS
	
	   @DosSetSigHandler - Establishes a signal handler
	   Parameters - RoutineAddress:D, PrevAddress:PD, PrevAction:PW, Action:W,
	                SigNumber:W
	
	   @DosFlagProcess - Sets an external event flag on another process
	   Parameters - ProcessID:W, Action:W, FlagNum:W, FlagArg:W
	
	   @DosHoldSignal - Temporarily enables or disables signal processing
	   Parameters - ActionCode:W
	
	   @DosSendSignal - Sends a CTRL-C or CTRL-BREAK signal
	   Parameters - ProcessID:W, SigNumber:W
