---
layout: page
title: "Q30807: MASM 5.10 OS2.DOC: OS/2 Call Summary - Memory Management"
permalink: /pubs/pc/reference/microsoft/kb/Q30807/
---

## Q30807: MASM 5.10 OS2.DOC: OS/2 Call Summary - Memory Management

	Article: Q30807
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 26-MAY-1988
	
	The following information is from the Microsoft Macro Assembler
	Version 5.10 OS2.DOC file>
	
	OS/2 Call Summary
	Memory management constant - INCL_DOSMEMMGR
	
	   @DosAllocSeg - Allocates a segment of memory
	   Parameters - Size:W, Selector:PW, AllocFlags:W
	
	   @DosReallocSeg - Changes the size of an allocated segment
	   Parameters - Size:W, Selector:W
	
	   @DosFreeSeg - Deallocates a segment
	   Parameters - Selector:W
	
	   @DosGiveSeg - Gives another process access to a shared memory segment
	   Parameters - CallerSegHandle:W, ProcessID:W, RecipientSegHandle:PW
	
	   @DosGetSeg - Gets access to a shared memory segment
	   Parameters - Selector:W
	
	   @DosAllocHuge - Allocates memory potentially requiring multiple segments
	   Parameters - NumSeg:W, Size:W, Selector:PW, ShareInd:W, MaxNumSeg:W
	
	   @DosReallocHuge - Changes memory amount previously allocated by
	                     DosAllocHuge
	   Parameters - NumSet:W, Size:W, Selector:W
	
	   @DosGetHugeShift - Returns a shift count used to derive selectors to
	                      huge memory allocated with DosAllocHuge
	   Parameters - ShiftCount:PW
	
	   @DosAllocShrSeg - Allocates a shared memory segment
	   Parameters - Size:W, Name:PZ, Selector:PW
	
	   @DosLockSeg - Locks a discardable segment in memory
	   Parameters - Selector:W
	
	   @DosUnlockSeg - Unlocks a discardable segment
	   Parameters - Selector:W
	
	   @DosGetShrSeg - Allows a process to access a previously allocated shared
	                   memory segment and increments the segment reference count
	   Parameters - Name:PZ, Selector:PW
	
	   @DosMemAvail - Returns the size of the largest block of free memory
	   Parameters - MemAvailSize:PD
	
	   @DosCreateCSAlias - Creates an executable alias for a data type descriptor
	                       passed as input
	   Parameters - DataSelector:W, CodeSelector:PW
	
	   @DosSubAlloc - Allocates memory from within a segment that was previously
	                  allocated and initialized with DosSubSet
	   Parameters - SegSelector:W, BlockOffset:PW, Size:W
	
	   @DosSubFree - Frees memory previously allocated with DosSubAlloc
	   Parameters - SegSelector:W, BlockOffset:W, Size:W
	
	   @DosSubSet - Initializes a segment for suballocation, or changes the size
	                of a previous suballocation
	   Parameters - SegSelector:W, BlockOffset:W, Size:W
