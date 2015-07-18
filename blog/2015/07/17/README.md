Windows 95
---

This week was the 20th anniversary of Windows 95 RTM ("Release To Manufacturing").  So I decided to throw a
PCjs party and try running Windows 95 Setup inside a PCjs machine for the first time.  Sadly, it immediately failed:

	Please wait while Setup initializes.
	Windows requires a computer with an 80386 processor or higher.

The failing code:

	0E36:08FD 06              PUSH     ES
	0E36:08FE 1E              PUSH     DS
	0E36:08FF 9C              PUSHF   
	0E36:0900 33C0            XOR      AX,AX
	0E36:0902 50              PUSH     AX
	0E36:0903 9D              POPF    
	0E36:0904 9C              PUSHF   
	0E36:0905 58              POP      AX
	0E36:0906 A90080          TEST     AX,8000
	0E36:0909 7517            JNZ      0922
	0E36:090B B80070          MOV      AX,7000
	0E36:090E 50              PUSH     AX
	0E36:090F 9D              POPF    
	0E36:0910 FB              STI     
	0E36:0911 9C              PUSHF   
	0E36:0912 58              POP      AX
	0E36:0913 A90070          TEST     AX,7000
	0E36:0916 7405            JZ       091D
	0E36:0918 B88603          MOV      AX,0386
	0E36:091B EB08            JMP      0925
	0E36:091D B88602          MOV      AX,0286
	0E36:0920 EB03            JMP      0925
	0E36:0922 B88600          MOV      AX,0086
	0E36:0925 9D              POPF    
	0E36:0926 1F              POP      DS
	0E36:0927 07              POP      ES
	0E36:0928 C3              RET     

was easily fixed with a change to [x86cpu.js](/modules/pcjs/lib/x86cpu.js), allowing the IOPL bits to be
modified in real-mode on an 80386.  When I had previously tweaked setPS() to accomodate 80286/80386 discrimination
logic in OS/2 1.0, there was no 80386 support in PCjs at that time, so it was sufficient to *never* allow the
IOPL bits to be altered in real-mode.

The next problem was triggered by Setup's CAB ("Diamond") decompression code, which uses all 32 bits
of the 80386's 32-bit registers.  That in itself was not a problem, but by leaving stray bits in the upper halves of
registers like EDX, it exposed a bug in the PCjs I/O instruction handlers, which neglected to mask EDX with 0xFFFF before
performing port lookups, causing mysterious I/O failures that usually manifested themselves as hard disk I/O errors.

Then PCjs crashed in the middle of the decompression of the first CAB file (MINI.CAB).  It turned out the stack
had been improperly adjusted because a "RETF n" instruction mistakenly believed that a stack switch had occurred.
This was, in fact, a left-over condition from a protected-mode stack-switch.  That was easily cleared.

Next, I discovered that I had never finished updating a handful of instructions to full 32-bit operation;
namely, INC, DEC, NEG, NOT, TEST, MOVSB and MOVSW.  Those are done now.

Then I ran into a couple of Windows 95 oddities.  First, some kernel initialization code deliberately
executed an invalid opcode (0x0F,0xFF) and expected its DPMI exception (0x06) handler to field the exception; that was
fixed by flagging the opcode as genuinely invalid.

By default, PCjs marks opcodes as invalid *only* if they are truly invalid.  PCjs considers the vast
majority of unused/undocumented opcodes to be merely "undefined" until we've seen them in the wild.  An instruction will
be marked invalid if we either discover that real hardware generates an Invalid Opcode exception *or* that real software
expects it to.  Here, it was the latter.

> SIDEBAR: Don't be confused that Intel also refers to the Invalid Opcode exception (0x06) as a #UD or "undefined"
opcode exception.  Every opcode that triggers that exception is, by definition, defined: it's defined as invalid.
I consider it a misnomer to refer to any invalid instruction as "undefined".

The other recent Windows 95 oddity I ran into was an instruction with multiple address-override (0x67) prefixes; the
first prefix changed the instruction's addressing mode from 16-bit to 32-bit, and the second prefix changed it back to
16-bit.  PCjs should have simply ignored the second prefix.

With all of the above changes in place, PCjs v1.18.4 is able to run Windows 95 Setup a bit farther, but still far from
completion.  If you want to give it a spin yourself, start the machine below (click the "Run" button) and once it has
finished booting, run SETUP from drive B, where the first Windows 95 diskette is already loaded.

NOTE: This is a pre-release version of Windows 95, as I don't currently have the RTM version on diskette.

To be continued....

[Embedded DeskPro 386](/devices/pc/machine/compaq/deskpro386/vga/4096kb/machine.xml "PCjs:deskpro386-vga-4096k::uncompiled:debugger")

*[@jeffpar](http://twitter.com/jeffpar)*  
*July 17, 2015*
