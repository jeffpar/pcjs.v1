---
layout: page
title: DEC PDP-11 BASIC
permalink: /apps/pdp11/tapes/basic/
---

DEC PDP-11 BASIC
----------------

Try our [DEC BASIC Demo](/devices/pdp11/machine/1120/basic/).

PCjs has archived the following DEC resources:

- [BASIC (Single User)](DEC-11-AJPB-PB.json)
- [PDP-11 BASIC PROGRAMMING MANUAL (December 1970)](http://archive.pcjs.org/pubs/dec/pdp11/basic/DEC-11-AJPB-D_PDP-11_BASIC_Programming_Manual_Dec70.pdf) 

Third-party resources include:

- "[PDP-11 Paper Tape BASIC](http://www.avitech.com.au/ptb/ptb.html)", written March 24, 2013

---

Debugging Notes
---------------

One of the first things I noticed when debugging PDP-11 BASIC was its heavy reliance on TRAP instructions.
For example, `TRAP 000` is used to output the character in R2 to the terminal.  Let's take a closer look at how
its TRAP handler works.

First, if you check the table of PDP-11 trap vectors, you'll see that the vector for TRAP instructions is 000034.
So let's dump the contents of the two-word vector at 000034:

	>> dw 034 l2
	000034  000100  000000  

The BASIC TRAP handler is at 000100, and here's that code:

	>> u 000100
	000100: 011666 000002          MOV   @SP,2(SP)
	000104: 162716 000002          SUB   #2,@SP
	000110: 013646                 MOV   @(SP)+,-(SP)
	000112: 006216                 ASR   @SP
	000114: 103404                 BCS   000126
	000116: 006316                 ASL   @SP
	000120: 062716 073654          ADD   #73654,@SP
	000124: 013607                 MOV   @(SP)+,PC

When the code starts, the TRAP instruction has already pushed two words onto the stack:

	0(SP):  previous PC
	2(SP):  previous PSW

The first instruction, `MOV @SP,2(SP)`, copies the *previous PC* onto the *previous PSW*, which is where we'll eventually want
*previous PC*, so that the handler can eventually return with a simple `RTS PC`.

The next instruction, `SUB #2,@SP`, subtracts 2 from the original *previous PC*, so that it now points to the TRAP instruction.

Then `@(SP)+,-(SP)` fetches the TRAP instruction while also "popping" the original *previous PC* and then "pushing" TRAP
instruction onto the stack, overwriting the original *previous PC*.

The next few instructions shift the TRAP right to see if bit 0 is set, and if it is not, then the TRAP instruction is restored
by shifting it left again, and then a large offset is added to it, transforming the TRAP instruction (which is now known to be
an *even* value) into a jump table index.

The final instruction, `MOV @(SP)+,PC`, moves the address at the jump table index into PC, while also removing the TRAP
instruction from the stack, leaving only the *previous PC* on the stack.
