Experimental Grunt Tasks
========================

I experimented briefly with a few Grunt tasks, but working with Grunt wasn't all that pleasant,
and neither of these tasks are all that important right now, so they're only here for a rainy day or
to be cannibalized for some other purpose.

[manifester](manifester/) was intended to open a manifest.xml file (discussed in more detail [here](/apps/))
and download all the referenced files.  The task was inspired by `npm install`, which downloads all the required
modules specified in [package.json](/package.json) without requiring them to be checked into the project.
However, the manifest design needs to be fleshed out more before work on this continues.

[prepjs](prepjs/) was intended to inline well-defined constants in all JavaScript files before running them
through the Closure Compiler, but it turned out that:
 
- the Grunt task would quickly run out of memory
- the Closure Compiler actually did a pretty good job inlining all by itself
