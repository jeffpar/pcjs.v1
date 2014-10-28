JavaScript Negativity
---
For those of us coming from the world of C, it's easy to be "negative" about the way JavaScript deals with 32-bit
integers.

As a newcomer, you quickly learn that JavaScript supports only one numeric data type -- 64-bit floats -- and you groan.

Then you learn that all the "bitwise" operators (**~**, **|**, **&**, **^**, **&lt;&lt;**, **&gt;&gt;** and
**&gt;&gt;&gt;**) treat their operands as 32-bit integer values and produce 32-bit integer results, and you breathe
a sigh of relief.

But then you start noticing oddities.  In 32-bit C programming, you can take any 32-bit value,
such as -1526726656 (which is equivalent to 0xA5000000), mask it with 0x80808080, and get 0x80000000.  However,
in JavaScript, you actually get -0x80000000, which, sadly, is not equal to 0x80000000.

To verify, type the following into any JavaScript REPL (eg, Node):

	> n = -1526726656
	-1526726656
	> n &= 0x80808080
	-2147483648
	> n.toString(16)
	'-80000000'

So the notion that bitwise operators yield 32-bit results isn't exactly right; every result continues to be
sign-extended into the entire 52 "significand" bits of the underlying 64-bit float.  And it's impossible to simply
"mask away" those unwanted sign bits, thanks to the fundamental restriction of JavaScript bitwise operators:
they operate *only* on the low 32 bits.

If you really want 0x80000000 instead of -0x80000000, add 0x100000000:

	> n = (n < 0? n + 0x100000000 : n)
	2147483648
	> n.toString(16)
	'80000000'

This works because JavaScript is perfectly capable of representing 0x80000000 as a positive number.
But be careful, because as soon as you perform *any* bitwise operation on a value with bit 31 set, even
something as innocuous-looking as:

	> n |= 0
	-2147483648
	> n.toString(16)
    '-80000000'

Viola: instant negative number!  To continue the fun, now "or" a one into bit 0:

	> n |= 1
	-2147483647
	> n.toString(16)
	'-7fffffff'
	
Viola: all low 32 bits have instantly flipped!

Actually, no, this time, I'm pulling your leg.  The low 32 bits of the internal value are exactly what you would
expect: 0x80000001 (the internal representation would look more like 0xFFFFF80000001).  The toString() method is
just a little misleading.  As the MDN docs explain, for a negative number, toString() returns the positive
representation of the number, preceded by a - sign, *not* the "two's complement" of the number.
 
*[@jeffpar](http://twitter.com/jeffpar)*  
*October 26, 2014*
