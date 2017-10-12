---
layout: page
title: "Q42771: HELPMAKE: "/A:" Must Be Used When Using Colon (:) Commands"
permalink: /pubs/pc/reference/microsoft/kb/Q42771/
---

	Article: Q42771
	Product: Microsoft C
	Version(s): 1.00
	Operating System: MS-DOS
	Flags: ENDUSER | s_helpmake s_quickc docerr
	Last Modified: 28-JAN-1991
	
	In at least two places in the "Microsoft QuickC Tool Kit" version 2.00
	manual, it is implied that the colon (:) is used as a default for
	HELPMAKE commands. However, it is never explicitly stated that
	HELPMAKE must be invoked with the "/A:" option when encoding the help
	database.
	
	In fact, for any HELPMAKE colon (:) command to be recognized and
	correctly interpreted during the encoding process, the "/A:" switch
	must be used. For example, to encode the source file HELPTEST.SRC into
	the help database HELPTEST.HLP, the following line should be used
	(where "/A:" specifies the control character; "/E" indicates that the
	file is being encoded, not decoded; and "/O" gives the destination
	filename):
	
	   HELPMAKE /A: /E /OHELPTEST.HLP HELPTEST.SRC
	
	HELPMAKE options may be in either uppercase or lowercase letters.
