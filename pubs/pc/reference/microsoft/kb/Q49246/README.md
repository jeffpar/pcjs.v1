---
layout: page
title: "Q49246: Using Offset with a Group of Data Segments"
permalink: /pubs/pc/reference/microsoft/kb/Q49246/
---

## Q49246: Using Offset with a Group of Data Segments

	Article: Q49246
	Version(s): 5.10a
	Operating System: MS-DOS
	Flags: ENDUSER | quickassembler quick assembler qasm
	Last Modified: 16-MAR-1990
	
	When using the OFFSET directive to refer to a variable defined in a
	segment that is part of a group, the offset generated is from the
	beginning of the segment instead of the beginning of the group. The
	group is defined properly and DS is assumed to be pointing to the
	group.
	
	This problem occurs in Microsoft Macro Assembler Version 5.10a and in
	QuickAssembler Version 2.00.
	
	The following example demonstrates this problem:
	
	dgroup   group data1,data2
	         assume cs:code,ds:dgroup
	
	data1    segment   para  public  'data'
	var1       dw      0
	           dw      0
	data1    ends
	
	data2    segment   para  public  'data'
	var2       dw      0
	data2    ends
	
	code     segment   'code'
	start:   mov       bx,offset var1
	         mov       bx,offset var2         <--incorrect
	         mov       bx,offset dgroup:var2  <--works all cases
	         lea       bx,var2                <--also works
	code     ends
	         end       start
	
	When the segment align type is PARA or PAGE, the above code will be
	incorrect. The offset directive generates an offset relative to the
	beginning of the segment instead of the beginning of the group. When
	the segment align type is BYTE,WORD or DWORD, the correct offset from
	the group beginning is generated.
	
	Please note the following:
	
	1. By default the Assembler uses PARA align.
	
	2. When a segment override is used in the OFFSET expression (as in the
	   above example), the correct offset is then generated.
	
	3. The LEA instruction also generates the correct offset.
