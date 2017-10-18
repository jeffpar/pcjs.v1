---
layout: page
title: "Q57484: JMP Back More Than 128 Bytes Not Flagged"
permalink: /pubs/pc/reference/microsoft/kb/Q57484/
---

## Q57484: JMP Back More Than 128 Bytes Not Flagged

	Article: Q57484
	Version(s): 2.01
	Operating System: MS-DOS
	Flags: ENDUSER | s_quickc buglist2.01
	Last Modified: 12-FEB-1990
	
	The QuickC/QuickAssembler compiler Version 2.01 does not flag an
	attempt to make a short jump backwards further than 128 bytes when one
	pass assembly is enabled. The compiler produces an object file, but it
	is erroneous. If incremental linking is enabled, the file will not
	link properly and the following error message will be returned:
	
	   SOURCE.OBJ (source.asm) : error L2002:  Fixup overflow at 1 in segment
	   _TEXT : pos: 175 record type: 9C
	
	If standard linking is enabled, the file will link, but the program
	will not run properly.
	
	One pass assembly is enabled by default, both inside and outside the
	environment. Two pass assembly can be enabled by toggling the "One
	Pass Assembly" switch inside the environment. It can also be enabled
	by using the undocumented /P2 switch outside the environment. Two pass
	assembly catches the error and produces the desired message.
	
	Microsoft has confirmed this to be a problem in QuickC Version 2.01.
	We are researching this problem and will post new information here as
	it becomes available.
	
	The following source code assembles without errors with one pass
	enabled but should generate an error on a short backward jump of
	further than 128 bytes.
	
	          .model small
	
	          .code
	
	start:    mov ax, DGROUP
	          mov ds, ax
	          xor cx, cx
	
	back:     inc cx
	          cmp cx, 2
	          jmp done
	
	          xor ax,ax       ; You need 60 or so of these pups.
	          xor ax,ax
	          .
	          .
	          .
	          xor ax,ax
	          xor ax,ax
	
	          jmp short back
	
	done:     mov ax, 4c00h
	          int 21h
	
	          end start
