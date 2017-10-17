---
layout: page
title: "Q57797: Problems Using BASIC 7.00 with Novell Advanced NetWare 2.15"
permalink: /pubs/pc/reference/microsoft/kb/Q57797/
---

## Q57797: Problems Using BASIC 7.00 with Novell Advanced NetWare 2.15

	Article: Q57797
	Version(s): 7.00
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900112-81
	Last Modified: 1-AUG-1990
	
	Microsoft BASIC Professional Development System (PDS) version 7.00 has
	not been fully tested under nor is it guaranteed to run under any
	version of Novell NetWare. Below are some confirmed and unconfirmed
	cases of problems using BASIC PDS 7.00 programs with Novell NetWare.
	
	Confirmed QBX.EXE Hanging Report
	--------------------------------
	
	1. Microsoft Product Support Services performed one test that showed
	   that QBX.EXE may hang under Novell Advanced NetWare version 2.15
	   revision C. This test was performed on an IBM AT with a 16-bit
	   Ungermann Bass network card. The test was run on a nondedicated
	   Novell server. The QBX.EXE editor screen comes up, but at this
	   point, the machine hangs and requires a cold reboot.
	
	   This information applies to the QBX.EXE editor that comes with
	   Microsoft BASIC Professional Development System (PDS) version 7.00
	   for MS-DOS.
	
	Unconfirmed QBX.EXE Hanging Reports
	-----------------------------------
	
	1. A customer reported that QBX.EXE can hang under the following
	   configuration:
	
	      COMPAQ 386/20 or ALR 386/33 computer
	      Version 2.15 Novell Advanced NetWare
	      Micom Interland board NI52100TP-8
	      Microsoft Mouse 7.00
	
	   When the customer booted without the Novell drivers, or with the
	   Novell drivers and without the Microsoft Mouse 7.00 driver, QBX.EXE
	   worked correctly without hanging. Microsoft has not confirmed this
	   information.
	
	2. A customer reported that QBX.EXE can hang under the following
	   configuration:
	
	      IBM PS/2 Model 50z computer
	      Version 2.15 revision C Novell SFT network
	
	3. A customer reported that a BASIC PDS 7.00 program using the
	   OPEN COM statement may hang on a workstation connected to Novell
	   Advanced NetWare version 2.15 revision A. When a Quarterdeck QEMM
	   version 5.00 expanded memory driver was installed, the machine
	   would not hang, but instead, QEMM would return an "Exception 12"
	   error. When the software for the Novell Network was removed, the
	   computer would not hang, nor would it generate an Exception 12
	   error with the QEMM driver loaded. Microsoft has not confirmed this
	   problem. The customer reported the problem on the following
	   configuration:
	
	      Dell System 310
	      Novell Advanced NetWare version 2.15 revision A
	      DOS version 3.30
	      80387 math coprocessor
	      4 MB extended memory
	      Video Seven VGA video card
	      Phoenix 80386 ROM BIOS Plus version 1.10 A05
	      Western Digital EtherCard Plus 16, or 3Com EtherLink card
	
	4. A customer reported that QBX.EXE hangs on the following
	   configuration (customer did not test same program run from .EXE):
	
	      Novell NetWare 2.15 SFT revision C
	      Everex Step 386
	      Version 3 AMI BIOS
	      MS-DOS version 4.01
	
	5. A customer reported that QBX.EXE hangs on the following
	   configuration (customer did not test same program run from .EXE):
	
	    Novell SFT NetWare 286 version 2.15 revision B
	    Uknown name AT 286
	    1 MB RAM
	    MDI Graphics Card (Hercules-compatible)
	    MF-II keyboard
	    MS-DOS 3.30
