---
layout: page
title: "Q40322: Setting Up QuickC Version 2.00 on a Two-Floppy Machine"
permalink: /pubs/pc/reference/microsoft/kb/Q40322/
---

	Article: Q40322
	Product: Microsoft C
	Version(s): 2.00   | 2.00
	Operating System: MS-DOS | OS/2
	Flags: enduser |
	Last Modified: 17-JAN-1989
	
	The following article contains one possible setup configuration for
	installing QuickC Version 2.00 on a two-floppy machine (360K). This is
	not the only setup configuration. Although the combination listed
	below will minimize disk swapping, it is not as practical for large
	programs as other configurations that require an additional disk(s)
	for your libraries.
	
	The following are the four steps to this setup:
	
	1. Below is a description of the distribution of QuickC Version 2.00
	   files over five 360K floppies. After each disk number is a list
	   of files that you need to copy to that disk. The following is the
	   description:
	
	      disk 1:   qc.exe
	
	      disk 2:   qcc.ovl
	                c1.err
	                cl.err
	                link.exe
	                ilink.exe
	                ilinkstb.ovl
	
	      disk 3:   qc.hlp
	
	      disk 4:   qcenv.hlp
	                errors.hlp
	                graphics.hlp
	                notes.hlp
	                (There is plenty of room left on this disk for
	                addition help files.)
	
	      disk 5:   \include\*.h    (It is best to copy just the header
	                                 files that you require.)
	                \include\sys\stat.h
	                \include\sys\timeb.h
	                \include\sys\types.h
	                \include\sys\utime.h
	                \include\sys\locking.h
	                \lib\xlibce.lib (without graphics.lib or pgchart.lib)
	                source files
	
	      The following are notes on disk 5:
	
	      The notation "\include\*.h" means that you must create a
	      directory named "include" on disk five, and copy the necessary
	      header files (files with the .h extension) to this directory.
	      "\include\sys\.." means that you must create a subdirectory
	      "sys" inside the "include" directory and copy the files listed
	      into it.
	
	      If you copy all of the header files, there is room for a
	      combined library without any graphics, and about 45K remains for
	      your source file. Due to this behavior, it's better to only copy
	      needed header files. If you want to use graphics or pgchart, in
	      all practicality, you should put your library or libraries onto
	      another disk, and swap when the linker asks for it.
	
	      The notation "\lib\xlibce.lib" means you must create a "lib"
	      directory and copy a combined library to this directory.
	      xLIBCE.LIB is your combined library where "x" is S, M, C, or L
	      (small, medium, compact, or large).
	
	      To build the combined libraries, you can invoke the SETUP.EXE
	      program to specifically build them for you. Type "setup /L" (use
	      /L, not /l).
	
	2. Set your environment variables as follows:
	
	      PATH=a:\;b:\
	      set INCLUDE=b:\include
	      set LIB=b:\lib
	
	   You can set these variables at the DOS command prompt
	   ("set path=a:\;b:\") or you can place these settings within
	   a batch file. When typing these variables, it is vital that
	   you do not add extraneous characters (such as spaces) to them
	   because they will mislead DOS. The following lists two common
	   errors when setting environment variables:
	
	      set path = a:\;b:\ <enter>    <--spaces invalidate this setting.
	      set path=a:\;b:\ <space(s)><enter>  <--spaces at the end also
	                                             invalidate the setting.
	
	3. Add the following two lines to your CONFIG.SYS file:
	
	      files=20
	      buffers=15
	
	   (You must reboot after this modification for the changes to take
	   effect.)
	
	4. Make Drive B: your default drive by typing "B:".
	
	If you have further questions concerning Setup, libraries,
	environment variables, or specific component files of QuickC,
	please refer to the following source listings in the
	"Microsoft QuickC Up and Running" manual:
	
	   Setup:
	
	      1. Page 15, "Installing on a Floppy-Disk System"
	
	      2. Page 6, "Running Setup"
	
	   Libraries:
	
	      1. Page 7, "Understanding Libraries"
	
	      2. Page 8, "First Screen: The Libraries"
	
	   Environment Variables:
	
	      1. Page 14, "Modifying CONFIG.SYS"
	
	      2. Page 13, "Setup Stage Three"
