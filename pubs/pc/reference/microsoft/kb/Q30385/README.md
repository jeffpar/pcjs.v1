---
layout: page
title: "Q30385: MOV with Type Operator Generates Incorrect Opcodes"
permalink: /pubs/pc/reference/microsoft/kb/Q30385/
---

## Q30385: MOV with Type Operator Generates Incorrect Opcodes

	Article: Q30385
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | buglist5.10
	Last Modified: 23-MAY-1988
	
	The MOV instruction, using indirect addressing, and the Type
	operator generate incorrect opcodes.
	
	   The first MOV instruction generates the opcode "B8FFF4", which is a
	move-immediate instruction. The assembler should generate the opcode
	"8B44F4".  This opcode is generated on the second move instruction.
	   MASM Version 5.00 generates the correct code for both MOV
	instructions. The following code demonstrates the problem:
	
	seg_1  segment  para  public  'code'
	       assume cs:seg_1
	test_str struc
	test_f1  dw  ?
	test_f2  dw  ?
	test_f3  db  8 dup (?)
	test_str ends
	main_entry proc
	       mov  ax,word ptr [si] - type test_str
	;
	;      This alternate generation works
	;
	       mov  ax,word ptr { si - type test_str]
	main_entry endp
	seg_1  ends
	       end
	
	   Microsoft is researching this problem and will post new information
	as it becomes available.
