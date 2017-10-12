---
layout: page
title: "Q29825: Structure Packing: /Zp4 or #pragma pack(4), and /Zp2"
permalink: /pubs/pc/reference/microsoft/kb/Q29825/
---

	Article: Q29825
	Product: Microsoft C
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | docerr
	Last Modified: 12-OCT-1988
	
	The /Zp4 compiler option or #pragma pack(4) results in a more
	efficient use of space than indicated on Pages 100 to 102 in both the
	"Microsoft C 5.00 Optimizing Compiler User's Guide" and the "Microsoft
	C 5.10 Optimizing Compiler User's Guide." When the C compiler aligns
	structure members, it uses the /Zp4 or #pragma pack(4) (or /Zp2 or
	#pragma pack(2) values) as the maximum number of bytes for alignment,
	but will word (even-byte) align individual struct members whose size
	is one or two bytes. Contiguous char or array of char members that are
	immediately preceded by char members will be byte aligned.
	
	When specifying 4-byte (or 2-byte) boundaries for aligning structure
	members, the actual alignment is dependent on the size of the structure
	member. To avoid wasting space, the compiler will word align structure
	members that are one or two bytes in size. Structure members whose size
	is four or eight bytes or greater will be aligned on 4-byte boundaries
	with the /Zp4 switch or #pragma pack(4) as documented.
	
	Char or array of char struct members will be byte aligned if they are
	preceded by a char struct member, otherwise they will be word aligned.
	(Search on "Zp" and "char" to find articles with more information on
	the alignment of char struct members.)
	
	The sizeof operator correctly indicates the actual size of the
	structure with any alignment of struct members.
	
	Note that this struct member alignment is different than that which
	occurred with previous versions of Microsoft C compilers. If using
	object files containing structures produced by C 4.00 or earlier
	compiler versions, it may be necessary to use dummy bytes to word
	align contiguous char struct members.
	
	To gain complete control over the alignment of struct members, you may
	use the /Zp or /Zp1 compiler options, or #pragma pack(1), and pad your
	struct with an appropriate number of dummy char or array of char
	members.
