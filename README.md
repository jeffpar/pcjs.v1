---
layout: page
title: PCjs
permalink: /
developer: false
machines:
  - type: pc
    id: ibm5150
    config: /devices/pc/machine/5150/mda/64kb/machine.xml
  - type: c1p
    id: demoC1P
    config: /devices/c1p/machine/8kb/large/machine.xml
---

Welcome to [PCjs](/docs/about/pcjs/), the first IBM PC simulation to run in your web browser without any plugins.
It was added to the [JavaScript Machines](/docs/about/) project in Fall 2012, and is now part of the
[PCjs Project](https://github.com/jeffpar/pcjs) on [GitHub](https://github.com/).  The project includes:

* [PCjs](/docs/about/pcjs/), a simulation of the original IBM PC (circa 1981)
* [C1Pjs](/docs/c1pjs/), a simulation of the OSI Challenger 1P (circa 1978)

All the simulations are written entirely in JavaScript.  No Flash, Java or other plugins are required.
Supported browsers include modern versions of Chrome, Safari, Firefox, Internet Explorer (v9.0 and up), Edge,
and assorted mobile browsers.

{% include machine.html id="ibm5150" %}

The [simulation](/devices/pc/machine/5150/mda/64kb/) above features an Intel 8088 running at 4.77Mhz,
with 64Kb of RAM and an IBM Monochrome Display Adapter.  For more control, there are also
[Control Panel](/devices/pc/machine/5150/mda/64kb/debugger/) and [Soft Keyboard](/devices/pc/machine/5150/mda/64kb/softkbd/)
configurations, featuring the built-in PCjs Debugger.  For even greater control, build your own PC. The
[PCjs Documentation](/docs/pcjs/) will help you get started.

The goals of the [JavaScript Machines](/docs/about/) project are to create fast, full-featured simulations of classic
computer hardware, help people understand how these early machines worked, make it easy to experiment with different
machine configurations, and provide a platform for running and analyzing old computer software.

Demos
---
Some pre-configured machines are shown below, ready to run BASIC, DOS, Windows 1.01, and assorted non-DOS software.

[<img src="/devices/pc/machine/5150/cga/64kb/donkey/thumbnail.jpg" width="200" height="100"/>](/devices/pc/machine/5150/cga/64kb/donkey/ "IBM PC running DONKEY.BAS")
[<img src="/devices/pc/machine/5160/cga/256kb/demo/thumbnail.jpg" width="200" height="100"/>](/devices/pc/machine/5160/cga/256kb/demo/ "IBM PC XT w/CGA, 10Mb Hard Drive")
[<img src="/devices/pc/machine/5160/cga/256kb/win101/thumbnail.jpg" width="200" height="100"/>](/devices/pc/machine/5160/cga/256kb/win101/ "IBM PC XT w/CGA, Windows 1.01")
[<img src="/devices/pc/machine/5160/ega/640kb/win101/thumbnail.jpg" width="200" height="100"/>](/devices/pc/machine/5160/ega/640kb/win101/ "IBM PC XT w/EGA, Windows 1.01")
[<img src="/disks/pc/os2/ibm/1.0/thumbnail.jpg" width="200" height="100"/>](/disks/pc/os2/ibm/1.0/ "IBM PC AT w/EGA, OS/2 1.0")
[<img src="/disks/pc/cpm/thumbnail.jpg" width="200" height="100"/>](/disks/pc/cpm/ "IBM PC w/MDA, CP/M-86")
[<img src="/disks/pc/games/microsoft/adventure/thumbnail.jpg" width="200" height="100"/>](/disks/pc/games/microsoft/adventure/ "IBM PC w/MDA, Microsoft Adventure")
[<img src="/disks/pc/games/infocom/zork1/thumbnail.jpg" width="200" height="100"/>](/disks/pc/games/infocom/zork1/ "IBM PC w/CGA, Zork I")

Check out the rest of the PCjs [Application](/apps/pc/), [Boot Disk](/disks/pc/) and [Machine](/devices/pc/machine/)
demos, including an [IBM PC Dual Display System](/devices/pc/machine/5150/dual/64kb/) demo of multiple monitor support,
and [IBM PC XT "Server Array"](/devices/pc/machine/5160/cga/256kb/array/) and [Windows 1.01 "Server Array"](/devices/pc/machine/5160/ega/640kb/array/)
demos of multiple machines running side-by-side.

C1Pjs
---
Below is the [OSI Challenger C1P](/docs/c1pjs/), another simulation in the JavaScript Machines project.
It simulates Ohio Scientific's 6502-based microcomputer, released in 1978.  More details about this simulation
and the original machine are available in the [C1Pjs Documentation](/docs/c1pjs/).

{% include machine.html id="demoC1P" %}

{% if page.developer %}

---

Developer Notes
---

The [PCjs repository](https://github.com/jeffpar/pcjs) on GitHub contains everything needed to run PCjs
computer simulations.  The [PCjs](/docs/pcjs/) and [C1Pjs](/docs/c1pjs/) emulators run in any modern web browser,
with or without a web server, and examples are provided for both [local](/docs/pcjs/demos/) and [remote](http://www.pcjs.org/)
operation.

The project includes:

- A simple Node-based web server ([server.js](server.js))
- Custom Node modules used by the web server ([HTMLOut](modules/htmlout/), [MarkOut](modules/markout/), [DiskDump](modules/diskdump/), [FileDump](modules/filedump/))
- A variety of IBM PC and C1P configuration and resource files (see [/apps](apps/), [/devices](devices/) and [/disks](disks/))
- The [PCjs](modules/pcjs/lib/) and [C1Pjs](modules/c1pjs/lib/) client applications, both "compiled" and uncompiled
- A smattering of [PCjs](docs/pcjs/) and [C1Pjs](docs/c1pjs/) documentation, along with [blog posts](blog/), related [publications](pubs/) and more

The bundled web server is not strictly required.  Any web server (Node, Apache, Nginx, etc) that can serve the necessary
JavaScript files to your browser will work.  However, instructions for doing that are beyond the scope of this introduction.

In fact, you can run PCjs simulations without a web server at all, using the "file:" protocol instead of "http:".
However, most of the machine configurations require additional resource files (ROMs, disk images, etc), which are
included in the project, but unless all the resource files are moved into a single directory (as they are in these
[Demos](/docs/pcjs/demos/)), your browser will probably be unable to load all of them, due to security restrictions.
Using the bundled web server is the preferred solution.

The project includes a large selection of disk images, and a powerful [DiskDump](modules/diskdump/) utility that
runs on both the client and server, featuring a command-line interface (CLI) and web server API.  Originally created to dump
existing disk images as JSON, **DiskDump** has evolved into a full-featured disk image generator, capable of creating PC-compatible
diskette *and* hard disk images from either lists *or* directories of files (including all subdirectories).

### Installing PCjs

The following instructions were originally written for OS X.  However, users of other operating systems should have
no problem following along.  There are some prerequisites:

- Node with NPM (download an installation package for your OS from [nodejs.org](http://nodejs.org/download/))
- Git (included with OS X Developer Tools; separate download required for [Windows](http://git-scm.com/download/win))

Some additional (optional) tools are also recommended:

- Python (included with OS X; separate download required for [Windows](https://www.python.org/downloads/windows/))
- GitHub (useful for getting Git set up on [Windows](https://windows.github.com/); also available for [OS X](https://mac.github.com/)) 

Once you have the prerequisites, open a command-line window, `cd` to the directory where you'd like to install PCjs,
and type the following commands:

	git clone git@github.com:jeffpar/pcjs.git pcjs
	cd pcjs
	npm install
	node server.js

Now open a web browser and go to `http://localhost:8088/`.  You're done!
 
If you just want to launch the web server or don't plan to do any development, you can reduce the
footprint slightly by asking NPM to install only "production" modules (which can also eliminate some
errors if, for example, you neglected to install Python):
 
	npm install --production
	
If you ever inadvertently run `npm install` without `--production`, you can easily uninstall all the
"devDependencies" listed in [package.json](package.json) with this command:

	npm prune --production
	
Finally, when installing on an AWS server, although you have complete control over how Node is launched, you
don't have direct control over NPM; I think the best you can do is set the following AWS "Environment Property":

	NPM_CONFIG_PRODUCTION=true
	
The current version of Node ([0.10.32](http://nodejs.org/dist/v0.10.32/node-v0.10.32.pkg) at the time of this
writing) should work fine, but version [0.10.26](http://nodejs.org/dist/v0.10.26/node-v0.10.26.pkg)
is what's been used to develop and test PCjs so far.

Also, [server.js](server.js) was originally written using [Express](http://expressjs.com/) v3.  Since then,
Express v4 has been released, but the `npm install` command above will make sure that v3 is installed locally.

The plan is to eventually move development to a newer version of Node, and migrate the PCjs server to a newer
version of Express; there's no desire to remain stuck in the past (well, ignoring the fact that PCjs is the
quintessential "stuck in the past" project), but there's also no urgency to update.

### Building PCjs

Unlike a typical project, where you have to *build* or *configure* or *make* something, PCjs is "ready to run".
That's because both the compiled and uncompiled versions of PCjs are checked into the project, making deployment
to a web server easy.

However, in order to build and test PCjs modifications, you'll want to use [Grunt](http://gruntjs.com/) and the
Grunt tasks defined by [Gruntfile.js](Gruntfile.js).

Although Grunt was installed locally when you ran `npm install`, you'll also want to install the command-line
interface to Grunt. You can install that locally as well, but it's recommended you install it globally with `-g`;
OS X users may also need to preface this command with `sudo`:

	npm install grunt-cli -g

Now you can run `grunt` anywhere within the PCjs project to build an updated version.  If no command-line arguments
are specified, `grunt` runs the "default" task defined by [Gruntfile.js](Gruntfile.js); that task runs Google's
[Closure Compiler](https://developers.google.com/closure/compiler/) if any of the target files (eg, pc.js or pc-dbg.js
in the [/versions](versions/) directory) are out-of date.

To ensure consistent compilation results, a copy of the Closure Compiler has been checked into the
[/bin](bin/) folder.  This version of Closure Compiler, in turn, requires Java v7 or later.  Use the following
commands to confirm that everything is working properly:

	java -version
	
which should report a version >= 1.7; eg:
	
    java version "1.7.0_67"
    Java(TM) SE Runtime Environment (build 1.7.0_67-b01)
    Java HotSpot(TM) 64-Bit Server VM (build 24.65-b04, mixed mode)

Then run:

	java -jar bin/compiler.jar --version
	
which should report:

	Closure Compiler (http://github.com/google/closure-compiler)
	Version: v20150609
	Built on: 2015/06/09 16:35

If you don't have Java installed, it's recommended that you install the JDK (*not* the JRE), because the JRE may not
update your command-line tools properly.  Note that Java is used *only* by the Closure Compiler; none of the PCjs
client or server components use Java.

Newer versions of the Closure Compiler should work as well, and at some point, a newer version will be checked into the
project.

Using PCjs
---

### From The Browser

The PCjs web server is little more than a file/directory browser for the PCjs project, plus a collection of APIs.

If a URL corresponds to a PCjs project folder and no "index.html" exists in that folder, the server loads an HTML
template ([common.html](modules/shared/templates/common.html)) and generates an "index.html" for that folder.

The contents of the "index.html" will vary depending on the contents of the folder; for example, if the folder
contains a README.md, then that file is converted to HTML and embedded in the "index.html".  Similarly, if the folder
contains a machine XML file, that is embedded as well.

### From The Command-Line

The PCjs client app can also be run from the command-line mode using Node, making it possible to script the application,
run a series of automated tests, etc:

    cd modules/pcjs/bin
    node pcjs

The [pcjs](modules/pcjs/bin/pcjs) script in [modules/pcjs/bin](modules/pcjs/bin) loads
all the PCjs browser scripts listed in the root [package.json](/package.json) and then starts a Node REPL ("read-eval-print loop").
The REPL handles a few special commands (eg, "load", "quit") and passes anything else to the PCjs Debugger component.
If no Debugger component has been created yet, or if the Debugger didn't recognize the command, then it's passed on to *eval()*,
like a good little REPL.

Use the "load" command to load a JSON machine configuration file.  A sample [ibm5150.json](modules/pcjs/bin/ibm5150.json)
is provided in the *bin* directory, which is a "JSON-ified" version of the [machine.xml](devices/pc/machine/5150/mda/64kb/machine.xml)
displayed on the [pcjs.org](/) home page.

The command-line loader creates all the JSON-defined machine components in the same order that the browser creates
XML-defined components.  You can also issue the "load" command directly from the command-line:

    node pcjs --cmd="load ibm5150.json"

In fact, any number of "--cmd" arguments can be included on the command-line.  A batch file syntax will eventually be
added, too.

When PCjs runs in a browser, an XML machine configuration file is transformed into HTML with a set of DIVs for each
component: an "object" DIV whose *data-value* attribute provides the initialization parameters for the corresponding
component, along with a set of optional "control" DIVs that the component can bind to (eg, a "Run" button, or a visual
representation of DIP switches, or whatever).

When PCjs is run from the command-line, there is no XML, HTML, or DIVs involved; this is basically a "headless" version
of PCjs, so there is no simple way to view a machine's video display or interact with its keyboard, mouse, etc.
You have to use Debugger commands to dump the machine's video buffer.

Since I was not inclined to add XML support to my Node environment, this has created some divergence between client
and server operation: PCjs on the client supports *only* XML machine configuration files, whereas PCjs on the server
supports *only* JSON machine configuration files.

I haven't decided whether I'll add support for JSON configuration files to the client, or add some XML-to-JSON conversion
to the server, or both.

Debugging PCjs
---

### Server Components

To help test/debug changes to PCjs server components (eg, [DiskDump](modules/diskdump/), [HTMLOut](modules/htmlout/)),
you can start the server with some additional options; eg:

	node server.js --logging --console --debug
	
The `--logging` option will create a [node.log](/logs/node.log) that records all the HTTP requests, `--debug`
will generate additional debug-only messages (which will also be logged if `--logging` is enabled), and `--console`
will replicate any messages to your console as well.

If you want server.js to use a different port (the default is 8088), set PORT in your environment before starting
the server:

	export PORT=80
	
or add `--port` to your command-line:

	node server.js --logging --console --debug --port=80

A complete list of command-line options can be found in [server.js](server.js).

### Client Components

A special command parameter ("gort") can be appended to the URL to request uncompiled client source files, making PCjs
and C1Pjs much easier to debug, albeit much slower:

	http://localhost:8088/?gort=debug

The "gort=debug" command is unnecessary if the server is started with `--debug`; the server always serves uncompiled
files when running in debug mode.

Conversely, if the server is in debug mode but you want to test a compiled version of PCjs, use:

	http://localhost:8088/?gort=release

and the server will serve compiled JavaScript files, regardless whether the server is running in debug mode or
release mode.

Another useful gort command is "gort=nodebug", which is like "gort=debug" in that it serves uncompiled files, but
it *also* sets the client-side **DEBUG** variable to **false**, disabling all debug-only runtime checks in the client
and allowing the simulation to run much faster (although not as fast as compiled code):

	http://localhost:8088/?gort=nodebug

Regrettably, the gort command "Klaatu barada nikto" is not yet recognized.  Fortunately, there are no (known) situations
where PCjs could run amok and destroy the planet.

Other parameters that can be passed via the URL:

- *autostart*: set it to "true" to allow all machines to start normally, "false" to prevent all machines from starting,
or "no" to prevent all machines from starting *unless* they have no "Run" button.

For example:

	http://localhost:8088/?gort=debug&autostart=false

Updating PCjs
---

### Developing

To start developing features for a new version of PCjs, here are the recommended steps:
 
1. Change the version number in the root [package.json](/package.json)
2. Run the "grunt promote" task to bump the version in all the machine XML files
3. Make changes
4. Run "grunt" to build new versions of the apps (eg, "/versions/pcjs/1.x.x/pc.js")
 
You might also want to check out the blog post on [PCjs Coding Conventions](/blog/2014/09/30/).

You may also want to skip step #2 until you're ready to start testing the new version.  Depending on the nature
of your changes, it may be better to manually edit the version number in only a few machine XML files for testing,
leaving the rest of the XML files pointing to the previous version.  Run "grunt promote" when the new version is much
closer to being released.

### Testing

In the course of testing PCjs, there may be stale "index.html" files that prevent you from seeing application
updates, changes to README.md files, etc.  So before running Node, you may want to "touch" the default HTML template:

	touch modules/shared/templates/common.html
	
The [HTMLOut](modules/htmlout/) module compares the timestamp of that template file to the timestamp of any
"index.html" and will regenerate the latter if it's out-of-date.

There's a TODO to expand that check to include the timestamp of any local README.md file, but there are many other
factors that can contribute to stale "index.html" files, so usually the safest thing to do is "touch" the
[common.html](modules/shared/templates/common.html) template, or delete all existing "index.html" files, either
manually or with the Grunt "clean" task:

	grunt clean
	
{% endif %}

License
---
The [PCjs Project](https://github.com/jeffpar/pcjs) is now an open source project on [GitHub](http://github.com/).
All published portions are free for redistribution and/or modification under the terms of the
[GNU General Public License](/LICENSE) as published by the Free Software Foundation, either version 3 of the License,
or (at your option) any later version.

You are required to include the following copyright notice, with a link to [{{ site.pcjs_domain }}]({{ site.url }}):

> [PCjs]({{ site.url }}) © 2012-2015 by [Jeff Parsons](mailto:Jeff@pcjs.org) ([@jeffpar](http://twitter.com/jeffpar))

in every source code file of every copy or modified version of this work, and to display that notice on every web page
or computer that runs any version of this software.

See [LICENSE](/LICENSE) for details.

More Information
---
Learn more about the [JavaScript Machines](/docs/about/) Project and [PCjs](/docs/about/pcjs/).  To
create your own PCjs machines, see the [Documentation](/docs/pcjs/) for details.

If you have questions or run into any problems, feel free to [tweet](http://twitter.com/jeffpar) or
[email](mailto:Jeff@pcjs.org).
