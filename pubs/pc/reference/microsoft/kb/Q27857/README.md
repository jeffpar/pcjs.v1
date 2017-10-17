---
layout: page
title: "Q27857: Old LINKer &quot;Unrecognized Switch Error: 'EX'&quot; when &quot;Make EXE&quot;"
permalink: /pubs/pc/reference/microsoft/kb/Q27857/
---

## Q27857: Old LINKer &quot;Unrecognized Switch Error: 'EX'&quot; when &quot;Make EXE&quot;

	Article: Q27857
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 15-JAN-1990
	
	When making an EXE file from within the QB.EXE Version 4.00, 4.00b, or
	4.50 editor and QBX.EXE (from Microsoft BASIC PDS Version 7.00)
	editor, the following message is generated when the wrong version of
	LINK.EXE is used:
	
	   Unrecognized switch error: "EX"
	
	When running an older linker from DOS with a newer switch (such as
	mistakenly using the /NOE option with the LINK.EXE Version 3.05
	provided with DOS Version 3.30), you can also get an "Unrecognized
	switch error" message.
	
	You must use the LINK.EXE that comes with QuickBASIC or the BASIC
	Compiler (or a later version of the linker). To find out the version
	number, invoke LINK from your working directory, and the linker
	displays a version number. This number can be compared with the number
	displayed by LINK.EXE on the product release disk.
	
	QuickBASIC Version 4.00 and QBX.EXE from BASIC PDS 7.00 each comes
	with its own copy of the LINK utility (LINK.EXE, Version 3.61 and
	Version 5.05 respectively). This version of the linker supports (and
	later versions support) the new /EX (/EXEPACK) switch. The function of
	this switch is to remove sequences of repeated bytes from object
	files. As a result, the switch provides a means for creating smaller
	EXE files. When the Make EXE option is chosen inside the editor from
	the Run menu, this switch is automatically used when the linker is
	invoked. Subsequently, if the wrong version of the linker is found
	(that is, one that does not support the new /EX switch), the error
	message "Unrecognized switch error" is generated.
	
	Because the message correctly indicates that the wrong version of
	LINK.EXE is being used, the workaround is to either remove all older
	versions of the linker from the machine or modify the DOS path
	statement so that the correct version of the linker is the first one
	found.
