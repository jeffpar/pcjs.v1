---
layout: page
title: "Q33714: Passing Strings to Assembler Routines Written for GW-BASIC"
permalink: /pubs/pc/reference/microsoft/kb/Q33714/
---

## Q33714: Passing Strings to Assembler Routines Written for GW-BASIC

	Article: Q33714
	Version(s): 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom B_GWBasicI
	Last Modified: 21-JUN-1989
	
	Assembler routines that are written to run with Microsoft GW-BASIC (or
	with IBM BASICA or Compaq BASICA) and are passed a string variable as
	an argument will not run properly when called from QuickBASIC compiled
	programs. This problem arises because the length of the string
	descriptor for QuickBASIC strings (4 bytes) is 1 byte longer than the
	string descriptor for the GWBASIC.EXE or the BASICA interpreter (3
	bytes).
	
	One solution to this problem is to simulate a GW-BASIC string in
	QuickBASIC and pass this simulated string to the assembler routine.
	The assembler routine does not need to be modified when this method is
	used.
	
	Note that many other more complicated factors (such as memory
	management of code and data) may also prevent assembler routines that
	were designed for GW-BASIC or BASICA to be successfully called from
	compiled BASIC. Many assembler routines may require rewriting.
	
	This information applies to QuickBASIC Versions 2.00, 2.01, 3.00,
	4.00, 4.00b, and 4.50 and to Microsoft BASIC Compiler Versions 6.00
	and 6.00b for MS-DOS and MS OS/2.
	
	The following program shows how to simulate a GW-BASIC string in
	QuickBASIC and pass it to an assembly routine that is expecting a
	GW-BASIC string:
	
	DIM a AS STRING * 11  'The length of this fixed-length string should be
	                      'the maximum number of characters to pass to the
	                      'assembly routine plus 3 (8 + 3 in this case).
	DIM c%(&H20)          'Reserves an area into which an assembly program
	                      'may be loaded.
	COMMON c%()           'Causes the array to be in the default data segment
	                      'when running in the editing environment.
	CLS
	BLOAD "gwstr.bin", VARPTR(c%(0))  'Load assembly routine into reserved area
	st$ = "printer"        'String to pass to the assembly routine
	addr% = VARPTR(a)      'Get the address of the fixed length string
	addr% = addr% + 3      'Compute the address of the actual string data
	
	                       'This line creates a 3-byte header and combines
	                       'that with the actual string data
	a = CHR$(LEN(st$)) + CHR$(addr% MOD 256) + CHR$(addr% \ 256) + st$
	
	                       'Passes to the assembly routine a pointer to
	                       'the simulated GW-BASIC string.
	CALL absolute(BYVAL VARPTR(a), VARPTR(c%(0)))
	END
	
	Programming Notes
	-----------------
	
	To simulate the GW-BASIC string, a fixed-length string is used. The
	first three characters of the fixed-length string are used to simulate
	the 3-byte string descriptor used in GW-BASIC. (Note that a
	fixed-length string has no string descriptor, thus VARPTR points to
	the actual string.)
	
	In GW-BASIC or BASICA, the first byte of the descriptor is the length
	of the string data and the next two are the offset of the string data.
	Because we are putting the string data into the fixed-length string in
	the characters following the 3-byte header, we can compute the offset
	of the string data by getting the offset of the fixed-length string
	and adding 3 to it.
	
	The offset of the string data is put into low byte-high byte format
	and placed into the second and third bytes of the string descriptor.
	The offset to the fixed-length string is passed to the assembly
	routine. Because the first three characters of the fixed-length string
	simulate a GW-BASIC string descriptor, the assembly routine thinks it
	is receiving a GW-BASIC string. It does not matter that the descriptor
	and string data are contiguous in memory.
