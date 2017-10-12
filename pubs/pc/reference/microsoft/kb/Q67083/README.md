---
layout: page
title: "Q67083: Online Help Lists Wrong Warning Level for C4127 and C4135"
permalink: /pubs/pc/reference/microsoft/kb/Q67083/
---

	Article: Q67083
	Product: Microsoft C
	Version(s): 6.00 6.00a | 6.00 6.00a
	Operating System: MS-DOS     | OS/2
	Flags: ENDUSER | docerr
	Last Modified: 21-NOV-1990
	
	The online help for Microsoft C versions 6.00 and 6.00a lists the
	wrong warning level for compiler warnings C4127 and C4135. The help
	states that both of these are level 4 warnings, but they actually
	appear when compiling at warning level 3 (/W3).
