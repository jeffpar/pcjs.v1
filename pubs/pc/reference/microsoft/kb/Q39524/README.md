---
layout: page
title: "Q39524: TSR in Assembly"
permalink: /pubs/pc/reference/microsoft/kb/Q39524/
---

## Q39524: TSR in Assembly

	Article: Q39524
	Version(s): 5.00 5.10
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 12-JAN-1989
	
	Terminate and stay resident (TSR) programs consist of RAM-resident and
	transient portions. When a TSR is executed, the transient portion
	initializes data and installs the interrupt handlers; the transient
	portion only takes place once. On exit, the transient code executes a
	MS-DOS TSR function to leave the RAM-resident portion in memory. The
	RAM-resident portion of the code is now ready and waiting to be
	invoked.
	
	Typically a TSR is invoked by another program by a sequence of
	keystrokes, or by a system interrupt. The following is an example of a
	TSR that displays the system time in the upper-right corner of the
	screen. During the transient portion, the TSR replaces the
	system-timer interrupt code with its own code and saves the old
	address so the original system-timer interrupt can be invoked by the
	new code. The system-timer interrupt occurs approximately 19 times a
	second, and is required for the system to execute correctly. The
	RAM-resident portion of the TSR first invokes the original
	system-timer interrupt, then calls Interrupt 1AH function 02H to
	obtain the current time. The time is then displayed in the upper-right
	corner of the screen.
	
	The following sample program demonstrates this behavior:
	
	_text   segment para public 'CODE'
	        org     100h
	        .286                    ; Used for PUSHA and POPA intstuctions
	                                ; If 8086 you will need to explictly
	                                ; push all the registers on the stack
	        assume  cs:_text,ds:_text
	start:
	        jmp     initialize
	old_timer       dd  ?           ; space for old timer vector
	timer_int       proc    far
	        sti                     ; enable interupts
	        assume  ds:nothing
	        pushf                   ; put flags on stack
	        call    old_timer
	        push    ax              ; save registers
	        push    cx
	        push    dx
	        mov     ah,02h
	        int     1ah             ; get time  Returns:
	                                ; ch = hours in BCD
	                                ; cl = minutes in BCD
	                                ; dh = seconds in BCD
	                                ; dl  ignored
	        call    print_drv       ; call time to read time
	        pop     dx
	        pop     cx
	        pop     ax              ; restore registers
	        iret
	timer_int       endp
	
	print_drv       proc    near
	        assume  cs:_text,ds:_text
	        pusha                   ; Save registers
	        push    es              ; Save Segment registers
	        push    ds
	        mov     bx,cs
	        mov     ds,bx           ; data seg = code seg
	        call    getpos
	        push    bx              ; save cursor on stack
	        mov     bx,41h
	        call    setpos          ; move cursor to right hand corner
	        call    display_time
	        pop     bx
	        call    setpos          ; restore cursor
	        pop     ds              ; restore Segment registers
	        pop     es              ; restore registers
	        popa
	        ret
	print_drv       endp
	
	display_time proc near
	        assume cs:_text,ds:_text
	        push   ax
	        push   bx
	        push   cx
	        push   si
	        mov    ax,cs           ; Data Seg = Code Seg
	        mov    ds,ax
	;   Output hours
	        mov        bx,cx       ; move hours to bx
	        mov        al,bh
	        mov        cl,4        ; Set shift count to 4
	        shr        ax,cl       ; rotate to low nybble
	        and        ax,000FH    ; Mask out all but low nybble
	        mov        si,ax       ; Use low nybble as index into
	        mov        al,byte ptr asciitab  [si] ; asciitable
	        call       dchar       ; print 1st digit of hours
	        mov        al,bh
	        and        ax,000FH    ; Mask out all but low nybble
	        mov        si,ax       ; Use low nybble as index into
	        mov        al,byte ptr asciitab  [si] ; asciitable
	        call       dchar
	        call       dcolon
	
	;   Output Minutes
	        mov        al,bl        ; move hours to bx
	        mov        cl,4         ; Set shift count to 8
	        shr        ax,cl        ; rotate to low nybble
	        and        ax,000FH     ; Mask out all but low nybble
	        mov        si,ax        ; Use low nybble as index into
	        mov        al,byte ptr asciitab  [si] ; asciitable
	        call       dchar        ; print 1st digit of hours
	        mov        al,bl
	        and        ax,000FH     ; Mask out all but low nybble
	        mov        si,ax        ; Use low nybble as index into
	        mov        al,byte ptr asciitab  [si] ; asciitable
	        call       dchar        ; print 1st digit of hours
	        call       dcolon
	
	;   Output Seconds
	        mov        al,dh        ; move hours to bx
	        mov        cl,4         ; Set shift count to 4
	        shr        ax,cl        ; rotate to low nybble
	        and        ax,000FH     ; Mask out all but low nybble
	        mov        si,ax        ; Use low nybble as index into
	        mov        al,byte ptr asciitab  [si] ; asciitable
	        call       dchar        ; print 1st digit of hours
	        mov        al,dh
	        and        ax,000FH     ; Mask out all but low nybble
	        mov        si,ax        ; Use low nybble as index into
	        mov        al,byte ptr asciitab  [si] ; asciitable
	        call       dchar
	
	        pop     si
	        pop     cx
	        pop     bx
	        pop     ax
	        ret
	display_time endp
	
	; Get the current cursor position and return it in BX
	getpos  proc    near
	        push    ax
	        push    cx
	        push    dx
	
	        mov     ah,03h
	        mov     bh,0    ; page zero
	        int     10h
	        mov     bx,dx   ; Return the positon in BX
	
	        pop     dx
	        pop     cx
	        pop     ax
	        ret
	getpos  endp
	
	; Set the current cursor postion to the vaule in BX
	setpos  proc    near
	        push    ax
	        push    bx
	        push    dx
	
	        mov     ah,02h  ; use int 10h function 2 to set cursor position
	        mov     dx,bx
	        mov     bh,0
	        int     10h
	
	        pop     dx
	        pop     bx
	        pop     ax
	        ret
	setpos endp
	
	dcolon  proc near
	        mov     al,':'
	        call    dchar
	        ret
	dcolon  endp
	
	; Display the character contained in Al
	dchar   proc near
	        push    ax
	        push    bx
	        mov     bh,1
	        mov     ah,0eh
	        int     10h
	        pop     bx
	        pop     ax
	        ret
	dchar   endp
	
	asciitab:     db      '0123456789',0
	; The following section  of code executes during initial program
	; execution.
	initialize:
	                assume ds:_text
	                mov bx,cs               ; data_seg = code_seg
	                mov ds,bx
	
	                mov     al,08h          ; get vector of interrupt timer
	                mov     ah,35h          ;
	                int     21h
	                mov     word ptr old_timer, bx ; save vector
	                mov     word ptr old_timer[2],es
	
	                mov     dx,offset timer_int
	                mov     al,08h
	                mov     ah,25h          ; replace system interrupt
	                int     21h             ; with our timer_int
	
	                mov     dx,offset initialize  ; terminate and stay resident
	                int     27h                   ; int 21h would work
	_text   ends
	        end start
