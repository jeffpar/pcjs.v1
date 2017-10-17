---
layout: page
title: "Q67735: How Structures Are Packed with /Zp"
permalink: /pubs/pc/reference/microsoft/kb/Q67735/
---

## Q67735: How Structures Are Packed with /Zp

	Article: Q67735
	Version(s): 
	Operating System: 6.00 6.00a | 6.00 6.00a
	Flags: MS-DOS     | OS/2
	Last Modified: 30-JAN-1991
	
	ENDUSER | docerr s_quickc
	
	The C compiler contains a command-line option as well as a pragma to
	pack structures, /Zp and pack, respectively. Packing a structure means
	to align an element of a structure on a 1-, 2-, or 4-byte boundary.
	Packing can be used for indexing purposes, as well as to decrease
	processor access times. If /Zp or the pragma is not used, the default
	structure packing value is 2.
	
	The amount of padding used before a particular structure field is
	determined by the field size and packing value. The packing value may
	change the offset of particular members of the structure.
	
	All offsets of structure members are relative to 0 (zero). Each member
	size is compared to the packing value (also called the alignment
	value). The element is then aligned on a boundary of the smallest of
	the field size and packing value.
	
	Finally, the structure itself may be padded to allow for arrays of
	structures to be aligned properly. The rule is simple. All structures
	are padded to a multiple of the pack size except one case. If a
	structure is packed on 4 byte boundaries but doesn't contain any
	elements larger than 2 bytes, it is padded to a multiple of 2.
	
	Below is an example of a structure that was packed with 1-byte packing
	[/Zp1 or #pragma pack (1)]. The structure is shown first, followed by
	a summary of what happens to the structure in memory, and finally the
	generated assembly listing is shown.
	
	Structure
	---------
	
	struct
	{
	   char a;
	   int b;
	   char c;
	} dummy;
	
	Packed Structure (/Zp1)
	-----------------------
	
	struct
	{
	   char a;
	   int b;
	   char c;
	}
	
	Assembly Code Generated in Small Model
	--------------------------------------
	
	_BSS SEGMENT WORD PUBLIC 'BSS'
	_BSS ENDS
	.
	.
	.
	_BSS SEGMENT
	COMM NEAR _dummy:BYTE:4
	_BSS ENDS
	
	Notice that the size in the assembly listing shows 4 bytes. Because
	the structure is exactly 4-bytes in size, there is no need for padding
	at the end.
	
	The following is an example with 2-byte packing [/Zp2 or #pragma
	pack(2)]:
	
	Structure
	---------
	
	struct
	{
	   char a;
	   int b;
	   char c;
	} dummy;
	
	Packed Structure (/Zp2)
	-----------------------
	
	struct
	{
	   char a;
	   (Filler character here)
	   int b;
	   char c;
	   (Filler character here)
	}
	
	Assembly Code Generated in Small Model
	--------------------------------------
	
	_BSS SEGMENT WORD PUBLIC 'BSS'
	_BSS ENDS
	.
	.
	.
	_BSS SEGMENT
	COMM NEAR _dummy:BYTE:6
	_BSS ENDS
	
	In this case, notice that the int is padded to start on a 2-byte
	boundary and the actual structure was padded to be a multiple of 2.
	Therefore, the length is 6 bytes.
	
	The following is an example of a structure packed with /Zp4:
	
	Structure
	---------
	
	struct
	{
	   char a;
	   int  b;
	   long c;
	   char d;
	} dummy;
	
	Packed Structure (/Zp4)
	-----------------------
	
	struct
	{
	   char a;
	   (1 padding character here)
	   int  b;
	   long c;
	   char d;
	   (3 filler characters here)
	}
	
	Assembly Code Generated in Small Model
	--------------------------------------
	
	_BSS SEGMENT WORD PUBLIC 'BSS'
	_BSS ENDS
	.
	.
	.
	_BSS SEGMENT
	COMM NEAR _dummy:BYTE:12
	_BSS ENDS
	
	This is a little more complex. The first padding occurs with the
	integer. Because the field size for an integer is 2 and the alignment
	value is 4, the integer will be aligned on a 2-byte boundary (field
	size is smaller). The long integer needs to be on a 4-byte alignment.
	However, because it is already on a 4-byte boundary, no padding
	characters are needed. Finally, because we have a long in this
	structure, the entire structure is padded to be a multiple of 4.
