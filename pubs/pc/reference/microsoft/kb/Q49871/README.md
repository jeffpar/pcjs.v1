---
layout: page
title: "Q49871: Mixing Case of LINK Option Causes Error L1093 or D4002"
permalink: /pubs/pc/reference/microsoft/kb/Q49871/
---

	Article: Q49871
	Product: Microsoft C
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | S_QuickC
	Last Modified: 30-NOV-1989
	
	When specifying linker options from the CL or the QCL command line,
	the word "link" must be all lowercase letters. If the word "link" is
	not all lowercase, the error that occurs is either:
	
	   Command line warning D4002 : ignoring unknown flag '-xxxx'
	
	   or
	
	   LINK : fatal error L1093: xxxx.OBJ : object not found
	
	Note: xxxx is the four letters keyed in after the "/" (forward slash)
	or the "-" (hyphen).
	
	For example, issuing the following command from the MS-DOS or OS/2
	command prompt
	
	   cl file.c /Link graphics.lib
	
	produces the following error:
	
	   Command line warning D4002 : ignoring unknown flag '-Link'
