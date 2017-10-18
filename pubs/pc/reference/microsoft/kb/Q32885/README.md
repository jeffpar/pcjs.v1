---
layout: page
title: "Q32885: No Symbolic Information Generated for Procedure Labels"
permalink: /pubs/pc/reference/microsoft/kb/Q32885/
---

## Q32885: No Symbolic Information Generated for Procedure Labels

	Article: Q32885
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist5.10
	Last Modified: 22-JUL-1988
	
	MASM does not generate an object-module record that allows a break
	point to be set at a procedure label under CodeView. The following
	code demonstrates this problem:
	
	    .model compact
	    .code
	    routine proc
	    mov ax,ax
	    routine endp
	    end
	
	   The source code was assembled and linked as follows:
	
	masm /ZI file.asm;
	link /CO file;
	cv file
	
	   In CodeView, entering "bp routine" gives the "Unknown symbol" error
	message.
	   Microsoft has confirmed this to be a problem in Version 5.10. We
	are researching this problem and will post new information as it
	becomes available.
