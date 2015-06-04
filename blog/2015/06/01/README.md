Debugging the IBM VGA ROM
---

The IBM VGA ("Video Graphics Array") standard was introduced as part of the IBM PS/2 line of computers;
it was not a feature you could purchase or install in older PC, XT or AT-compatible machines.  In fact, full VGA
support was not even available in all PS/2 models.  Of the first four PS/2 models -- the 8086-based Model 30, the
80286-based Model 50 and Model 60, and the 80386-based Model 80 -- VGA support was available only in the three
higher-end models.  The Model 30 came with MCGA ("Multicolor Graphics Array") video hardware that supported a subset
of VGA modes (eg, 640x480 2-color and 320x200 256-color graphics).

It wasn't until October 1987 that IBM finally introduced an 8-bit ISA card that brought VGA capability to older PCs.
The card was called the **IBM PS/2 Display Adapter**.  However, I think the name is a bit confusing, since the card
could only be used in PC, XT, and AT-compatible systems.  I'll refer to it here simply as the IBM VGA.  

The VGA ROM used here is assumed to have come from an original IBM VGA.  It's unknown if IBM ever made any
revisions to the VGA ROM.  With the introduction of the PS/2 family and the VGA, IBM decided to no longer publish
the source code for its ROMs, so I've created some assemblable source code from the IBM VGA ROM
[here](/devices/pc/video/ibm/vga/ibm-vga.nasm).

I've finally started debugging a machine configuration that uses the IBM VGA ROM.  Since the VGA and the 80386 are
contemporaries, I'm using an [80386 machine configuration](/devices/pc/machine/compaq/deskpro386/vga/2048kb/machine.xml).
However, I don't expect the IBM VGA ROM to require any 80386 support or PS/2-specific features.  

The first problem I ran into was here:

	;
	;   Initialize the ROM BIOS Video Mode Options byte @40:0087 (default to color and 256Kb of RAM)
	;
	mov	byte [0x487],0x60	; 0000008D
	;
	;   The x100 subroutine alternately enables port 0x3B? and 0x3D? decoding, verifying that there is
	;   no response on opposing ports 0x3D? and 0x3B?, respectively; otherwise, it assumes that another
	;   video card must exist and attempts to select co-existing settings for the VGA.  For example, if
	;   there is an unexpected response on the color ports, the VGA ROM will default to mono operation.
	;
	call	x100			; 00000092

The Video component installs I/O port handlers for all possible I/O ranges; when a range isn't being used, the
associated I/O operations are redirected to a dummy Card, so that the active Card isn't affected.  Here,
however, that was insufficient.  If the VGA is the only installed video card, the VGA ROM expects *NO RESPONSE*
on inactive CRTC ports.  So I've changed the CRTC I/O handlers to check the Card's fActive flag.  This seems
like a safe and logical change, but I still have to check for backward-compatibility issues with older ROMs.

Other problems included:

 * Some bugs in Read Mode 1 that caused a memory test failure
 * Horizontal and vertical retrace timing issues (the ROM requires a specific number of intervals per second)
 * Differences between the EGA and VGA in the SWSENSE bit (bit 4) of Input Status Register 0 

The last problem was the most puzzling, because the ROM programs a series of values into the first DAC register,
and expects the SWSENSE bit of Input Status Register 0 to change in very specific ways, depending on the kind
of monitor attached.

I've not found any hardware documentation that explains exactly how this should work.  IBM's own Technical Reference
material is extremely vague:

	"Bit 4: Switch Sense Bit - This bit allows the system microprocessor to read the switch sense line.
	This bit allows the power-on self-test to determine if a monochrome or color display is connected to
	the system."

I've hard-coded a solution that assumes a color monitor.  Support for using a monochrome monitor with an EGA was
never completed, and this is another related issue that will have to be resolved for the VGA as well.

*[@jeffpar](http://twitter.com/jeffpar)*  
*June 1, 2015*
