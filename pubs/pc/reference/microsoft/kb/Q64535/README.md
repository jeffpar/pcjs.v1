---
layout: page
title: "Q64535: IRET Can't Be Used with proc USES"
permalink: /pubs/pc/reference/microsoft/kb/Q64535/
---

## Q64535: IRET Can't Be Used with proc USES

	Article: Q64535
	Version(s): 5.10 5.10a | 5.10 5.10a
	Operating System: MS-DOS     | OS/2
	Flags: ENDUSER |
	Last Modified: 17-OCT-1990
	
	A procedure that uses the USES keyword cannot return by using IRET.
	The USES statement pushes the specified registers on the stack upon
	entry and pops them before exiting a procedure. If the USES keyword is
	used with a procedure that ends with an IRET instruction, the pushes
	will be generated for the procedure, but the pops will not.
	
	The following code demonstrates the problem:
	
	The Source File
	---------------
	
	.model large,c
	
	.code
	proctest segment 'CODE'
	
	first proc far uses di si bp
	      mov si,3
	      mov di,4
	      iret
	first end
	      end first
	
	The Assembled Listing
	---------------------
	
	assume cs:@code,ds:@data,ss:@data
	
	proctest_TEXT segment 'CODE'
	
	first  proc far uses di si bp
	
	push DI
	push SI
	push BP
	      mov si,3
	      mov di,4
	                    <--- missing pops for bp,si, and di
	      iret
	first  endp
	      end  first
	@CurSeg ends
