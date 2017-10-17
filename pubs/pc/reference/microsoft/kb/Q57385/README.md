---
layout: page
title: "Q57385: INT86OLD &amp; INT86XOLD Not in QB 4.50 or BASIC 7.00 Help, Manual"
permalink: /pubs/pc/reference/microsoft/kb/Q57385/
---

## Q57385: INT86OLD &amp; INT86XOLD Not in QB 4.50 or BASIC 7.00 Help, Manual

	Article: Q57385
	Version(s): 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S891226-2 docerr B_BasicCom
	Last Modified: 26-FEB-1990
	
	The "Microsoft BASIC 7.0: BASIC Language Reference" manual fails to
	document the INT86OLD and INT86XOLD routines.
	
	Also, CALL INT86OLD and CALL INT86XOLD are not documented in the
	online Help systems for either QB.EXE in QuickBASIC 4.50 or for
	QBX.EXE, which comes with Microsoft BASIC Professional Development
	System (PDS) Version 7.00.
	
	A complete description of INT86OLD and INT86XOLD are provided below
	for owners of BASIC PDS 7.00, and for owners of QuickBASIC 4.50 who do
	not own a copy of the "Microsoft QuickBASIC 4.5: BASIC Language
	Reference."
	
	This information applies to Microsoft BASIC PDS 7.00 for MS-DOS and to
	Microsoft QuickBASIC 4.50 for MS-DOS.
	
	Note that CALL INT86OLD and CALL INT86XOLD are documented in the
	"Microsoft QuickBASIC 4.5: BASIC Language Reference" manual for
	QuickBASIC 4.50. The following description of INT86OLD and INT86XOLD
	is taken from Page 72 of that manual [additional comments are in
	brackets ([])]:
	
	                      CALL INT86OLD Statements
	
	ACTION: Allows programs to perform DOS system calls
	
	SYNTAX: CALL INT86OLD (intno, inarray(), outarray())
	        CALL INT86XOLD (intno, inarray(), outarray())
	
	REMARKS: The CALL INTERRUPT statement provides an easier way to make
	         DOS system calls. See the entry for CALL INTERRUPT for more
	         information. The following list describes the arguments to
	         INT86OLD and INT86XOLD:
	
	Argument    Description
	-----------------------
	intno       The DOS interrupt to perform. It is an integer between 0
	            and 255. See your DOS documentation for the interrupt
	            numbers.
	
	inarray()   An integer array specifying the register values when the
	            interrupt is performed.
	
	            INT86OLD uses an eight-element array, while INT86XOLD
	            uses a ten-element array. Table R.1 lists the array
	            elements and the corresponding registers.
	
	outarray()  Contains the post-interrupt register values. It has the
	            same structure as inarray().
	
	If an error occurs, intno = -1 and values in outarray are
	unchanged. Errors are caused by in_no not being in the range 0 - 255.
	
	Table R.1 INT86OLD and INT86XOLD Register Values
	------------------------------------------------
	Array Element         Register
	------------------------------------------------
	inarray(x)              AX
	inarray(x+1)            BX
	inarray(x+2)            CX
	inarray(x+3)            DX
	inarray(x+4)            BP
	inarray(x+5)            SI
	inarray(x+6)            DI
	inarray(x+7)            FLAGS
	inarray(x+8)*           DS
	inarray(x+9)*           ES
	------------------------------------------------
	*  These array elements are used only by INT86XOLD. To use the
	   current run-time values of DS and ES, assign the value -1 to array
	   elements 8 and 9.
	
	The INT86OLD and INT86XOLD routines alter all registers except
	BP and DS.
	
	INT86OLD and INT86XOLD provide compatibility with older [QuickBASIC
	2.00, 2.01, or 3.00] programs using INT86 and INT86X. Like the INT86
	and INT86X routines, INT86OLD and INT86XOLD are distributed in a Quick
	library [QB.QLB for QB.EXE and QBX.QLB for QBX. EXE] and in a
	conventional library [QB.LIB for QuickBASIC 4.x and QBX.LIB for BASIC
	PDS 7.00] on the distribution disks. The disks also contain a header
	file [QB.BI for QuickBASIC 4.x or QBX.BI for BASIC PDS 7.00] for use
	with the procedures. See the disk-contents list for specific
	information.
	
	Note that INT86OLD and INT86XOLD do not require the use of VARPTR.
	Also, the register values are stored in the arrays beginning with the
	first array element.
	
	EXAMPLE
	-------
	
	'This example uses INT86OLD to open a file and place some text in it.
	
	' Note: To use CALL INTERRUPT, you must load the Quick library QB.LIB
	'       with QuickBASIC. The program also uses the QB.BI header file.
	
	' Include header file for INT86OLD, etc.
	$INCLUDE:'QB.BI'
	
	DIM INARY%(7),OUTARY%(7)          'Define input and output
	                                  'arrays for INT86.
	'
	' Define register-array indices to
	' make program easier to understand.
	CONST AX=0, BX=1, CX=2, DX=3, BP=4, SI=5, DI=6, FL=7
	'
	INARY%(AX) = &H3C00               'DOS function to create a file.
	INARY%(CX) = 0                    'DOS attribute for created file.
	TEMP$="FOO.TXT"+CHR$(0)
	INARY%(DX) = SADD(TEMP$)
	                                  'Pointer to file-name string
	                                  'with zero byte termination.
	
	CALL INT86OLD(&H21,INARY%(),OUTARY%())
	                                  'Perform the creation.
	'
	INARY%(BX) = OUTARY%(AX)         'Move created file handle for write.
	INARY%(AX) = &H4000               'DOS function to write to file.
	TEXT$ = "hello, world"+CHR$(13)+CHR$(10)
	                                  'Define text to write to file.
	INARY%(CX) = LEN(TEXT$)           'Get length of text string.
	INARY%(DX) = SADD(TEXT$)          'Get address of text string.
	CALL INT86OLD(&H21,INARY%(),OUTARY%())
	                                  'Perform the write.
	'
	INARY%(AX) = &H3E00               'DOS function to close a file.
	CALL INT86OLD(&H21,INARY%(),OUTARY%())
	                                  'Perform the close.
