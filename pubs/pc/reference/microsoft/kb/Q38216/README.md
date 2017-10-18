---
layout: page
title: "Q38216: Error L2002: Fixup Overflow for MASM and C"
permalink: /pubs/pc/reference/microsoft/kb/Q38216/
---

## Q38216: Error L2002: Fixup Overflow for MASM and C

	Article: Q38216
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 12-JAN-1989
	
	If the variable exp_data is declared in MASM as follows
	
	.data
	    EXTRN _exp_data:WORD
	
	and declared in C as follows, the error L2002: fixup overflow is
	generated:
	
	 .
	 .
	 .
	 int exp_data;
	
	 main()
	 {...
	 }
	
	This error occurs because the assembler declaration puts _exp_data in
	the _data logical segment in dgroup. The C declaration, however, will
	put _exp_data in the FAR_BSS as it is an uninitialized global data
	item in large model.
	
	One way to eliminate this error is to initialize _exp_data in C. This
	will put it in the _data logical segment in dgroup as well.
	
	Another work around is to delcare _exp_data in MASM outside of the
	.data directive. This will put _exp_data into the FAR_BSS in
	large-memory model.
