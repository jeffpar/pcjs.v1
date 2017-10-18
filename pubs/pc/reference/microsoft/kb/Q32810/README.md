---
layout: page
title: "Q32810: BSESUB.INC Contains Incorrect Declarations"
permalink: /pubs/pc/reference/microsoft/kb/Q32810/
---

## Q32810: BSESUB.INC Contains Incorrect Declarations

	Article: Q32810
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist5.10
	Last Modified: 15-JUL-1988
	
	In BSESUB.INC, the KBDINFO structure fields should all be declared
	with the DW directive; however, the fields are declared by the DB
	directive instead. Also, the fsShift field should be declared with DW
	directive instead of the DD directive.
	   Microsoft has confirmed this to be a problem in Version 5.10. We
	are researching this problem and will post new information as it
	becomes available.
