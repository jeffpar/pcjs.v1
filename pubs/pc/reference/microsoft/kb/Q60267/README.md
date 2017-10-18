---
layout: page
title: "Q60267: Error A2057 with Include File DOS.INC and .386 Directive"
permalink: /pubs/pc/reference/microsoft/kb/Q60267/
---

## Q60267: Error A2057 with Include File DOS.INC and .386 Directive

	Article: Q60267
	Version(s): 5.10 5.10a | 5.10 5.10a
	Operating System: MS-DOS     | OS/2
	Flags: ENDUSER | buglist5.10 buglist5.10a
	Last Modified: 19-APR-1990
	
	The error "A2057: Illegal size of operand" occurs with the use of the
	DOS.INC include file and the .386 or .386P directive.
	
	The DOS.INC files are provided on Disk 2 of the MASM Version 5.10
	disks for simplified use of the DOS calls.
	
	Microsoft has confirmed this to be a problem with MASM 5.10. We are
	researching this problem and will post new information here as it
	becomes available.
	
	The following assembly listing produces the error mentioned above:
	
	        DOSSEG
	        title   test1
	        .386P
	
	        include     \include\dos.inc
	
	_datas  segment word 'data'
	mess            db      'Hi,there'
	messlen         equ     $-mess
	_datas  ends
	
	        assume cs:_codes
	_codes  segment word 'code'
	start:  mov     ax,_datas
	                mov     ds,ax           ;set data segment to point
	                                                ;to message
	
	                @write  mess,messlen    ; here is where the
	                                                        ; offset error is
	                @exit
	
	_codes  ends
	                end     start
	
	No errors occur if the use16 use type is used in the segment
	statement. This generates a 16-bit offset for the DOS.INC macros
	(where a 32-bit offset is generated without the USE 16, and produces
	an error).
	
	The following code demonstrates the segment use type to overcome the
	error:
	
	        DOSSEG
	        title   test1
	        .386P
	
	        include     \include\dos.inc
	
	_datas  segment use16 word 'data'
	mess            db      'Hi,there'
	messlen         equ     $-mess
	_datas  ends
	
	        assume cs:_codes
	_codes  segment word 'code'
	start:  mov     ax,_datas
	                mov     ds,ax           ; set data segment to point
	                                        ; to message
	
	                @write  mess,messlen    ; here is where the
	                                        ; offset error is
	                @exit
	
	_codes  ends
	                end     start
