---
layout: page
title: "Q50705: LINK : Warning L4011 Caused By Invalid /PACKCODE Group Size"
permalink: /pubs/pc/reference/microsoft/kb/Q50705/
---

	Article: Q50705
	Product: Microsoft C
	Version(s): 3.65 4.06 4.07 5.01.21 5.03 | 5.01.21 5.03
	Operating System: MS-DOS                      | OS/2
	Flags: ENDUSER | S_C S_QUICKC S_QUICKASM S_PASCAL DOCERR
	Last Modified: 10-NOV-1989
	
	The LINK code packing option, /PAC[:n], groups together neighboring
	code segments into the same segment of maximum size "n" bytes. The
	results of using /PAC will only be reliable when "n" is in the range
	of 0 to 65500. Page 278 of the "Microsoft C 5.1 CodeView and
	Utilities" reference manual states the default value for "n" is 65530.
	This is incorrect.
	
	The linkers from the following products were tested with the /PAC
	option to determine their behavior with various values of "n":
	
	   C 5.10
	   Pascal 4.00
	   FORTRAN 5.00
	   QuickC 1.01
	   QuickC 2.00
	   QuickASM 2.01
	
	Note: Linkers were checked in both real and protected mode where
	appropriate.
	
	The following table shows the acceptable values that can be used with
	the /PAC[:n] option and what error message will occur when the value
	of "n" is out of range:
	
	----------------------------------------------------------------------
	Value of "n"      LINK Vers.   Error Message
	----------------------------------------------------------------------
	0 to 65500        3.65         No Errors/Warnings
	                  4.06         No Errors/Warnings
	                  4.07         No Errors/Warnings
	                  5.01.21      No Errors/Warnings
	                  5.03         No Errors/Warnings
	
	65501 to 65536    3.65         LINK : warning L4011:
	                  4.06         LINK : warning L4011: PACKCODE value
	                               exceeding 65500 unreliable
	                  4.07         (same as above)
	                  5.01.21      (same as above)
	                  5.03         (same as above)
	
	65537 and over    3.65         LINK : fatal error L1005:
	                  4.06         LINK : fatal error L1005: packing limit
	                               exceeds 65536 bytes
	                  4.07         (same as above)
	                  5.01.21      (same as above)
	                  5.03         (same as above)
	----------------------------------------------------------------------
	
	Note : With LINK Version 5.03 and later, the /PAC option has been
	changed to /PACKC to differentiate /PACKC[ODE] from the new
	/PACKD[ATA] option.
