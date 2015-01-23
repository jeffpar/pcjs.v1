PCjs Uncompiled
---
Most machines on [pcjs.org](http://www.pcjs.org/) run with a compiled version of PCjs, which is produced
by running PCjs JavaScript source code through Google's Closure Compiler, yielding a smaller (minified)
version that loads and runs much faster than the original source code.

However, certain features are disabled in the compiled versions, including a new BACKTRACK feature that
makes it possible to track the contents of memory locations and registers back to their source (eg, to a ROM
or file location).  Once the BACKTRACK feature is finished, it will be folded into the compiled code, but until
then, the only way to experiment with it is by running the uncompiled code.

To make it easier to launch machines with the uncompiled code, the PCjs server now allows the *version* field
of a PCjs machine link to specify "uncompiled"; previously, the only *version* values allowed were a specific
version number (eg, "1.16.5") or an asterisk (which would default to the latest compiled version).

Here's how you embed an "uncompiled" machine in a PCjs Markdown file:

	[Embedded IBM PC](/devices/pc/machine/5170/ega/1152kb/rev3/ "PCjs:at-ega-1152k-rev3::uncompiled:debugger")

And here's that example in action, in the Markdown ([README.md]()) file you are reading right now:

[Embedded IBM PC](/devices/pc/machine/5170/ega/1152kb/rev3/ "PCjs:at-ega-1152k-rev3::uncompiled:debugger")

*[@jeffpar](http://twitter.com/jeffpar)*  
*January 17, 2015*
