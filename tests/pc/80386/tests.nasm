;
; This file is designed to run both as a test ROM and as a DOS COM file (hence the "org 0x100"),
; which is why it has a ".com" extension instead of the more typical ".rom" extension.
;
; When used as a ROM, it should be installed at physical address 983296 (0xf0100) and aliased at
; physical address 4294902016 (0xffff0100).  The jump at jmpStart should align with the CPU reset
; address (%0xfffffff0), which will transfer control to 0xf000:0x0100.
;
; The code which attempts to update myGDT and addrGDT will have no effect when installed as a ROM,
; which is fine, because those data structures are predefined with appropriate ROM-based addresses.
;
; See the machine definition file in /modules/pcjs/bin/romtests.json for a sample ROM configuration.
;
; PMODE_32BIT Notes
; -----------------
; PMODE_32BIT is NOT enabled by default, because based on what I've seen in VirtualBox (and notes
; at http://geezer.osdevbrasil.net/johnfine/segments.htm), if CS is loaded with a 32-bit code segment
; while in protected-mode and we then return to real-mode, even if we immediately perform a FAR JMP
; with a real-mode CS, the base and limit of CS will be updated, but other CS attributes, like EXT_BIG,
; will NOT be updated.  As a result, the processor will crash as soon as it starts executing 16-bit
; real-mode code, because it's being misinterpreted as 32-bit code, and there doesn't appear to be
; anything you can do about it from real-mode.
;
; The work-around: switch to a 16-bit code segment BEFORE returning to real-mode.
;
; "Unreal mode" works by setting other segment registers (eg, DS, ES) to 32-bit segments, not CS.
; SS should not be set to a 32-bit segment either, because that causes implicit pushes to use ESP
; instead of SP, even in real-mode.
;
; TODO: Verify that a 80386 cannot successfully return to real-mode when CS contains a 32-bit code segment.
;
	cpu	386
	org	0x100
	section .text

	bits	16

ACC_TYPE_SEG		equ	0x1000
ACC_PRESENT		equ	0x8000
ACC_TYPE_CODE		equ	0x0800
ACC_TYPE_READABLE	equ	0x0200
ACC_TYPE_WRITABLE	equ	0x0200
ACC_TYPE_CODE_READABLE	equ	0x1a00
ACC_TYPE_DATA_WRITABLE	equ	0x1200

EXT_NONE		equ	0x0000
EXT_BIG			equ	0x0040

;
; If we built our data structures in RAM, we might use the first page of RAM (0x0000-0x0fff) like so:
;
;	0x0000-0x03ff	Real-mode IDT (256*4)
;	0x0400-0x0bff	Prot-mode IDT (256*8)
;	0x0c00-0x0cff	RAM_GDT (for 32 GDT selectors)
;	0x0d00-0x0d07	RAM_IDTR
;	0x0d08-0x0d0f	RAM_GDTR
;	0x0d10-0x0d13	RAM_RETF (Real-mode return address)
;	0x0d14-0x0fff	reserved
;
; And in the second page (0x1000-0x1fff), we might build a page directory, followed by a single page table that
; allows us to map up to 4Mb (although we'd likely only create PTEs for the first 1Mb).
;
;RAM_GDT	equ	0x0c00
;RAM_IDTR	equ	0x0d00
;RAM_GDTR	equ	0x0d08
;RAM_RETF	equ	0x0d10

CSEG_REAL	equ	0xf000
CSEG_PROT	equ	0x0008
DSEG_PROT	equ	0x0010

CR0_MSW_PE	equ	0x0001

;
; The "set" macro initializes a register to the specified value (eg, "set eax,0")
;
%macro	set	2
    %ifnum %2
      %if %2 = 0
	xor	%1,%1
      %else
    	mov	%1,%2
      %endif
    %else
    	mov	%1,%2
    %endif
%endmacro

;
; The "defDesc" macro defines a descriptor, given a name (%1), base (%2), limit (%3), type (%4), and ext (%5)
;
%assign	selDesc	0

%macro	defDesc	1-5 none,0,0,0,0
	%assign %1 selDesc
	dw	(%3 & 0x0000ffff)
	dw	(%2 & 0x0000ffff)
    %if selDesc = 0
	dw	((%2 & 0x00ff0000) >> 16) | %4 | (0 << 13)
    %else
	dw	((%2 & 0x00ff0000) >> 16) | %4 | (0 << 13) | ACC_PRESENT
    %endif
	dw	((%3 & 0x000f0000) >> 16) | %5 | ((%2 & 0xff000000) >> 16)
	%assign selDesc selDesc+8
%endmacro

;
; The "setDesc" macro creates a descriptor, given a name (%1), base (%2), limit (%3), type (%4), and ext (%5)
;
%macro	setDesc 1-5 none,0,0,0,0
	%assign %1 selDesc
	set	ebx,%2
	set	ecx,%3
	set	dx,%4
	set	ax,%5
	call	storeDesc
	%assign selDesc selDesc+8
%endmacro

start:	cli
	mov	eax,0x44332211
	mov	ebx,eax
	mov	ecx,0x88776655
	mul	ecx
	div	ecx
	cmp	eax,ebx
	je	near initGDT		; apparently we have to tell NASM "near" because this is a forward reference
	times	32768 nop		; lots of NOPs to force a 16-bit conditional jump
;
; storeDesc(EBX=base, ECX=limit, DX=type, AX=ext, DI=address of descriptor)
;
storeDesc:
	cld
	push	ax
	mov	ax,cx
	stosw				; store the low 16 bits of limit from ECX
	mov	ax,bx
	stosw				; store the low 16 bits of base from EBX
	mov	ax,dx
	shr	ebx,16
	mov	al,bl
	or	ax,ACC_PRESENT
	stosw
	pop	ax
	shr	ecx,16
	and	cl,0xf
	or	al,cl
	mov	ah,bh
	stosw
	ret

addrGDT:dw	myGDTEnd - myGDT - 1	; 16-bit limit of myGDT
	dw	myGDT, 0xffff		; 32-bit base address of myGDT (works as long as we're aliased at 0xffff0000)

;
; TODO: Why do I need to provide a 2nd parameter for "defDesc NULL"? Is this a NASM 0.98.x bug?
;
myGDT:	defDesc	NULL,0			; the first descriptor in any descriptor table is always a dud (it corresponds to the null selector)
    %ifdef PMODE_32BIT
	defDesc	CSEG_PROT,0x000f0000,0x0000ffff,ACC_TYPE_CODE_READABLE,EXT_BIG
	defDesc	DSEG_PROT,0x00000000,0x000fffff,ACC_TYPE_DATA_WRITABLE,EXT_BIG
    %else
	defDesc	CSEG_PROT,0x000f0000,0x0000ffff,ACC_TYPE_CODE_READABLE,EXT_NONE
	defDesc	DSEG_PROT,0x00000000,0x000fffff,ACC_TYPE_DATA_WRITABLE,EXT_NONE
    %endif
myGDTEnd:

initGDT:
    %ifdef RAM_GDT
	set	edi,RAM_GDT
	mov	[RAM_GDTR+2],edi
	setDesc	NULL
	xor	eax,eax
	mov	ax,cs
	shl	eax,4
	setDesc	CSEG_PROT,eax,0x0000ffff,ACC_TYPE_CODE_READABLE,EXT_NONE
	setDesc	DSEG_PROT,0x0,0x000fffff,ACC_TYPE_DATA_WRITABLE,EXT_NONE
	sub	edi,RAM_GDT
	dec	edi
	mov	[RAM_GDTR],di
	mov	word [RAM_RETF],toReal
	mov	word [RAM_RETF+2],cs
    %else
    ;
    ; This code will have no effect if we're in ROM (but in that case, everything should already be initialized correctly)
    ;
    	xor	eax,eax
	mov	ax,cs
	shl	eax,4				; EAX = base address of the current CS
	mov	edx,eax				; save it in EDX
	mov	[cs:myGDT+CSEG_PROT+2],ax	; update the base portions of the descriptor for CSEG_PROT
	shr	eax,16
	mov	[cs:myGDT+CSEG_PROT+4],al
	mov	[cs:myGDT+CSEG_PROT+7],ah
	mov	eax,edx				; recover the base address of the current CS
	add	eax,myGDT			; EAX = physical address of myGDT
	mov	[cs:addrGDT+2],eax		; update the 32-bit base address of myGDT in addrGDT
    %ifdef PMODE_32BIT
	mov	[cs:jmpReal+5],cs		; update the segment of the far jmp that returns us to real-mode
    %else
	mov	[cs:jmpReal+3],cs
    %endif
	mov	[cs:jmpStart+3],cs		; ditto for the far jmp that returns us to the start of the image
    %endif

goProt:	o32 lgdt [cs:addrGDT]
	mov	eax,cr0
	or	eax,CR0_MSW_PE
	mov	cr0,eax
	nop
jmpProt:
	jmp	CSEG_PROT:toProt

toProt:
    %ifdef PMODE_32BIT
	bits	32				; only if we define the CSEG_PROT descriptor with EXT_BIG
    %endif
	mov	ax,DSEG_PROT
	mov	ds,ax
	mov	es,ax
;
; Do some protected-mode tests now...
;
goReal:	mov	eax,cr0
	and	eax,~CR0_MSW_PE
	mov	cr0,eax
	nop
jmpReal:
	jmp	CSEG_REAL:toReal

toReal:
    %ifdef PMODE_32BIT
	bits	16				; only if we define the CSEG_PROT descriptor with EXT_BIG
    %endif
	mov	ax,cs
	cmp	ax,CSEG_REAL			; is CS equal to 0xf000?
	je	near jmpStart			; yes
	int	0x20				; no, so assume we're running under DOS and exit

	;
	; Fill the remaining space with NOPs until we get to target offset 0xFFF0.
	; Note that we subtract 0x100 from the target offset because we're ORG'ed at 0x100.
	;
	times	0xfff0-0x100-($-$$) nop

jmpStart:
	jmp	CSEG_REAL:start

	db	0x20
	db	'04/04/15'
	db	0xFC				; 0000FFFE  FC (Model ID byte)
	db	0x00				; 0000FFFF  00 (location of checksum byte)
