---
layout: page
title: PDP-11/70 with Front Panel and Debugger
permalink: /devices/pdp11/machine/1170/panel/debugger/
machines:
  - id: test1170
    type: pdp11
    debugger: true
---

{% include machine.html id="test1170" %}

Toggle-Ins
----------

As DEC explains in its [PDP-11/70 Maintenance Service Guide](http://archive.pcjs.org/pubs/dec/pdp11/1170/PDP1170_Maintenance_Service_Guide_Apr88.pdf),
Chapter 4: "There are several useful toggle-ins that are probably not very well known."  Excerpts are listed below.

### Memory Management

	Use the following toggle-in to verify the correct operation of Memory Management Relocation.
	
	200/012737          MOV #400,@#177572 (load maint. bit in MMRO)
	202/000400
	204/177572
	206/012737          MOV #070707,@#200 (move 070707 to virtual 200)
	210/070707
	212/000200
	214/000000          HLT
	
	300/000300          Preset loc 300 to 300
	
	17772300/077406     Set Kernel I PDR 0 to R/W 4K page
	17772340/000001     Set Kernel I PAR 0 to (Base address 100)
	
	Load Address 200
	Start               Display = 000216 (Halt@214)
	Load Address 300
	Exam                Display = 070707 ... Relocation works

With the PDPjs Debugger, the above "toggle-in" is easily entered with these commands:

	e 200 012737 000400 177572 012737 070707 000200 000000
	e 300 000300
	e 17772300 077406
	e 17772340 000001
	r pc 200
	g

which should produce these results:

	>> e 200 012737 000400 177572 012737 070707 000200 000000
	changing 000200 from 00000 to 12737
	changing 000202 from 00000 to 00400
	changing 000204 from 00000 to 77572
	changing 000206 from 00000 to 12737
	changing 000210 from 00000 to 70707
	changing 000212 from 00000 to 00200
	changing 000214 from 00000 to 00000
	>> e 300 000300
	changing 000300 from 00000 to 00300
	>> e 17772300 077406
	changing 00017772300 from 00000 to 77406
	>> e 17772340 000001
	changing 00017772340 from 00000 to 00001
	>> r pc 200
	updated registers:
	R0=000000 R1=000000 R2=000000 R3=000000 R4=000000 R5=000000 
	SP=000000 PC=000200 PS=000013 SW=00000000 T0 N1 Z0 V1 C1 
	000200: 012737 000400 177572   MOV   #400,@#177572
	>> g
	running
	stopped (3 instructions, 32 cycles, 9 ms, 3556 hz)
	R0=000000 R1=000000 R2=000000 R3=000000 R4=000000 R5=000000 
	SP=000000 PC=000214 PS=000001 SW=00000000 T0 N0 Z0 V0 C1 
	000214: 000000                 HALT 
	>> dw 300 l1
	000300  70707  

### Unibus Map Checkout

	Use the following console operating procedure to verify the correct operation of the Unibus Map.
	
	Load Address        500
	Deposit             125252      Known Data
	
	Load Address        17000500
	Deposit             125252      Data Path Ok
	
	Load Address        17000700
	Deposit             070707      Known Data
	
	Load Address        17770202    Map register 0 Hi
	Deposit             000000      Relocation constant
	
	Load Address        17770200    Map register 0 Lo
	Deposit             000200      Relocation constant
	
	Load Address        17772516    MMR3
	Deposit             000040      Enable map
	
	Load address        17000500    Relocates to 700
	Examine             070707      ... Relocated ok
