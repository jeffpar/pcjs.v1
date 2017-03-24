---
layout: post
title: Stepping Through PDP-10 Diagnostics
date: 2017-03-24 22:00:00
permalink: /blog/2017/03/24/
machines:
  - id: testka10
    type: pdp10
    config: /devices/pdp10/machine/ka10/test/debugger/machine.xml
    debugger: true
    commands: a 30724 /apps/pdp10/diags/klad/dakaa/MYDAKAA.MAC
---

Now that the PDPjs MACRO-10 Mini-Assembler is [limping along](/blog/2017/03/21/), it was time to start assembling some
of DEC's PDP-10 diagnostics and loading them into a test machine.  The first diagnostic I tried was
[KA10 Basic Instruction Diagnostic #1 (MAINDEC-10-DAKAA-B-D)](/apps/pdp10/diags/klad/dakaa/), which has been loaded into
the machine below.

{% include machine.html id="testka10" %}

Here were the results of my first run attempt:

	>> a 30724 /apps/pdp10/diags/klad/dakaa/MYDAKAA.MAC
	starting PCjs MACRO-10 Mini-Assembler...
	loading MYDAKAA.MAC
	CPU will not be auto-started (click Run to start)
	2844 words loaded at 030724-036357
	00=000000000000 01=000000000000 02=000000000000 03=000000000000 
	04=000000000000 05=000000000000 06=000000000000 07=000000000000 
	10=000000000000 11=000000000000 12=000000000000 13=000000000000 
	14=000000000000 15=000000000000 16=000000000000 17=000000000000 
	PC=030724 RA=00000000 EA=000000 C0=0 C1=0 OV=0 ND=0 PD=0 
	030724: 254000 030741  JRST    30741
	>> g
	running
	undefined opcode: 000000
	stopped (1698 instructions, 1697 cycles, 14 ms, 121214 hz)
	00=000000000000 01=000000000000 02=777777777777 03=000000000000 
	04=777777777777 05=000000000000 06=000000000000 07=777777777777 
	10=777777777777 11=000000000000 12=000000000000 13=000000000000 
	14=000000000000 15=000000000000 16=000000000000 17=000000000000 
	PC=035057 RA=00000000 EA=000000 C0=0 C1=0 OV=0 ND=0 PD=0 
	035057: 000000 000000  UUO     0,0
	>> dh
	035044: 444000 036353  EQV     0,36353          ;history=10
	035045: 332000 000000  SKIPE   0,0              ;history=9
	035047: 324000 035050  JUMPA   0,35050          ;history=8
	035050: 200000 036354  MOVE    0,36354          ;history=7
	035051: 404000 036355  AND     0,36355          ;history=6
	035052: 444000 036356  EQV     0,36356          ;history=5
	035053: 444000 036357  EQV     0,36357          ;history=4
	035054: 332000 000000  SKIPE   0,0              ;history=3
	035056: 324000 035057  JUMPA   0,35057          ;history=2
	035057: 000000 000000  UUO     0,0              ;history=1

Happily, this was a good outcome, because 035057 is the end of the test.  If you look at the diagnostic's
[listing file](/apps/pdp10/diags/klad/dakaa/DAKAA.LST.txt), this is what you would normally see at address 035057:

	035057	254 00 0 00 030057 	ENDXX:	JRST	BEGEND		;LOOP PROGRAM

Next, I tried [KA10 Basic Instruction Diagnostic #4 (MAINDEC-10-DAKAD-B-D)](/apps/pdp10/diags/klad/dakad/):

	>> a 30724 /apps/pdp10/diags/klad/dakad/MYDAKAD.MAC
	starting PCjs MACRO-10 Mini-Assembler...
	loading MYDAKAD.MAC
	1986 words loaded at 030724-034625
	00=000000000000 01=000000000000 02=777777777777 03=000000000000 
	04=777777777777 05=000000000000 06=000000000000 07=777777777777 
	10=777777777777 11=000000000000 12=000000000000 13=000000000000 
	14=000000000000 15=000000000000 16=000000000000 17=000000000000 
	PC=030724 RA=00000000 EA=000000 C0=0 C1=0 OV=0 ND=0 PD=0 
	030724: 254000 030741  JRST    30741
	>> g
	running
	stopped (450 instructions, 449 cycles, 8 ms, 56125 hz)
	00=000000000017 01=400000000000 02=000000000001 03=400000000000 
	04=000004000004 05=000005000005 06=000006000006 07=000007000007 
	10=000010000010 11=000011000011 12=000012000012 13=000013000013 
	14=000014000014 15=000015000015 16=000016000016 17=000017000017 
	PC=032007 RA=00032007 EA=032007 C0=0 C1=0 OV=0 ND=0 PD=0 
	032007: 324000 032010  JUMPA   0,32010
	>> dh
	031774: 201100 000001  MOVEI   2,1              ;history=10
	031775: 200142 000000  MOVE    3,0(2)           ;history=9
	031776: 312140 034461  CAME    3,34461          ;history=8
	032000: 324000 032001  JUMPA   0,32001          ;history=7
	032001: 476000 000003  SETOM   0,3              ;history=6
	032002: 205040 400000  MOVSI   1,400000         ;history=5
	032003: 201100 000001  MOVEI   2,1              ;history=4
	032004: 200142 000000  MOVE    3,0(2)           ;history=3
	032005: 312140 034462  CAME    3,34462          ;history=2
	032006: 254200 032007  HALT    32007            ;history=1

This looked less good.


*[@jeffpar](http://twitter.com/jeffpar)*
*Mar 24, 2017*
