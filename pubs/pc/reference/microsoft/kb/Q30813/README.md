---
layout: page
title: "Q30813: MASM 5.10 OS2.DOC: OS/2 Call Summary - Monitor Management"
permalink: /pubs/pc/reference/microsoft/kb/Q30813/
---

## Q30813: MASM 5.10 OS2.DOC: OS/2 Call Summary - Monitor Management

	Article: Q30813
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 26-MAY-1988
	
	The following information is from the Microsoft Macro Assembler
	Version 5.10 OS2.DOC file.
	
	OS/2 Call Summary
	Monitor management constant - INCL_DOSMONITORS
	
	   @DosMonOpen - Initiates device monitoring and assigns a monitor handle
	   Parameters - DevName:PZ, Handle:PW
	
	   @DosMonClose - Terminates device monitoring
	   Parameters - Handle:W
	
	   @DosMonReg - Establishes input and output buffers to monitor an I/O stream
	   Parameters - Handle:W, BufferI:PB, BufferO:PB, PosFlag:W, Index:W
	
	   @DosMonRead - Waits for and reads input from the monitor buffer
	   Parameters - BufferI:PB, WaitFlag:W, DataBuffer:PB, ByteCnt:PW
	
	   @DosMonWrite - Writes data to the output buffer of a monitor
	   Parameters - BufferO:PB, DataBuffer:PB, ByteCnt:W
