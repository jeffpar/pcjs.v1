---
layout: page
title: "Q29735: LES Instruction Assembles Incorrectly"
permalink: /pubs/pc/reference/microsoft/kb/Q29735/
---

## Q29735: LES Instruction Assembles Incorrectly

	Article: Q29735
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | buglist5.10
	Last Modified: 23-MAY-1988
	
	The following program demonstrates a problem with the LES
	instructions in MASM Version 5.10.
	   The first LES instruction (Parm1) assembles correctly, but the
	second instruction (Parm2) generates an "immediate mode illegal"
	message.
	   The only difference between the two instructions is the order of
	the arguments. In earlier versions of MASM, they produced identical
	code.
	
	   The problem is with the type operator and the way it handles
	registers inside brackets ([]). The type operator makes things a
	constant on the left of the expression.
	   Parm1 works because it handles registers inside brackets
	differently. "Type" turns bp into a constant; +10 then turns it back
	into an addressing mode.
	   However, in Parm2, bp+10 has been turned into an addressing mode,
	which is then turned into a constant by "type x". This difference is
	demonstrated in the following code:
	
	              .model   small
	
	x             struc
	y             dd        ?
	x             ends
	
	Parm1         equ       dword ptr [bp+type x+10]
	Parm2         equ       dword ptr [bp+10+type x]
	
	              .code
	
	begin:        les       di,Parm1
	              les       di,Parm2
	
	              end       begin
