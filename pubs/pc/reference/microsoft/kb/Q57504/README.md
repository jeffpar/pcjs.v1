---
layout: page
title: "Q57504: Documentation Errors in BASIC 7.00 Presentation Graphics"
permalink: /pubs/pc/reference/microsoft/kb/Q57504/
---

## Q57504: Documentation Errors in BASIC 7.00 Presentation Graphics

	Article: Q57504
	Version(s): 7.00 7.10
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S891211-2 docerr
	Last Modified: 8-JAN-1991
	
	This article documents several documentation errors in Chapter 6,
	"Presentation Graphics," of the "Microsoft BASIC 7.0: Programmer's
	Guide" for Microsoft BASIC Professional Development System (PDS)
	Versions 7.00 and 7.10. The errors are as follows:
	
	1. Page 250 details the fields in the AxisType user-defined TYPE. The
	   field "Labelled" is misspelled. It should be spelled "Labeled".
	   This field is spelled correctly in the definition of the AxisType
	   in the CHRTB.BI $INCLUDE file.
	
	2. Page 251 incorrectly says to assign TicFormat to the CONSTant
	   cDecFormat for decimal. There is no CONSTant named cDecFormat.
	   This constant is defined as cNormFormat in the CHRTB.BI $INCLUDE
	   file.
	
	3. Page 266 describes how to load fonts for use in Presentation
	   Graphics. The following line in the example at the bottom of the
	   page is incorrect:
	
	      Env.MainTitle.Font = 3
	
	   This line should be changed to the following:
	
	      Env.MainTitle.TitleFont = 3
