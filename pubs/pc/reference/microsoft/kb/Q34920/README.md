---
layout: page
title: "Q34920: Mixed Expressions Can Cause Unsigned Division"
permalink: /pubs/pc/reference/microsoft/kb/Q34920/
---

	Article: Q34920
	Product: Microsoft C
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 12-OCT-1988
	
	The ANSI C standard specifies that when a signed and unsigned integer
	are involved in an arithmetic expression, the signed integer is to be
	converted to the type of the unsigned before expression evaluation. If
	the signed integer is negative, the sign will be lost and the value
	will change, even though the bit pattern will remain the same.
	
	This situation is especially a problem with functions that return a
	value of type size_t, which is an alias for unsigned int in our
	implementation. Note that this is not a problem or a code generation
	error, this is the expected behavior.
	
	For example, if the statement
	
	i = (4 - strlen("1234567890")) / 2;
	
	is executed, the value of i will be 32765 rather than -3 as one might
	expect because the expression (4 - strlen("1234567890")) is an
	unsigned integer expression with the value of 65530 rather than a
	signed expression with the value of -6. If you look at the code
	generated, you'll notice that an instruction that performs unsigned
	division is generated rather than a one that performs signed division.
	
	To avoid this behavior, use a typecast on the return value
	of strlen() so that it is treated as an int. For the example
	above, the statement
	
	i = (4 - (int) strlen("1234567890")) / 2;
	
	would have generated the desired value of -3. Note that even this code
	would have failed if the length of the string was greater than 32767;
	however, the incorrect code above fails if the length of the string is
	greater than four.
	
	Runtime functions that return values of type size_t, unsigned, or
	unsigned long include the following:
	
	strtoul, _getlinestyle, fread, fwrite, _clear87, _control87,
	_status87, _fmsize, _memavl, _memmax, _msize, _nmsize,
	stackavail, strcspn, strlen, strspn, _bios_disk,
	_bios_equiplist, _bios_keybrd, _bios_memsize, _bios_printer,
	_bios_serialcom, _bios_timeofday, _dos_allocmem, _dos_close,
	_dos_creat, _dos_creatnew, _dos_findfirst, _dos_findnext,
	_dos_freemem, _dos_getdate, _dos_getdiskfree,
	_dos_getfileattr, _dos_getftime, _dos_gettime, _dos_open,
	_dos_read, _dos_setblock, _dos_setdate, _dos_setfileattr,
	_dos_setftime, _dos_settime, _dos_write, FP_OFF, FP_SEG,
	long_lrotl, long_lrotr, _rotl, and _rotr
