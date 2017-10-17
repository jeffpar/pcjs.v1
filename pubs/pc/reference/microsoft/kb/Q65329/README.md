---
layout: page
title: "Q65329: QC 2.0x Incorrectly Stores Uninitialized Global Data in DGROUP"
permalink: /pubs/pc/reference/microsoft/kb/Q65329/
---

## Q65329: QC 2.0x Incorrectly Stores Uninitialized Global Data in DGROUP

	Article: Q65329
	Version(s): 2.00 2.01
	Operating System: MS-DOS
	Flags: ENDUSER | buglist2.00 fixlist2.50
	Last Modified: 31-AUG-1990
	
	Microsoft QuickC version 2.00 and Microsoft QuickAssembler version
	2.01 both store uninitialized global data in the default data segment
	for the program (DGROUP). This is an error for compact and large model
	programs according to standard Microsoft segment-ordering conventions.
	In versions 2.50 and 2.51, this was corrected and uninitialized global
	data is now stored in FAR_BSS for compact and large models.
	
	Sample Code
	-----------
	
	int global;
	
	void main()
	{}
	
	To see this concept demonstrated, compile the above program under
	QuickC versions 2.0x and 2.5x. If the .MAP file from each is examined,
	the results will be obvious.
	
	Microsoft has confirmed this to be a problem with QuickC version 2.00.
	This problem was corrected with QuickC versions 2.50 and 2.51.
