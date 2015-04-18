Compaq DeskPro 386 Update
---
PCjs can now boot the [Compaq DeskPro 386/16 ROM BIOS](/devices/pc/bios/compaq/deskpro386/).

There's still a problem with the hard disk controller, which I haven't looked into yet, but
it can be bypassed.  Booting from a floppy works.

While working through issues with this ROM BIOS, I created some lightly-annotated
[source code](/devices/pc/bios/compaq/deskpro386/1988-01-28.nasm) that can be re-assembled
with [NASM](http://www.nasm.us/).  The process of creating the initial source code is
explained [here](/devices/pc/bios/compaq/deskpro386/#producing-rom-source-code).

During the debugging process, I also came across a real head-scratcher.  Take a look at this code
at F000:BCAF:

	;;
	;; Relocate the ROM and initialize conventional RAM
	;;
	call    xc825           ; 0000BCAF  E8730B

	;;
	;; This function loads the GDTR with [00FF0730,0047], but since the previous call
	;; disabled the A20 line, the first selector load crashes, because physical address
	;; %FF0730 requires A20.
	;;
	call    xf480           ; 0000BCB2  E8CB37

The first call (to F000:C825) is to a long, fairly linear function that includes a call to F000:A478,
a small function whose sole purpose is to issue an 8042 Keyboard Controller command that disables the A20
line.

	;;
	;; Disable A20
	;;
	call    xa478           ; 0000C8B4  E8C1DB

After disabling A20, the function at F000:C825 then performs a series of `rep stosd` to zero all
conventional (below 1Mb) RAM, and then it returns to the code at F000:BCB2, which in turn calls F000:F480.

Here's the problem: the code at F000:F480 almost immediately attempts to enter protected-mode, which
fails because A20 is disabled.

	;;
	;; When we arrive here, the A20 line has been disabled, so in theory, the GDT is
	;; accessible only at the "low" ROM address (%0F0730), not the "high" address (%FF0730).
	;; And even if we DID access it from the "low" address, it contains base addresses (eg,
	;; for selector 0x28) located at %FFxxxx, so we're still screwed if A20 is disabled.
	;;
	;; TODO: Determine how this code worked in "real life"
	;;
	;; FYI, it seems this code doesn't do anything if bits 6 and 7 of the RAM Settings
	;; register are set to anything other than 0x40 (ie, it returns to real-mode almost
	;; immediately after entering protected-mode).
	;;
	lgdt    [cs:0x077e]     ; 0000F498  load [gdtr_hi] into GDTR
	mov     eax,cr0         ; 0000F49E  0F2000
	or      ax,0x1          ; 0000F4A1  0D0100
	mov     cr0,eax         ; 0000F4A4  0F2200
	jmp     0x28:xf4ac      ; 0000F4A7  EAACF42800

I don't see how the above code can work.  The JMP instruction will invariably fault, because the
GDTR is pointing to memory that cannot be accessed when A20 is disabled.

The code at F000:F498 is not called from any other place.  It can only be reached by running the
preceding code which, among other things, disables A20.  And there's only one branch between that
code and the code that enters protected-mode that could possibly make any difference:

	test    word [cs:si],0x0f00 ; 0000F48A  2EF704000F
	jz      xf494               ; 0000F48F  7403

But the high byte of the word at [cs:si] (part of Compaq's Built-In Memory table) is initialized
earlier with a value from AL that was first masked with 0xF0:

	;;
	;; Isolate the base memory settings in bits 5-4 (00=640Kb, 10=512Kb, 11=256Kb)
	;;
	and     al,0xf0         ; 000085D7  24F0  '$.'

	;;
	;; Update [bim_table_offset]+1 (eg, %FF7FB7) with base memory settings
	;;
	mov     [es:di+0x1],al  ; 000085D9  26884501  '&.E.'

and I'm not aware of any intervening code that could have altered that byte, so it's not clear how the
high byte of the word at [cs:si] would ever contain any set bits that coincide with 0x0F.

I've worked around this problem for now by changing how PCjs manages the A20 line.  All A20 changes
now go through the CPU component, instead of directly to the Bus component, giving the CPU first crack
at any changes to A20.  If the CPU is in real-mode, it simply passes the A20 request on to the Bus.
However, if the CPU is in protected-mode, it maintains the requested "logical" A20 state, but ensures
that the "physical" state of A20 is always enabled.  In short, it is no longer possible for the CPU
to be in protected-mode AND for the A20 line to be disabled; when one is enabled, the other is enabled
as well.
 
That's obviously NOT how the actual hardware works, but it does have the advantage of avoiding strange
bugs involving the A20 line in protected-mode -- including this "bug" in the Compaq DeskPro 386 ROM BIOS.

Here's my Compaq DeskPro 386/16 PCjs test configuration.  Set a breakpoint at F000:F498 ("bp f000:f498")
in the Debugger panel and see what *you* think.  Use the "rp" command to see all registers, including
the current base and limit values loaded into the segment registers.

[Embedded DeskPro 386](/devices/pc/machine/compaq/deskpro386/ega/2048kb/machine.xml "PCjs:deskpro386-ega-2048k::uncompiled:debugger")

*[@jeffpar](http://twitter.com/jeffpar)*  
*April 16, 2015*
