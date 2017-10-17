---
layout: page
title: "Q30855: &quot;Device Unavailable&quot; Using Communications Port in Real Mode"
permalink: /pubs/pc/reference/microsoft/kb/Q30855/
---

## Q30855: &quot;Device Unavailable&quot; Using Communications Port in Real Mode

	Article: Q30855
	Version(s): 6.00 6.00b 7.00 | 6.00 6.00B 7.00
	Operating System: MS-DOS          | OS/2
	Flags: ENDUSER |
	Last Modified: 26-FEB-1990
	
	If a "Device Unavailable" message occurs when trying to do
	communications under real mode (the DOS 3.x compatibility box in
	OS/2), then setcom40 must be run. This process allows the program to
	access the COM port in real mode. Setcom40 sets the serial-port
	address before starting the real mode program.
	
	Real mode applications use the BIOS COM-port base addresses, which
	begin at 400H to determine the presence of serial ports. However, the
	OS/2 COM.SYS device driver fills these addresses with zeros to keep
	real mode programs from interfering with protected mode applications
	that might try to access the COM ports.
	
	Setcom40 sets the port base addresses to values that real mode
	applications will recognize.
	
	The following syntax writes the port address for COMx in the BIOS area
	of the disk, where x is the number of the serial port:
	
	   setcom40 comx=on
	
	The following syntax removes the address from the BIOS area of the
	disk when the real mode application no longer requires it:
	
	   setcom40 comx=off (where x is the number of the serial port)
	
	For more information, please refer to Page 190 in the "Microsoft
	Operating System/2 Beginning User's Guide" of the Microsoft OS/2 SDK
	(Software Development Kit) Version 1.00.
