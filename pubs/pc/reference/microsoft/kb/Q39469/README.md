---
layout: page
title: "Q39469: Process &quot;exit&quot; Values Must Lie Between 0 and 255 Inclusive"
permalink: /pubs/pc/reference/microsoft/kb/Q39469/
---

	Article: Q39469
	Product: Microsoft C
	Version(s): 4.00 5.00 5.10 | 4.00 5.00 5.10
	Operating System: MS-DOS         | OS/2
	Flags: ENDUSER | S_QUICKC
	Last Modified: 29-DEC-1988
	
	Problem:
	
	I am testing the exit value of a process. This value is not accurate
	for values above 255.
	
	Response:
	
	Exit values must range between 0 and 255 inclusive. This limitation
	has its roots in the "terminate with return code" interrupt function
	(interrupt 21H, function 4CH). Using this function, exit values are
	specified in the AL register. The AL register allows values from 0 to
	255. All Microsoft C programs under DOS terminate using this function.
	
	Under OS/2, the same limitation exists. Although OS/2 does not use
	interrupts as DOS does, the reasoning is analogous.
	
	Exit values can be tested using the functions spawnl, spawnle, spawnlp,
	spawnlpe, spawnv, spawnve, spawnvp, and spawnvpe. Also, batch files may
	test exit values using the IF ERRORLEVEL statement.
