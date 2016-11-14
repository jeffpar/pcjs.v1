---
layout: page
title: DEC Paper Tape Diagnostics
permalink: /apps/pdp11/tapes/diags/
---

Paper Tape Diagnostics
----------------------

Thanks to the [iamvirtual.ca](http://iamvirtual.ca/collection/systems/mediadoc/mediadoc.html#papertape)
website, we have archived the PDP-11 diagnostics shown below.  The tapes have been added to the
[Default PC11 Configuration](/devices/pdp11/pc11/), so that you can easily load them into any machine with a
[PC11](/modules/pdp11/lib/pc11.js), such as this [PDP-11/20 with Front Panel and Debugger](/devices/pdp11/machine/1120/panel/debugger/).

As noted for other [DEC PDP-11 Tape Images](/apps/pdp11/tapes/), these "Absolute Format" tapes can be loaded directly
into RAM using the machine's "Load" button instead of "Attach", allowing you to bypass the usual three-step process of
loading the [Bootstrap Loader](/apps/pdp11/boot/bootstrap/) in order to load the [Absolute Loader](/apps/pdp11/tapes/absloader/)
in order to load the desired tape.

[![MAINDEC-11-D0AA-PB (MAR/70): TEST 1 - BRANCH](MAINDEC-11-D0AA-PB.jpg)](#tests-1-12)
[![MAINDEC-11-D0BA-PB (MAR/70): TEST 2 - CON BRANCH](MAINDEC-11-D0BA-PB.jpg)](#tests-1-12)
[![MAINDEC-11-D0CA-PB (MAR/70): TEST 3 - UNARY](MAINDEC-11-D0CA-PB.jpg)](#tests-1-12)
[![MAINDEC-11-D0DA-PB (MAR/70): TEST 4 - UNARY + BINARY](MAINDEC-11-D0DA-PB.jpg)](#tests-1-12)
[![MAINDEC-11-D0EA-PB (MAR/70): TEST 5 - ROTATE SHIFT](MAINDEC-11-D0EA-PB.jpg)](#tests-1-12)
[![MAINDEC-11-D0FA-PB (MAR/70): TEST 6 - COMPARE](MAINDEC-11-D0FA-PB.jpg)](#tests-1-12)
[![MAINDEC-11-D0GA-PB (MAR/70): TEST 7 - COMPARE NOT](MAINDEC-11-D0GA-PB.jpg)](#tests-1-12)
[![MAINDEC-11-D0HA-PB (MAR/70): TEST 8 - MOVE](MAINDEC-11-D0HA-PB.jpg)](#tests-1-12)
[![MAINDEC-11-D0IA-PB (MAR/70): TEST 9 - BIS, BIC + BIT](MAINDEC-11-D0IA-PB.jpg)](#tests-1-12)
[![MAINDEC-11-D0JA-PB (MAR/70): TEST 10 - ADD](MAINDEC-11-D0JA-PB.jpg)](#tests-1-12)
[![MAINDEC-11-D0KA-PB (MAR/70): TEST 11 - SUBTRACT](MAINDEC-11-D0KA-PB.jpg)](#tests-1-12)
[![MAINDEC-11-D0LA-PB (MAR/70): TEST 12 - JUMP](MAINDEC-11-D0LA-PB.jpg)](#tests-1-12)
[![MAINDEC-11-D0MA-PB (FEB/70): TEST 13 - JSR, RTS, RTI](MAINDEC-11-D0MA-PB.jpg)](#test-13)
[![MAINDEC-11-D0NA-PB (APR/70): TEST 14A - TRAP TEST](MAINDEC-11-D0NA-PB.jpg)](#test-14)
[![MAINDEC-11-D0NB-PB (FEB/71): TEST 14B - TRAP TEST](MAINDEC-11-D0NB-PB.jpg)](#test-14)
[![MAINDEC-11-D0NC-PB (FEB/72): TEST 14C - TRAP TEST](MAINDEC-11-D0NC-PB.jpg)](#test-14)
[![MAINDEC-11-D0OA-PB (MAR/70): TEST 15 - CPU EXERCISER](MAINDEC-11-D0OA-PB.jpg)](#test-15)

Instructions for Running Diagnostics
------------------------------------

### Tests 1-12

Instructions for running "TEST 1 - BRANCH" through "TEST 12 - JUMP" come from the
[MAINDEC USER REFERENCE MANUAL, OCTOBER 1973](http://archive.pcjs.org/pubs/dec/pdp11/diags/MAINDEC_User_Reference_Manual_Oct73.pdf),
p. 19:

	MAINDEC-11-D0AA to D0LA (NEW NUMBER - DZKAA to DZKAL)
	
	T1 to T12
	
	ABSTRACT
	
	This is a group of 12 tests that incrementally test and isolate simple
	malfunctions of the PDP-11. The tests should be run in the indicated
	numerical sequence. The sequence is:
	
	                   1. Branch
	                   2. Conditional Branch
	                   3. Unary
	                   4. Unary and Binarys
	                   5. Rotate/Shift
	                   6. Compare (Equality)
	                   7. Compare (non equality)
	                   8. Move
	                   9. Bit Set, Clear and Test
	                   10. Add
	                   11. Subtract
	                   12. Jump
	
	REQUIREMENTS
	
	          PDP-11
	
	STORAGE - Use all of 4K [words] except 17500 - 17776 (Reserved for boot and
	          absolute loader)
	
	LOADING - Absolute Loader
	
	EXECUTION TIME - 246 min, depending on test - Bell will ring
	 
	STARTING PROCEDURE - Start and Restart at 200
	 
	PRINTOUTS - No
	 
	SWITCH REGISTER OPTIONS - No

The code for "TEST 1 - BRANCH" is not terribly exciting.  Most of its 8Kb length is filled with these
three repeated instructions:

	000210: 060100                 ADD   R1,R0
	000212: 000401                 BR    000216
	000214: 000000                 HALT 

until it reaches this point:

	014202: 005267 000022          INC   014230
	014206: 001006                 BNE   014224
	014210: 012737 000207 177566   MOV   #207,@#177566
	014216: 105737 177564          TSTB  @#177564
	014222: 100375                 BPL   014216
	014224: 000167 163750          JMP   000200
	014230: 000000                 HALT 

where it increments a zero-initialized word.  When the word wraps around to zero again, it will output a BELL
character (with bit 7 set; I'm not sure why) to the machine's display terminal, and then run the test again.  If a
BR instruction fails to branch for some strange reason, then in theory, the machine will fall through to a HALT
instruction, and the test will halt.

### Test 13

	MAINDEC-11-D0MA (NEW NUMBER - DZKAM)
	
	T13
	
	ABSTRACT
	
	This is a test of the JSR, RTS and RTI instructions.  It is also the
	first time the Register 6 has been "PUSHED and POPPED".
	
	REQUIREMENTS
	
	          PDP-11
	
	STORAGE - 0 - 5000
	
	LOADING - Absolute Loader
	
	EXECUTION TIME - 2 min - Bell will ring
	 
	STARTING PROCEDURE - Start and Restart at 200
	 
	PRINTOUTS - No
	 
	SWITCH REGISTER OPTIONS - No

### Test 14

Note that, as the instructions indicate, this test will fail on a PDP-11/45 or newer machine, because
it expects the MUL instruction to trap.

	MAINDEC-11-D0NA (NEW NUMBER - DAKAA)
	
	T14 TRAPS
	
	ABSTRACT
	
	This is a test of all operation and instruction that cause traps.
	Also tested are trap overflow conditions, oddities of register 6,
	interrupts and the reset instructions.
	
	REQUIREMENTS
	
	          PDP-11/20, 11/05, 11/10
	
	STORAGE - 0 - 17500
	
	LOADING - Absolute Loader
	
	EXECUTION TIME - Function or core size - Bell will ring
	 
	STARTING PROCEDURE
	
	          Start and Restart at     200 for a 4K System
	                                   202 for an 8K System
	                                   204 for a 12K System
	                                   206 for a 16K System
	                                   210 for a 20K System
	                                   212 for a 24K System
	                                   214 for a 28K System
	
	PRINTOUTS - No
	 
	SWITCH REGISTER OPTIONS - No
	
	This program should not be used to test 11/40 and 11/45's.

### Test 15

Before loading and running this test on the [PDP-11/20 with Front Panel and Debugger](/devices/pdp11/machine/1120/panel/debugger/),
it's recommended that you also toggle SW-15, as described below, so that the test will HALT on any failure.

	MAINDEC-11-D0OA (NEW NUMBER - DZQKA)
	
	T15 Instruction Exerciser
	
	ABSTRACT
	
	This program is designed to be a comprehensive check of all 11 family
	processor instructions.  The program executed each instruction in all
	address modes and includes tests for traps and the teletype interrupt
	sequence.  The program relocates the test code throughout memory 0-28K.
	
	REQUIREMENTS
	
	          PDP-11 family central processor
	          Optional - KL11-L (line clock)
	
	STORAGE - Program uses all the first 4K of memory (excluding that area
	          of memory reserved for the loaders.)
	
	LOADING - Absolute Loader
	
	EXECUTION TIME - For 4K - 1 min, for 28K - 5 min.
	 
	STARTING PROCEDURE - 200
	
	PRINTOUTS - Yes
	
	SWITCH REGISTER OPTIONS - Yes
	
	SW15 =   .... HALT ON ERROR
	SW14 =   .... LOOP SUBTEST
	SW13 =   .... INHIBIT ERROR PRINTOUT
	SW12 =   .... INHIBIT TRACE TRAPPING
	SW11 =   .... INHIBIT SUBTEST ITERATION
	SW10 =   .... RING BELL ON ERROR
	SW 8 =   .... LOAD PDP-11/45 MICRO BREAK REGISTER
	SW 7-0 = .... WHEN SET LOADS THE MICRO BREAK REGISTER WITH THE VALUE
	              SET INTO SW7-0 AT THE BEGINNING OF EACH SUBTEST
	
	                          NOTE
	                          
	              WHEN ALL SWITCHES ARE DOWN NO TYPEOUTS
	              WILL OCCUR AT THE END OF A PASS (errors
	              will be typed). SETTING SW7 WILL CAUSE
	              END OF PASS MESSAGE TO BE TYPED.

Newer Paper Tape Software (mid-1970s)
-------------------------------------

Thanks to the efforts of person(s) unknown, additional paper tape images have been uploaded to
[bitsavers.org](http://bitsavers.trailing-edge.com/bits/DEC/pdp11/papertapeimages/).  It's not super organized,
so for now, I'm just going to pick out selected tapes and archive them here.

From [bitsavers.org](http://bitsavers.trailing-edge.com/bits/DEC/pdp11/papertapeimages/20040101/), Tray 02:

* Tape 04: [MAINDEC-11-DEQKC-B1-PB 06/12/78; 11/70 cpu instruction; exerciser; (c)1975,76](MAINDEC-11-DEQKC-B1-PB.json)
