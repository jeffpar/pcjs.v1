---
layout: page
title: "Q41661: QuickC 2.00 README.DOC: /K"
permalink: /pubs/pc/reference/microsoft/kb/Q41661/
---

## Q41661: QuickC 2.00 README.DOC: /K

	Article: Q41661
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER | s_helpmake
	Last Modified: 24-JAN-1991
	
	The following information is taken from the QuickC version 2.00
	README.DOC file, part 3, "Notes on 'QuickC Tool Kit.'" The following
	notes refer to specific pages in "QuickC Tool Kit."
	
	Page 182   /K[filename]
	
	Add this description to the table:
	
	Optimizes .HLP file sizes. The /K option specifies a file that
	defines keyword separator characters. These characters separate words
	in the file before HELPMAKE compresses it.
	
	The file used to create QC.HLP is listed below. (The first space is
	a blank character and it indicates that a space separates words.)
	
	  "&'()*+,.-/:=?@[\]^_`{|}~\177
	
	The other characters specify other separators. The angle brackets and
	pound sign are excluded, which gives a slightly better compression of
	phrases such as "#include <stdio.h>".
	
	Without the /K option, HELPMAKE sees these tokens to compress:
	
	        #
	        include
	        <
	        stdio
	        .
	         h
	         >
	
	With the /K option, HELPMAKE sees the following tokens to compress:
	
	        #include
	        <stdio
	        .
	         h>
	
	Repeated over the entire QC.HLP file, the small savings add up.
