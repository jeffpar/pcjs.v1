---
layout: page
title: "Q65244: @data Group Override Produces Phase Error A2006"
permalink: /pubs/pc/reference/microsoft/kb/Q65244/
---

## Q65244: @data Group Override Produces Phase Error A2006

	Article: Q65244
	Version(s): 5.10    | 5.10a
	Operating System: MS-DOS  | OS/2
	Flags: ENDUSER | buglist5.10
	Last Modified: 12-NOV-1990
	
	Page 91 of the "Microsoft Macro Assembler 5.1 Programmer's Guide"
	states that the @data text equate represents the group name.
	
	This implies that the code statement with the GROUP override
	
	   mov ax, dgroup:[di]
	
	is equal to the following:
	
	   mov ax, @data:[di]
	
	However, the code below generates the following error:
	
	   A2006: phase error between passes
	
	The following is a sample code:
	
	.model small
	.code
	
	delta   proc
	
	        mov   ax, @data:[di]
	
	delta   endp
	
	        end
	
	Microsoft has confirmed this to be a problem in the Macro Assembler
	version 5.10a. We are researching this problem and will post new
	information here as it becomes available.
