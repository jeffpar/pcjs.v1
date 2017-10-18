---
layout: page
title: "Q30898: KBDINFO Incorrectly Defined"
permalink: /pubs/pc/reference/microsoft/kb/Q30898/
---

## Q30898: KBDINFO Incorrectly Defined

	Article: Q30898
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 12-JAN-1989
	
	The KBDINFO structure found in BSESUB.H is incorrectly defined, as
	follows:
	
	                KBDINFO struc
	                        kbxl_cb                 db ?
	                        kbxl_fsMask             db ?
	                        kbxl_chTurnAround       db ?
	                        kbxl_fdInterim          db ?
	                        kbxl_fsState            dw ?
	                KBDINFO ends
	
	   The members of the structure should all be declared as words (dw)
	rather than bytes.
