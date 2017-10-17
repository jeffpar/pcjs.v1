---
layout: page
title: "Q31573: QuickBASIC/MASM Programs in &quot;PC Magazine&quot; Incorrect"
permalink: /pubs/pc/reference/microsoft/kb/Q31573/
---

## Q31573: QuickBASIC/MASM Programs in &quot;PC Magazine&quot; Incorrect

	Article: Q31573
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 28-DEC-1989
	
	The sample QuickBASIC and MASM programs discussed in "PC Magazine"
	October 13, 1987, on Pages 389-399 will not correctly work with
	QuickBASIC Version 4.00.
	
	The modified programs are as follows:
	
	   === QP.BAS ===
	
	   'QPrint.Bas - quick print demonstration for QuickBASIC
	
	   Test$ = STRING$(20 * 80, "X")              'make a long string
	   Colr% = 7
	   LOCATE 1, 1
	   CALL QPrint(Test$, Colr%)
	
	   === QP.ASM ===
	
	   ;QPRINT.ASM - performs Quick Printing in the QuickBASIC
	   ;Note: Assemble this with MASM (2.00 or later)
	   ;Copyright 1987, Ziff Communications Co.
	
	   Code        Segment Byte Public 'Code'
	               Assume  CS:Code
	               Public  QPrint
	
	   QPrint      Proc    Far
	
	   Begin:      Push  BP         ;save registers for BASIC
	               MOV   BP,SP      ;* ADD THIS LINE
	               PUSH  DS         ;* ADD THIS LINE
	               PUSH  ES         ;* ADD THIS LINE
	
	               Mov   AH,3       ;specify BIOS service to read cursor position
	               Mov   BH,0       ;on text page zero
	               Int   10h        ;this service returns row/column in DH/DL
	
	               Mov   AL,DH      ;put the current row number into AL
	               Mov   CL,160     ;multiply by 160 to get start address of row
	               Mul   CL         ;do the multiplication, answer ends up in AX
	               Mov   DH,0       ;clear DH for the Add below, we only want DL
	               Add   AX,DX      ;add the column once for the character byte
	               Add   AX,DX      ;and once more for the attribute byte
	               Mov   DI,AX      ;now DI holds starting address on the screen
	
	               Xor   DX,DX      ;zero out DX to look at low memory using ES
	               Mov   ES,DX
	               Mov   BX,0B000h     ;assume the mono screen segment for now
	               Mov   AL,ES:[463h]  ;look at the video controller port address
	               Cmp   AL,0B4h     ;is it mono?
	               JZ    Get_Params ;yes, skip over adding 800h to video segment
	               Add   BX,800h    ;no, adjust BX for a color monitor
	               Push  BX         ;and save it because the EGA test destroys BX
	
	               Mov   AH,12h     ;specify EGA BIOS EGA special function servic
	               Mov   BL,10h     ;request EGA information
	               Int   10h        ;call the BIOS
	               Cmp   BL,10h     ;if BL is still 10h, there's no EGA
	               JNZ   EGA        ;it is an EGA, skip ahead
	               Mov   DX,3DAh    ;not EGA, specify port to check for retrace
	
	   EGA:        Pop   BX         ;get the video segment again
	
	   Get_Params: ;* Mov   BP,SP   ;get stack pointer so you can find variables
	               Mov   ES,BX      ;move whatever segment is correct into ES
	
	               Mov   SI,[BP+06] ;get the color that was passed
	               Mov   AH,[SI]    ;and put it into AH for screen writing below
	               Mov   SI,[BP+08] ;put descriptor to X$ into SI
	               Mov   CX,[SI]    ;put Len(X$) into CX for loop counter
	               JCXZ  Exit       ;if CX is zero it's a null string, exit now
	               Mov   SI,[SI+02] ;put address of first character in X$ into SI
	               Cld              ;clear the direction flag to move data forwar
	
	   Check_Mon:  Cmp   DL,0       ;are we on a mono or EGA system?
	               JZ    Mono       ;yes, skip over the retrace stuff
	
	   No_Retrace: In    AL,DX      ;get the video status byte from port number D
	               Test  AL,1       ;test just the horizontal retrace bit
	               JNZ   No_Retrace ;if doing a retrace, wait until it's not
	
	   Retrace:    In    AL,DX      ;get the status byte again
	               Test  AL,1       ;are we doing a retrace now?
	               JZ    Retrace    ;no, wait until we are
	
	   Mono:       Lodsb            ;get the character from X$ and increment SI
	               Stosw            ;store both the character and attribute
	               Loop  Check_Mon  ;loop until CX is zero
	
	   Exit:       POP   ES         ;* ADD THIS LINE
	               POP   DS         ;* ADD THIS LINE
	               Pop   BP         ;restore BP for BASIC
	               Ret   4          ;return skipping the passed parameters
	
	   QPrint      Endp
	   Code        Ends
	               End   ;* remove this label Begin
