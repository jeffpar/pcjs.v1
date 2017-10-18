---
layout: page
title: "Q32836: .TYPE Operator Has New Bit Settings"
permalink: /pubs/pc/reference/microsoft/kb/Q32836/
---

## Q32836: .TYPE Operator Has New Bit Settings

	Article: Q32836
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 15-JUL-1988
	
	In previous versions of the Microsoft Macro Assembler, the .TYPE
	operator uses only bits 0, 1, 5, and 7. In MASM Versions 5.10, the use
	of bits 2, 3 and 4 has been added.
	   The following is a chart of bit assignments:
	
	    Bit Position        If Bit=0            If Bit=1
	
	    0               Not program related     Program related
	    1               Not data related        Data related
	    2               Not a constant value    Constant value
	    3               Addressing mode is not  Addressing mode is direct
	                        direct
	    4               Not a register          Expression is a register
	    5               Not defined             Defined
	    7               Local or public scope   External scope
	
	    For more information on the .TYPE operator please refer to the
	"Microsoft Macro Assembler 5.10 Programmer's Guide."
