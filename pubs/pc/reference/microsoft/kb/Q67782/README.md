---
layout: page
title: "Q67782: /MT Cannot Be Mixed with /FPa As Shown on Page 370 of APT"
permalink: /pubs/pc/reference/microsoft/kb/Q67782/
---

## Q67782: /MT Cannot Be Mixed with /FPa As Shown on Page 370 of APT

	Article: Q67782
	Version(s): 6.00 6.00a | 6.00 6.00a
	Operating System: MS-DOS     | OS/2
	Flags: ENDUSER | docerr
	Last Modified: 6-FEB-1991
	
	Page 370 of the "Advanced Programming Techniques" manual shipped with
	Microsoft C version 6.00 incorrectly gives an example of combining the
	command-line switches /MT and /FPa. This procedure does not work and
	will cause the compiler to generate the following error message:
	
	   Command Line Error D2016: '-MT' and '-FPa' are incompatible
	
	To use the alternate math libraries, you must either create a single
	threaded .EXE or a multithreaded DLL. The libraries to create a
	multithreaded .EXE are not available.
