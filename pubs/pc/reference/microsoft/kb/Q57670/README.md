---
layout: page
title: "Q57670: LOCATE Doesn't Turn Off Cursor After INTERRUPT Loads User Font"
permalink: /pubs/pc/reference/microsoft/kb/Q57670/
---

## Q57670: LOCATE Doesn't Turn Off Cursor After INTERRUPT Loads User Font

	Article: Q57670
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom SR# S900102-68
	Last Modified: 15-JAN-1990
	
	The LOCATE statement can be used to turn the cursor off. This is done
	by passing zero (0) as the third parameter, as in the following
	example:
	
	   LOCATE ,,0
	
	However, the ability of LOCATE to turn off the cursor is disabled when
	interrupt 10 hex, function 11 hex, subfunction 0 is called. In fact,
	the interrupt routine itself turns the cursor on. This interrupt call
	(which requires an EGA card and the use of SCREEN 0) causes the video
	card to use a block of memory in RAM for generating ASCII characters,
	rather than the ROM default ASCII characters.
	
	To turn the cursor off in this instance, interrupt 10 hex, function 1
	must be called. The program below illustrates how this is done.
	
	This information applies to Microsoft QuickBASIC Versions 4.00, 4.00b,
	and 4.50 for MS-DOS, to Microsoft BASIC Compiler Versions 6.00 and
	6.00b for MS-DOS, and to Microsoft BASIC Professional Development
	System (PDS) Version 7.00 for MS-DOS.
	
	It's not just using the RAM font instead of the ROM font that causes
	the problem. Once interrupt 10 hex, function 11 hex, subfunction 0 is
	called, the LOCATE statement cannot turn the cursor off during the
	entire execution of the program. That is, even if you load the default
	ROM font back in by calling interrupt 10 hex, function 11 hex,
	subfunction 0, the LOCATE statement still will not work properly.
	
	The following code example illustrates the problem. In the comments of
	this example, the word "block" refers to the block of RAM where the
	new character definition will be. Note that, for simplicity, the
	example redefines only one character and leaves the rest in their
	default state.
	
	'This example requires an EGA card; VGA will not work.
	
	' $INCLUDE: 'qb.bi'        'Load interrupt routines and types.
	DIM Regs AS RegTypeX       'Stores values of registers.
	DIM Table AS STRING * 14   'This will hold the definition for one
	                           'character (14 rows high, 8 bits wide).
	CLS
	LOCATE ,,1   'Cursor will turn on.
	LOCATE ,,0   'Cursor will turn off.
	
	DEF SEG = VARSEG(Table)    'Make the block's segment current.
	
	FOR i = 0 TO 13                  'Load definition block.
	   POKE VARPTR(Table) + i, 255   'All 255s will appear as a solid
	NEXT i                           'rectangle.
	
	DEF SEG                     'Go back to DGROUP.
	
	Regs.AX = &H1100            'Function 11 hex subfunction 0.
	Regs.BX = &HE00             'There are &HE points per character.
	                            'Put font at table 0.
	Regs.CX = 1                 'Block defines one character.
	Regs.DX = 0                 'First character redefined is ASCII 0.
	Regs.DS = -1                'Use old data segment.
	Regs.ES = VARSEG(Table(0))  'Segment of block.
	Regs.BP = VARPTR(Table(0))  'Offset of block.
	
	CALL InterruptX(&H10, Regs, Regs)  'Call interrupt &H10.
	                                   'The cursor will turn on.
	
	LOCATE ,,0   'Cursor will not turn off.
	
	'The following interrupt call will cause the video card to use the
	'default ROM font but will not re-enable LOCATE's ability to turn off
	'the cursor.
	
	Regs.AX = &H1101   'Function &H11, subfunction 1
	CALL InterruptX(&H10, Regs, Regs)
	
	LOCATE ,,0   'Cursor will not turn off.
	
	'The following interrupt call can be used to turn the cursor off.
	
	Regs.AX = &H100   'Function 1.
	Regs.CX = &H2000
	CALL InterruptX(&H10, Regs, Regs)   'Cursor will turn off.
