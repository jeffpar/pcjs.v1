---
layout: page
title: "Q65923: Interrupt to Get QB/QBX Invocation Command Line; vs. COMMAND&#36;"
permalink: /pubs/pc/reference/microsoft/kb/Q65923/
---

## Q65923: Interrupt to Get QB/QBX Invocation Command Line; vs. COMMAND&#36;

	Article: Q65923
	Version(s): 6.00 6.00b 7.00 7.10
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900925-39 B_QuickBas
	Last Modified: 19-OCT-1990
	
	Below is an example of how to do a DOS interrupt to obtain the
	command-line arguments used to invoked a QuickBASIC program. The
	sample program works in the QB.EXE/QBX.EXE environment and in an .EXE
	program. This program can be used to obtain the name of the Quick
	library that QB or QBX was invoked with.
	
	The program returns the complete command line entered (if any) after
	your .EXE or QB/QBX program name. The BASIC language offers the
	COMMAND$ function to do the same thing, but COMMAND$ returns nothing
	in the QB.EXE/QBX.EXE environment.
	
	This sample code applies to Microsoft QuickBASIC versions 4.00, 4.00b,
	and 4.50; to Microsoft BASIC Compiler versions 6.00 and 6.00b for
	MS-DOS; and to Microsoft BASIC PDS versions 7.00 and 7.10 for MS-DOS.
	(The code will also run under the DOS 3.x box in MS OS/2's real mode,
	but will not run under MS OS/2's protected mode.)
	
	The following program uses DOS interrupt 21 hex, with function 62 hex,
	to find the segment address of the program segment prefix (PSP). Based
	on this information, the program then uses the PEEK function to read
	the command line from memory. The Arguments$ function in the example
	returns a string containing all command-line arguments.
	
	The program arguments are located at an offset of &H80 (80 hex) from
	the PSP. The first byte at this offset is the number of characters in
	the command tail, followed by a string of ASCII characters terminated
	by a carriage return; the carriage return is not included in the
	count.
	
	For more information about MS-DOS interrupts, please refer to the
	following excellent book:
	
	   "Advanced MS-DOS Programming, Second Edition", by Ray Duncan,
	    published by Microsoft Press (1988).
	
	Sample Code
	-----------
	
	To use this sample code, QuickBASIC must be started with the /L option
	to load the default Quick library, QB.QLB or QBX.QLB, which contains
	the necessary INTERRUPT routine. (In QuickBASIC 4.x or BASIC compiler
	6.00x, the default Quick library is QB.QLB; in BASIC PDS 7.00 and
	7.10, it is QBX.QLB). Name the following program TEST.BAS:
	
	' $INCLUDE: 'qb.bi'
	' In QuickBASIC 4.x or BASIC compiler 6.00x, use the above include;
	' but in BASIC PDS 7.00 and 7.10, change the above to use 'QBX.BI'
	DECLARE FUNCTION Arguments$ ()
	args$ = Arguments$
	PRINT args$
	END
	
	FUNCTION Arguments$
	DIM regs AS RegType
	regs.ax = &H6200
	CALL INTERRUPT(&H21, regs, regs)   ' Get the address of the PSP
	DEF SEG = regs.bx                  ' Set the current segment
	count = PEEK(&H80)                 ' Get the number of characters
	a$ = ""
	FOR a = 2 TO count                 ' Read the arguments from memory
	     a$ = a$ + CHR$(PEEK(&H80 + a))
	NEXT
	Arguments$ = a$                    ' Return the arguments to program
	END FUNCTION
	
	If you invoked this program with
	
	   QB TEST/L QB.QLB
	      or
	   QBX TEST/L QBX.QLB
	
	the program will print the following:
	
	   TEST/L QB.QLB
	      or
	   TEST/L QBX.QLB
	
	If you invoked this program from an .EXE program (such as TEST.EXE) as
	follows
	
	   TEST ARG1 ARG2
	
	then the program will print the following:
	
	   ARG1 ARG2
