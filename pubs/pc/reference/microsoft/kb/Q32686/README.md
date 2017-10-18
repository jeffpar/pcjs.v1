---
layout: page
title: "Q32686: More Than 127 Segments Will Generate Bad Object Record"
permalink: /pubs/pc/reference/microsoft/kb/Q32686/
---

## Q32686: More Than 127 Segments Will Generate Bad Object Record

	Article: Q32686
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist5.10
	Last Modified: 15-JUL-1988
	
	When a macro assembler program has more than 127 segments and
	it is compiled with the /Zd switch, an invalid object module is
	produced. The object module contains an invalid LINUM record caused
	by the segment index field.
	   Microsoft has confirmed this to be a problem in Version 5.10. We
	are researching this problem and will post new information as it
	becomes available.
