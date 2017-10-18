---
layout: page
title: "Q30500: Segment Relative Versus Group Relative"
permalink: /pubs/pc/reference/microsoft/kb/Q30500/
---

## Q30500: Segment Relative Versus Group Relative

	Article: Q30500
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 23-MAY-1988
	
	The following sample code will be used to explain segment relative
	and group relative:
	
	dgroup  GROUP   aseg,cseg
	ASSUME  cs:dgroup,ds:dgroup
	aseg    SEGMENT public  byte    'CODE'
	        org 100h
	        start:
	        data_pointer    dw  the_data
	aseg    ends
	cseg    SEGMENT public  byte    'CODE'
	        the_data    label   byte
	cseg    ends
	        end start
	
	   When defining data, fixups are relative to the start of the
	segment. The variable data_pointer will have an address relative to
	the start of the aseg segment. If you want the variable to have an
	address relative to the start of the group, you can explicitly state
	the offset relative to dgroup as follows.
	
	data_pointer    dw  offset  dgroup:the_data
	
	   The exception is when you are using simplified segment directives.
	In that case, group relative fixups always are used rather than
	segment relative.
	   In code segments, fixups are relative to either segment or group
	depending on the ASSUME statements. In other words, the ASSUME
	STATEMENT is checked before the fixup is generated. The exception here
	is the same as above. When using simplified segment directives, group
	relative fixups are the default.
	
	   The OFFSET operator is segment relative and is discussed further in
	a separate article.
