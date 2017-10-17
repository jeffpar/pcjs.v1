---
layout: page
title: "Q64589: How to Use Named, Shared Memory Segments in OS/2 BASIC Program"
permalink: /pubs/pc/reference/microsoft/kb/Q64589/
---

## Q64589: How to Use Named, Shared Memory Segments in OS/2 BASIC Program

	Article: Q64589
	Version(s): 6.00 6.00b 7.00 7.10
	Operating System: OS/2
	Flags: ENDUSER | SR# S900730-92
	Last Modified: 17-AUG-1990
	
	Microsoft BASIC Compiler versions 6.00 and 6.00b and Microsoft BASIC
	Professional Development System (PDS) versions 7.00 and 7.10 can
	create OS/2 protected mode programs that use named, shared memory
	segments. Named, shared memory segments are areas of memory used for
	interprocess communications (IPC). Their use involves calling three
	different OS/2 API functions. Below are two sample BASIC programs that
	demonstrate the use of named, shared memory segments.
	
	This information applies to Microsoft BASIC Compiler versions 6.00 and
	6.00b for MS OS/2 and to Microsoft BASIC Professional Development
	System (PDS) versions 7.00 and 7.10 for MS OS/2.
	
	Named, shared memory segments can be used to communicate between
	processes. Their names have the following form:
	
	   \SHAREMEM\name.ext
	
	".ext" is optional. The size of the segment can be up to 65,536 bytes.
	After the segment is allocated, it can be read from and written to
	using PEEK and POKE, which examine and set (respectively) a 1-byte
	address location. Typically, one process (called the "creator") will
	allocate the segment and other programs (called "obtainers") will
	obtain the address (selector) to it. The minimum OS/2 API functions
	that need to be called to use named, shared memory segments are the
	following:
	
	For the Creator
	---------------
	
	Function       Description
	--------       -----------
	
	DosAllocShrSeg()   Allocates a named, shared memory segment of up to
	                   65,536 bytes and returns a selector for it.
	
	For the Obtainers
	-----------------
	
	Function       Description
	--------       -----------
	
	DosGetShrSeg()     Obtains a selector to a named, shared memory segment
	                   that was allocated by DosAllocShrSeg().
	
	For Both the Creator and Obtainers
	----------------------------------
	
	Function       Description
	--------       -----------
	
	DosFreeSeg()       Releases the selector to the segment. When all
	                   selectors by all processes have been released, the
	                   segment is reclaimed by OS/2.
	
	For more information on named, shared memory segments and other IPC
	methods, see Chapter 13, "Interprocess Communication," of "Advanced
	OS/2 Programming" by Ray Duncan (Microsoft Press, 1989).
	
	The following are two sample programs that demonstrate the use of
	named, shared memory segments. To compile the programs, enter the
	following commands at the OS/2 command prompt:
	
	   bc creator;
	   bc obtainer;
	
	How the programs are linked depends on which version of BASIC is being
	used. This is because in BASIC 6.00 and 6.00b, the name of the OS/2
	API functions import library is DOSCALLS.LIB. In BASIC PDS 7.00 and
	7.10, the name is OS2.LIB. The link lines are as follows:
	
	For BASIC 6.00 and 6.00b:  link creator,,,doscalls;
	                           link obtainer,,,doscalls;
	
	For BASIC PDS 7.00 and 7.10:  link creator,,,os2;
	                              link obtainer,,,os2;
	
	CREATOR.BAS
	-----------
	
	'CREATOR.BAS allocates a named, shared segment and writes the letters
	'of the alphabet to bytes 0 through 25 of the segment. It then waits
	'until byte 0 of the segment becomes 255 before releasing its selector
	'and terminating.
	DECLARE FUNCTION DosAllocShrSeg% (BYVAL SegmentSize%,
	                                  BYVAL NameSegment%,_
	                                  BYVAL NameOffset%, SEG Selector%)
	DECLARE FUNCTION DosFreeSeg%     (BYVAL Selector%)
	
	'Attempt to allocate the segment.
	SegmentName$ = "\SHAREMEM\SPIKE" + CHR$(0)
	ErrorCode%   = DosAllocShrSeg% (26, VARSEG(SegmentName$),_
	                                SADD(SegmentName$), Selector%)
	
	'Check if an error occurred.  If not, make the segment current.
	IF ErrorCode% <> 0 THEN
	   PRINT "Error";ErrorCode%;" allocating segment"
	   BEEP
	   END
	ELSE
	   DEF SEG = Selector%
	END IF
	
	FOR ASCII% = 65 TO 90         'Write the letters A through Z to bytes
	   POKE ASCII% - 65, ASCII%   '0 through 25 of the segment.
	NEXT ASCII%
	
	PRINT "Waiting for data to be read..."   'When OBTAINER.BAS is done
	DO UNTIL PEEK(0) = 255                   'reading, it will put a 255
	LOOP                                     'in byte 0 of the segment.
	
	ErrorCode% = DosFreeSeg% (Selector%)   'Free the segment selector.
	END
	
	OBTAINER.BAS
	------------
	
	'OBTAINER.BAS obtains a selector to the segment created by
	'CREATOR.BAS and reads bytes 0 through 25, display their contents. It
	'then POKEs a 255 into byte 0 of the segment so CREATOR.BAS will
	'terminate. Lastly, it releases its selector to the segment and
	'terminates itself.
	DECLARE FUNCTION DosGetShrSeg% (BYVAL NameSegment%,
	                                BYVAL NameOffset%, SEG Selector%)
	DECLARE FUNCTION DosFreeSeg%   (BYVAL Selector%)
	
	'Attempt to get a selector for the segment.
	SegmentName$ = "\SHAREMEM\SPIKE" + CHR$(0)
	ErrorCode%   = DosGetShrSeg% (VARSEG(SegmentName$),_
	                              SADD(SegmentName$), Selector%)
	
	'Check if an error occurred.  If not, make the segment current.
	IF ErrorCode% <> 0 THEN
	   PRINT "Error";ErrorCode%;" getting segment"
	   BEEP
	   END
	ELSE
	   DEF SEG = Selector%
	END IF
	
	FOR Offset% = 0 TO 25
	   PRINT CHR$(PEEK(Offset%));" ";   'Display bytes 0 to 25 of the
	NEXT Offset%                        'named, shared memory segment.
	
	POKE 0, 255                            'Signal CREATOR.BAS to end and
	ErrorCode% = DosFreeSeg% (Selector%)   'release the segment selector.
	END
