---
layout: page
title: "Q31338: ATI Wondercard Graphics Adapter"
permalink: /pubs/pc/reference/microsoft/kb/Q31338/
---

	Article: Q31338
	Product: Microsoft C
	Version(s): 1.00 2.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 13-FEB-1989
	
	Certain BIOS versions of the ATI Wondercard Graphics Adapter and
	Microsoft Mouse Driver Versions 6.02, 6.10, 6.11, and 6.14 are
	incompatible. ATI has solved this problem by offering a BIOS upgrade.
	
	The BIOS version is displayed when booting your computer. If you do
	not know the BIOS version of the Wondercard, reboot the machine. The
	board and BIOS versions that do work together are as follows:
	
	Board Version                      BIOS Version
	
	   1                             1.16 (or higher)
	   2                             2.07 (or higher)
	   3                             3.07 (or higher)
	   4                             4.07 (or higher)
	
	It is also possible to disable the VGA emulatoin on the ATI card
	by running SMS (ATI's configuration program) with the following
	paramiters:
	
	            sms egabios   (to disable VGA)
	            sms vgabios   (to enable VGA)
	
	For more information about the BIOS upgrade, contact ATI at the
	following phone number and address:
	
	(416) 576-0711
	ATI 3761 Victoria Park Ave.
	Unit #2
	Scarborough, Ontario, Canada
	M1W352
