---
layout: page
title: "Q46376: How to Pipe ( &#124; ) Input into a QuickBASIC Program"
permalink: /pubs/pc/reference/microsoft/kb/Q46376/
---

## Q46376: How to Pipe ( &#124; ) Input into a QuickBASIC Program

	Article: Q46376
	Version(s): 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890621-89 B_BasicCom
	Last Modified: 27-DEC-1989
	
	It is possible to use DOS redirection to pipe output from a program
	into a QuickBASIC program. To do this, the QuickBASIC program must
	CALL INTERRUPT 21 Hex, with function 3F Hex, to get the input from the
	DOS device CON.
	
	This information applies to Microsoft QuickBASIC Versions 3.00, 4.00,
	4.00b, and 4.50 for MS-DOS, to Microsoft BASIC Compiler Versions 6.00
	and 6.00b for MS-DOS, and to Microsoft BASIC PDS Version 7.00 for
	MS-DOS.
	
	DOS redirection is a feature of DOS Versions 2.00 and later. It allows
	you to take the output that would normally go to a device like the
	terminal's screen and redirect or "pipe" the output into another
	program. The program on the receiving end then takes the input and
	processes or "filters" the input. This is why these programs are often
	called "filters." The syntax for the DOS pipe command is the
	following:
	
	   DOS-PROMPT> p1 | p2
	
	In this command, p1 is the program performing the output, | is called
	the pipe symbol, and p2 is the program performing the input or
	filtering. An example of a common use for this feature of DOS is as
	follows:
	
	   DOS-PROMPT> dir | sort
	
	The "dir" command gives a listing of the current directory, which is
	piped into the DOS "sort" program. Sort then filters the input and
	displays the directory listing in sorted order.
	
	However, the output from p1, the first program, can be piped into a
	QuickBASIC program as well. The QuickBASIC program can then read the
	input from the DOS device CON. This is possible because DOS stores the
	output from the first program in a temporary file. The QuickBASIC
	program can then CALL INTERRUPT 21H function 3FH to retrieve the
	input. This function inputs a specific number of bytes from a file or
	device, such as the CON device.
	
	Interrupt 21 Hex, with function 3F hex, requires five register
	parameters to be passed:
	
	   AH = The function number, 3F Hex.
	   BX = Handle to the file or device.
	   CX = The number of bytes to read.
	   DS = Segment of the buffer area. The buffer will be a string.
	   DX = Offset of the buffer area.
	
	For more detailed information on INTERRUPT 21 Hex and function 3F Hex,
	redirection, and filters, consult "Advanced MS-DOS Programming" by Ray
	Duncan, published by Microsoft Press, copyright 1988.
	
	For more information on using the QuickBASIC CALL INTERRUPT, search on
	the following word:
	
	   QB4INT
	
	Note: You can pipe information into a QuickBASIC program, but it is
	more difficult to pipe information from a QuickBASIC program to
	another program. QuickBASIC usually does not output information
	through DOS services but accesses the hardware directly. The PRINT
	statement, for example, displays text directly to video memory, not to
	the DOS CON device. To direct output from a BASIC program to CON, you
	must either OPEN the BASIC device "CONS" (with no colon) for output as
	a file and PRINT#n all information to that file number (#n), or use
	INTERRUPT 21 Hex, with function 40 Hex, to output to the CON device.
	This output could be piped into another program.
	
	Code Example
	------------
	
	'***********************************************************
	'* This program calls the DOS INTerrupt 21H function 3FH   *
	'*  in order to read any input that has been redirected    *
	'*  to it with the | operator from DOS. It then echoes the *
	'*  input to the screen, and filters out any extra Line    *
	'*  Feed characters.                                       *
	'***********************************************************
	
	REM $INCLUDE: 'qb.bi'
	' For BC.EXE and QBX.EXE for BASIC 7.00 use the include file 'QBX.BI'
	
	DIM inregs AS RegTypeX, outregs AS RegTypeX
	
	REM $DYNAMIC
	DIM tempvar(10) AS STRING * 10
	'NOTE: The length of the string and the number of bytes read
	'      (inregs.cx) should be the same.
	
	DO
	     ' Set up the parameters for the CALL INTERRUPTX
	     inregs.ax = &H3F00  ' AH gets the functions number.
	     inregs.bx = 0       ' The is the handle to the CON device is 0.
	     inregs.cx = 10      ' Request to read 10 characters at a time.
	     inregs.ds = VARSEG(tempvar(1)) ' Segment of the buffer area.
	     inregs.dx = VARPTR(tempvar(1)) ' Offset of the buffer area.
	
	     'INT 21H function 3FH to read a file or device.
	     CALL INTERRUPTX(&H21, inregs, outregs)
	
	     'The number of bytes actually read is returned in AX.
	     'We requested 10, so if it reads fewer, then we are done.
	     IF outregs.ax < 10 THEN EXIT DO
	
	     ' Filter the string returned
	     FOR i = 1 TO LEN(tempvar(1))
	       a$ = MID$(tempvar(1), i, 1)
	      ' DOS puts a line feed (LF) after its carriage return.
	      ' We want to avoid this, because the PRINT will add an
	      ' extra carriage return after this line feed.
	
	       IF NOT (a$ = CHR$(10)) THEN
	      PRINT a$;
	       END IF
	    NEXT
	LOOP
	END
