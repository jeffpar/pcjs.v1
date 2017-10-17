---
layout: page
title: "Q66702: CV2206 Warning: Corrupt OMF Detected in &lt;filename&gt;"
permalink: /pubs/pc/reference/microsoft/kb/Q66702/
---

## Q66702: CV2206 Warning: Corrupt OMF Detected in &lt;filename&gt;

	Article: Q66702
	Version(s): 2.x 3.00 3.10 | 2.x 3.00 3.10
	Operating System: MS-DOS        | OS/2
	Flags: ENDUSER | S_MASM H_MASM
	Last Modified: 11-NOV-1990
	
	When trying to debug a Macro Assembler program with CodeView, the
	following message may appear:
	
	   CV2206 Warning: Corrupt debug OMF detected in <filename>,
	      discarding source line information
	
	The error occurs when code segments are not of class "CODE". Page 104
	of the "Macro Assembler 5.10 Programmer's Guide" states the following:
	
	   The CodeView debugger also expects code segments to have the class
	   name 'CODE'. If you fail to assign a class type to a code segment,
	   or if you give it a class type other than 'CODE', then labels may
	   not be properly aligned for symbolic debugging.
	
	This is also mentioned in the "CodeView and Utilities" manual under
	section 1.3.8 titled "Preparing Assembly Programs."
	
	The following is an example of the problem:
	
	_text segment para public   ; 'CODE' should be added to this line
	
	begin    proc
	      mov ah, 4ch
	      int 21h
	begin    endp
	
	_text ends
	      end begin
