---
layout: page
title: "Q11785: Getting the DTA Address Using INT86"
permalink: /pubs/pc/reference/microsoft/kb/Q11785/
---

## Q11785: Getting the DTA Address Using INT86

	Article: Q11785
	Version(s): 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 28-DEC-1989
	
	Problem:
	
	I would like to search for files with a given extension, save them in
	an array, and display them on the screen for user selection using
	QuickBASIC Version 2.00 and the DOS interrupt routine INT86. I have
	written a sample program that calls function 4E and 4F to find the
	desired files. They appear to be working correctly, as the flag
	returned in the low byte of register AX is showing 0 for each
	successful find and 18 when no files exist or when the last file has
	been found. However, I do not know how to read the DTA (Disk Transfer
	Address) after I successfully find a file, thus I cannot store the
	filename for later display.
	
	Response:
	
	In QuickBASIC Versions 2.00, 2.01, and 3.00, you can perform DOS
	Interrupts by calling the external routine INT86. In QuickBASIC
	Versions 4.00, 4.00b, and 4.50, you can call the external routines
	INT86OLD INT86XOLD INTERRUPT and INTERRUPTX.
	
	It is difficult to find the current DTA of a program (and its offset
	is subject to change without notice); therefore, it is better to ask
	DOS (via INT 21, function Hex 1A "Set DTA") to reassign the DTA to a
	location over which you have control. For the application indicated,
	you should try the following:
	
	1. Issue the DOS function call to change the DTA address (INT 21,
	   function Hex 1A) to an address of a structure in your code space
	   (this way you will know where to find it).
	
	2. Perform your "Find first" (INT 21, function Hex 4E).
	
	3. Perform your loop of "Continue file search" (INT 21, function Hex
	   4F).
	
	Within your loop you may check your variables in the structure as
	desired. The "Microsoft MS-DOS Programmer's Reference" manual includes
	an example of how to set up the structure for the DTA in assembler.
	
	The book "Advanced MS-DOS," by Ray Duncan (Microsoft Press, 1986) also
	is a very helpful reference for using DOS function calls.
