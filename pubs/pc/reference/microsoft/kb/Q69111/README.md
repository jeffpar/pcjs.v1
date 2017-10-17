---
layout: page
title: "Q69111: Correction for Scroll SUB in GENERAL.BAS, UI Toolbox"
permalink: /pubs/pc/reference/microsoft/kb/Q69111/
---

## Q69111: Correction for Scroll SUB in GENERAL.BAS, UI Toolbox

	Article: Q69111
	Version(s): 7.00 7.10
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S910115-118 buglist7.00 buglist7.10
	Last Modified: 14-FEB-1991
	
	The subprogram Scroll within GENERAL.BAS will not display the correct
	attributes if you select a negative number for "lines" when you want
	to scroll the window down. A correction for this problem is shown
	below. (Scrolling in the up direction displays the correct attributes,
	and needs no correction.)
	
	This correction applies to the User Interface (UI) Toolbox in
	Microsoft BASIC Professional Development System (PDS) versions 7.00
	and 7.10 for MS-DOS.
	
	The DOS Interrupt call 16 hex with function 7 or 6 requires that the
	BX register be set with the color attribute. The bits 6 through 4 are
	set to the desired background attribute. The following formula shifts
	this attribute into the correct location in the word register BX:
	
	   regs.bx = 256 * (attr MOD 8) * 16
	
	The original code for subprogram Scroll has the following attributes
	set for the BX register:
	
	   regs.bx = 256 * attr
	
	The following excerpt is from Scroll with the correct modifications:
	
	SUB Scroll (row1, col1, row2, col2, lines, attr)
	          .
	          .
	          .
	     MAXCOL THEN
	        DIM regs AS RegType
	        IF lines < 0 THEN
	            regs.ax = 256 * 7 + (-lines)
	           'regs.bx = 256 * attr                 <=== old code
	            regs.bx = 256 * (attr MOD 8) * 16   '<=== change to this
	            regs.cx = 256 * (row1 - 1) + (col1 - 1)
	            regs.dx = 256 * (row2 - 1) + (col2 - 1)
	        ELSE
	            regs.ax = 256 * 6 + lines                  'AH = 06
	            regs.bx = 256 * (attr MOD 8) * 16
	            regs.cx = 256 * (row1 - 1) + (col1 - 1)
	            regs.dx = 256 * (row2 - 1) + (col2 - 1)
	        END IF
	        INTERRUPT 16, regs, regs
	    END IF
	END SUB
