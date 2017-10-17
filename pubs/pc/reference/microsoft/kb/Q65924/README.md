---
layout: page
title: "Q65924: How to Get Absolute Address of String Variable in BASIC"
permalink: /pubs/pc/reference/microsoft/kb/Q65924/
---

## Q65924: How to Get Absolute Address of String Variable in BASIC

	Article: Q65924
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900725-36 B_BasicCom
	Last Modified: 19-OCT-1990
	
	This article describes how to get the absolute memory address of the
	contents of a variable-length string variable in compiled BASIC. The
	sample code below also shows how to PEEK at the string in memory.
	
	To get the physical (or absolute) address, you must multiply the
	segment value (which is in paragraphs) by 16 bytes per paragraph, and
	then add the offset value (which is in bytes). However, there are some
	integer tricks necessary to work around the fact that the VARPTR,
	VARSEG, SADD, and SSEG functions return a signed short integer instead
	of an unsigned address, as described further below.
	
	This information applies to QuickBASIC versions 4.00, 4.00b, and 4.50
	for MS-DOS; to Microsoft BASIC Compiler versions 6.00 and 6.00b for
	MS-DOS and MS OS/2; and to Microsoft BASIC Professional Development
	System (PDS) versions 7.00 and 7.10 for MS-DOS and MS OS/2.
	
	The above BASICs use a medium memory model. This means that a compiled
	.EXE program (as well as a program being executed within the QB.EXE or
	QBX.EXE environment) consists of multiple code segments and one data
	segment (DGROUP). In the above BASICs, certain data items, such as
	dynamic non-variable-length-string arrays, reside outside the near
	data segment (DGROUP). In BASIC PDS 7.00 and 7.10, the contents of far
	variable-length strings also reside outside DGROUP. Code and data
	objects can thus be found in various places in memory, and the general
	layout of these items is more complex than in earlier BASICs.
	
	To determine the absolute address of any data item, you first must
	obtain the segment and offset of that data item.
	
	The VARSEG function returns the segment of any variable or near string
	descriptor. However, in BASIC PDS 7.00 and 7.10, you must use the SSEG
	function (instead of VARSEG) to find the segment for the contents of
	far strings because VARSEG is useless for far strings. VARSEG just
	finds the segment of the descriptor for near strings in BASIC PDS 7.00
	and 7.10. SSEG can be used to find the segment of the contents of both
	near and far strings in BASIC PDS 7.00 and 7.10.
	
	The offset can be found with the SADD function (for the contents of
	variable-length strings) or the VARPTR function for all other data
	types (including fixed-length strings).
	
	The segment value is measured in paragraphs, whereas the offset is
	measured in bytes. You must multiply the segment value by 16 bytes per
	paragraph to convert to bytes. (Segments are numbered on paragraph
	boundaries, which are every 16 bytes.)
	
	To get the physical (or absolute) address, you must multiply the
	segment value by 16 decimals (10 Hex) and then add the offset value.
	
	Special Integer Handling Is Required for Addresses Above 32767
	--------------------------------------------------------------
	
	The VARPTR, VARSEG, SADD, and SSEG functions return values anywhere
	between 0 (zero) and FFFF hex (or between 0 and 65535 in unsigned
	decimal notation).
	
	However, if VARPTR, VARSEG, SADD, or SSEG return an address value
	between 8000 hex and FFFF hex (or between 32768 and 65535 in unsigned
	decimal notation), which you may assign to a short or long integer,
	then BASIC reports the integer as negative (from -32768 to -1,
	respectively). This occurs because the VARPTR, VARSEG, SADD, and SSEG
	functions return a signed short integer. BASIC does not have an
	unsigned data type. This means that if the integer variable returned
	(from VARPTR, VARSEG, SADD, or SSEG) is negative, you must convert it
	to its equivalent unsigned value and assign to a long integer. (A long
	integer can store positive numbers between 32768 and 65535, unlike a
	short integer.) The Unsigned& FUNCTION below is provided for this
	purpose.
	
	For more information about converting a BASIC signed integer to
	unsigned and assigning to a long integer, search for a separate
	article using following words:
	
	   how AND convert AND BASIC AND unsigned AND integer
	
	Code Example of Calculating Absolute Address of String Contents
	---------------------------------------------------------------
	
	This program determines the absolute address of the contents of a
	variable-length string in memory. The program also uses the PEEK
	function and prints the string byte by byte. To make the program work
	in BASIC PDS 7.00 or 7.10 when using BC /Fs (far strings) or running
	in QBX.EXE, you must use SSEG instead of VARSEG, as shown (or else the
	wrong address will be used and PEEK will return random characters).
	
	DECLARE FUNCTION Unsigned& (param%)
	CLS
	strng$ = "Quigzy Sticks are gurus"  ' initialize variable
	offset% = SADD(strng$)    ' Get VARPTR value, assign to short integer
	' Use only one of the following segment% assignments, depending upon
	' which BASIC version you have:
	segment% = VARSEG(strng$)  ' Get VARSEG value, assign to short integer
	                           ' in QuickBASIC 4.x, BASIC compiler 6.00x.
	                           ' In BASIC PDS 7.00/7.10, VARSEG only gives
	                           ' segment for near string descriptors;
	                           ' VARSEG is useless for far strings.
	'segment% = SSEG(strng$)  ' Get SSEG value, assign to short integer
	                          ' in BASIC PDS 7.00/7.10 if using BC /Fs
	                          ' (far strings) or running in QBX.EXE.
	                          ' SSEG works with far or near strings.
	' Convert short integer offset% to unsigned long integer loffset& :
	loffset& = Unsigned&(offset%)
	' Convert short integer segment% to unsigned long integer lsegment& :
	lsegment& = Unsigned&(segment%)
	lsegment& = lsegment& * 16  ' Convert segment paragraphs to bytes.
	address& = lsegment& + loffset&   ' Calculate absolute address.
	DEF SEG = segment%
	FOR i = 0 TO (LEN(strng$) - 1)
	  a = PEEK(loffset& + i)          'Print out the string byte by byte.
	  PRINT CHR$(a);
	NEXT
	PRINT : PRINT
	PRINT "The above string is located at the following RAM location:"
	PRINT "Absolute machine address in decimal : "; address&
	PRINT "Absolute machine address in hex     :  "; HEX$(address&)
	
	FUNCTION Unsigned& (param%)
	' This function returns the unsigned long integer form of the
	' short integer param%, which was passed as input.
	   IF param% < 0 THEN
	      Unsigned& = &HFFFF& AND param%
	   ELSE
	      Unsigned& = param%
	   END IF
	END FUNCTION
	
	Manual Example of Calculating Absolute Address in Hex Notation
	--------------------------------------------------------------
	
	Multiplying by 16 corresponds to shifting the segment value 4 bits to
	the left in binary notation (2 ^ 4 = 16), or in hex notation, shifting
	the segment value to the left by one hex digit. The easiest way
	manually to multiply by 16 is to work with segment values in Hex and
	append a zero to the right side of the Hex value.
	
	For example, assume the segment value is &h1234 and the offset value
	is &h4321. To add the segment and offset together and calculate the
	absolute address, you must first multiply the segment by &h10, as
	follows:
	
	   &h1234 times &h10 equals &h12340
	
	&h12340 is thus the absolute byte location of the segment. Now, add
	the offset to the absolute byte location of the segment, as follows:
	
	   &h12340 plus &h4321 equals &h13661
