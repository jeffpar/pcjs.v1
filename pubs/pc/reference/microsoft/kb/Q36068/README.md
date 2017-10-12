---
layout: page
title: "Q36068: IEEE Floating-Point Representation and MS languages"
permalink: /pubs/pc/reference/microsoft/kb/Q36068/
---

	Article: Q36068
	Product: Microsoft C
	Version(s): 3.00 4.00 5.00 5.10 | 5.10
	Operating System: MS-DOS              | OS/2
	Flags: ENDUSER | s_pascal h_fortran h_masm b_quickbas
	Last Modified: 8-MAR-1989
	
	The following information discusses how real*4 (single precision) and
	real*8 (double precision) numbers are stored internally by Microsoft
	languages that use the IEEE floating-point format. The Microsoft
	Binary Format (MBF) for floating-point storage, which is used by the
	BASIC interpreter for MS-DOS and by QuickBASIC up through Versions
	3.x, is NOT discussed in this article.
	
	This information applies to all versions of Microsoft languages that
	use IEEE floating-point format, including the following:
	
	1. C Versions 3.00, 4.00, 5.00, and 5.10
	
	2. FORTRAN Versions 3.1x, 3.20, 3.30, 4.0x, and 4.10
	
	3. MASM Versions 1.25, 1.27, 3.0x, 4.00, 5.00, and 5.10
	
	4. Pascal Versions 3.1x, 3.20, 3.30, 3.31, 3.32, and 4.00
	
	5. The coprocessor version of QuickBASIC Version 3.00 (QB87.EXE), and
	   QuickBASIC Versions 4.00, 4.00b, and 4.50
	
	There are three internal varieties of real numbers. Microsoft is
	consistent with the IEEE numeric standards. Real*4 and real*8 are used
	in all of our languages. Real*10 is used only with MASM. Real*10 is
	also what any 8087, 80287, or 80387 coprocessor and the emulator math
	package use when performing floating-point calculations.
	
	In FORTRAN, real*4 is declared using the words "REAL" or "REAL*4."
	The words "DOUBLE PRECISION" or "REAL*8" are used to declare a real*8
	number.
	
	In C, real*4 is declared using the word "float." Real*8 is declared
	using the word "double" or "long double."
	
	In Pascal, real*4 is declared using the word "real4," and real*8 is
	declared using the word "real8."  The word "real" defaults to real*4,
	but this can be changed to real*8 with the $real:8 metacommand.
	
	In MASM, real*4 is declared with the "DD" directive, real*8 is
	declared with the "DQ" directive, and real*10 is declared with the
	"DT" directive.
	
	In QuickBASIC, the default variable type is real*4. Variables that
	have an exclamation point ("!") as their last character are also
	real*4. Variables that have a cross-hatch (also called pound-sign,
	"#" as the last character of its name are double precision (real*8).
	The DEFSNG and DEFDBL statements can be used to declare that variables
	whose names begin with certain letters and are of a certain type.
	These types can also be declared with the keywords SINGLE and DOUBLE.
	
	The values are stored as follows:
	
	real*4  sign bit, 8  bit exponent, 23 bit mantissa
	real*8  sign bit, 11 bit exponent, 52 bit mantissa
	real*10 sign bit, 15 bit exponent, 64 bit mantissa
	
	In real*4 and real*8 formats, there is an assumed leading one in the
	mantissa that is not stored in memory, so the mantissas are actually
	24 or 53 bits, even though only 23 or 52 bits are stored.  The
	real*10 format stores actually stores this bit.
	
	The exponents are biased by half of their possible value. This means
	you subtract this bias from the stored exponent to get the actual
	exponent. If the stored exponent is less than the bias, it is actually
	a negative exponent.
	
	The exponents are biased as follows:
	
	8-bit  (real*4)  exponents are biased by 127
	11-bit (real*8)  exponents are biased by 1023
	15-bit (real*10) exponents are biased by 16383
	
	These exponents are not powers of ten; they are powers of two, i.e.,
	8-bit stored exponents can be up to 127. 2**127 is roughly equivalent
	to 10**38, which is the actual limit of real*4.
	
	The mantissa is stored as a binary fraction of the form 1.XXX... .
	This fraction has a value greater than or equal to 1 and less than 2.
	Note that real numbers are always stored in normalized form, i.e., the
	mantissa is left-shifted such that the high-order bit of the mantissa
	is always one. Because this bit is always one, it is assumed (not
	stored) in the real*4 and real*8 formats. The binary (not decimal)
	point is assumed to be just to the right of the leading one.
	
	The format, then, for the various sizes is as follows:
	
	           BYTE 1    BYTE 2    BYTE 3    BYTE 4   ...  BYTE n
	real*4    SXXX XXXX XMMM MMMM MMMM MMMM MMMM MMMM
	real*8    SXXX XXXX XXXX MMMM MMMM MMMM MMMM MMMM ... MMMM MMMM
	real*10   SXXX XXXX XXXX XXXX 1MMM MMMM MMMM MMMM ... MMMM MMMM
	
	S represents the sign bit, the X's are the exponent bits, and the M's
	are the mantissa bits. Note that the leftmost one is assumed in real*4
	and real*8 formats, but present as "1" in BYTE 3 of the real*10
	format.
	
	To shift the binary point properly, you first un-bias the exponent and
	then move the binary point to the right or left the appropriate number
	of bits.
	
	The following are some examples in real*4 format:
	
	                    SXXX XXXX XMMM MMMM ... MMMM MMMM
	2   =  1  * 2**1  = 0100 0000 0000 0000 ... 0000 0000 = 4000 0000
	    Note the sign bit is zero, and the stored exponent is 128, or
	    100 0000 0 in binary, which is 127 plus 1.  The stored mantissa
	    is (1.) 000 0000 ... 0000 0000, which has an implied leading
	    1 and binary point, so the actual mantissa is one.
	-2  = -1  * 2**1  = 1100 0000 0000 0000 ... 0000 0000 = C000 0000
	    Same as +2 except that the sign bit is set.  This is true for
	        all IEEE format floating-point numbers.
	 4  =  1  * 2**2  = 0100 0000 1000 0000 ... 0000 0000 = 4080 0000
	    Same mantissa, exponent increases by one (biased value is
	    129, or 100 0000 1 in binary.
	 6  = 1.5 * 2**2  = 0100 0000 1100 0000 ... 0000 0000 = 40C0 0000
	    Same exponent, mantissa is larger by half--it's
	    (1.) 100 0000 ... 0000 0000, which, since this is a binary
	    fraction, is 1 1/2 (the values of the fractional digits are
	    1/2, 1/4, 1/8, etc.).
	 1  = 1   * 2**0  = 0011 1111 1000 0000 ... 0000 0000 = 3F80 0000
	    Same exponent as other powers of two, mantissa is one less
	    than two at 127, or 011 1111 1 in binary.
	.75 = 1.5 * 2**-1 = 0011 1111 0100 0000 ... 0000 0000 = 3F40 0000
	    The biased exponent is 126, 011 1111 0 in binary, and the
	    mantissa is (1.) 100 0000 ... 0000 0000, which is 1 1/2.
	2.5 = 1.25 * 2**1 = 0100 0000 0010 0000 ... 0000 0000 = 4020 0000
	    Exactly the same as two except that the bit which represents
	    1/4 is set in the mantissa.
	0.1 = 1.6 * 2**-4 = 0011 1101 1100 1100 ... 1100 1101 = 3DCC CCCD
	    1/10 is a repeating fraction in binary. The mantissa is
	    just shy of 1.6, and the biased exponent says that 1.6 is to
	    be divided by 16 (it is 011 1101 1 in binary, which is 123 in
	    decimal). The true exponent is 123 - 127 = -4, which means
	    that the factor by which to multiply is 2**-4 = 1/16. Note
	    that the stored mantissa is rounded up in the last bit--an
	    attempt to represent the unrepresentable number as accuartely
	    as possible. (The reason that 1/10 and 1/100 are not exactly
	    representable in binary similar to the reason that 1/3 is not
	    exactly representable in decimal.)
	 0  = 1.0 * 2**-128 = all zero's--a special case.
