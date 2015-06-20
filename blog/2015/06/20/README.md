Compaq DeskPro 386 Disk Controller
---
In short, it isn't working.

So let's boot a [DeskPro 386](/devices/pc/machine/compaq/deskpro386/ega/2048kb/) machine,
enable HDC and Port messages in the Debugger (`m hdc on;m port on`), and see what's up.

	notice: Type 2 "20Mb Hard Disk" is fixed disk 0
	notice: Mounted diskette "PC-DOS 3.00 (Disk 1)" in drive A
	notice: Mounted diskette "PC-DOS 3.00 (Disk 2)" in drive B
	ramLow: 640Kb allocated
	ramLow: ROM BIOS memory test has NOT been disabled
	ramCPQ: 384Kb allocated
	ramCPQ: Compaq memory at 0xFA0000
	ramExt: 1024Kb allocated
	ramExt: Extended memory at 0x100000
	PCjs v1.x.x
	Copyright © 2012-2015 Jeff Parsons <Jeff@pcjs.org>
	License: GPL version 3 or later <http://gnu.org/licenses/gpl.html>
	Type ? for list of debugger commands
	EAX=00000000 EBX=00000000 ECX=00000000 EDX=00000304 
	ESP=00000000 EBP=00000000 ESI=00000000 EDI=00000000 
	SS=0000 DS=0000 ES=0000 FS=0000 GS=0000 PS=00000002 V0 D0 I0 T0 S0 Z0 A0 P0 C0 
	F000:FFF0 EA05F900F0      JMP      F000:F905
	messages on:  port
	messages on:  hdc
	running
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x00) @F000:F907
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x01) @F000:F926
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x02) @F000:F93C
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x03) @F000:F942
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x04) @F000:F946
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x05) @F000:F95F
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x06) @F000:F978
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x08) @F000:F9AA
	notice: PIC0(0x20): unsupported OCW2 automatic EOI command: 0x00
	notice: PIC1(0xA0): unsupported OCW2 automatic EOI command: 0x00
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x09) @F000:F9F1
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x0F) @F000:BAAA
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x10) @F000:BAFB
	bus.outPort(0x004B,unknown,0x12) @F000:BAFF
	bus.outPort(0x004B,unknown,0x42) @F000:BB03
	bus.outPort(0x004B,unknown,0x92) @F000:BB07
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x11) @F000:BB29
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x12) @F000:BB70
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x13) @F000:BB90
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x14) @F000:BBB8
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x15) @F000:BBD8
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x17) @F000:BC08
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x18) @F000:BC14
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x40) @F000:B552
	CompaqController.writeByte(0x0000,0xFF) @0018:87B4
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x2F) @0018:87B4
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x41) @F000:B572
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x42) @F000:B599
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x43) @F000:B5C4
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x44) @F000:B5D2
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x45) @F000:B600
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x43) @F000:B5C4
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x44) @F000:B5D2
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x45) @F000:B600
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x46) @F000:B61C
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x19) @F000:BC2C
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x30) @F000:A8B0
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x31) @F000:A905
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x32) @F000:A91D
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x33) @F000:A93B
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x34) @F000:A953
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x36) @F000:A991
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x38) @F000:A99C
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x39) @F000:A9BC
	bus.inPort(0x03BC,unknown) @F000:A9CA
	bus.outPort(0x03BC,unknown,0x00) @F000:A9CD
	bus.inPort(0x03BC,unknown) @F000:A9D0
	bus.inPort(0x0378,unknown) @F000:A9CA
	bus.outPort(0x0378,unknown,0x00) @F000:A9CD
	bus.inPort(0x0378,unknown) @F000:A9D0
	bus.inPort(0x0278,unknown) @F000:A9CA
	bus.outPort(0x0278,unknown,0x00) @F000:A9CD
	bus.inPort(0x0278,unknown) @F000:A9D0
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x3A) @F000:A9DE
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x3B) @F000:A9FB
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x52) @F000:AA41
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x53) @F000:AA54
	bus.outPort(0x46E8,unknown,0x16) @C000:009C
	bus.outPort(0x46E9,unknown,0x00) @C000:009C
	bus.outPort(0x0102,unknown,0x01) @C000:00A3
	bus.outPort(0x0103,unknown,0x00) @C000:00A3
	bus.outPort(0x46E8,unknown,0x0E) @C000:00AA
	bus.outPort(0x46E9,unknown,0x00) @C000:00AA
	bus.outPort(0x4AE8,unknown,0x00) @C000:00B0
	bus.outPort(0x4AE9,unknown,0x00) @C000:00B0
	Card.setMemoryAccess(0x1510): missing readByte handler
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x8C) @F000:D05C
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x1A) @F000:BC79
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x50) @F000:AA76
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x51) @F000:AA7F
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x52) @F000:AA9C
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x1B) @F000:BC80
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x1C) @F000:BC87
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x90) @F000:CC53
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x91) @F000:CC85
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x1D) @F000:BC8E
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x93) @F000:CC8A
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x94) @F000:CD06
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x95) @F000:CD3C
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x96) @F000:CD6A
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x2D) @F000:BC95
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x0D) @F000:E107
	bus.outPort(0x004B,unknown,0x12) @F000:E10B
	bus.outPort(0x0048,unknown,0x22) @F000:E112
	bus.outPort(0x004B,unknown,0x00) @F000:E139
	bus.inPort(0x0048,unknown) @F000:E13B
	bus.inPort(0x0048,unknown) @F000:E13E
	bus.outPort(0x004B,unknown,0x12) @F000:E11A
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x0E) @F000:E11E
	bus.outPort(0x004B,unknown,0x92) @F000:E122
	bus.outPort(0x004A,unknown,0x22) @F000:E129
	bus.outPort(0x004B,unknown,0x80) @F000:E139
	bus.inPort(0x004A,unknown) @F000:E13B
	bus.inPort(0x004A,unknown) @F000:E13E
	bus.outPort(0x004B,unknown,0x92) @F000:E131
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x1E) @F000:BC9C
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x80) @F000:CFDF
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x81) @F000:CFF7
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x82) @F000:D011
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x84) @F000:D02D
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x1F) @F000:BCA3
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x75) @F000:F74D
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x76) @F000:F761
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x77) @0030:F772
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x78) @0030:F790
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x00) @F000:F907
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x07) @F000:F986
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x08) @F000:F9AA
	notice: PIC0(0x20): unsupported OCW2 automatic EOI command: 0x00
	notice: PIC1(0xA0): unsupported OCW2 automatic EOI command: 0x00
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x09) @F000:F9F1
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x79) @F000:F7CD
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x7B) @F000:F814
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x20) @F000:BCAA
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x60) @F000:D6E6
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x61) @F000:D704
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x18) @0030:870A
	CompaqController.readByte(0x0000) returned 0x0F @0030:8710
	CompaqController.readByte(0x0001) returned 0x0A @0030:8710
	CompaqController.writeByte(0x0000,0xFF) @0030:8715
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x18) @0030:8715
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x62) @0030:D719
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x63) @0030:D761
	CompaqController.writeByte(0x0000,0xFF) @0030:84B0
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x70) @0030:DB38
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x71) @0030:DB6D
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x73) @0030:DBF4
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x6D) @0030:DAC0
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x6E) @0030:DAC8
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x6F) @0030:DB19
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x70) @0030:DB38
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x71) @0030:DB6D
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x73) @0030:DBF4
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x65) @0030:D7E6
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x6D) @0030:DAC0
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x6E) @0030:DAC8
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x6F) @0030:DB19
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x70) @0030:DB38
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x71) @0030:DB6D
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x73) @0030:DBF4
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x70) @0030:DB38
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x71) @0030:DB6D
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x73) @0030:DBF4
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x72) @0030:DC01
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x66) @0030:D942
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x67) @0030:D970
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x68) @0030:D99B
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x00) @F000:F907
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x07) @F000:F986
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x08) @F000:F9AA
	notice: PIC0(0x20): unsupported OCW2 automatic EOI command: 0x00
	notice: PIC1(0xA0): unsupported OCW2 automatic EOI command: 0x00
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x09) @F000:F9F1
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x69) @F000:D9CC
	CompaqController.readByte(0x0000) returned 0x0F @0018:880A
	CompaqController.writeByte(0x0000,0xFF) @0018:8810
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x6C) @F000:DAB1
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0xD0) @F000:C82A
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0xD1) @F000:C83B
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0xD2) @0030:C847
	CompaqController.writeByte(0x0000,0xFF) @0030:84B0
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x7F) @0030:853E
	CompaqController.readByte(0x0000) returned 0x0F @0030:85D2
	CompaqController.writeByte(0x0000,0xFF) @0030:85D7
	CompaqController.writeByte(0x0000,0xFC) @0030:863C
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0xD3) @0030:C881
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0xD4) @F000:C8A5
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x7D) @F000:F482
	CompaqController.readByte(0x0000) returned 0x0F @0028:F4BC
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x7E) @F000:F686
	CompaqController.writeByte(0x0000,0xFE) @0018:87B4
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x2F) @0018:87B4
	CompaqController.writeByte(0x0000,0xFF) @0018:87B4
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x2F) @0018:87B4
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x21) @F000:BCBB
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x23) @F000:BCC2
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x8B) @F000:CEDD
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x8C) @F000:D05C
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x86) @F000:CF04
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x87) @F000:CF2A
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x88) @F000:CF41
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x89) @F000:CF4E
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x8D) @F000:CF8E
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x22) @F000:BCC9
	CompaqController.readByte(0x0000) returned 0x0F @0018:880A
	CompaqController.writeByte(0x0000,0xFF) @0018:8810
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x24) @F000:BCEB
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x25) @F000:BD19
	hdcAT.outPort(0x01F6,DRVHD,0xA0) @F000:91B5
	hdcAT.outPort(0x03F6,FDR,0x00) @F000:C5B5
	hdcAT.outPort(0x03F6,FDR,0x04) @F000:C5B8
	hdcAT.outPort(0x03F6,FDR,0x00) @F000:C5BE
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0xA0) @F000:83FE
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0xA1) @F000:8408
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0xA2) @F000:8415
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0xA3) @F000:8430
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0xA6) @F000:8490
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0xA8) @F000:91BE
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0xAF) @F000:920A
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x26) @F000:BD20
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0xB0) @F000:C397
	hdcAT.outPort(0x01F2,SECCNT,0x55) @F000:C3A6
	hdcAT.inPort(0x01F2,SECCNT): 0x55 @F000:C3A9
	hdcAT.outPort(0x03F6,FDR,0x00) @F000:C5B5
	hdcAT.outPort(0x03F6,FDR,0x04) @F000:C5B8
	hdcAT.outPort(0x03F6,FDR,0x00) @F000:C5BE
	hdcAT.inPort(0x01F7,STATUS): 0x40 @F000:C574
	hdcAT.inPort(0x01F1,ERROR): 0x01 @F000:C588
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0xB3) @F000:C3E3
	hdcAT.outPort(0x03F6,FDR,0x00) @F000:B4B0
	hdcAT.inPort(0x01F7,STATUS): 0x40 @F000:B367
	hdcAT.outPort(0x01F6,DRVHD,0xA0) @F000:B2C8
	hdcAT.inPort(0x01F7,STATUS): 0x40 @F000:B367
	hdcAT.inPort(0x01F7,STATUS): 0x40 @F000:B52F
	hdcAT.inPort(0x01F7,STATUS): 0x40 @F000:C41F
	hdcAT.outPort(0x03F6,FDR,0x00) @F000:B4B0
	hdcAT.inPort(0x01F7,STATUS): 0x40 @F000:B367
	hdcAT.outPort(0x01F6,DRVHD,0xA0) @F000:B2C8
	hdcAT.inPort(0x01F7,STATUS): 0x40 @F000:B367
	hdcAT.inPort(0x01F7,STATUS): 0x40 @F000:B52F
	hdcAT.inPort(0x01F7,STATUS): 0x40 @F000:C41F
	hdcAT.outPort(0x03F6,FDR,0x00) @F000:B4B0
	hdcAT.inPort(0x01F7,STATUS): 0x40 @F000:B367
	hdcAT.outPort(0x01F6,DRVHD,0xA0) @F000:B2C8
	hdcAT.inPort(0x01F7,STATUS): 0x40 @F000:B367
	hdcAT.inPort(0x01F7,STATUS): 0x40 @F000:B52F
	hdcAT.inPort(0x01F7,STATUS): 0x40 @F000:C41F
	hdcAT.outPort(0x03F6,FDR,0x00) @F000:B4B0
	hdcAT.inPort(0x01F7,STATUS): 0x40 @F000:B367
	hdcAT.outPort(0x01F6,DRVHD,0xA0) @F000:B2C8
	hdcAT.inPort(0x01F7,STATUS): 0x40 @F000:B367
	hdcAT.inPort(0x01F7,STATUS): 0x40 @F000:B52F
	hdcAT.inPort(0x01F7,STATUS): 0x40 @F000:C41F
	hdcAT.outPort(0x03F6,FDR,0x00) @F000:B4B0
	hdcAT.inPort(0x01F7,STATUS): 0x40 @F000:B367
	hdcAT.outPort(0x01F6,DRVHD,0xA0) @F000:B2C8
	hdcAT.inPort(0x01F7,STATUS): 0x40 @F000:B367
	hdcAT.inPort(0x01F7,STATUS): 0x40 @F000:B52F
	hdcAT.inPort(0x01F7,STATUS): 0x40 @F000:C41F
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0xB6) @F000:C54B
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0xB8) @F000:C3C3
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x27) @F000:BD27
	bus.outPort(0x03BE,unknown,0xEC) @F000:BD2E
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x28) @F000:BD31
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x29) @F000:BD38
	chipset.outPort(0x0084,DMA.SPARE0.PAGE,0x8C) @F000:D05C
	stopped (67172989 ops, 305957247 cycles, 69937 ms, 4374755 hz)
	EAX=00000000 EBX=0000B95B ECX=00000000 EDX=00000000 
	ESP=000000DC EBP=000000DE ESI=00000020 EDI=0000E411 
	SS=0030 DS=0040 ES=F000 FS=0000 GS=0304 PS=00000246 V0 D0 I1 T0 S0 Z1 A0 P1 C0 
	F000:DCAC 74F8            JZ       DCA6

*[@jeffpar](http://twitter.com/jeffpar)*  
*June 20, 2015*
