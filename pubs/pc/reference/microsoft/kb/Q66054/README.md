---
layout: page
title: "Q66054: How to Create Overlays with Macro Assembler"
permalink: /pubs/pc/reference/microsoft/kb/Q66054/
---

## Q66054: How to Create Overlays with Macro Assembler

	Article: Q66054
	Version(s): 5.10 5.10a
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 12-NOV-1990
	
	The following code illustrates the creation of an overlay with an
	assembly module. The first procedure _main in the root module calls
	the procedure rt2 in the overlaid module.
	
	It is possible to create overlays while linking with the medium- and
	large-memory model libraries.
	
	The Overlay Manager is a part of a higher-level language's run-time
	library (C for instance). While linking, this library must be used if
	the code for the Overlay Manager is to be linked with the program.
	
	Page 285 of the "Microsoft Macro Assembler 5.1 CodeView and Utilities
	Guide" explains the use of overlays with assembly-language modules.
	Only modules with a 32-bit (long) call/ret instruction can be
	overlaid. Routines called should be declared as FAR. The linker is
	unable to produce overlay modules that can be called indirectly with
	function pointers. The root module is the resident (nonoverlaid)
	portion of the program, and the overlaid module is the transient
	portion.
	
	There are two segments created by the linker. The Overlay_Area and the
	Overlay_Data. The size of the Overlay_Area (class "code") is
	determined by the Overlay_End statement that points to the end of the
	Overlay_Area segment. The Overlay_Data is placed in DGROUP. The two
	segments can be viewed in a MAP file.
	
	LINK sets the Overlay_Area to fit the largest overlay. Only the code
	is overlaid. The Overlay_Data is initialized by LINK with information
	about the executable file and information useful to the run-time
	Overlay Manager (for example, number of overlays).
	
	LINK replaces all FAR calls from root to overlay, or overlay to
	overlay with the following information:
	
	1. A software interrupt (usually INT 3FH, which can be overridden
	   the /OVERLAYINTERRUPT option on the LINK line).
	
	2. The overlay number.
	
	3. The offset into the overlay segment.
	
	This information provides the overlay manager with a mechanism to do
	the following:
	
	1. Load a specified overlay into memory.
	
	2. Transfer control to a specified offset within an overlay.
	
	If you need to modify the behavior of the Overlay Manager, the source
	code is available as part of the Microsoft C run-time source code,
	which can be ordered through Microsoft Sales and Service by calling
	(800) 426-9400.
	
	Code Example
	------------
	
	;main module      (1.asm)
	
	assume cs:cseg,ds:dseg,ss:sseg
	
	DSEG segment word public
	line02  db 'In the Root module'
	        db (13)         ;CR
	        db (10)         ;LF
	        db (36)         ;$ String Terminator
	DSEG ends
	
	EXTRN rt2:far
	
	cseg segment byte public
	public _main            ;necessary as the run-time library
	                        ;following the entry point at _astart
	                        ;calls _main (in C startup module crt0.asm)
	_main   proc   FAR
	   mov  ax,DSEG
	   mov  ds,ax
	   mov  ah,09           ;String output Function 09H
	   mov  dx,seg line02
	   mov  ds,dx
	   mov  dx,offset line02
	   int  21h             ;Invoking DOS Interrupt 21H
	
	   call rt2             ;Call to the Overlay Procedure
	   mov  ah,4Ch          ;Function 4CH return to DOS
	   int  21h
	_main   endp
	
	cseg ends
	
	sseg segment stack
	        db 20 dup (0)
	sseg ends
	   end
	
	------------------------------------
	;overlaid module  (2.asm)
	
	;assume cs:c1seg,ds:d1seg
	
	D1SEG segment word public
	line03  db 'In the Overlaid module'
	        db (13)
	        db (10)
	        db (36)
	D1SEG ends
	
	public rt2
	c1seg segment byte public
	
	rt2   proc   FAR
	   mov  ax,D1SEG
	   mov  ds,ax
	   mov  ah,09
	   mov  dx,seg line03
	   mov  ds,dx
	   mov  dx,offset line03
	   int  21h
	   ret
	rt2   endp
	
	c1seg ends
	   end
	
	------------------------------------
	
	The following are commands to assemble and link:
	
	MASM /MX 1.asm;
	MASM /MX 2.asm;
	LINK /NOI /NOD 1.obj + (2.obj),,,slibcer;
	
	Notes
	-----
	
	Consider the following:
	
	1. Either use Segmented Linker version 5.01.20 or later, or OverLay
	   Linker version 3.64 or later.
	
	2. Use the appropriate run-time library from C version 6.00 and C
	   versions 5.x (medium or large).
	
	3. Use /MX and /NOI to preserve case sensitivity.
	
	Output from .EXE occurs in the following:
	
	1. In the Root module
	
	2. In the Overlaid module
