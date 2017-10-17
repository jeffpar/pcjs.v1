---
layout: page
title: "Q39190: BC /A or CodeView Finds Run-Time Error Segment:Offset Address"
permalink: /pubs/pc/reference/microsoft/kb/Q39190/
---

## Q39190: BC /A or CodeView Finds Run-Time Error Segment:Offset Address

	Article: Q39190
	Version(s): 6.00 6.00b 7.00 | 6.00 6.00b 7.00
	Operating System: MS-DOS          | OS/2
	Flags: ENDUSER | B_QuickBas
	Last Modified: 26-FEB-1990
	
	The following information applies to Microsoft BASIC Compiler Versions
	6.00 and 6.00b for MS-DOS and MS OS/2, to Microsoft BASIC Professional
	Development System (PDS) Version 7.00 for MS-DOS and MS OS/2, and to
	QuickBASIC Versions 4.00, 4.00b, and 4.50 for MS-DOS.
	
	When a run-time error message is displayed with a segment and offset
	address, the address is in hexadecimal notation. For example, "error
	in module [name] at 5517:0059" means a code segment address of 5517
	hexadecimal and a code offset address of 0059 hexadecimal.
	
	To find out where this address corresponds to a statement in your
	program, you can compile your program with the BC /A option and
	generate a .LST file. The .LST file lists the code offsets along with
	the BASIC statements and their translation into assembly-language
	code. You can use the module name and code offset from the run-time
	error message to find the error line in that module's .LST file. (The
	segment address from the error message is not needed to find the error
	line in the .LST file).
	
	You can also use the run-time error's segment:offset address in the
	Microsoft CodeView debugger to see which BASIC code caused the
	run-time error.
	
	The BC /A option requires the file to be saved in Text format. (If you
	save the source file in Fast Load and Save format, BC /A gives the
	compiler error "Cannot generate listing for BASIC binary source
	files.")
	
	Page 196 of the "Microsoft CodeView and Utilities: Software
	Development Tools for MS-DOS" manual states that you can use "V" to
	view an address in the segment:offset format. To view the source code
	executed at an address, type the following in CodeView:
	
	   V &H5517:&H0059
	
	Note: QuickBASIC Versions 4.00, 4.00b, and 4.50 are not sold with the
	CodeView debugger. The CodeView debugger comes with Microsoft BASIC
	Compiler Version 6.00 or 6.00b, Microsoft BASIC PDS Version 7.00, or
	with Microsoft Macro Assembler Versions 5.00 and 5.10, but is not sold
	separately.
	
	The following is an example of finding the statement in error in a
	BASIC program based upon the code offset given in the run-time error
	message. The BASIC .EXE program below generates a "File Not Found"
	error at a specific address. Note that the error occurred at an offset
	(0057) right after a call to B$OPEN. This is a clue that the error
	occurred with the open routine.
	
	The following is a code example to be compiled with the BC /A option:
	
	   CLS
	   PRINT "This is a test of the /a option"
	   OPEN "NONEXIST.DAT" FOR INPUT AS #1
	
	This program generates the following output:
	
	   This is a test of the /a option
	
	   File not found in module TEST     at address 5CCD:0057
	
	The .LST file generated with BC /A is as follows:
	                                                           PAGE   1
	                                                          28 Dec 88
	                                                           09:35:26
	Offset  Data    Source Line      Microsoft (R) QuickBASIC
	
	 0030   0006    CLS
	 0030   0006    PRINT "This is a test of the /a option"
	 0030   0006    OPEN "NONEXIST.DAT" FOR INPUT AS #1
	 0030   0006
	 0030   0006
	 0030    **            I00002: mov   ax,0FFFFh
	 0033    **                    push  ax
	 0034    **                    call  B$SCLS
	 0039    **                    mov   ax,offset <const>
	 003C    **                    push  ax
	 003D    **                    call  B$PESD
	 0042    **                    mov   ax,offset <const>
	 0045    **                    push  ax
	 0046    **                    mov   ax,0001h
	 0049    **                    push  ax
	 004A    **                    mov   ax,0FFFFh
	 004D    **                    push  ax
	 004E    **                    mov   ax,0001h
	 0051    **                    push  ax
	 0052    **                    call  B$OPEN      <<-- offending line
	 0057    **                    call  B$CENP
	 005C   0006
	
	43613 Bytes Available
	43308 Bytes Free
	
	    0 Warning Error(s)
	    0 Severe  Error(s)
