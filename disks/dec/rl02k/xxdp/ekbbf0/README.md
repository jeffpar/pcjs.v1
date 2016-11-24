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

	11/70 CPU DIAGNOSTIC PART 2

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

When I first ran this diagnostic in PDPjs, it failed a few tests:

	CEKBBF0 11/70 CPU #2
	A
	SCCE STACK OVERFLOW NOT GOING HIGH OR
	NOT GETTING TO TMCD E31 OR E31 BAD
	ERRORPC TEST NUMBER
	020646  000040
	
	
	CPU UNDER TEST FOUND TO BE A KB11-B/C OR KB11-CM                
	
	TMCA E67(8) NOT GETTING TO E76(13) OR E76 IS BAD
	ERRORPC TEST NUMBER
	026030  000063
	
After setting a breakpoint at 020646 and then dumping the instruction history buffer when it was hit:

	>> bp 020646
	bp 020646 set
	>> g
	bp 020646 hit
	stopped (18110643 instructions, 86218232 cycles, 12936 ms, 6664984 hz)
	R0=177777 R1=032435 R2=152110 R3=000024 R4=153352 R5=001164
	SP=001076 PC=020646 PS=000000 IR=000000 SL=000377 T0 N0 Z0 V0 C0
	020646: 104241                 EMT   241
	>> dh 22 22
	020404: 012767 021136 160656   MOV   #21136,001270          ;history=22
	020412: 012767 020450 160466   MOV   #20450,001106          ;history=21
	020420: 013767 177776 160542   MOV   @#177776,001170        ;history=20
	020426: 032737 000020 177776   BIT   #20,@#177776           ;history=19
	020434: 001405                 BEQ   020450                 ;history=18
	020450: 012737 000340 000006   MOV   #340,@#6               ;history=17
	020456: 012767 020472 160424   MOV   #20472,001110          ;history=16
	020464: 012737 020530 000024   MOV   #20530,@#24            ;history=15
	020472: 012737 020546 000004   MOV   #20546,@#4             ;history=14
	020500: 012706 000336          MOV   #336,SP                ;history=13
	020504: 012700 177777          MOV   #177777,R0             ;history=12
	020510: 010016                 MOV   R0,@SP                 ;history=11
	020546: 023727 000000 020512   CMP   @#0,#20512             ;history=10
	020554: 001407                 BEQ   020574                 ;history=9
	020574: 022737 177777 000336   CMP   #177777,@#336          ;history=8
	020602: 001003                 BNE   020612                 ;history=7
	020612: 012767 020620 160270   MOV   #20620,001110          ;history=6
	020620: 012737 020650 000004   MOV   #20650,@#4             ;history=5
	020626: 012706 177776          MOV   #177776,SP             ;history=4
	020632: 005016                 CLR   @SP                    ;history=3
	020634: 012706 001076          MOV   #1076,SP               ;history=2
	020640: 012737 032636 000004   MOV   #32636,@#4             ;history=1
	020646: 104241                 EMT   241

The closest we have to a source code listing of the EKBBF0 diagnostic comes from some
[scanned microfiche](http://archive.pcjs.org/pubs/dec/pdp11/diags/AH-7968F-MC_CEKBBF0_1170_CPU_2_May80.pdf)
on [bitsavers.org](http://bitsavers.trailing-edge.com/pdf/dec/pdp11/microfiche/ftp.j-hoppe.de/bw/gh/) for:

	PRODUCT CODE: AC-7966F-MC
	PRODUCT NAME: CEKBBF0 11/70 CPU #2
	DATE CREATED: MAY, 1980
	MAINTAINER:   DIAGNOSTIC ENGINEERING

The source code listing for TEST 40 appears to match the code above:

	;;***************************************************************
	;*TEST 40       RED ZONE TRAP
	;*
	;*      A RED ZONE TRAP IS FIRST ATTEMPTED WITH THE SP AT 336.
	;*      IF BEN13 FAILS EXECUTION WILL GO TO EITHER BRK.80 OR BRK.20
	;*      OR PUP.00.
	;*      BRK.80 WILL CAUSE THE OLD PSW AND PC TO BE STACKED ON THE
	;*      OLD STACK INSTEAD OF LOCATIONS 2 AND 0.
	;*      BRK.20 WILL MAKE IT LOOK LIKE THE RED ZONE FAILED.
	;*      PUP.00 WILL CAUSE A TRAP TO LOCATION 24.
	;*
	;*      IF THE PROCESSOR FAILS TO TRAP EITHER TMCD SL RED IS
	;*      NOT GOING LOW OR TMCC ABORT IS NOT GOING LOW.
	;*
	;*      IF UBCB ABOTR RESTART FAILS TO GO LOW OR E10(13)
	;*      IS BAD THE PROCESSOR WILL HANG IN THE PAUSE STATE.
	;;***************************************************************
	TST40:  SCOPE
	        MOV     #TST41,NEXTTST  ;SAVE ADDRESS OF NEXT TEST
	        MOV     #14$,$LPADR     ;SETUP LOOP ADR
	        MOV     @#PSW,$TMP3     ;SAVE PSW
	        BIT     #BIT4,@#PSW     ;IS T BIT ON?
	        BEQ     14$             ;BRANCH IF NO
	        MOV     #PR7,-(SP)      ;PUT NEW PSW ON STACK
	        MOV     #14$,-(SP)      ;PUT RETURN ADR ON STACK
	        RTT                     ;TURN T BIT OFF
	14$:    MOV     #PR7,@#ERRVEC+2 ;RESTORE ERRVEC PSW
	        MOV     #64$,$LPERR     ;SETUP ERROR LOOP
	        MOV     #3$,@#PWRVEC    ;SETUP LOCATION 24
	64$:    MOV     #1$,@#ERRVEC    ;SETUP ERRVEC
	        MOV     #336,SP         ;SET THE SP TO RED ZONE
	        MOV     #-1,R0          ;SETUP R0
	        MOV     R0,(SP)         ;EXECUTE THE TRAP INSTRUCTION
	6$:     MOV     #STACK,SP       ;RESET THE SP
	        MOV     #CPUSPUR,@#ERRVEC   ;RESTORE ERRVEC
	        ERROR   235             ;RED ZONE REFERENCE FAILED TO TRAP
	        BR      8$
	3$:     MOV     #STACK,SP       ;RESET THE SP
			MOV     #CPUSPUR,@#ERRVEC   ;RESTORE LOCATION 4
	        ERROR   237             ;BEN 13 FAILED TO PUP.00
	        BR      8$
	1$:     CMP     @#0,#6$         ;DID BEN 13 FAIL?
			BEQ     7$              ;BRANCH IF NO
			MOV     #STACK,SP       ;RESET THE SP
			MOV     #CPUSPUR,@#ERRVEC   ;RESTORE ERRVEC
			ERROR   240             ;BEN 13 FAILED TO BRK.80
			BR      8$
	7$:     CMP     #-1,@#336       ;;DID YEL ZONE OCCUR?
			BNE     8$              ;BRANCH IF NO
			CLR     @#336           ;SETUP FOR LOOPING
			ERROR   251             ;YEL ZONE IN RED REGION
	;
	;TEST TO ENSURE PSW REFERENCE VIA THE SP CAUSES A RED ZONE TRAP
	8$:     MOV     #63$,$LPERR     ;SETUP ERROR LOOP
	63$:    MOV     #4$,@#ERRVEC    ;SETUP ERRVEC
			MOV     #PSW,SP         ;PUT ADDRESS OF PSW IN SP
			CLR     (SP)            ;EXECUTE THE TRAP CAUSING INSTRUCTION
			MOV     #1076,SP        ;RESET THE SP
			MOV     #CPUSPUR,@#ERRVEC   ;RESTORE ERRVEC
			ERROR   241             ;NO RED ZONE ON STACK OVERFLOW

PDPjs was failing to trigger a RED stack violation on this instruction:

	R0=177777 R1=032435 R2=152110 R3=000024 R4=153352 R5=001164
	SP=177776 PC=020632 PS=000350 IR=000000 SL=000377 T0 N1 Z0 V0 C0
	020632: 005016                 CLR   @SP                    ;cycles=7

so execution fell into `ERROR 241`.  This was resolved by updating the *checkStackLimit1145()* function
in [cpustate.js](/modules/pdp11/lib/cpustate.js) to include stack addresses >= 177776 in the RED stack
overflow range test.
