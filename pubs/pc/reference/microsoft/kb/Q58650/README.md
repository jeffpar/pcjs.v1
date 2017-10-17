---
layout: page
title: "Q58650: Changing a Drive's Volume Label"
permalink: /pubs/pc/reference/microsoft/kb/Q58650/
---

## Q58650: Changing a Drive's Volume Label

	Article: Q58650
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | s_quickc s_quickasm h_masm
	Last Modified: 14-MAR-1990
	
	Changing a drive's volume label involves the use of FCB (File Control
	Block) file processing, and therefore, is not supplied with the C
	run-time libraries. However, one of the ways to do this is through DOS
	int 21h calls for FCB file manipulation.
	
	Below is an assembly routine written with Microsoft MASM Version 5.10
	to change a drive's volume name. To do this, it first sets up an
	extended FCB to allow for manipulating files with attributes. Offset 6
	of the FCB is set to 8 (_A_VOLID defined in dos.h) to specify a
	volume. The old volume is searched for with "*.*" as a pattern and
	deleted, then the volume is re-created with the new volume label
	passed by the C caller. The function returns the error code supplied
	from the DOS API that creates the volume label.
	
	Use the following:
	
	 rc = NewVol( iDrive, szName ); // iDrive = Drive number ( 1, 2, ... )
	                               // szName = Up to 11 chars. DOS filename
	                               // rc = Return Code from function.
	
	The new volume label must be passed with 11 characters for the name.
	Anything less MUST be padded with spaces.
	
	Sample Code
	-----------
	
	;   unsigned NewVol( int, char * ) will delete a disk volume and
	;                                  create one with the new name.
	;
	; Assemble with /Dmodel={SMALL MEDIUM COMPACT LARGE}
	;               /Dlang={C FORTRAN BASIC PASCAL}
	
	%.MODEL model,lang
	
	.DATA
	maxlen  EQU     11                 ;Maximum name length
	datasz  EQU      2                 ;Size of Data Pointers
	;   Setup an extended FCB
	fcb     DB      255, 0, 0, 0, 0, 0, 8, 1
	        DB      37 DUP (?)
	default DB      '*       *  '      ;Equivalent to "*.*"
	
	.CODE
	NewVol  PROC USES si di es, Drive:WORD, VolName:WORD
	        mov     bx,Drive           ;Get drive number ( 1 byte )
	        mov     fcb+7,bl           ;...and store in FCB offset 7
	        mov     ax,ds
	        mov     es,ax
	        cld                        ;Upward move
	        mov     cx,maxlen          ;Size of move
	        mov     si,OFFSET default  ;Source string to
	        mov     di,OFFSET fcb+8    ;...filename offset in 8 FCB
	        rep     movsb              ;Move maxlen bytes of vol name
	        mov     dx,OFFSET fcb      ;Delete volume off drive
	        mov     ah,13H
	        int     21H
	        mov     cx,maxlen
	        mov     si,VolName         ;New name passed by C caller
	        mov     di,OFFSET fcb+8
	        rep     movsb              ;Copy 11 chars for new label
	        mov     dx,OFFSET fcb      ;Create the new volume
	        mov     ah,16H
	        int     21H
	        mov     dx,OFFSET fcb      ;Close the file
	        mov     ah,10H
	        int     21H
	        mov     ah,0
	        ret
	NewVol  ENDP
	        END
