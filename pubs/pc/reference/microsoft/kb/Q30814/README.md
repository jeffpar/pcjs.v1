---
layout: page
title: "Q30814: MASM 5.10 OS2.DOC: OS/2 Call Summary - Queue Management"
permalink: /pubs/pc/reference/microsoft/kb/Q30814/
---

## Q30814: MASM 5.10 OS2.DOC: OS/2 Call Summary - Queue Management

	Article: Q30814
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 26-MAY-1988
	
	The following information is from the Microsoft Macro Assembler
	Version 5.10 OS2.DOC file.
	
	OS/2 Call Summary
	Queue management constant - INCL_DOSQUEUES
	
	   @DosMakePipe - Creates a pipe
	   Parameters - ReadHandle:PW, WriteHandle:PW, PipeSize:W
	
	   @DosCloseQueue - Closes a queue
	   Parameters - QueueHandle:W
	
	   @DosCreateQueue - Creates and opens a queue
	   Parameters - QueueHandle:PW, QueuePrt:W, QueueName:PZ
	
	   @DosOpenQueue - Opens a queue
	   Parameters - OwnerPID:PW, QueueHandle:PW, QueueName:PZ
	
	   @DosPeekQueue - Retrieves, but does not remove, a queue element
	   Parameters - QueueHandle:W, Request:PD, DataLength:PW, DataAddress:PD
	                ElementCode:PW, NowWait:W, ElemPriority:PB, SemHandle:D
	
	   @DosPurgeQueue - Purges a queue of all elements
	   Parameters - QueueHandle:W
	
	   @DosQueryQueue - Finds the size of (number of elements in) a queue
	   Parameters - QueueHandle:W, NumberElements:PW
	
	   @DosReadQueue - Reads and removes an element from a queue
	   Parameters - QueueHandle:W, Request:PD, DataLength:PW, DataAddress:PD
	                ElementCode:W, NoWait:W, ElemPriority:PW, SemHandle:D
	
	   @DosWriteQueue - Adds an element to a queue
	   Parameters - QueueHandle:W, Request:W, DataLength:W, DataBuffer:PB,
	                ElemPriority:W
