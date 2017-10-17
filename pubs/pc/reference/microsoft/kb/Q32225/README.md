---
layout: page
title: "Q32225: Using the SHORTNAMES Switch"
permalink: /pubs/pc/reference/microsoft/kb/Q32225/
---

## Q32225: Using the SHORTNAMES Switch

	Article: Q32225
	Version(s): 1.00   | 1.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | tar78150
	Last Modified: 31-MAR-1989
	
	SHORTNAMES is a boolean switch. When it is set (the default), if you
	type <arg> "foo" <setfile>, you will be sent to the first file in your
	history list with the base name "foo". You do not have to specify the
	full pathname for a file in another directory. If there is no
	d:\path\foo.xxx anywhere in your file history, you only get foo.
	
	If you have a file "foo" in your current directory, SHORTNAMES still
	tries to find a file in your history list first. The history of files
	is stored in M.TMP. The number of files saved is determined by the
	TMPSAV switch.
	
	To disable this feature, set noshortnames: in your TOOLS.INI file.
	
	To avoid this behavior without changing the switch value, include a
	period in the path specification. For example, enter <arg> "foo."
	<setfile>, which will look only in the current directory. The presence
	of any path character (".", etc.) disables the SHORTNAMES feature for
	the file being referenced.
