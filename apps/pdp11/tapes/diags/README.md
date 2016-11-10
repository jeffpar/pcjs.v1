---
layout: page
title: Diagnostic Paper Tape Images
permalink: /apps/pdp11/tapes/diags/
---

Diagnostic Paper Tape Images
----------------------------

Thanks to the [iamvirtual.ca](http://iamvirtual.ca/collection/systems/mediadoc/mediadoc.html#papertape) website,
we have archived a number of PDP-11 diagnostics:

* ![MAINDEC-11-D0AA-PB (MAR/70): TEST 1 - BRANCH](MAINDEC-11-D0AA-PB.jpg)
* ![MAINDEC-11-D0BA-PB (MAR/70): TEST 2 - COND BRANCH](MAINDEC-11-D0BA-PB.jpg)
* ![MAINDEC-11-D0CA-PB (MAR/70): TEST 3 - UNARY](MAINDEC-11-D0CA-PB.jpg)
* ![MAINDEC-11-D0DA-PB (MAR/70): TEST 4 - UNARY+BINARY](MAINDEC-11-D0DA-PB.jpg)
* ![MAINDEC-11-D0EA-PB (MAR/70): TEST 5 - ROTATE+SHIFT](MAINDEC-11-D0EA-PB.jpg)
* ![MAINDEC-11-D0FA-PB (MAR/70): TEST 6 - COMPARE](MAINDEC-11-D0FA-PB.jpg)
* ![MAINDEC-11-D0GA-PB (MAR/70): TEST 7 - COMPARE NOT](MAINDEC-11-D0GA-PB.jpg)
* ![MAINDEC-11-D0HA-PB (MAR/70): TEST 8 - MOVE](MAINDEC-11-D0HA-PB.jpg)
* ![MAINDEC-11-D0IA-PB (MAR/70): TEST 9 - BIS+BIC+BIT](MAINDEC-11-D0IA-PB.jpg)
* ![MAINDEC-11-D0JA-PB (MAR/70): TEST 10 - ADD](MAINDEC-11-D0JA-PB.jpg)
* ![MAINDEC-11-D0KA-PB (MAR/70): TEST 11 - SUBTRACT](MAINDEC-11-D0KA-PB.jpg)
* ![MAINDEC-11-D0LA-PB (MAR/70): TEST 12 - JUMP](MAINDEC-11-D0LA-PB.jpg)

The above tapes have been added to the [Default PC11 Configuration](/devices/pdp11/pc11/), so that you can load
them in machines such as this [PDP-11/70](/devices/pdp11/machine/1170/panel/debugger/). 

As noted for other [DEC PDP-11 Tape Images](/apps/pdp11/tapes/), any "Absolute Format" tape (which should include
all the tapes listed above) can be loaded directly into RAM using the machine's "Load" button instead of "Attach".
In most cases, this eliminates the first two steps.

Instructions for Running Diagnostics
------------------------------------

Instructions for running "TEST 1 - BRANCH" through "TEST 12 - JUMP" come from the
[MAINDEC USER REFERENCE MANUAL, OCTOBER 1973](http://archive.pcjs.org/pubs/dec/pdp11/diags/MAINDEC_User_Reference_Manual_Oct73.pdf),
p. 19:

	MAINDEC-11-D0AA to D0LA (NEW NUMBER - DZKAA to DZKAL)
	
	T1 to T12
	
	ABSTRACT
	
	This is a group of 12 tests that incrementally test and isolate simple malfunctions of
	the PDP-11. The tests should be run in the indicated numerical sequence. The sequence is:
	
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
	
	STORAGE - Use all of 4K [words] except 17500 - 17776 (Reserved for boot and absolute loader)
	
	LOADING - Absolute Loader
	
	EXECUTION TIME - 246 min, depending on test - Bell will ring
	 
	STARTING PROCEDURE - Start and Restart at 200
	 
	PRINTOUTS - No
	 
	SWITCH REGISTER OPTIONS = No

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

Newer Paper Tape Software (mid-1970s)
-------------------------------------

Thanks to the efforts of person(s) unknown, additional paper tape images have been uploaded to
[bitsavers.org](http://bitsavers.trailing-edge.com/bits/DEC/pdp11/papertapeimages/).  It's not super organized,
so for now, I'm just going to pick out selected tapes and archive them here.

From [bitsavers.org](http://bitsavers.trailing-edge.com/bits/DEC/pdp11/papertapeimages/20040101/), Tray 02:

* Tape 04: [MAINDEC-11-DEQKC-B1-PB 06/12/78; 11/70 cpu instruction; exerciser; (c)1975,76](MAINDEC-11-DEQKC-B1-PB.json)
