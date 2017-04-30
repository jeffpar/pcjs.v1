---
layout: page
title: PDP-10 KA10 Diagnostics
permalink: /apps/pdp10/diags/ka10/
---

PDP-10 KA10 Diagnostics
-----------------------

PCjs has archived selected files from the "KLAD Diagnostic Sources" located at the
[PDP-10 KLAD Diagnostics Sources](http://pdp-10.trailing-edge.com/klad_sources/index.html) and turned them into
stand-alone PDP-10 diagnostics, using the new PCjs [MACRO-10 Mini-Assembler](/modules/pdp10/lib/macro10.js).

Lists of supported [diagnostics](#list-of-ka10-diagnostics) and [reliability tests](#list-of-ka10-reliability-tests)
are provided below, as well as some [notes](#notes-on-ka10-diagnostics) on assembling the diagnostics. 

All the files below presumably came from this "[23.15 Mbyte compressed tape image](http://pdp-10.trailing-edge.com/tapes/klad_sources.tap.bz2)"
which is described on the [PDP-10 KLAD Diagnostics Sources](http://pdp-10.trailing-edge.com/klad_sources/index.html) page as:

	Start of Saveset Diagnostics -- binaries and documentation on 
    
    strange monitor 0(0) APR#8210
    
    0 BPI 9-track 13-Dec-100 1:03:45 BACKUP 0(0) tape format 1
    
    Tape number 1

The original 23.15 Mbyte file looked like this:

    -rw-------@ 1 Jeff  staff  23148930 Feb  3  2002 klad_sources.tap.bz2

and `bzip2 -d klad_sources.tap.bz2` produced this:

    -rw-------@ 1 Jeff  staff  139719984 Feb  3  2002 klad_sources.tap



List of KA10 Diagnostics
------------------------

The following list of KA10 Diagnostics is not comprehensive.  It's simply a list of diagnostics archived and tested with PDPjs
so far.

- [KA10 Basic Instruction Diagnostic #1 (MAINDEC-10-DAKAA)](dakaa/)
	- TEST OF JUMP, JUMPA AND SKIPX INSTRUCTIONS
    - TEST OF MOVE, SKIP AND COMPARE INSTRUCTIONS
    - TEST OF SKIP, FULL WORD TRANSFER AND HALF WORD TRANSFER INSTRUCTIONS
    - TEST OF BOOLEAN INSTRUCTIONS (SETM, SETZ, AND, XOR, EQV)
- [KA10 Basic Instruction Diagnostic #2 (MAINDEC-10-DAKAB)](dakab/)
	- TEST OF THE ADD INSTRUCTION
	- SPECIAL KI10 FOUR BIT ADDER TEST
	- TEST OF SUB AND COMPARE INSTRUCTIONS
	- TEST OF COMPARE (CAMX) INSTRUCTIONS
	- TEST OF MOVS INSTRUCTION
	- TEST OF COMPARE (CAXX) INSTRUCTIONS
	- TEST OF BOOLEAN INSTRUCTIONS
	- TEST OF MOVN INSTRUCTION
	- TEST OF MOVM INSTRUCTION
- [KA10 Basic Instruction Diagnostic #3 (MAINDEC-10-DAKAC)](dakac/)
	- TEST OF LOGICAL TEST INSTRUCTIONS
	- TEST OF HWT INSTRUCTIONS
	- SUPPLEMENTARY ADDER TESTS - FLT 1 + 0
	- SUPPLEMENTARY ADDER TESTS - O + FLT 0
	- SUPPLEMENTARY ADDER TESTS - FLT 1 + FLT 1
	- SUPPLEMENTARY ADDER TESTS - FLT 0 + 0FLT
- [KA10 Basic Instruction Diagnostic #4 (MAINDEC-10-DAKAD)](dakad/)
	- TEST OF AC HARDWARE AND INDEX REGISTERS
	- TEST OF INDEX REGISTER ADDRESSING
	- TEST OF EXCH INSTRUCTION
	- TEST OF MOVEM INSTRUCTION
	- TEST OF JFCL INSTRUCTION AND ARITHMETIC FLAGS
	- TEST OF JRST INSTRUCTION AND ARITHMETIC FLAGS
	- TEST OF JSP INSTRUCTION
	- TEST JRST INSTRUCTION
	- TEST OF AOBJX INSTRUCTIONS
	- TEST SETTING OF ARITHMETIC FLAGS VIA MOVNX AND MOVMX
	- TEST OF AOS AND SOS INSTRUCTIONS
	- TEST OF INTERACTION OF JFCL, JRST, AND JSP WITH ARITHMETIC FLAGS
	- TEST OF JUMPX INSTRUCTIONS
	- TEST OF AOJ AND SOJ INSTRUCTIONS
	- TEST OF MEMORY, BOTH AND SELF MODE INSTRUCTIONS
	- XCT INSTRUCTION - BASIC TESTS
	- INDIRECT ADDRESSING - BASIC TESTS
	- TEST INDIRECT ADDRESSING WITH INDEXING
- [KA10 Basic Instruction Diagnostic #5 (MAINDEC-10-DAKAE)](dakae/)
	- TEST OF JSR INSTRUCTION
	- TEST OF JSA INSTRUCTION
	- TEST OF JRA INSTRUCTION
	- TESTS OF BIS FLAG
	- TEST OF MSCL FWT INSTRUCTIONS
	- TEST OF MSCL ADD/SUB INSTRUCTIONS
	- TEST OF MSCL CAIX INSTRUCTIONS
	- TEST OF MSCL CAMX INSTRUCTIONS
	- TEST OF MSCL JUMPX INSTRUCTIONS
	- TEST OF MSCL AOJX INSTRUCTIONS
	- TEST OF MSCL AOSX INSTRUCTIONS
	- TEST OF MSCL SOJX INSTRUCTIONS
	- TEST OF MSCL SOSX INSTRUCTIONS
- [KA10 Basic Instruction Diagnostic #6 (MAINDEC-10-DAKAF)](dakaf/)
	- TEST OF MSCL BOOLEAN INSTRUCTIONS
	- TEST OF MSCL HWT INSTRUCTIONS
	- TEST OF MSCL LOGICAL TEST INSTRUCTIONS
- [KA10 Basic Instruction Diagnostic #7 (MAINDEC-10-DAKAG)](dakag/)
	- TEST OF PUSH INSTRUCTION
	- TEST OF PUSHJ INSTRUCTION
	- TEST OF POP INSTRUCTION
	- TEST OF POPJ INSTRUCTION
	- XCT INSTRUCTION - ADDITIONAL TESTS
	- TEST XCT INSTRUCTION WITH INDIRECT ADDRESSING AND INDEXING
	- TEST OF SHIFT/ROTATE INSTRUCTIONS USED IN THE ERROR HANDLER
- [KA10 Basic Instruction Diagnostic #8 (MAINDEC-10-DAKAH)](dakah/)
	- TESTS OF PI, INTERRUPTS, LUUO'S, I/O
- [KA10 Basic Instruction Diagnostic #9 (MAINDEC-10-DAKAI)](dakai/)
	- TESTS OF LOGICAL SHIFT, ROTATE, ARITHMETIC SHIFT; SINGLE AND COMBINED
- [KA10 Basic Instruction Diagnostic #10 (MAINDEC-10-DAKAJ)](dakaj/)
	- TESTS OF LOGICAL SHIFT, ROTATE, ARITHMETIC SHIFT; SINGLE AND COMBINED
- [KA10 Basic Instruction Diagnostic #11 (MAINDEC-10-DAKAK)](dakak/)
	- TESTS OF MULTIPY, INTERGER MULTIPLY, DIVIDE, INTERGER DIVIDE*
- [KA10 Basic Instruction Diagnostic #12 (MAINDEC-10-DAKAL)](dakal/)
	- TESTS THE MULTIPY, INTERGER MULIPLY, DIVIDE AND INTERGER DIVIDE INSTRUCTIONS*
- [KA10 Basic Instruction Diagnostic #13 (MAINDEC-10-DAKAM)](dakam/)
	- TESTS THE BYTE, BLOCK TRANSFER AND JFFO INSTRUCTIONS

*Gotta love those multipy, interger muliply, and interger divide tests! -JP

List of KA10 Reliability Tests
------------------------------

Like the diagnostics above, the following list of KA10 Reliability Tests are simple those tests that have been
archived and tested with PDPjs so far.

- [KA10 Basic Instruction Reliability Test #1 (MAINDEC-10-DAKBA)](dakba/)
	- COMPARES, SKIPS, EXCHANGES, BOOLE, ROTATES, TESTS

Notes on KA10 Diagnostics
-------------------------

It's possible to assemble some of the above diagnostics from the original (unmodified) source files.  For example,
you can go to the [DAKAK Diagnostic](dakak/) page and enter the following Debugger command:

	a 'DAKAKT.MAC;../PARAM.KLM;../FIXED.KLM;DAKAKM.MAC;../UUOERR.KLM;../STOR.KLM'

However, while the MACRO-10 assembly process appears to work:

	loading DAKAKT.MAC
	loading PARAM.KLM
	loading FIXED.KLM
	loading DAKAKM.MAC
	loading UUOERR.KLM
	loading STOR.KLM
	6301 words loaded at 000137-044630, start address 030000
	00=000000000000 01=000000000000 02=000000000000 03=000000000000 
	04=000000000000 05=000000000000 06=000000000000 07=000000000000 
	10=000000000000 11=000000000000 12=000000000000 13=000000000000 
	14=000000000000 15=000000000000 16=000000000000 17=000000000000 
	PC=030000 RA=00000000 EA=000000 PS=000000 OV=0 C0=0 C1=0 ND=0 PD=0 
	030000: 254020 027776  JRST    @27776

there are additional modules that must be loaded into the machine as well, which are not yet supported.  So it's best
to assemble the modified files that have been placed inside each diagnostic's folder.  For the [DAKAK Diagnostic](dakak/),
that's **DAKAK.MAC**: 

	>> a DAKAK.MAC
	loading DAKAK.MAC
	5849 words loaded at 000137-044133, start address 030621
	00=000000000000 01=000000000000 02=000000000000 03=000000000000 
	04=000000000000 05=000000000000 06=000000000000 07=000000000000 
	10=000000000000 11=000000000000 12=000000000000 13=000000000000 
	14=000000000000 15=000000000000 16=000000000000 17=000000000000 
	PC=030621 RA=00000000 EA=000000 PS=000000 OV=0 C0=0 C1=0 ND=0 PD=0 
	030621: 254000 030622  JRST    30622

If the machine is able to run to the end of the diagnostic (which can be located by looking at the diagnostic's original
MACRO-10 listing file) without stopping on an UUO opcode, then the diagnostic likely succeeded.
