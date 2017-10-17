---
layout: page
title: "Q42781: C Compiler: _control87() and Modifying the Control Word"
permalink: /pubs/pc/reference/microsoft/kb/Q42781/
---

## Q42781: C Compiler: _control87() and Modifying the Control Word

	Article: Q42781
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER |
	Last Modified: 25-MAY-1989
	
	Question:
	
	I want to mask off invalid arithmetic operation interrupts
	(EM_INVALID) from the math coprocessor using the _control87()
	function. However, after masking invalids with _control87() and
	confirming its value, invalids continue to be unmasked.
	
	Can I adjust the control word myself, or does the math package depend
	on a certain state of the control word?
	
	Response:
	
	You cannot mask or unmask certain bits with _control87(), even though
	it will report that it was successful. Also, modifying certain bits of
	the control word yourself (with the 80X87 instruction FLDCW) will
	corrupt all subsequent floating-point C run-time operations.
	
	The documentation in FPEXCEPT.DOC (which is contained in the C 5.10
	package) does state that denormals are always masked off and that
	invalids are never masked. It also states that bits 7, 6, 1, and 0 in
	the control word cannot be modified. It is true that these bits cannot
	be modified with the function _control87(); however, if you look at
	the control word with an assembly routine, you will see that the
	control word does not hold the same value as the C run time would have
	you believe.
	
	Invalid exceptions cannot be masked because the C run time uses them
	internally to handle extending the 80 x 87 floating-point stack beyond
	eight stack elements. If you try to mask invalid with the C run time,
	you will be told that you were successful, but the control word will
	not be changed at all. No invalid exceptions will ever reach you. If
	you try to mask invalid and an invalid exception occurs (which doesn't
	have anything to do with stack overflow or underflow), the C run time
	will check to see if you tried to mask invalid. If you did, the
	floating point routines will simply ignore the mask. If you mask
	invalid by setting the control word from an assembly routine with
	FLDCW, the run time will have stack problems.
	
	As for denormals, the denormal exception is never masked internally
	because every time the 80 x 87 encounters a denormal number, the
	emulator will try to convert it to a normalized number. This is the
	masked behavior on an 80387. Because this should not be changed (since
	it will break our math routines), you should treat denormals as if
	they are always masked. Thus, denormals always appear to be masked;
	you will never see a denormal exception, since they are all handled
	internally by the emulator.
	
	Therefore, denormals always appear to be masked unless you look at the
	control word on the chip directly, by using an FSTCW or CodeView. Also,
	it will appear that invalids can be masked, unless you look at the
	chip directly. If you do look at the chip directly, you will see that
	nothing has changed when trying to mask an invalid with _control87.
	Therefore, the code is functioning as expected. Both invalid and
	denormal are unmasked. If you look at the control word with FSTCW, you
	will see that the default control word is 1370h, instead of the 1332h
	returned by _control87. Also, if you send _control87(0x00ff,0x00ff),
	this function will tell you that the control word is set to 13FFh;
	however, FSTCW will reveal that the control word is really set to
	137Ch.
	
	Because the run time depends on certain settings of the control word,
	we do not want the run time to modify those settings. You can easily
	write an assembly routine to set the control word to anything you
	like, using FLDCW. It would not be to anyone's advantage to provide a
	floating-point function that would nullify all subsequent
	floating-point run time.
	
	We do not support the modification of the control-word bits mentioned
	above.
	
	For additional information on floating point exceptions, please refer
	to the file FPEXCEPT.DOC contained in the C 5.10 package.
