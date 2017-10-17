---
layout: page
title: "Q65323: BASIC Program to Read COBOL BCD (COMP-3) Numbers"
permalink: /pubs/pc/reference/microsoft/kb/Q65323/
---

## Q65323: BASIC Program to Read COBOL BCD (COMP-3) Numbers

	Article: Q65323
	Version(s): 6.00 6.00b 7.00 7.10 | 6.00 6.00b 7.00 7.10
	Operating System: MS-DOS               | OS/2
	Flags: ENDUSER | SR# S900828-36 B_COBOL
	Last Modified: 2-JAN-1991
	
	Below is a BASIC program that reads a data file created by Microsoft
	COBOL containing binary-coded-decimal (COMP-3) numbers. This is
	accomplished by reading in the file one byte at a time, interpreting
	those bytes according to the binary-coded-decimal (BCD) format, and
	performing calculations based on those interpretations to generate
	equivalent BASIC double-precision floating-point numbers.
	
	This information applies to Microsoft QuickBASIC versions 4.00, 4.00b,
	and 4.50 for MS-DOS; to Microsoft BASIC Compiler versions 6.00 and
	6.00b for MS-DOS and MS OS/2; and to Microsoft BASIC Professional
	Development System (PDS) versions 7.00 and 7.10 for MS-DOS and MS
	OS/2.
	
	The information about binary-coded-decimal numbers and the COMP-3
	format applies to Microsoft COBOL Compiler versions 3.00 and 3.00a for
	MS-DOS and MS OS/2, and to Microsoft COBOL Professional Development
	System version 4.00 for MS-DOS and MS OS/2.
	
	Microsoft COBOL 3.00, 3.00a, and 4.00 support a data type commonly
	referred to as binary-coded-decimal (BCD) format. The syntactical name
	for this data type in COBOL is COMP-3.
	
	The bytes used to store a COMP-3 number can contain two base-10 digits
	each. The high nibble (4 bits) stores one digit of the number and the
	low nibble (4 bits) stores the next digit to the right. That is, the
	high nibble stores a digit whose place in the number has a power of 10
	that is one greater than that of the digit in the low nibble.
	Moreover, the first byte used to store the number will contain the
	digit with the highest power of 10; subsequent bytes will hold digits
	that have successively lesser powers of 10. (Note: There are two
	nibbles in every byte.)
	
	A special case is made for the last byte, where the high nibble stores
	the last digit in the number, and the low nibble stores the sign of
	the number. The low nibble will contain 15 if the number is unsigned,
	12 for positive, and 13 for negative. Also, if the number of nibbles
	needed for digits plus the sign nibble will not fill a whole number of
	bytes, the high nibble of the byte storing the first digit is set to
	0.
	
	As an example, here is a binary representation of how the number 69
	(signed positive) would be stored:
	
	   +---------- First Byte ---------+--------- Second Byte ---------+
	   |                               |                               |
	   +- High Nibble -+- Low Nibble --+- High Nibble -+- Low Nibble --+
	   |               |               |               |               |
	   +---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+
	   | 0 | 0 | 0 | 0 | 0 | 1 | 1 | 0 | 1 | 0 | 0 | 1 | 1 | 1 | 0 | 0 |
	   +---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+
	   |               |               |               |               |
	   +------ 0 ------+------ 6 ------+------ 9 ------+-- Positive ---+
	
	Below is a BASIC program (BCDTODBL.BAS) that converts the COMP-3
	numbers in a COBOL data file to BASIC's double-precision numbers. The
	program reads in each byte of the file sequentially, interpreting it
	as either a pair of digits or a digit and a sign. The program knows
	that it has read all the digits in a number when the low nibble of the
	last byte read contains a sign value (12, 13, or 15). When this
	happens, the program circulates through all the digits accumulated for
	the number and multiplies each by its associated power of 10. The
	result of this iterative calculation is assigned to a double-precision
	floating-point number. Finally, one more calculation is performed on
	the number so that it will contain the amount of decimal places
	specified by the user.
	
	Following the BASIC program is a COBOL program (WRITEBCD.CBL) that
	creates a file containing a user-specified amount of COMP-3 signed
	numbers. To compile and link the program in COBOL 3.00 or 3.00a, enter
	the following commands from the DOS or OS/2 prompt:
	
	   cobol writebcd;
	   link writebcd;
	
	The compile lines for COBOL Professional Development System (PDS)
	version 4.00 are as follows:
	
	   cobol writebcd;
	   link writebcd,,,coblib cobapi;
	
	The BASIC program can be run or compiled from within the QB.EXE or
	QBX.EXE environments. See your BASIC documentation for information on
	using the QB.EXE or QBX.EXE environments.
	
	BCDTODBL.BAS
	------------
	
	DIM Digits%(15)       'Holds the digits for each number (max = 16).
	DIM BASICeqv#(1000)   'Holds the BASIC equivalent of each COMP-3 number.
	
	'Clear the screen, get the filename and the amount of decimal places
	'desired for each number, and open the file for sequential input:
	CLS
	INPUT "Enter the COBOL data file name: ", FileName$
	INPUT "Enter the number of decimal places desired: ", Decimal%
	OPEN FileName$ FOR INPUT AS #1
	
	DO UNTIL EOF(1)   'Loop until the end of the file is reached.
	   Byte$ = INPUT$(1, 1)   'Read in a byte.
	   IF Byte$ = CHR$(0) THEN  'Check if byte is 0 (ASC won't work on 0).
	      Digits%(HighPower%) = 0       'Make next two digits 0. Increment
	      Digits%(HighPower% + 1) = 0   'the high power to reflect the
	      HighPower% = HighPower% + 2   'number of digits in the number
	                                    'plus 1.
	   ELSE
	      HighNibble% = ASC(Byte$) \ 16      'Extract the high and low
	      LowNibble% = ASC(Byte$) AND &HF    'nibbles from the byte. The
	      Digits%(HighPower%) = HighNibble%  'high nibble will always be a
	                                         'digit.
	      IF LowNibble% <= 9 THEN                   'If low nibble is a
	                                                'digit, assign it and
	         Digits%(HighPower% + 1) = LowNibble%   'increment the high
	         HighPower% = HighPower% + 2            'power accordingly.
	      ELSE
	         HighPower% = HighPower% + 1 'Low nibble was not a digit but a
	         Digit% = 0                  '+ or - signals end of number.
	
	         'Start at the highest power of 10 for the number and multiply
	         'each digit by the power of 10 place it occupies.
	         FOR Power% = (HighPower% - 1) TO 0 STEP -1
	         BASICeqv#(E%)=BASICeqv#(E%) + (Digits%(Digit%) * (10^Power%))
	         Digit% = Digit% + 1
	         NEXT
	
	         'If the sign read was negative, make the number negative.
	         IF LowNibble% = 13 THEN
	            BASICeqv#(E%) = BASICeqv#(E%) - (2 * BASICeqv#(E%))
	         END IF
	
	         'Give the number the desired amount of decimal places, print
	         'the number, increment E% to point to the next number to be
	         'converted, and reinitialize the highest power.
	         BASICeqv#(E%) = BASICeqv#(E%) / (10 ^ Decimal%)
	         PRINT BASICeqv#(E%)
	         E% = E% + 1
	         HighPower% = 0
	      END IF
	   END IF
	LOOP
	CLOSE   'Close the COBOL data file, and end.
	
	WRITEBCD.CBL
	------------
	
	      $SET ANS85
	       IDENTIFICATION DIVISION.
	       PROGRAM-ID.  WriteBCD.
	
	       ENVIRONMENT DIVISION.
	       INPUT-OUTPUT SECTION.
	       FILE-CONTROL.
	           SELECT BCDFile ASSIGN TO "BCD.DAT".
	
	       DATA DIVISION.
	       FILE SECTION.
	       FD BCDFile.
	       01 BCDNumber      PIC S9(5) COMP-3.
	
	       WORKING-STORAGE SECTION.
	      *   Holds the number of COMP-3 items to write to the file.
	       01 TotalNumbers   PIC 99 COMP-5.
	
	       PROCEDURE DIVISION.
	
	      *   Get the number of COMP-3 items to write to file.
	          DISPLAY "Enter the number of items to write:".
	          ACCEPT TotalNumbers.
	
	      *   Open the COMP-3 file for sequential output and write each
	      *   number out to the file as the user enters it.
	          OPEN OUTPUT BCDFile.
	          PERFORM TotalNumbers TIMES
	             ACCEPT BCDNumber
	             WRITE BCDNumber
	          END-PERFORM.
	
	      *   Close the COMP-3 file and end.
	          CLOSE BCDFile.
