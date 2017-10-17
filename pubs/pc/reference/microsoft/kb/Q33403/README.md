---
layout: page
title: "Q33403: Using 43-Line Mode with Hercules Card"
permalink: /pubs/pc/reference/microsoft/kb/Q33403/
---

## Q33403: Using 43-Line Mode with Hercules Card

	Article: Q33403
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | SR# G880721-1772
	Last Modified: 27-JUL-1988
	
	Currently, only 82x55 mode is supported for the Hercules card. It
	is possible to switch to 43-line mode if you first do a
	_setvideomode(_DEFAULTMODE), then immediately do a
	_setvideomode(_ERESCOLOR).
