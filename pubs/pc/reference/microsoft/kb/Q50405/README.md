---
layout: page
title: "Q50405: Indirect Far Jump/Call in MASM 5.10"
permalink: /pubs/pc/reference/microsoft/kb/Q50405/
---

## Q50405: Indirect Far Jump/Call in MASM 5.10

	Article: Q50405
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 29-MAR-1990
	
	The following example demonstrates how to generate an indirect far
	call or jump in MASM:
	
	.model large
	
	.data
	jumptable   dd    routine1
	            dd    routine2
	
	.code
	start:   mov    ax,@data
	         mov    ds,ax
	         call   dword ptr  jumptable
	         jmp    dword ptr  jumptable+4
	         ret
	
	cseg     segment  word public 'code'
	routine1 proc
	           ret
	routine1 endp
	
	routine2 proc
	           ret
	routine2 endp
	cseg     ends
	
	         end    start
