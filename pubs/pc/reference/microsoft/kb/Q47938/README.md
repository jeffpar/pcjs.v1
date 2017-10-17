---
layout: page
title: "Q47938: Debugging of DLLs That Do Not Have the .DLL Extension"
permalink: /pubs/pc/reference/microsoft/kb/Q47938/
---

## Q47938: Debugging of DLLs That Do Not Have the .DLL Extension

	Article: Q47938
	Version(s): 2.30   | 2.30
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 21-AUG-1989
	
	CodeView Protect (CVP) Version 2.30 has the ability to debug DLLs that
	are called with DosLoadModule(). DosLoadModule() can load DLLs that
	do not have the .DLL extension. However, CVP 2.30 cannot debug DLLs
	that do not have the .DLL extension. If you want to debug DLLs that
	are called with DosLoadModule, they must have the .DLL extension.
	
	Microsoft is aware of this limitation with CodeView Protect 2.30. We
	are researching this problem and will post new information as it
	becomes available.
