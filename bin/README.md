Bin
---
This where all the server-side (PHP) code used to reside.  I've since deleted all the PHP code from the project,
because I more-or-less finished porting it all to server-side JavaScript, in assorted moduless located in
[my_modules](/my_modules/).  But of course, all the PHP code is still in Git's history, so you can always dig it up
again if you really want it.

All that remains here is the version of Google's Closure Compiler (and its associated [README](README)) that I use
to build the client-side JavaScript files -- not because I have any attachment to this particular version, but because
you never know if an update will break something unexpectedly.

So, just like all the Node modules that I depend on, frozen in time by the version numbers listed in
[package.json](../package.json), I don't update until I'm prepared to spend some time running a bunch of regression
tests.  Which is tedious, because I don't really have a regression test suite yet.  So I don't like to update my
dependencies very often.

Azure Files
---
[IISNode.yml]() was a file that needed to be in the root directory when I was running the website on Microsoft Azure
(formerly Windows Azure).  I didn't really want it in the root anymore, because I've since moved the website to AWS
Elastic Beanstalk, which has no use for it.  But, just in case I decide to use Azure again, I've saved that file here.

AWS Files
---
[awspush.sh]() is a script that saves various logs from the current AWS instance before pushing out a new release,
since invoking `git aws.push` will generally lose any files on the current AWS instance's volume.  It relies on
[awsget.sh]() to save copies of the remote logs in [Logs](../logs/).