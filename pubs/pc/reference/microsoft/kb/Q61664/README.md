---
layout: page
title: "Q61664: Changes in OS/2 Multithreaded and DLL Support in C 6.00"
permalink: /pubs/pc/reference/microsoft/kb/Q61664/
---

	Article: Q61664
	Product: Microsoft C
	Version(s): 6.00
	Operating System: OS/2
	Flags: ENDUSER |
	Last Modified: 9-MAY-1990
	
	Described below are several changes that have been made in Microsoft C
	version 6.00 to further support the writing of multithread (MT)
	applications and dynamic link libraries (DLLs) for OS/2:
	
	1. There is now only one set of include files with C 6.00 (as opposed
	   to the separate standard and multithreaded include files in C
	   5.10). The multithreaded versions have been merged with the
	   standard includes and are differentiated internally via "ifdef"
	   statements. If you define _MT in your program (#define _MT) or on
	   the the compile command-line (/D_MT), then the multithreaded
	   includes will be used, otherwise the standard includes are
	   utilized.
	
	2. All of the DLL libraries are multithreaded in C 6.00. Previously, a
	   DLL statically linked with the C DLL run-time library LLIBCDLL.LIB
	   could only be single-threaded; multithreaded DLLs required that
	   they be linked with a DLL version of the C run-time library
	   (CRTLIB.DLL). In C 6.00, LLIBCDLL.LIB is multithreaded, which
	   allows statically linked multithreaded DLLs to contain C run-time
	   code.
	
	3. The C 6.00 compiler now provides three new switches, /MT, /MD, and
	   /ML, to simplify the building of multithreaded programs and dynamic
	   link libraries. These switches lessen the number of other
	   command-line options that must be used and automatically specify
	   the correct library to be used.
	
	   The list below shows the new switches, followed by the options the
	   new switches are roughly equivalent to and the default library
	   names that the switches specify must be written into the object
	   modules. These new switches MUST be used in order to use the
	   specified libraries because the switches are NOT specifically equal
	   to the expanded option lists shown.
	
	      Switches                         Equivalent Options
	      --------                         ------------------
	
	      /MT - /ALw /FPi /G2 /D_MT        Library name - LLIBCMT.LIB
	      /ML - /ALw /FPa /G2 /D_MT        Library name - LLIBCDLL.LIB
	      /MD - /ALw /FPi /G2 /DDLL /D_MT  No default library name - uses
	                                       DLL version of C run-time
	                                       library (for example,
	                                       CRTLIB.DLL).
	
	These switches are documented further on Pages 355-356 of "Microsoft C
	Advanced Programming Techniques" and in the online help. Note that in
	most of the C 6.00 documentation, the symbolic constant _MT is
	improperly referred to as MT (missing the leading underscore).
