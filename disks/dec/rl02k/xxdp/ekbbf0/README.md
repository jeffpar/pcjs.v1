---
layout: page
title: "EKBBF0: 11/70 MEMORY MANAGEMENT DIAGNOSTIC (PART 2)"
permalink: /disks/dec/rl02k/xxdp/ekbbf0/
---

EKBBF0: 11/70 CPU DIAGNOSTIC (PART 2)
-------------------------------------

From the
[PDP-11 Diagnostic Handbook (1988)](http://archive.pcjs.org/pubs/dec/pdp11/diags/PDP11_DiagnosticHandbook_1988.pdf),
p. 1-7:

	11/70 CPU DIAGNOSTIC PART 1

	ABSTRACT:

		This diagnostic is the second part of the 11/70 CPU, it tests advanced
		instructions and miscellaneous logic.

	OPERATING PROCEDURES:
	        Set the switch register by <CONTROL P> (RD console)
	    CON = xxxxxxWZ
	        (W = deposit xxxxxx into console switch register)
			(R = read and type console switch settings)
			(Z = switch console terminal back to program)

	    .R EKBBF0

	SWITCH SETTINGS
	    SW15 = 1 halt on error
	    SW14 = 1 loop on test
	    SW13 = 1 inhibit error typeouts
	    SW12 = 1 inhibit T-bit trapping
	    SW11 = 1 inhibit iterations
	    SW10 = 1 ring bell on error
	    SW09 = 1 loop on error
	    SW08 = 1 loop on test in SWR <07:00>
	    SW07 = 1 not used
	    SW06 = 1 skip bus request 6 test
	    SW05 = 1 skip bus request 5 test
	    SW04 = 1 skip bus request 4 test
	    SW02 = 1 test selector (with switch 8)
	    SW01 = 1 test selector (with switch 8)
	    SW00 = 1 skip operator intervention testing
