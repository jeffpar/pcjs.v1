---
layout: page
title: "Q67511: /Ta Switch Is Not Used By QuickC with QuickAssembler"
permalink: /pubs/pc/reference/microsoft/kb/Q67511/
---

## Q67511: /Ta Switch Is Not Used By QuickC with QuickAssembler

	Article: Q67511
	Version(s): 2.00 2.01 2.50 2.51
	Operating System: MS-DOS
	Flags: ENDUSER | docerr buglist2.01 buglist2.51
	Last Modified: 14-DEC-1990
	
	Page 100 of the Microsoft QuickC "Toolkit" manual states that the
	/Ta"filename" option is used to specify an assembly file to assemble,
	even if the file does not have a .ASM extension. It also states that
	the Microsoft Macro Assembler will be used to assemble the file. For
	the QuickC with QuickAssembler product, this is incorrect.
	
	The /Ta switch is used by QuickC version 2.00 and 2.50 to allow
	assembly files to be assembled by MASM. QuickC with QuickAssembler
	versions 2.01 and 2.51 ignore the switch. This causes a problem
	because the filename specified after the /Ta switch will be
	interpreted as an option, and the following error message will be
	generated:
	
	   command line fatal error A1017: unknown option: file.ext
	
	The only workaround for this avoid the /Ta switch all together and
	specify all assembler files with the .ASM file extension.
	
	Microsoft has confirmed this to be a problem in QuickC with
	QuickAssembler versions 2.01 and 2.51. We are researching this problem
	and will post new information here as it becomes available.
