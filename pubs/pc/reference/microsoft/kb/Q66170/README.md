---
layout: page
title: "Q66170: Repeat Prefix (REP) Documentation Error"
permalink: /pubs/pc/reference/microsoft/kb/Q66170/
---

## Q66170: Repeat Prefix (REP) Documentation Error

	Article: Q66170
	Version(s): 5.00   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | docerr
	Last Modified: 12-NOV-1990
	
	On Page 368 of the "Microsoft Macro Assembler Programmer's Guide," the last
	sentence in the second paragraph from the bottom states the following:
	
	   Segment overrides can be used safely when interrupts are turned
	   off, when a string instruction is used without a segment override,
	   or when a 80386 processor is used.
	
	It should read as follows:
	
	   Segment overrides can be used safely when interrupts are turned
	   off, when a string instruction is used without a repeat prefix, or
	   when a 80386 processor is used.
	
	The repeat prefix may be used safely with segment overrides if a CLI
	instruction is performed before the REP instruction and a STI
	instruction is performed after it. This process shuts off interrupts
	during the REP instruction that contains a segment override. Clearing
	interrupts in this manner is only needed for instructions with segment
	overrides that are preceded with REP.
	
	Please note that the execution of a repeated instruction can take a
	considerable amount of time; you may not want to have interrupts shut
	off for that much time. It is the programmer's responsibility to
	ensure that interrupts are not missed while interrupts are off.
	
	A better alternative if you are moving a large amount of data is to
	change the DS register for the duration of the repeated instruction
	(so that the segment override is not needed) and restore it
	afterwards.
	
	The following is an example of using the CLI instruction to disable
	interrupts and using the STI instruction to re-enable them:
	
	    ;   set SI and DI
	
	    MOV CX, 20   ; relatively small number of bytes--won't take long
	    CLI
	    REP MOVS dest,ES:source
	    STI
	
	    ;   ...
	
	The following is an example of temporarily using the DS register to
	avoid the segment override:
	
	    ;   set SI and DI
	
	    MOV  CX, 4000h ; lots to move -- this will take some time
	    PUSH DS        ; save for later
	    PUSH ES        ; same as ES: override -- change for other overrides
	    POP  DS        ; load into DS
	    REP  MOVS dest, source
	    POP  DS        ; restore DS
