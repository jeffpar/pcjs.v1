---
layout: page
title: "Q32811: Address-Size and Operand-Size Override Generated"
permalink: /pubs/pc/reference/microsoft/kb/Q32811/
---

## Q32811: Address-Size and Operand-Size Override Generated

	Article: Q32811
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist5.10
	Last Modified: 15-JUL-1988
	
	MASM will generate both an address-size and operand-size override
	for a far call from a USE16 segment to a USE32 segment. Only the
	operand-size override is necessary.
	   Microsoft has confirmed this to be a problem in Version 5.10. We
	are researching this problem and will post new information as it
	becomes available.
	
	   The  following source code demonstrates the problem:
	
	                        .386
	                        s32 segment USE32
	                            assume cs:@CurSeg
	                            p   proc
	                            p   endp
	                        s32 ends
	                        s16 segment USE16
	                            assume cs:@CurSeg
	67|66|9A 00000000           call    far ptr p
	                        s16 ends
	                        end
	
	   The opcodes generated for the Call instruction are shown at the
	left of the instruction. The address-size prefix is 67 and the
	operand-size prefix is 66.
