---
layout: page
title: "Q41668: QuickC 2.00 README.DOC: Error Message C2418"
permalink: /pubs/pc/reference/microsoft/kb/Q41668/
---

## Q41668: QuickC 2.00 README.DOC: Error Message C2418

	Article: Q41668
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 28-FEB-1989
	
	The following information is taken from the QuickC Version 2.00
	README.DOC file, part 3, "Notes on 'QuickC Tool Kit.'" The following
	notes refer to specific pages in "QuickC Tool Kit."
	
	Page  252  Error Message C2418
	
	The following error message is new and should be added to Page 252:
	
	  C2418  'identifier': not in a register
	
	  This error occurs when an in-line assembler instruction
	  references a variable with register storage class that has not
	  actually been allocated in a register. To correct this, remove the
	  register keyword from the variable definition and make sure that
	  this instruction is legal with a memory operand.
	
	For Example:
	
	  main()
	  {
	   register long regvar1;   /* _asm references are illegal */
	   register int regvar2;
	   register int regvar3;
	   register int regvar4;
	
	   _asm
	   {
	    les regvar2, regvar1;    /* error */
	    mov regvar2, regvar4;    /* error */
	   }
	  }
