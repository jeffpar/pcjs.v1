---
layout: page
title: "Q66841: Does /ND Override /Aw?"
permalink: /pubs/pc/reference/microsoft/kb/Q66841/
---

## Q66841: Does /ND Override /Aw?

	Article: Q66841
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 18-NOV-1990
	
	Question:
	
	I have two separate modules to an application that I compile with
	/Alfw and /ND. The documentation states that /Aw will assume SS!=DS
	and DS is not loaded. However, when I examine the assembler output
	(/Fc or /Fa), I see that DS is loaded for each function in the modules
	compiled with /ND. Is this a problem in the compiler? Does /ND
	override /Aw?
	
	Response:
	
	You are confusing the functionality of these two switches. The /Aw
	switch is used by the compiler to determine if local variables
	(typically stack based) can be based on DS, as well as SS. Take the
	case where a variable needs to be copied from local data to global
	data, which would normally include a couple of MOV instructions. If
	the compiler can assume DS=SS, it can generate a LEA instruction on
	the stack-based variable and set up ES:DI with the destination. DS
	will already be set to the correct value. If DS != SS, the compiler
	will have to generate more code to correctly access the stack-based
	variable.
	
	Now, for the /ND switch. In this case, the data segment for the module
	is not the default segment. The compiler will do an explicit DS load
	at function entry point because of just this fact, that is, there is
	no way for the compiler to know that DS is properly set to the
	nonstandard segment name (not DGROUP). While this behavior is indeed
	the same behavior as the _loadds keyword, it has nothing to do with
	the main reason for /Aw (DS!=SS).
	
	To summarize, the /Aw switch doesn't cause the segment load, but it
	also doesn't stop it. This is one case where one switch (/ND) can
	override one of the effects of another switch (/Aw). However, the main
	effect of the /Aw switch is not changed (don't assume DS = SS).
