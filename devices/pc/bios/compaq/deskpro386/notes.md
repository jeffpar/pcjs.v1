Debugging Notes
===

Checkpoint
---
This code:

	F000:F9E9 B000          MOV      AL,00
	F000:F9EB E620          OUT      20,AL

triggers the following warning:

	notice: PIC0(0x20): unsupported OCW2 automatic EOI command: 0x00

and the very next instruction:

	F000:F9ED E6A0          OUT      A0,AL
	
triggers the same warning:

	notice: PIC1(0xA0): unsupported OCW2 automatic EOI command: 0x00

Checkpoint
---
There's a loop at F000:B5AA that stores 0x4000 DWORDs into RAM (ie, 64Kb), where each DWORD is
a single-bit left rotation of the preceding DWORD.  This is followed by another loop that loads
each DWORD and verifies that it contains the appropriate bit.

Then a stack is set up in RAM (at 0030:0100) and the first CALL is issued:

	F000:BC2E E87DEC        CALL     A8AE

There's some CMOS I/O activity, serial and parallel port I/O, more CMOS I/O, and then some EGA I/O.

When arrive here:

	C000:016D B80700        MOV      AX,0007
	C000:0170 CD10          INT      10

and we complain that the IDTR limit for the real-mode IDT isn't 0x3FF (it's been set to 0xFFFF instead).
That may be OK, but I need to verify that that's what the ROM intended.  If it is, then I'll probably need
to change our assertion from "cpu.addrIDTLimit == 0x03FF" to "cpu.addrIDTLimit >= 0x03FF".

Checkpoint
---
The BIOS now progresses as far as F000:F747 (PUSH GS).

Checkpoint
---
The BIOS now progresses as far as 0030:8618 (MOV AX,GS).

Checkpoint
---
The BIOS now progresses to a Compaq memory-mapped write operation:

	stopped (27129586 ops, 2209813 cycles, 361 ms, 6121366 hz)
	EAX=000098FC EBX=0000E000 ECX=00000000 EDX=00000000 
	ESP=000000E4 EBP=00000000 ESI=0000FFFF EDI=00007FBE 
	SS=0028[00000300,FFFF] DS=0050[80C00000,FFFF] ES=0048[00FF0000,FFFF] 
	CS=0030[000F0000,FFFF] FS=0000[00000000,FFFF] GS=0304[00003040,FFFF]
	LD=0000[00000000,0000] GD=[0001C000,005F] ID=[000FF821,0007] TR=0000 A20=ON 
	CR0=0000FFF1 CR2=00000000 CR3=00000000 PS=00000083 V0 D0 I0 T0 S1 Z0 A0 P0 C1 
	0030:8637 C6060000FC    MOV      [0000],FC          ;history=1

and then gets stuck loading CS:IP of 0x28:0xF4AC:

	assertion failure in deskpro386.cpu386
	Fault 0x0D blocked by Debugger
	stopped (27572151 ops, 443210 cycles, 340635 ms, 1301 hz)
	EAX=0000FFF1 EBX=00000080 ECX=0000270F EDX=0000004A 
	ESP=000000FE EBP=00000000 ESI=00007FB6 EDI=00008000 
	SS=0030[00000300,FFFF] DS=0040[00000400,FFFF] ES=0000[00000000,FFFF] 
	CS=F000[000F0000,FFFF] FS=0000[00000000,FFFF] GS=0304[00003040,FFFF]
	LD=0000[00000000,0000] GD=[00FF0730,0047] ID=[00000000,FFFF] TR=0000 A20=OFF 
	CR0=0000FFF1 CR2=00000000 CR3=00000000 PS=00000082 V0 D0 I0 T0 S1 Z0 A0 P0 C0 
	F000:F4A7 EAACF42800    JMP      0028:F4AC

This code will fail if the A20 line is off.  Until I can figure out why this code is being run
with A20 off, I've worked around it by enabling A20 internally whenever protected-mode is active.
