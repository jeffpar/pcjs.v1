---
layout: page
title: "Q50944: Using CALL INTERRUPT to Push Characters into Keyboard Buffer"
permalink: /pubs/pc/reference/microsoft/kb/Q50944/
---

## Q50944: Using CALL INTERRUPT to Push Characters into Keyboard Buffer

	Article: Q50944
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S891113-111 B_BasicCom
	Last Modified: 21-FEB-1991
	
	It is possible in compiled BASIC to push keys into the keyboard buffer
	on IBM AT and PS/2 class computers using the CALL INTERRUPT statement.
	(This technique will not work on IBM PC class computers.) This can
	allow you to create keyboard macros, such as for training and
	demonstration sequences in a program. Therefore, if you were to write
	a program that required a lot of input from and interaction with a
	user, you could also write a training or demonstration sequence that
	would show the user what kind of input your program required, using
	the method demonstrated below. This would require filling in the
	required responses for the user by pushing the keystrokes into the
	keyboard buffer.
	
	This information applies to Microsoft QuickBASIC versions 4.00, 4.00b,
	and 4.50 for MS-DOS; to Microsoft BASIC Compiler versions 6.00 and
	6.00b for MS-DOS; and to Microsoft BASIC PDS versions 7.00 and 7.10
	for MS-DOS.
	
	The interrupt for the key push routine requires both the scan code for
	the key and the ASCII value of the character to be pushed. A maximum
	of 15 characters can be pushed into the keyboard buffer at one time.
	
	The program shown below, KEYPSH.BAS, sets up a table containing all of
	the scan codes for ASCII character values 32 (a space) through 126
	(~), and defines the routine PUSHSTRING that will push the passed
	string of characters into the keyboard buffer.
	
	Code Example: KEYPSH.BAS
	------------------------
	
	' This program works on IBM AT and PS/2 class computers, but not on
	' IBM PC class computers.
	DECLARE SUB pushstring (thestring$)
	REM $INCLUDE: 'qb.bi'   ' User-defined TYPEs for CALL INTERRUPT
	' For BC.EXE and QBX.EXE in BASIC 7.00, use the include file 'QBX.BI'
	DIM SHARED scanarray(1 TO 93) AS INTEGER
	FOR i% = 1 TO 93  ' initialize scan code array
	        READ scanarray(i%)
	NEXT
	CALL pushstring("<Key Push!>")
	INPUT a$
	PRINT a$
	' Define Scan Codes for ASCII characters 32 (space) through 126 (~):
	
	REM      !   "  #  $  %  &   '   (   )  *   +   ,   -   .   /
	DATA 57, 2, 40, 4, 5, 6, 8, 40, 10, 11, 9, 13, 51, 12, 52, 53
	
	REM    0  1  2  3  4  5  6  7  8   9
	DATA  11, 2, 3, 4, 5, 6, 7, 8, 9, 10
	
	REM   :   ;   <   =   >   ?  @
	DATA 39, 39, 51, 13, 52, 53, 3
	
	REM   A   B   C   D   E   F   G   H   I   J   K   L   M
	DATA 30, 48, 46, 32, 18, 33, 34, 35, 23, 36, 37, 38, 50
	
	REM   N   O   P   Q   R   S   T   U   V   W   X   Y   Z
	DATA 49, 24, 25, 16, 19, 31, 20, 22, 47, 17, 45, 21, 44
	
	REM   [   \   ]  ^   _   `
	DATA 26, 43, 27, 7, 12, 41
	
	REM   a   b   c   d   e   f   g   h   i   j   k   l   m
	DATA 30, 48, 46, 32, 18, 33, 34, 35, 23, 36, 37, 38, 50
	
	REM   n   o   p   q   r   s   t   u   v   w   x   y   z
	DATA 49, 24, 25, 16, 19, 31, 20, 22, 47, 17, 45, 21, 44
	
	REM   {   |   }   ~
	DATA 26, 43, 27, 41
	
	SUB pushstring (thestring$)   ' pushes string into keyboard buffer
	   DIM inregs AS regtype
	   DIM outregs AS regtype
	   stringlen = LEN(thestring$)
	   IF stringlen > 15 THEN stringlen = 15  ' max buffer size = 15
	   FOR i% = 1 TO stringlen
	      inregs.ax = &H500    ' subfunction to push character
	      ascvalue = ASC(MID$(thestring$, i%, 1))
	      IF ascvalue >= 32 AND ascvalue <= 126 THEN
	         'assign scan code to high byte
	         inregs.cx = scanarray(ascvalue - 31) * 256
	         inregs.cx = inregs.cx + ascvalue   ' add ASCII code
	         CALL interrupt(&H16, inregs, outregs) ' keyboard interrupt
	      END IF
	   NEXT
	END SUB
	
	To compile and link with Microsoft QuickBASIC versions 4.00, 4.00b,
	and 4.50, or with Microsoft BASIC Compiler versions 6.00 and 6.00b,
	perform the following:
	
	   BC KeyPSH.bas;
	   LINK KeyPSH.bas,,,BRUNxx.Lib+QB.Lib;
	
	The "xx" in the library name is for the current version of the product
	you are using (40, 41, 45, 60, or 61). For BASIC compiler 6.00 and
	6.00b, use BRUNxxER.LIB (emulation math package) or BRUNxxAR.LIB
	(alternate math package). For the alternate math library, you must
	compile with the BC /FPa switch. If you compile with BC /O, link with
	BCOMxx.LIB instead of BRUNxx.LIB.
	
	To run this program in the QB.EXE environment, you must load the Quick
	library QB.QLB as follows:
	
	   QB /L QB.QLB
	
	For BASIC PDS 7.00, compile and link as follows:
	
	   BC KeyPSH.bas;
	   LINK KeyPSH.bas,,,BRT70ENR.Lib+QBX.Lib;
	
	The above example is for the math emulation, near strings, and real
	mode run-time library. The other possible run-time libraries and their
	corresponding compiler switches are as follows:
	
	   Library Name   Compiler Switches    Comments
	   ------------   -----------------    --------
	
	   BRT70ENR.LIB   [default in MS-DOS]   Emulation math, near strings
	   BRT70ANR.LIB   /FPa                  Alternate math, near strings
	   BRT70EFR.LIB   /Fs                   Emulation math, far strings
	   BRT70AFR.LIB   /FPa /Fs              Alternate math, far strings
	
	To use stand-alone libraries, use BCL70xxx.LIB instead of BRT70xxx.LIB
	and add the compiler switch BC /O.
	
	For the QBX.EXE 7.00 environment, use QBX.QLB as follows:
	
	   QBX /L QBX.QLB
	
	References:
	
	For more articles about reading from and writing to the keyboard
	buffer, query on the following words:
	
	   interrupt and keyboard and buffer
	
	Keyboard scan codes and ASCII codes are documented in Appendix D of
	"Microsoft QuickBASIC 4.5: Programming in BASIC"; in Appendix A of
	"Microsoft QuickBASIC 4.0: Language Reference" for 4.00 and 4.00b; in
	Appendix A of "Microsoft BASIC Compiler 6.0: Language Reference" for
	6.00 and 6.00b; and in Appendix A of "Microsoft BASIC 7.0: Language
	Reference" manual for BASIC PDS versions 7.00 and 7.10.
