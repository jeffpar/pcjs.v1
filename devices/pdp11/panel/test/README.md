---
layout: page
title: PDP-11 Test Panels
permalink: /devices/pdp11/panel/test/
---

PDP-11 Test Panels
------------------

* [Terminal Test Panel](terminal.xml) (with [Debugger](debugger/terminal.xml))

Toggle-Ins
----------

From the [PDP-11/70 Maintenance Service Guide](http://archive.pcjs.org/pubs/dec/pdp11/1170/PDP1170_Maintenance_Service_Guide_Apr88.pdf),
Chapter 4:

	There are several useful toggle-ins that are probably not very well known. They are as follows:
	
	Memory Management
	
	Use the following toggle-in to verify the correct operation of Memory Management Relocation.
	
	200/012737          MOV #400,@#177572 (load maint. bit in MMRO)
	202/000400
	204/177572
	206/012737          MOV #070707,@#200 (move 070707 to virtual 200)
	210/070707
	212/000200
	214/000000          HLT
	
	300/000300          Preset loc 300 to 300
	
	17772300/077406     Set Kernal I PDR 0 to R/W 4K page
	17772340/000001     Set Kernal I PAR 0 to (Base address 100)
	
	Load Address 200
	Start               Display = 000216 (Halt@214)
	Load Address 300
	Exam                Display = 070707 ... Relocation works
	
	Unibus Map Checkout
	
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
