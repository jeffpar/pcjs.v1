---
layout: page
title: "Q37198: Setup Won't Accept Drive on Novell Network"
permalink: /pubs/pc/reference/microsoft/kb/Q37198/
---

## Q37198: Setup Won't Accept Drive on Novell Network

	Article: Q37198
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 18-NOV-1988
	
	Setup on Novell network Versions 2.0x gives "cannot create subdirectory
	G:\(etc.)" when trying to specify a destination for bound executables
	(i.e., the first question about paths that the setup program asks).
	
	It will not install on a network because it is illegal to do so
	without a special licensing agreement with Microsoft. If you have this
	agreement you receive a setup program that installs on the network.
	
	This scenario should not be confused with the situation of someone
	installing Microsoft software on their immediate machine and using
	network drives to store files they have created. This process is
	allowed.
