---
layout: page
title: "Q63623: How to Set Up Programmer's WorkBench (PWB) for BASIC PDS 7.10"
permalink: /pubs/pc/reference/microsoft/kb/Q63623/
---

## Q63623: How to Set Up Programmer's WorkBench (PWB) for BASIC PDS 7.10

	Article: Q63623
	Version(s): 7.10   | 7.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | SR# S900702-109 s_pwb
	Last Modified: 5-SEP-1990
	
	The following information applies to Microsoft BASIC Professional
	Development System (PDS) version 7.10 for MS-DOS and MS OS/2.
	
	To successfully begin using the Programmer's WorkBench (PWB.EXE), you
	must make several changes in your environment, as follows:
	
	1. The file NEW-VARS.BAT (a batch file for MS-DOS) or NEW-VARS.CMD (a
	   command file for MS OS/2) must be executed before using PWB.EXE.
	   These files are located in the BC7\BIN directory (for MS-DOS) or
	   BC7\BINP directory (for MS OS/2) if the default directory names
	   were chosen during setup. The information in these files can be
	   added directly to your AUTOEXEC.BAT (for MS-DOS) or CONFIG.SYS (for
	   MS OS/2), as shown in the "More Information" section below.
	
	2. The file TOOLS.PRE must be renamed to TOOLS.INI or appended to an
	   existing TOOLS.INI. The TOOLS.INI must be in the directory
	   specified by the environment variable INIT. The TOOLS.PRE file is
	   located in the BC7\BINP directory if the default directory names
	   were chosen during setup.
	
	3. For MS OS/2, the LIBPATH environment variable must contain the
	   directory where BASIC's run-time DLLs are stored. These files are
	   located in the BC7\BINP directory if the default directory names
	   were chosen during setup.
	
	4. To use Microsoft C with PWB.EXE in interlanguage calling, the file
	   PWBC.MXT (for MS-DOS) or PWBC.PXT (for MS OS/2) must be unpacked
	   and copied from the distribution disks to the directory containing
	   PWB.EXE. PWB.EXE is located in the BC7\BIN directory (for MS-DOS)
	   or the BC7\BINP directory (for MS OS/2) if the default directory
	   names were chosen during setup. To find the disk PWBC.MXT or
	   PWBC.PXT is located on, look in the PACKING.LST file on DISK 1 of
	   the distribution disks.
	
	5. After any changes have been made to the AUTOEXEC.BAT file or
	   CONFIG.SYS file, your machine must be rebooted.
	
	The following is more information about requirements 1 through 4
	above:
	
	1. The information in the NEW-VARS.BAT or NEW-VARS.CMD files can be
	   added directly to your AUTOEXEC.BAT (for MS-DOS) or CONFIG.SYS (for
	   MS OS/2).
	
	   To avoid LINK and compile problems, make sure the directory for
	   PWB.EXE comes first in your PATH.
	
	   The following lines must be added to (or modified if the
	   environment variables already exist) your AUTOEXEC.BAT file (for
	   use with MS-DOS):
	
	      set PATH=c:\bc7\bin;c:\bc7\binb;
	      set LIB=c:\bc7\lib;
	      set INCLUDE=c:\bc7\src;
	      set HELPFILES=c:\bc7\help;
	
	   The following lines must be added to (or modified if the
	   environment variables already exist) your CONFIG.SYS file (for
	   use with MS OS/2):
	
	      set PATH=c:\bc7\binp;c:\bc7\binb;
	      set LIB=c:\bc7\lib;
	      set INCLUDE=c:\bc7\src;
	      set HELPFILES=c:\bc7\help;
	
	2. The environment variable for INIT should resemble the following if
	   your TOOLS.INI file is in the directory called INIT:
	
	      SET INIT=C:\INIT;
	
	   To append TOOLS.PRE to TOOLS.INI, use the following command:
	
	      COPY TOOLS.INI + \BC7\BINB\TOOLS.PRE
	
	3. A sample LIBPATH after using the default setup for MS OS/2 and
	   Microsoft BASIC PDS 7.10 is as follows:
	
	      LIBPATH=C:\OS2\DLL;C:\;C:\BC7\BINP;
	
	4. To unpack the files PWBC.MXT and PWBC.PXT, the commands are as
	   follows:
	
	      UNPACK A:PWBC.MX$ PWBC.MXT
	      UNPACK A:PWBC.PX$ PWBC.PXT
