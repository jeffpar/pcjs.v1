---
layout: page
title: "Q30815: MASM 5.10 OS2.DOC: OS/2 Call Summary - Miscellaneous Functions"
permalink: /pubs/pc/reference/microsoft/kb/Q30815/
---

## Q30815: MASM 5.10 OS2.DOC: OS/2 Call Summary - Miscellaneous Functions

	Article: Q30815
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 26-MAY-1988
	
	The following information is from the Microsoft Macro Assembler
	Version 5.10 OS2.DOC file.
	
	OS/2 Call Summary
	Miscellaneous functions constant - INCL_DOSMISC
	
	   @DosError - Enables OS/2 to receive hard-error notification without
	               generating a hard-error signal
	   Parameters - Flag:W
	
	   @DosSetVec - Registers an address to be used when an exception occcurs
	   Parameters - VecNum:W, RoutineAddress:D, PrevAddress:PD
	
	   @DosGetMessage - Retrieves a message from a message file and inserts
	                    variable information into the message
	   Parameters - IvTable:PD, IvCount:W, DataArea:PB, DataLength:W,
	                MsgNumber:W, FileName:PZ, MsgLength:PW
	
	   @DosErrClass - Enables recognition and processing of error (exit) codes
	   Parameters - Code:W, Class:PW, Action:PW, Locus:PW
	
	   @DosInsMessage - Inserts variable text string information into a message
	   Parameters - IvTable:PD, IvCount:W, MsgInput:PZ, MsgInLength:W,
	                DataArea:PW, DataLength:W, MsgLength:PW
	
	   @DosPutMessage - Outputs a message from a buffer to a specified handle
	   Parameters - FileHandle:W, MessageLength:W, MessageBuffer:PB
	
	   @DosGetEnv - Gets the segment of the environment string and the
	                offset within it of the command line
	   Parameters - EnvPointer:PW, CmdOffset:PW
	
	   @DosScanEnv - Searches an environment segment for an environment variable
	   Parameters - EnvVarName:PZ, ResultPointer:PD
	
	   @DosSearchPath - Enables applications to find files in specified
	                    directories
	   Parameters - Control:W, PathRef:PZ, Filename:PZ, ResultBuffer:PB,
	                ResultBufferLen:W
	
	   @DosGetVersion - Gets the current DOS version
	   Parameters - VersionWord:PW
	
	   @DosGetMachineMode - Tells whether the processor is in real or
	                        protected mode
	   Parameters - MachineMode:PB
