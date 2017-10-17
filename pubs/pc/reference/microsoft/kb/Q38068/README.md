---
layout: page
title: "Q38068: PRINT SCREEN (Hardware Interrupt 5) Fails If Printer Is Busy"
permalink: /pubs/pc/reference/microsoft/kb/Q38068/
---

## Q38068: PRINT SCREEN (Hardware Interrupt 5) Fails If Printer Is Busy

	Article: Q38068
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 12-JAN-1990
	
	If the printer is busy (still working on a print job) when a hardware
	interrupt 5 (PRINT SCREEN) interrupt is issued (such as by pressing
	the SHIFT+PRINT SCREEN or PRINT SCREEN key), the interrupt will not
	dump the screen to the printer. The hardware interrupt 5 checks the
	printer status before continuing, and if the printer is busy, it
	aborts the screen dump.
	
	This information applies to Microsoft QuickBASIC Versions 4.00, 4.00b,
	and 4.50, to Microsoft BASIC Compiler Versions 6.00 and 6.00b for
	MS-DOS, and to Microsoft BASIC PDS 7.00 for MS-DOS. It also applies to
	any language that supports hardware interrupt 5.
	
	If a program sends some information to the printer and then issues an
	interrupt 5 (through CALL INTERRUPT, or an assembly-language program),
	the screen dump may be skipped. If the printer has not finished
	printing the information sent prior to the interrupt 5 call, the
	printer will return "busy" when the print screen interrupt checks the
	printer status.
	
	This may not be a problem running on machines with slower clock speeds
	(4.77, 6 MHz, etc.), but the same code running on a faster machine
	(clock speed 10, 12, 16, 20 MHz, etc.) may fail because the processor
	of the computer may work faster than the printer does.
	
	To guarantee that the printer is not busy before doing a screen dump,
	you can check the printer status yourself. The printer status can be
	obtained by invoking interrupt 17 hex, function 2. The value returned
	in the AH register by this interrupt contains the following
	information corresponding to each bit:
	
	   Bit     Status
	   ---     ------
	
	   7       Printer NOT busy
	   6       Acknowledge
	   5       Out of paper
	   4       Printer selected
	   3       I/O error
	   2       Unused
	   1       Unused
	   0       Timed-out
	
	Below are two sample program listings, one for assembly language, and
	one for BASIC using the CALL INTERRUPT method, that return the printer
	status byte. If the status byte ANDed with 128 is 128, the printer is
	not busy; if it is 0, the printer is busy, and a screen dump at that
	point would fail. Program logic should loop, constantly checking the
	printer status, until the status (AND 128) is 128, and then perform
	the interrupt 5.
	
	For another sample BASIC program using this interrupt, query on the
	following:
	
	   time-out and printer and interrupt and 17 and function and 2
	
	Code Example
	------------
	
	   The assembly listing is as follows:
	
	; Assembled with Microsoft Macro Assembler (MASM) Version 5.x.
	.MODEL  medium
	.CODE
	        public PStat
	PStat   proc    far
	        mov ah, 2
	        mov     dx,0                    ;printer # 0
	        int     17h
	        mov al, ah
	        mov     ah,0                    ;one byte return value
	        ret
	PStat endp
	END
	
	   The BASIC listing is as follows:
	
	REM $INCLUDE: 'QB.BI'
	REM For PDS 7.00, you must include QBX.BI
	FUNCTION PStat% STATIC
	  DIM Regs AS RegType
	  Regs.AX = &H200
	  Regs.DX = 0                           'printer # 0
	  CALL INTERRUPT(&H17, Regs, Regs)
	  PStat% = Regs.AX \ 256                'status = AH
	END FUNCTION
