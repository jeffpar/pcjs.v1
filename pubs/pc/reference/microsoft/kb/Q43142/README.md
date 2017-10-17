---
layout: page
title: "Q43142: QuickC: The Inline Assembler Generates 3-Byte JMP Instructions"
permalink: /pubs/pc/reference/microsoft/kb/Q43142/
---

## Q43142: QuickC: The Inline Assembler Generates 3-Byte JMP Instructions

	Article: Q43142
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 2-MAY-1989
	
	The following instruction will assemble, link, and run correctly in
	the Microsoft Macro Assembler Version 5.10:
	
	   JMP  $+2
	
	However, the Microsoft QuickC Compiler Version 2.00 inline assembler
	will generate code that hangs the machine when executed.
	
	This is expected behavior and is due to the fact that the inline
	assembler must generate code as assembly mnemonics are encountered.
	Therefore, it cannot tell that the instruction is a SHORT jump. The
	Microsoft Macro Assembler will optimize the code into a 2-byte jump
	instruction while QuickC will generate a 3-byte jump instruction. To
	achieve the desired result either change the instruction to the
	following:
	
	   JMP  $+3
	
	or
	
	   JMP SHORT $+2
	
	The desired result of this instruction is to simply jump to the
	instruction located at the address pointed to by the instruction
	pointer, plus the number of bytes specified.
	
	The following MASM program will have the effect of skipping the second
	instruction:
	
	                                    TITLE  test
	                                    DOSSEG
	                                    .MODEL SMALL
	                                    .CODE
	 0000                           start:
	 0000  EB 02                        jmp  $+4
	 0002  EB 00                        jmp  $+2
	 0004  EB 00                        jmp  $+2
	 0006  B8 4C00                      mov  ax,4c00h
	 0009  CD 21                        int  21h
	                                END start
	
	Clearly, the Assembler is producing a 2-byte JMP instruction. The
	following is the code compiled with QuickC Version 2.00 which will
	have the same effect:
	
	void main(void_ {
	     _asm {
	          jmp $+6
	          jmp $+3
	          jmp $+3
	     }
	
	Upon viewing the mixed C/assembly in CodeView 2.20, it is clear that
	QuickC is generating a 3-byte JMP instruction:
	
	1:      void main(void) {
	/* startup code here */
	3:                      jmp $+6
	6DD8:002B E90300         JMP       _main+11 (0031)
	4:                      jmp $+3
	6DD8:002E E90000         JMP       _main+11 (0031)
	5:                      jmp $+3
	6DD8:0031 E90000         JMP       _main+14 (0034)
	7:         }
	/* exit code here */
