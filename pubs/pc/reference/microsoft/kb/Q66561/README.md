---
layout: page
title: "Q66561: 386MAX.SYS with MOUSE.COM 7.0 Can Hang Sprite Video Cards"
permalink: /pubs/pc/reference/microsoft/kb/Q66561/
---

	Article: Q66561
	Product: Microsoft C
	Version(s): 7.00 7.03 7.04
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S901024-6 B_BasicCom
	Last Modified: 15-NOV-1990
	
	When used with 386MAX.SYS version 4.05 (an expanded memory driver by
	Qualitas Software), Microsoft Mouse driver versions 7.00, 7.03, and
	7.04 can hang computers equipped with video cards that have sprite
	capabilities (the ability to have a graphic cursor in text mode).
	
	This problem only occurs with the above mentioned versions. Earlier
	versions of the Microsoft Mouse driver will not cause this problem.
	
	Using Mouse driver version 7.04 with the "/y" line option will fix
	this problem.
	e.g.
	    in DOS:
	
	      mouse /y
	
	 or in the AUTOEXEC.BAT:
	
	      C:\MOUSE1\MOUSE /Y
