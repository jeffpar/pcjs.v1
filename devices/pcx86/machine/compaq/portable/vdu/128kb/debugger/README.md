---
layout: page
title: COMPAQ Portable (128Kb) with Monochrome Graphics and Debugger
permalink: /devices/pcx86/machine/compaq/portable/vdu/128kb/debugger/
machines:
  - id: compaq-portable-128kb
    type: pcx86
    debugger: true
---

{% include machine.html id="compaq-portable-128kb" %}

Debugging Notes
---------------

I originally created the [XML File](machine.xml) for this machine by copying an IBM PC configuration with
a monochrome display adapter and motherboard SW1 settings `01000001`.  Note that the SW1 monitor switches,
SW1[5] and SW1[6], are both off (`0`), indicating a monochrome monitor.

However, when I booted the machine, the BIOS displayed two errors: 501 in the top left corner, and 4011
toward the middle of the screen.  The machine then crashed in RAM; the last ROM instruction executed was:

    &F000:E769 CF               IRET                              ;history=6102

A [1986 COMPAQ Maintenance and Service Guide](http://www.minuszerodegrees.net/manuals/Compaq%20Portable_Plus_286%20-%20Maintenance%20and%20Service%20Guide.pdf)
indicated that error 501 was a "Display Controller Failure (Video Display or Video Controller Board)".
And the [1982 COMPAQ Operations Guide](/pubs/pc/software/dos/compaq/1.10) contained some information on switch
settings on p. 18 of the "320-KBYTE DISK DRIVE" manual (p. 259 of the entire PDF).

COMPAQ documented only two values for the SW1 monitor switches:

- `10`: COMPAQ VIDEO BOARD (DEFAULT)
- `00`: COMPAQ VIDEO & IBM MONOCHROME BOARDS

The descriptions were a bit cryptic, but since I had already tried `00`, there was no harm in trying `10`.

On this new boot attempt, there was no cursor initially, and two different errors were displayed: 301
and 401.  But then the COMPAQ MS-DOS 1.10 date and time prompts appeared -- success!

I never expected this machine to work the first time, or even the second time, because I had never executed
a COMPAQ Portable ROM before, and the PCx86 [Video](/modules/pcx86/lib/video.js) component doesn't yet know how
to properly emulator a COMPAQ video (VDU) board, which is capable of mimicking both MDA and CGA adapters.

I had assumed that a COMPAQ Portable would prefer to boot up in a monochrome mode, since the boot process is
text-based, and monochrome text looks better than color graphics text.  And that may still be true.  The BIOS
may simply be confused by how the video card is responding, and it may be falling back to some default behavior
that is less "fatal" than my first attempt.

Ignoring VDU compatibility for the moment, the next order of business was to isolate the cause of other errors:
301 ("Keyboard Error") and 401 ("Printer Error").

It turned out that the printer issue was easily resolved by changing the parallel port's adapter number from 2 to 1,
which changes the port's base I/O address from 0x378 to 0x3BC.  The latter is what's normally used by the built-in
parallel port on an IBM monochrome adapter, so either COMPAQ used the same default address *or* the BIOS assumed that
a monochrome card was installed.  Or something like that.

Next, I'll work on figuring out the keyboard error, and then I'll start analyzing how the COMPAQ BIOS detects and
initializes the video hardware.

The Keyboard Error
------------------

Setting a write breakpoint on video memory (`bw b800:0`) eventually led me to following code:

    >> pr
    AX=0E20 BX=0007 CX=0000 DX=0008 SP=0400 BP=E5B6 SI=0001 DI=4000 
    SS=0000 DS=F000 ES=B800 PS=F046 V0 D0 I0 T0 S0 Z1 A0 P1 C0 
    &F000:E5D9 BA0103           MOV      DX,0301                  ;cycles=16
    >> pr
    AX=0E20 BX=0007 CX=0000 DX=0301 SP=0400 BP=E5B6 SI=0001 DI=4000 
    SS=0000 DS=F000 ES=B800 PS=F046 V0 D0 I0 T0 S0 Z1 A0 P1 C0 
    &F000:E5DC E856FC           CALL     E235 (romBIOS+0x0235)    ;cycles=12

after which " 301" appeared at the top of the screen.  From there, I was able to backtrack to the first
bit code that appeared to tinker with the 8255 (the original PC keyboard interface) via ports 0x60 and 0x61:

    &F000:E538 BA2100           MOV      DX,0021
    &F000:E53B E851FD           CALL     E28F (romBIOS+0x028F)
    &F000:E53E B0FF             MOV      AL,FF
    &F000:E540 EE               OUT      DX,AL
    &F000:E541 E461             IN       AL,61

But first, I was curious about that code at E538 -- which it turns out was simply verifying that all possible
8-bit values could be written to and read back from the PIC's IMR.  Here's what E28F looks like:

    romBIOS+0x028F:
    &F000:E28F 33C0             XOR      AX,AX
    &F000:E291 B90001           MOV      CX,0100
    &F000:E294 EE               OUT      DX,AL
    &F000:E295 EE               OUT      DX,AL
    &F000:E296 EC               IN       AL,DX
    &F000:E297 3AC4             CMP      AL,AH
    &F000:E299 750C             JNZ      E2A7 (romBIOS+0x02A7)
    &F000:E29B EC               IN       AL,DX
    &F000:E29C 3AC4             CMP      AL,AH
    &F000:E29E 7507             JNZ      E2A7 (romBIOS+0x02A7)
    &F000:E2A0 FEC0             INC      AL
    &F000:E2A2 FEC4             INC      AH
    &F000:E2A4 E2EE             LOOP     E294 (romBIOS+0x0294)
    &F000:E2A6 C3               RET     
    &F000:E2A7 58               POP      AX
    &F000:E2A8 FFE3             JMP      BX

And E28F is called many other times, for many other ports, including port 0x61.  And in the process of writing
every possible value to port 0x61, a keyboard reset is triggered, BUT that's not the keyboard reset we care about.
That comes later, in the code below.  At this point, I've also turned on keyboard messages (`m kbd on`) and port
messages (`m port on`) in the PCjs debugger.

    >> tr
    AX=0000 BX=E595 CX=0000 DX=0008 SP=0400 BP=2000 SI=0001 DI=4000 
    SS=0000 DS=F000 ES=B800 PS=F002 V0 D0 I0 T0 S0 Z0 A0 P0 C0 
    &F000:E59B E461             IN       AL,61                    ;cycles=19
    >> tr
    AX=004D BX=E595 CX=0000 DX=0008 SP=0400 BP=2000 SI=0001 DI=4000 
    SS=0000 DS=F000 ES=B800 PS=F002 V0 D0 I0 T0 S0 Z0 A0 P0 C0 
    &F000:E59D 0C80             OR       AL,80                    ;cycles=18
    >> tr
    AX=00CD BX=E595 CX=0000 DX=0008 SP=0400 BP=2000 SI=0001 DI=4000 
    SS=0000 DS=F000 ES=B800 PS=F082 V0 D0 I0 T0 S1 Z0 A0 P0 C0 
    &F000:E59F 24BF             AND      AL,BF                    ;cycles=12
    >> tr
    AX=008D BX=E595 CX=0000 DX=0008 SP=0400 BP=2000 SI=0001 DI=4000 
    SS=0000 DS=F000 ES=B800 PS=F086 V0 D0 I0 T0 S1 Z0 A0 P1 C0 
    &F000:E5A1 E661             OUT      61,AL                    ;cycles=12
    >> tr
    keyboard clock line changing to false
    keyboard data line changing to false
    AX=008D BX=E595 CX=0000 DX=0008 SP=0400 BP=2000 SI=0001 DI=4000 
    SS=0000 DS=F000 ES=B800 PS=F086 V0 D0 I0 T0 S1 Z0 A0 P1 C0 
    &F000:E5A3 247F             AND      AL,7F                    ;cycles=18
    >> tr
    AX=000D BX=E595 CX=0000 DX=0008 SP=0400 BP=2000 SI=0001 DI=4000 
    SS=0000 DS=F000 ES=B800 PS=F002 V0 D0 I0 T0 S0 Z0 A0 P0 C0 
    &F000:E5A5 E661             OUT      61,AL                    ;cycles=12
    >> tr
    keyboard data line changing to true
    chipset.receiveKbdData(0x00)
    AX=000D BX=E595 CX=0000 DX=0008 SP=0400 BP=2000 SI=0001 DI=4000 
    SS=0000 DS=F000 ES=B800 PS=F002 V0 D0 I0 T0 S0 Z0 A0 P0 C0 
    &F000:E5A7 BB2800           MOV      BX,0028                  ;cycles=18
    >> tr
    AX=000D BX=0028 CX=0000 DX=0008 SP=0400 BP=2000 SI=0001 DI=4000 
    SS=0000 DS=F000 ES=B800 PS=F002 V0 D0 I0 T0 S0 Z0 A0 P0 C0 
    &F000:E5AA E856FC           CALL     E203 (romBIOS+0x0203)    ;cycles=12
    >> u e203
    romBIOS+0x0203:
    &F000:E203 5D               POP      BP
    &F000:E204 B90401           MOV      CX,0104
    &F000:E207 E2FE             LOOP     E207 (romBIOS+0x0207)
    &F000:E209 4B               DEC      BX
    &F000:E20A 75F8             JNZ      E204 (romBIOS+0x0204)
    &F000:E20C FFE5             JMP      BP
    >> g e20c
    running
    stopped (30331 opcodes, 213962 cycles, 1538868214773 ms, 0 hz)
    AX=000D BX=0000 CX=0000 DX=0008 SP=0400 BP=E5AD SI=0001 DI=4000 
    SS=0000 DS=F000 ES=B800 PS=F046 V0 D0 I0 T0 S0 Z1 A0 P1 C0 
    &F000:E20C FFE5             JMP      BP
    >> tr
    AX=000D BX=0000 CX=0000 DX=0008 SP=0400 BP=E5AD SI=0001 DI=4000 
    SS=0000 DS=F000 ES=B800 PS=F046 V0 D0 I0 T0 S0 Z1 A0 P1 C0 
    &F000:E5AD 0C40             OR       AL,40                    ;cycles=19
    >> tr
    AX=004D BX=0000 CX=0000 DX=0008 SP=0400 BP=E5AD SI=0001 DI=4000 
    SS=0000 DS=F000 ES=B800 PS=F006 V0 D0 I0 T0 S0 Z0 A0 P1 C0 
    &F000:E5AF E661             OUT      61,AL                    ;cycles=12
    >> tr
    keyboard clock line changing to true
    keyboard reset
    keyboard response 0xAA buffered
    chipset.receiveKbdData(0xAA)
    keyboard data 0xAA delivered
    AX=004D BX=0000 CX=0000 DX=0008 SP=0400 BP=E5AD SI=0001 DI=4000 
    SS=0000 DS=F000 ES=B800 PS=F006 V0 D0 I0 T0 S0 Z0 A0 P1 C0 
    &F000:E5B1 B314             MOV      BL,14                    ;cycles=18
    >> tr
    AX=004D BX=0014 CX=0000 DX=0008 SP=0400 BP=E5AD SI=0001 DI=4000 
    SS=0000 DS=F000 ES=B800 PS=F006 V0 D0 I0 T0 S0 Z0 A0 P1 C0 
    &F000:E5B3 E84DFC           CALL     E203 (romBIOS+0x0203)    ;cycles=12
    >> pr
    chipset.receiveKbdData(0x00)
    keyboard data 0x00 delivered
    AX=004D BX=0000 CX=0000 DX=0008 SP=0400 BP=E5B6 SI=0001 DI=4000 
    SS=0000 DS=F000 ES=B800 PS=F046 V0 D0 I0 T0 S0 Z1 A0 P1 C0 
    &F000:E5B6 E83404           CALL     E9ED (romBIOS+0x09ED)    ;cycles=109774
    >> u e9ed
    romBIOS+0x09ED:
    &F000:E9ED E460             IN       AL,60
    &F000:E9EF 86E0             XCHG     AH,AL
    &F000:E9F1 E461             IN       AL,61
    &F000:E9F3 0C80             OR       AL,80
    &F000:E9F5 E661             OUT      61,AL
    &F000:E9F7 247F             AND      AL,7F
    &F000:E9F9 E661             OUT      61,AL
    &F000:E9FB C3               RET     
    >> tr
    AX=004D BX=0000 CX=0000 DX=0008 SP=03FE BP=E5B6 SI=0001 DI=4000 
    SS=0000 DS=F000 ES=B800 PS=F046 V0 D0 I0 T0 S0 Z1 A0 P1 C0 
    &F000:E9ED E460             IN       AL,60                    ;cycles=31
    >> tr
    chipset.inPort(0x0060,PPI_A): 0x00 at F000:E9ED
    AX=0000 BX=0000 CX=0000 DX=0008 SP=03FE BP=E5B6 SI=0001 DI=4000 
    SS=0000 DS=F000 ES=B800 PS=F046 V0 D0 I0 T0 S0 Z1 A0 P1 C0 
    &F000:E9EF 86E0             XCHG     AH,AL                    ;cycles=18
    >> tr
    AX=0000 BX=0000 CX=0000 DX=0008 SP=03FE BP=E5B6 SI=0001 DI=4000 
    SS=0000 DS=F000 ES=B800 PS=F046 V0 D0 I0 T0 S0 Z1 A0 P1 C0 
    &F000:E9F1 E461             IN       AL,61                    ;cycles=12
    >> tr
    AX=004D BX=0000 CX=0000 DX=0008 SP=03FE BP=E5B6 SI=0001 DI=4000 
    SS=0000 DS=F000 ES=B800 PS=F046 V0 D0 I0 T0 S0 Z1 A0 P1 C0 
    &F000:E9F3 0C80             OR       AL,80                    ;cycles=18
    >> tr
    AX=00CD BX=0000 CX=0000 DX=0008 SP=03FE BP=E5B6 SI=0001 DI=4000 
    SS=0000 DS=F000 ES=B800 PS=F082 V0 D0 I0 T0 S1 Z0 A0 P0 C0 
    &F000:E9F5 E661             OUT      61,AL                    ;cycles=12
    >> tr
    keyboard data line changing to false
    AX=00CD BX=0000 CX=0000 DX=0008 SP=03FE BP=E5B6 SI=0001 DI=4000 
    SS=0000 DS=F000 ES=B800 PS=F082 V0 D0 I0 T0 S1 Z0 A0 P0 C0 
    &F000:E9F7 247F             AND      AL,7F                    ;cycles=18
    >> tr
    AX=004D BX=0000 CX=0000 DX=0008 SP=03FE BP=E5B6 SI=0001 DI=4000 
    SS=0000 DS=F000 ES=B800 PS=F006 V0 D0 I0 T0 S0 Z0 A0 P1 C0 
    &F000:E9F9 E661             OUT      61,AL                    ;cycles=12
    >> tr
    keyboard data line changing to true
    chipset.receiveKbdData(0x00)
    keyboard data 0x00 delivered
    AX=004D BX=0000 CX=0000 DX=0008 SP=03FE BP=E5B6 SI=0001 DI=4000 
    SS=0000 DS=F000 ES=B800 PS=F006 V0 D0 I0 T0 S0 Z0 A0 P1 C0 
    &F000:E9FB C3               RET                               ;cycles=18
    >> tr
    AX=004D BX=0000 CX=0000 DX=0008 SP=0400 BP=E5B6 SI=0001 DI=4000 
    SS=0000 DS=F000 ES=B800 PS=F006 V0 D0 I0 T0 S0 Z0 A0 P1 C0 
    &F000:E5B9 86C4             XCHG     AL,AH                    ;cycles=16
    >> tr
    AX=4D00 BX=0000 CX=0000 DX=0008 SP=0400 BP=E5B6 SI=0001 DI=4000 
    SS=0000 DS=F000 ES=B800 PS=F006 V0 D0 I0 T0 S0 Z0 A0 P1 C0 
    &F000:E5BB 3CAA             CMP      AL,AA                    ;cycles=12
    >> tr
    AX=4D00 BX=0000 CX=0000 DX=0008 SP=0400 BP=E5B6 SI=0001 DI=4000 
    SS=0000 DS=F000 ES=B800 PS=F017 V0 D0 I0 T0 S0 Z0 A1 P1 C1 
    &F000:E5BD 750E             JNZ      E5CD (romBIOS+0x05CD)    ;cycles=12
    >> tr
    AX=4D00 BX=0000 CX=0000 DX=0008 SP=0400 BP=E5B6 SI=0001 DI=4000 
    SS=0000 DS=F000 ES=B800 PS=F017 V0 D0 I0 T0 S0 Z0 A1 P1 C1 
    &F000:E5CD 0AC0             OR       AL,AL                    ;cycles=20
    >> tr
    AX=4D00 BX=0000 CX=0000 DX=0008 SP=0400 BP=E5B6 SI=0001 DI=4000 
    SS=0000 DS=F000 ES=B800 PS=F056 V0 D0 I0 T0 S0 Z1 A1 P1 C0 
    &F000:E5CF 7403             JZ       E5D4 (romBIOS+0x05D4)    ;cycles=11
    >> tr
    AX=4D00 BX=0000 CX=0000 DX=0008 SP=0400 BP=E5B6 SI=0001 DI=4000 
    SS=0000 DS=F000 ES=B800 PS=F056 V0 D0 I0 T0 S0 Z1 A1 P1 C0 
    &F000:E5D4 B020             MOV      AL,20                    ;cycles=20
    >> tr
    AX=4D20 BX=0000 CX=0000 DX=0008 SP=0400 BP=E5B6 SI=0001 DI=4000 
    SS=0000 DS=F000 ES=B800 PS=F056 V0 D0 I0 T0 S0 Z1 A1 P1 C0 
    &F000:E5D6 E8AEFC           CALL     E287 (romBIOS+0x0287)    ;cycles=12
    >> u
    romBIOS+0x05D9:
    &F000:E5D9 BA0103           MOV      DX,0301
    &F000:E5DC E856FC           CALL     E235 (romBIOS+0x0235)
    &F000:E5DF BABC03           MOV      DX,03BC
    &F000:E5E2 EC               IN       AL,DX
    &F000:E5E3 50               PUSH     AX
    &F000:E5E4 BBECE5           MOV      BX,E5EC
    &F000:E5E7 E8A5FC           CALL     E28F (romBIOS+0x028F)
    &F000:E5EA EB06             JMP      E5F2 (romBIOS+0x05F2)

So what do we deduce from the above code?  E5AF is where the keyboard is reset and the standard 0xAA response is
queued up and delivered.  Then the BIOS calls E203, which just spins for a short time, and then it calls E9ED, which
reads the keyboard's response.

The problem is that my Keyboard component wants to deliver the next byte in its queue every *msTransmit* milliseconds,
and that timeout was originally set to 15ms, but apparently the COMPAQ BIOS delay loop at E203 takes longer than 15ms,
and so the previous 0xAA response gets replaced with 0x00 (indicating no more keyboard data) BEFORE the BIOS gets
around to reading the response.

It's possible that I shouldn't replace the 0xAA response unless another scan or response code has been queued up,
but I've debugged too many BIOS handlers, keyboard interrupt handlers, Windows 1.x keyboard device drivers, etc, to
risk changing that behavior now.  Besides, it turns that a simpler and safer solution was to simply bump the Keyboard
component's *msTransmit* value up from 15ms to 25ms.

So that's what I did, and happily, it seems to have cured the 301 keyboard error.
