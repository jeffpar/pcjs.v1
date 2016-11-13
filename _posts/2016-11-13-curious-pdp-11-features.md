---
layout: post
title: Curious PDP-11 Features
date: 2016-11-13 13:00:00
permalink: /blog/2016/11/13/
---

Last week, I ran PDPjs through a series of early DEC PDP-11 diagnostic tests on paper tape.
These tests were originally released in 1970 and are documented in such DEC publications as the
[MAINDEC USER REFERENCE MANUAL](http://archive.pcjs.org/pubs/dec/pdp11/diags/MAINDEC_User_Reference_Manual_Oct73.pdf)
(October 1973).

[Tests 1-12](/apps/pdp11/tapes/diags/#tests-1-12), "MAINDEC-11-D0AA-PB" through "MAINDEC-11-D0LA-PB", 
uncovered a couple of uninteresting bugs in the emulator that affected the ASRB and RORB instructions, both involving some
incorrect masks.  But aside from those hiccups, the tests ran fine.  Ditto for [Test 13](/apps/pdp11/tapes/diags/#test-13).

Things got much more interesting in [Test 14](/apps/pdp11/tapes/diags/#test-14).  For starters (and as DEC's documentation
points out), the test will immediately fail (HALT) if run on a PDP-11/40 or PDP-11/45, because it tests the RESERVED
instruction trap by using the MUL opcode, which was only reserved on early PDP-11's, like the PDP-11/20.

After switching to a [PDP-11/20 configuration](/devices/pdp11/machine/1120/panel/debugger/), Test 14 uncovered a series of
problems, including:

- The DL11 transmitter must generate an interrupt *immediately* after being enabled
- When a RESERVED instruction trap occurs with an invalid stack pointer, the RESERVED instruction trap must be immediately
followed by a stack overflow trap
- When a hardware interrupt occurs with an invalid stack pointer, the hardware interrupt trap must be immediately followed
by a stack overflow trap (ie, before the first instruction of the hardware interrupt handler is executed)
- When a BUS error occurs while fetching an opcode, the address of the opcode must be pushed by the trap handler
- When a trap handler loads a new PSW that allows a hardware interrupt to be acknowledged, the acknowledgement must be delayed
by one instruction

And finally, the most interesting bug uncovered by Test 14 involved instructions like this:

	MOV     R0,(R0)+

Imagine that R0 contains 1000.  PDPjs (as well as several other emulators I tested) would write the value 1000 to address
1000 after auto-incrementing R0 to 1002.

Unfortunately, that's wrong.  Apparently, the PDP-11 performs both source and destination address calculations *before*
reading and writing the source and destination values.  So, in the above example, the value 1002 must be written to address 1000.

I should add that not all emulators get this wrong: [SimH](https://github.com/simh/simh), the gold standard of PDP-11
emulators, handles it correctly.

Don't confuse this behavior with the order in which the source and destination operands are processed (source operands
are always decoded first, destination operands next), or with the fact that the auto-increment mode is actually a *post*-
increment mode, whereas auto-decrement is a *pre*-decrement mode.  Those things are also true, but they have nothing to do
with this bug.

PDPjs resolved the bug by using a special (negative) value to indicate a register source operand, which is then converted
to the register's current value after both operands have been decoded.  Test 14 now passes.

Next up: Test 15!

---

It's worth noting that all these diagnostic paper tape images are in the [Absolute Loader](/apps/pdp11/tapes/absloader/) format,
but unlike tapes like [PDP-11 BASIC](/apps/pdp11/tapes/basic/), they don't include a start address, so you have to read the
documentation for each test to learn the starting procedure, including any switches that should be set first.

However, PDPjs makes life a bit simpler for you.  As noted for other [DEC PDP-11 Tape Images](/apps/pdp11/tapes/), any
"Absolute Format" tape can be loaded directly into RAM using the machine's "Load" button instead of "Attach", allowing you
to bypass the usual three-step process of loading the [Bootstrap Loader](/apps/pdp11/boot/bootstrap/) in order to load the
[Absolute Loader](/apps/pdp11/tapes/absloader/) in order to load the desired tape.

Moreover, PDPjs' JSON-encoded paper tape images support an *exec* property that allows the start address to be explicitly
set, which will override any start address inside the image.  For these diagnostics, I have set the start address (usually 200)
via the *exec* property.

*[@jeffpar](http://twitter.com/jeffpar)*  
*Nov 13, 2016*
