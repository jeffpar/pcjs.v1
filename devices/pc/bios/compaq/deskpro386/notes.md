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
