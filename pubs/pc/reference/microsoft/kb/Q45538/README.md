---
layout: page
title: "Q45538: fcvt() Incorrectly Prototyped in QuickC Advisor"
permalink: /pubs/pc/reference/microsoft/kb/Q45538/
---

## Q45538: fcvt() Incorrectly Prototyped in QuickC Advisor

	Article: Q45538
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER | docerr
	Last Modified: 26-JUN-1989
	
	In the QuickC 2.00 Advisor, the fcvt() function is incorrectly
	prototyped as the following:
	
	   char *fcvt(double value, inc count, int *dec, int *sign);
	
	The correct prototype is as follows:
	
	   char *fcvt(double value, int count, int *dec, int *sign);
	
	The second parameter is documented as being "inc count"; it should be
	"int count".
