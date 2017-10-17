---
layout: page
title: "Q59895: Why Can't a Stand-Alone DLL Use the Emulator Math Library?"
permalink: /pubs/pc/reference/microsoft/kb/Q59895/
---

## Q59895: Why Can't a Stand-Alone DLL Use the Emulator Math Library?

	Article: Q59895
	Version(s): 5.10 6.00
	Operating System: OS/2
	Flags: ENDUSER |
	Last Modified: 18-APR-1990
	
	Question:
	
	In MTDYNA.DOC, it states that a stand-alone DLL should use LLIBCDLL,
	and therefore, the alternate math library. In the C Version 6.00
	"Advanced Programming Techniques" manual, it states that the alternate
	math library must be used because of the following:
	
	   For a DLL to use the 80x87 coprocessor of the emulation point
	   library, the DLL and all of its client programs must agree on which
	   process is going to handle floating-point exceptions and on which
	   process is going to handle emulation if the machine does not have a
	   coprocessor.
	
	I don't understand why exception handling and/or task switching causes
	more problems for using an 80x87 in a DLL context than in normal
	applications. The DLL can always find the PID of the client and could
	signal it, register a DosExitList function, or do several other things
	in the case of an exception. Given that the DLL C run-time databases
	could be per-instance data segments, why is there a problem?
	
	Response:
	
	The problem with handling 80x87 floating-point exceptions and using
	DLLs is that when we call DosSetVec() to set a handler for 80x87
	exceptions, the handler is set for the entire process. Whoever calls
	DosSetVec() last will get control of all 80x87 exceptions.
	
	Suppose we are lucky and the DLL calls DosSetVec() last and an
	exception occurs. The DLL has no way of knowing whether the exception
	occurred in the DLL's code or the EXE's code (or perhaps some other
	DLL). Thus, the DLL has no way of knowing what to do. Perhaps the
	exception should be ignored or maybe the process should be terminated.
	
	Calling DosExitList() is not a solution because the DLL has to decide
	what to do right now. Also, finding out the PID and then signaling the
	process is not very useful because this means that the EXE and all of
	the DLLs in the process must set up special signal handlers to handle
	exceptions. In other words, the EXE and the DLL must all use a special
	library to cooperate when a floating point exception occurs, and that
	is what CDLLOBJS.LIB is for.
	
	LLIBCDLL.LIB is for writing stand-alone DLLs, that is, DLLs that can
	be called from any EXE. Because LLIBCDLL.LIB uses alternate math, it
	is completely self-contained and doesn't need any special code in the
	EXE.
