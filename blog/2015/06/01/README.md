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

The VGA ROM programs the card for the first time here:

	EAX=00000000 EBX=00001642 ECX=00000004 EDX=00004AE8 
	ESP=000000EA EBP=FFFF00F0 ESI=00006000 EDI=000003D4 
	SS=0030 DS=0000 ES=C000 FS=0000 GS=0304 PS=00000246 V0 D0 I1 T0 S0 Z1 A0 P1 C0 
	C000:00CB E85910          CALL     1127                 ;cycles=5
	videoVGA.outPort(0x03C4,SEQ.INDX,0x00) @C000:112F
	videoVGA.outPort(0x03C5,SEQ.RESET,0x01) @C000:112F
	videoVGA.outPort(0x03C4,SEQ.INDX,0x01) @C000:1204
	videoVGA.outPort(0x03C5,SEQ.CLK,0x29) @C000:1204
	videoVGA.outPort(0x03C4,SEQ.INDX,0x02) @C000:1204
	videoVGA.outPort(0x03C5,SEQ.MAPMASK,0x0F) @C000:1204
	videoVGA.outPort(0x03C4,SEQ.INDX,0x03) @C000:1204
	videoVGA.outPort(0x03C5,SEQ.CHARMAP,0x00) @C000:1204
	videoVGA.outPort(0x03C4,SEQ.INDX,0x04) @C000:1204
	videoVGA.outPort(0x03C5,SEQ.MODE,0x06) @C000:1204
	videoVGA.outPort(0x03C2,MISC,0x63) @C000:1143
	videoVGA.outPort(0x03C4,SEQ.INDX,0x00) @C000:1149
	videoVGA.outPort(0x03C5,SEQ.RESET,0x03) @C000:1149
	videoVGA.outPort(0x03D4,CRTC.INDX,0x11) @C000:1151
	videoVGA.outPort(0x03D5,CRTC.VERT_RETRACE_END,0x00) @C000:1151
	videoVGA.outPort(0x03D4,CRTC.INDX,0x00) @C000:1204
	videoVGA.outPort(0x03D5,CRTC.HORZ_TOTAL,0x5F) @C000:1204
	videoVGA.outPort(0x03D4,CRTC.INDX,0x01) @C000:1204
	videoVGA.outPort(0x03D5,CRTC.HORZ_DISP_END,0x4F) @C000:1204
	videoVGA.outPort(0x03D4,CRTC.INDX,0x02) @C000:1204
	videoVGA.outPort(0x03D5,CRTC.HORZ_BLANK_START,0x50) @C000:1204
	videoVGA.outPort(0x03D4,CRTC.INDX,0x03) @C000:1204
	videoVGA.outPort(0x03D5,CRTC.HORZ_BLANK_END,0x82) @C000:1204
	videoVGA.outPort(0x03D4,CRTC.INDX,0x04) @C000:1204
	videoVGA.outPort(0x03D5,CRTC.HORZ_RETRACE_START,0x55) @C000:1204
	videoVGA.outPort(0x03D4,CRTC.INDX,0x05) @C000:1204
	videoVGA.outPort(0x03D5,CRTC.HORZ_RETRACE_END,0x81) @C000:1204
	videoVGA.outPort(0x03D4,CRTC.INDX,0x06) @C000:1204
	videoVGA.outPort(0x03D5,CRTC.VERT_TOTAL,0xBF) @C000:1204
	videoVGA.outPort(0x03D4,CRTC.INDX,0x07) @C000:1204
	videoVGA.outPort(0x03D5,CRTC.CRTC_OVERFLOW,0x1F) @C000:1204
	videoVGA.outPort(0x03D4,CRTC.INDX,0x08) @C000:1204
	videoVGA.outPort(0x03D5,CRTC.PRESET_ROW_SCAN,0x00) @C000:1204
	videoVGA.outPort(0x03D4,CRTC.INDX,0x09) @C000:1204
	videoVGA.outPort(0x03D5,CRTC.MAX_SCAN_LINE,0x40) @C000:1204
	removeCursor(): removed from 0,0
	videoVGA.outPort(0x03D4,CRTC.INDX,0x0A) @C000:1204
	videoVGA.outPort(0x03D5,CRTC.CURSOR_START,0x00) @C000:1204
	checkCursor(): cursor moved from -1 to 0
	videoVGA.outPort(0x03D4,CRTC.INDX,0x0B) @C000:1204
	videoVGA.outPort(0x03D5,CRTC.CURSOR_END,0x00) @C000:1204
	videoVGA.outPort(0x03D4,CRTC.INDX,0x0C) @C000:1204
	videoVGA.outPort(0x03D5,CRTC.START_ADDR_HI,0x00) @C000:1204
	videoVGA.outPort(0x03D4,CRTC.INDX,0x0D) @C000:1204
	videoVGA.outPort(0x03D5,CRTC.START_ADDR_LO,0x00) @C000:1204
	videoVGA.outPort(0x03D4,CRTC.INDX,0x0E) @C000:1204
	videoVGA.outPort(0x03D5,CRTC.CURSOR_ADDR_HI,0x00) @C000:1204
	videoVGA.outPort(0x03D4,CRTC.INDX,0x0F) @C000:1204
	videoVGA.outPort(0x03D5,CRTC.CURSOR_ADDR_LO,0x00) @C000:1204
	videoVGA.outPort(0x03D4,CRTC.INDX,0x10) @C000:1204
	videoVGA.outPort(0x03D5,CRTC.VERT_RETRACE_START,0x9C) @C000:1204
	videoVGA.outPort(0x03D4,CRTC.INDX,0x11) @C000:1204
	videoVGA.outPort(0x03D5,CRTC.VERT_RETRACE_END,0x8E) @C000:1204
	videoVGA.outPort(0x03D4,CRTC.INDX,0x12) @C000:1204
	videoVGA.outPort(0x03D5,CRTC.VERT_DISP_END,0x8F) @C000:1204
	videoVGA.outPort(0x03D4,CRTC.INDX,0x13) @C000:1204
	videoVGA.outPort(0x03D5,CRTC.OFFSET,0x28) @C000:1204
	videoVGA.outPort(0x03D4,CRTC.INDX,0x14) @C000:1204
	videoVGA.outPort(0x03D5,CRTC.UNDERLINE,0x1F) @C000:1204
	videoVGA.outPort(0x03D4,CRTC.INDX,0x15) @C000:1204
	videoVGA.outPort(0x03D5,CRTC.VERT_BLANK_START,0x96) @C000:1204
	videoVGA.outPort(0x03D4,CRTC.INDX,0x16) @C000:1204
	videoVGA.outPort(0x03D5,CRTC.VERT_BLANK_END,0xB9) @C000:1204
	videoVGA.outPort(0x03D4,CRTC.INDX,0x17) @C000:1204
	videoVGA.outPort(0x03D5,CRTC.MODE_CTRL,0xE3) @C000:1204
	videoVGA.outPort(0x03D4,CRTC.INDX,0x18) @C000:1204
	videoVGA.outPort(0x03D5,CRTC.LINE_COMPARE,0xFF) @C000:1204
	videoVGA.inPort(0x03DA,STATUS1): 0x00 @C000:1167
	videoVGA.outPort(0x03C0,ATC.INDX,0x10) @C000:116C
	videoVGA.outPort(0x03C0,ATC.MODE,0x01) @C000:1171
	videoVGA.outPort(0x03C0,ATC.INDX,0x12) @C000:1174
	videoVGA.outPort(0x03C0,ATC.PLANES,0x0F) @C000:1179
	videoVGA.outPort(0x03C0,ATC.INDX,0x13) @C000:117C
	videoVGA.outPort(0x03C0,ATC.HORZPAN,0x00) @C000:1181
	videoVGA.outPort(0x03CE,GRC.INDX,0x00) @C000:1204
	videoVGA.outPort(0x03CF,GRC.SRESET,0x00) @C000:1204
	videoVGA.outPort(0x03CE,GRC.INDX,0x01) @C000:1204
	videoVGA.outPort(0x03CF,GRC.ESRESET,0x00) @C000:1204
	videoVGA.outPort(0x03CE,GRC.INDX,0x02) @C000:1204
	videoVGA.outPort(0x03CF,GRC.COLRCMP,0x0F) @C000:1204
	videoVGA.outPort(0x03CE,GRC.INDX,0x03) @C000:1204
	videoVGA.outPort(0x03CF,GRC.DATAROT,0x00) @C000:1204
	videoVGA.outPort(0x03CE,GRC.INDX,0x04) @C000:1204
	videoVGA.outPort(0x03CF,GRC.READMAP,0x00) @C000:1204
	videoVGA.outPort(0x03CE,GRC.INDX,0x05) @C000:1204
	videoVGA.outPort(0x03CF,GRC.MODE,0x08) @C000:1204
	setAccess(0x0210)
	videoVGA.outPort(0x03CE,GRC.INDX,0x06) @C000:1204
	videoVGA.outPort(0x03CF,GRC.MISC,0x05) @C000:1204
	setMode(0x0010)
	setMode(16): removing 0x00008000 bytes from 0x000B8000
	setMode(16): adding 0x00010000 bytes to 0x000A0000
	videoVGA.outPort(0x03CE,GRC.INDX,0x07) @C000:1204
	videoVGA.outPort(0x03CF,GRC.COLRDC,0x0F) @C000:1204
	videoVGA.outPort(0x03CE,GRC.INDX,0x08) @C000:1204
	videoVGA.outPort(0x03CF,GRC.BITMASK,0xFF) @C000:1204
	
	EAX=0000FF09 EBX=00001642 ECX=00000000 EDX=000003DA 
	ESP=000000EA EBP=FFFF00F0 ESI=00006000 EDI=000003D4 
	SS=0030 DS=0000 ES=C000 FS=0000 GS=0304 PS=00000246 V0 D0 I1 T0 S0 Z1 A0 P1 C0 
	C000:00CE 32C0            XOR      AL,AL                ;cycles=1031

Now that the card was programmed for the first time, I used the `d video` Debugger command to dump the video
card's state:

	BIOSMODE: 0x10
	CRTC[0x00]: HORZ_TOTAL         0x5F
	CRTC[0x01]: HORZ_DISP_END      0x4F
	CRTC[0x02]: HORZ_BLANK_START   0x50
	CRTC[0x03]: HORZ_BLANK_END     0x82
	CRTC[0x04]: HORZ_RETRACE_START 0x55
	CRTC[0x05]: HORZ_RETRACE_END   0x81
	CRTC[0x06]: VERT_TOTAL         0xBF
	CRTC[0x07]: CRTC_OVERFLOW      0x1F
	CRTC[0x08]: PRESET_ROW_SCAN    0x00
	CRTC[0x09]: MAX_SCAN_LINE      0x40
	CRTC[0x0A]: CURSOR_START       0x00
	CRTC[0x0B]: CURSOR_END         0x00
	CRTC[0x0C]: START_ADDR_HI      0x00
	CRTC[0x0D]: START_ADDR_LO      0x00
	CRTC[0x0E]: CURSOR_ADDR_HI     0x00
	CRTC[0x0F]: CURSOR_ADDR_LO     0x00
	CRTC[0x10]: VERT_RETRACE_START 0x9C
	CRTC[0x11]: VERT_RETRACE_END   0x8E
	CRTC[0x12]: VERT_DISP_END      0x8F
	CRTC[0x13]: OFFSET             0x28
	CRTC[0x14]: UNDERLINE          0x1F
	CRTC[0x15]: VERT_BLANK_START   0x96
	CRTC[0x16]: VERT_BLANK_END     0xB9
	CRTC[0x17]: MODE_CTRL          0xE3
	CRTC[0x18]: LINE_COMPARE       0xFF*
	   STATUS1: 0x00
	   ATCDATA: false
	 ATC[0x00]: PAL00   0x??
	 ATC[0x01]: PAL01   0x??
	 ATC[0x02]: PAL02   0x??
	 ATC[0x03]: PAL03   0x??
	 ATC[0x04]: PAL04   0x??
	 ATC[0x05]: PAL05   0x??
	 ATC[0x06]: PAL06   0x??
	 ATC[0x07]: PAL07   0x??
	 ATC[0x08]: PAL08   0x??
	 ATC[0x09]: PAL09   0x??
	 ATC[0x0A]: PAL0A   0x??
	 ATC[0x0B]: PAL0B   0x??
	 ATC[0x0C]: PAL0C   0x??
	 ATC[0x0D]: PAL0D   0x??
	 ATC[0x0E]: PAL0E   0x??
	 ATC[0x0F]: PAL0F   0x??
	 ATC[0x10]: MODE    0x01
	 ATC[0x11]: OVRSCAN 0x??
	 ATC[0x12]: PLANES  0x0F
	 ATC[0x13]: HORZPAN 0x00*
	 GRC[0x00]: SRESET  0x00
	 GRC[0x01]: ESRESET 0x00
	 GRC[0x02]: COLRCMP 0x0F
	 GRC[0x03]: DATAROT 0x00
	 GRC[0x04]: READMAP 0x00
	 GRC[0x05]: MODE    0x08
	 GRC[0x06]: MISC    0x05
	 GRC[0x07]: COLRDC  0x0F
	 GRC[0x08]: BITMASK 0xFF*
	 SEQ[0x00]: RESET   0x03*
	 SEQ[0x01]: CLK     0x29
	 SEQ[0x02]: MAPMASK 0x0F
	 SEQ[0x03]: CHARMAP 0x00
	 SEQ[0x04]: MODE    0x06
		  FEAT: 0x00
		  MISC: 0x63
	   STATUS0: 0x00
	   LATCHES: 0x00
		ACCESS: 0x0210
	Use 'dump video buffer' to dump video memory

If you've noticed that none of the ATC palette registers were programmed, well, that's apparently by design.
  
*[@jeffpar](http://twitter.com/jeffpar)*  
*June 1, 2015*
