---
layout: page
title: "Q65926: How PutCopyBox Determines Window Size in 7.00/7.10 UI ToolBox"
permalink: /pubs/pc/reference/microsoft/kb/Q65926/
---

## Q65926: How PutCopyBox Determines Window Size in 7.00/7.10 UI ToolBox

	Article: Q65926
	Version(s): 7.00 7.10
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900924-84
	Last Modified: 8-NOV-1990
	
	The User-Interface (UI) ToolBox uses three assembler routines to "Get
	a window from the screen" (GetCopyBox), "Put a window to the screen"
	(PutCopyBox), and "Change the attributes of a window" (AttrBox). The
	source code for these three assembler routines are located in the
	UIASM.ASM file.
	
	GetCopyBox and PutCopyBox are complimentary routines, except for the
	parameters that they use. GetCopyBox needs five parameters; four to
	define the rectangle of the window and one for the string to store the
	information. PutCopyBox uses only three parameters; two for the
	upper-left corner and one for the string where the information will
	come from.
	
	PutCopyBox determines the size of the rectangle by the window width
	and window height stored in the first four bytes of the string.
	GetCopyBox stores this information in the string as the first four
	bytes, then places the contents of the window following the height and
	width of the window.
	
	The window width is the first two bytes and the window height is the
	next two bytes.
	
	This information applies to Microsoft BASIC Professional Development
	System (PDS) versions 7.00 and 7.10 for MS-DOS.
	
	The following is an extraction of code from UIASM.ASM used by the UI
	ToolBox routines to preserve and restore a window on the screen.
	
	The sections of code listed below that refer to "si,offset" are moving
	the data from memory to the string. The references to "di,offset" are
	moving the data from the string to memory.
	
	Sample Code
	-----------
	
	get_setstr:
	        mov     al,x1
	        sub     al,x0                   ;find width of box
	        mov     bwidth,al               ;and save
	        add     al,1                    ;add one to width
	        mov     ah,0                    ;to find # words to move
	        mov     movword,ax              ;MovWord = (width+1)
	        mov     al,y1
	        sub     al,y0                   ;find height of box
	        mov     height,al               ;and save
	        mov     es,strdseg
	        mov     di,strdoff              ;string is the destination
	
	        ; Place the Windows Width in the first word of the string
	        ; The first and second bytes of the string
	
	        mov     si,offset bwidth        ;point to width
	        movsb                           ;put width in string
	
	        ; Place the Windows Height in the second word of the string
	        ; The third and fourth bytes of the string
	
	        mov     si,offset height
	        movsb                           ;and the height, too
	
	put_setstr:
	        push    ds
	        pop     es                      ;equate ES to DS
	
	        mov     si,strdoff              ;point DS:SI to string mem
	        push    ds
	        mov     ds,strdseg
	
	        ; Get the Windows Width from the string
	
	        mov     di,offset bwidth
	        movsb                           ;get width
	
	        ; Get the Windows Height from the string
	
	        mov     di,offset height
	        movsb                           ;and height out of string
	
	        pop     ds
