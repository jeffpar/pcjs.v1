---
layout: page
title: "Q35968: CALL SetUEvent in Assembly Routine to Disable PRINT SCREEN"
permalink: /pubs/pc/reference/microsoft/kb/Q35968/
---

## Q35968: CALL SetUEvent in Assembly Routine to Disable PRINT SCREEN

	Article: Q35968
	Version(s): 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 12-JAN-1990
	
	This article provides an example of calling BASIC's SetUEvent routine
	from an assembly-language interrupt routine to disable the screen dump
	performed by the PRINT SCREEN key (found on enhanced IBM keyboards) or
	the SHIFT+PRSCR or SHIFT+PRTSC key (found on earlier, nonenhanced IBM
	PC keyboards).
	
	Special steps must be taken when triggering BASIC's user-defined
	events from assembly-language interrupt routines. Primarily, the
	assembly routine needs to make sure that the DS register points to
	BASIC's default data segment before making the call to SetUEvent.
	Also, the interrupt routine should be disabled before, and re-enabled
	after, a CHAIN or RUN statement. This information applies to Microsoft
	QuickBASIC Versions 4.00b and 4.50, to Microsoft BASIC Compiler
	Versions 6.00 and 6.00b for MS-DOS and MS OS/2, and to Microsoft BASIC
	PDS Version 7.00 for MS-DOS and MS OS/2.
	
	Note: The SetUEvent routine is not provided in QuickBASIC Version 4.00
	or earlier. SetUEvent was introduced in QuickBASIC Version 4.00b and
	the BASIC compiler Version 6.00 and later.
	
	BASIC user-defined interrupts are triggered by a call to SetUEvent.
	This routine can be called from an external assembly routine, usually
	an interrupt handler. However, in QuickBASIC 4.00b, in the BASIC
	compiler 6.00 and 6.00b, and in BASIC PDS 7.00, SetUEvent assumes that
	DS is pointing to BASIC's default data segment; if it isn't, the call
	to SetUEvent will not trigger the BASIC interrupt routine. To ensure
	that DS is pointing to the correct place, save the value of DS in a
	location accessible to the interrupt routine when installing it. Then,
	in the interrupt routine, place that value in DS directly before
	making the call to SetUEvent. In QuickBASIC Version 4.50, you don't
	have to set DS equal to the BASIC Data Segment.
	
	When CHAINing or RUNning other BASIC programs that use the same
	interrupt routine, the first BASIC program must deinstall the
	interrupt handler, CHAIN (or RUN) the second program, and reinstall
	the handler again. The sample program below demonstrates how to
	install, deinstall, and properly CALL SetUEvent in an interrupt
	handler situation.
	
	The following is a BASIC code example:
	
	DECLARE SUB PrScr ()
	DECLARE SUB DeInst ()
	ON UEVENT GOSUB handler
	UEVENT ON
	CALL PrScr
	PRINT "Screen Dump interrupt has been disabled."
	PRINT "Press PRINT SCREEN (or SHIFT+PRTSC) key to trigger event."
	PRINT "Press any other key to end program."
	WHILE i$ = ""
	  i$ = INKEY$
	WEND
	CALL DeInst
	PRINT "Screen Dump interrupt has been re-enabled."
	END
	handler:
	  PRINT "Screen dumps are currently disabled."
	  RETURN
	
	The following is an assembly-language program that redefines the
	interrupt that occurs when you press the PRINT SCREEN (or SHIFT+PRTSC)
	key:
	
	; PRSCR.ASM
	cr      equ     0dh
	lf      equ     0ah
	.model  medium
	.code
	        extrn   SetUEvent:proc
	        public  prscr
	
	tsr_active      db      0
	old_seg         dw      ?
	old_off         dw      ?
	bds             dw      ?
	
	handler proc    far
	      sti
	      push      ax
	      push      bx
	      push      cx
	      push      dx
	      push      si
	      push      di
	      push      bp
	      push      ds
	      push      es                  ;save regs
	        cmp     cs:tsr_active, byte ptr 0  ;are we already up?
	        je      do_int                  ;no, go display message
	        jmp     ex_int                  ;yes, get out!
	
	do_int: mov     cs:tsr_active, byte ptr 1  ;okay, we're up now...
	        mov     ax,bds
	        mov     ds,ax                   ;set DS = BASIC's data segment
	        call    SetUEvent               ;trigger the user event
	        mov     cs:tsr_active, 0        ;re-activate interrupt
	
	ex_int: pop     es
	        pop     ds
	        pop     bp
	        pop     di
	        pop     si
	        pop     dx
	        pop     cx
	        pop     bx
	        pop     ax
	        cli             ; CLI corresponds to STI at Handler beginning.
	        iret
	handler endp
	
	prscr   proc    far
	        push    bp
	        mov     bp, sp
	        push    ds
	        push    es
	        mov     cs:bds,ds               ;put BASIC's DS here
	        mov     ax, 3505h               ;get interrupt vector
	        int     21h                     ;for PrScr
	        mov     cs:old_seg,es
	        mov     cs:old_off,bx           ;save it
	        mov     dx, seg handler
	        mov     ds,dx
	        mov     dx, offset handler      ;reset interrupt 5
	        mov     ax, 2505h               ;to point to handler
	        int     21h
	        pop     es
	        pop     ds
	        pop     bp
	        ret                             ;back to BASIC
	prscr   endp
	
	        public  deinst
	deinst  proc    far                ;to de-install our Prscr interrupt
	        push    bp
	        mov     bp,sp
	        push    ds
	        mov     dx,cs:old_seg
	        mov     ds, dx
	        mov     dx,cs:old_off           ;get old INT 5 vector
	        mov     ax, 2505h
	        int     21h                     ;and restore it
	        pop     ds
	        pop     bp
	        ret
	deinst  endp
	END
