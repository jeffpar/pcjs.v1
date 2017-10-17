---
layout: page
title: "Q44463: Difference between Arrays and Pointers in C"
permalink: /pubs/pc/reference/microsoft/kb/Q44463/
---

## Q44463: Difference between Arrays and Pointers in C

	Article: Q44463
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | SR# G890510-18105 S_QuickC
	Last Modified: 19-SEP-1989
	
	Question:
	
	My program is divided into several modules. In one module, I declare
	an array with the following declaration:
	
	   signed char buffer[100];
	
	In another module, I access the variable with one of the following:
	
	   extern signed char *buffer;           /* FAILS */
	   extern signed char buffer[];          /* WORKS */
	
	Using CodeView reveals that the program is using the wrong address
	for the array in the first case. The second case works correctly.
	
	What is the difference between an array and a pointer.
	
	Response:
	
	This is a C programming mistake. The following declarations are NOT
	the same:
	
	   char *pc;
	   char ac[20];
	
	The first declaration sets aside memory for a pointer; the second sets
	aside memory for 20 characters.
	
	A picture of pc and ac in memory might appear as follows:
	
	    pc  +--------+
	        |   ???  |
	        +--------+
	
	    ac  +-----+-----+-----+-----+     +-----+
	        |  ?  |  ?  |  ?  |  ?  | ... |  ?  |
	        +-----+-----+-----+-----+     +-----+
	
	The same is true for the following:
	
	   extern char *pc;
	   extern char ac[];
	
	Thus, to access the array in ac in another module, the correct
	declaration is as follows:
	
	   extern signed char ac[];
	
	In your case, the correct declaration is the following:
	
	   extern char buffer[];
	
	The first declaration says that there's a pointer to char called pc
	(which is two or four bytes) somewhere out there; the second says that
	there's an actual array of characters called ac.
	
	The addressing for pc[3] and ac[3] is done differently. There are some
	similarities; specifically, the expression "ac" is a constant pointer
	to char that points to &ac[0]. The similarity ends there, however.
	
	To evaluate pc[3], we first load the value of the pointer pc from
	memory, then we add 3. Finally, we load the character which is stored
	at this location (pc + 3) into a register. The MASM code might appear
	as follows (assuming small-memory model):
	
	   MOV     BX, pc          ; move *CONTENTS* of pc into BX
	                           ; BX contains 1234
	   MOV     AL, [BX + 3]    ; move byte at pc + 3 (1237) into AL
	                           ; ==> AL contains 'd'
	
	A picture might appear as follows, provided that pc had been properly
	set to point to an array at location 1234 and that the array contained
	"abcd" as its first four characters:
	
	address:   1000                  1234  1235  1236  1237
	    pc  +--------+--->>>>>------v-----v-----v-----v-----+
	        |  1234  |          *pc |  a  |  b  |  c  |  d  | ...
	        +--------+              +-----+-----+-----+-----+
	                                 pc[0] pc[1] pc[2] pc[3]
	                                 *pc   *(pc+1) etc.
	
	Note: Using pc without properly initializing it (a simple way to
	initialize it is "pc = malloc(4);" or "pc = ac;") causes you to access
	random memory you didn't intend to access (and causes the strange
	behavior).
	
	Since ac is a constant, it can be built into the final MOV command,
	eliminating the need for two MOVs. The MASM code might appear as
	
	   MOV     AL, [offset ac + 3]     ; mov byte at ac + 3 into AL
	                                   ; offset ac is 1100, so move
	                                   ; byte at 1103 into AL
	                                   ; ==> AL contains 'd'
	
	and the picture appears as follows:
	
	address: 1100  1101  1102  1103        1119
	    ac  +-----+-----+-----+-----+     +-----+
	        |  a  |  b  |  c  |  d  | ... |  \0 |
	        +-----+-----+-----+-----+     +-----+
	        ac[0] ac[1] ac[2] ac[3]       ac[19]
	        *ac   *(ac+1)  etc.
	
	Note: If you first initialize pc to point to ac (by saying "pc =
	ac;"), then the end effect of the two statements is exactly the same.
	(This change can be shown in the picture by changing pc so it contains
	the address of ac, which is 1100.) However, the instructions used to
	produce these effects are different.
	
	Note: If you declared ac to be as follows, the compiler would generate
	code to do pointer-type addressing rather than array-type addressing:
	
	   extern char *ac;  /* WRONG! */
	
	It would use the first few bytes of the array as an address (rather
	than characters) and access the memory stored at that location. This
	is what you're doing and why you're having problems.
