Build Tools
---
This is where all the server-side PHP code used to reside.  I've since deleted that code from the project,
because it's all been ported to JavaScript as a collection of [Node modules](/my_modules/).

All that remains here is the version of Google's Closure Compiler (and its associated [README](README)) that I use
to build the client-side JavaScript files -- not because I have any attachment to this particular version, but because
updating requires a lot of testing, and I don't really have a regression test suite yet.  Besides, every newer
version of the Closure Compiler I've tried this year (2014) has resulted in slightly *slower* performance, so there's
even less incentive to update it.

Here are some useful links regarding Google's Closure Compiler:

- [Documentation](https://developers.google.com/closure/compiler/docs/overview)
- [Project on GitHub](https://github.com/google/closure-compiler)
- [Release details](https://github.com/google/closure-compiler/wiki/Releases)
- [Link to the latest version](http://dl.google.com/closure-compiler/compiler-latest.zip)
- [Discussion Group](https://groups.google.com/forum/#!forum/closure-compiler-discuss)

There used to be some other build tools here, including a *makefile* and assorted shell scripts, but now that
I've transitioned everything to JavaScript, the build process is driven by [Grunt](http://gruntjs.com/) and the project's
[Gruntfile.js](/Gruntfile.js). 
