---
layout: page
title: "Q39526: How to Declare External struct in MASM"
permalink: /pubs/pc/reference/microsoft/kb/Q39526/
---

## Q39526: How to Declare External struct in MASM

	Article: Q39526
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | struc external
	Last Modified: 12-JAN-1989
	
	Question:
	
	In mixed-language programming with MASM and C, how can I declare an
	external variable that is of a "struct" type declared in the C module?
	
	Response:
	
	You may declare a type with STRUC directive in your MASM module with
	the same memory-storage template as the "struct" type declared in your
	C module. You also can declare the variable as external with WORD type
	if it is a near data, or DWORD type if it is a far data.
	
	Note: In C, the packed struct type and the unpacked struct type have
	different storage in memory. As a result, the template constructed in
	your MASM module has to match the memory storage exactly. (See the
	sample program below.) Please refer to the "Microsoft Mixed-Language
	Programming Guide" (Section 9.2, "Structure, Records, and User-Defined
	Types") for more specific information regarding the C storage method.
	
	You can access the fields of the structure in the assembly module by
	using the "." operator.
	
	The sample program below demonstrates this information:
	
	/* sample program, c module */
	
	struct record {
	    char byte_1 ;
	    unsigned int word_1 ;
	    char byte_2 ;
	    unsigned int word_2 ;
	    } rec = {0x41, 0xffff, 0x42, 0xeeee} ;
	
	void proc_rec(void) ;
	
	main()
	{
	proc_rec() ;
	}
	
	/* end of the C module */
	
	Any template you may create in MASM with STRUC directive has to
	have unique field names through the MASM module. The field names
	represent the offset relative to the beginning of the structure. They
	do not have to be literally the same field names of the structure
	defined in the C module.
	
	The following sample program demonstrates this information:
	
	; sample program, MASM module
	
	        .model small
	        DOSSEG
	        .data
	foo     struc
	byte_1  db   ?      ; if dw is used, next padding byte is not needed.
	junk_1  db   ?      ; necessary padding, unused byte
	word_1  dw   ?
	byte_2  db   ?
	junk_2  db   ?      ; necessary padding, unused byte
	word_2  dw   ?
	foo     ends
	
	extrn   _rec:word       ; extrn  _rec:foo   is illeage
	
	        .code
	        public _proc_rec
	_proc_rec  proc  near
	        mov ax, _rec.word_1
	        mov bx, _rec.word_2
	        mov cl, _rec.byte_1
	        mov ch, _rec.byte_2
	        ret
	_proc_rec  endp
	        end
	
	; end of Masm module
