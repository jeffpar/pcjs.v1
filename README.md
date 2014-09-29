The Original IBM PC in Your Browser
---

Welcome to [pcjs.org](http://www.pcjs.org/) and [PCjs](/docs/about/pcjs/), the first IBM PC simulation to run in your
web browser without any plugins.  It was added to the [JavaScript Machines](/docs/about/) project in Fall 2012.
The project now includes:

* [PCjs](/docs/about/pcjs/), a simulation of the original IBM PC (circa 1981)
* [C1Pjs](/docs/c1pjs/), a simulation of the OSI Challenger 1P (circa 1978)

All our simulations are written entirely in JavaScript.  No Flash, Java or other plugins are required.
Supported browsers include recent versions of Internet Explorer (v9.0 or later), Safari, Chrome, Firefox and various
mobile browsers.

[[Embedded IBM PC]](/configs/pc/machines/5150/mda/64kb/ "PCjs:ibm5150")

The [simulation](/configs/pc/machines/5150/mda/64kb/) above features an Intel 8088 running at 4.77Mhz,
with 64Kb of RAM and an IBM Monochrome Display Adapter.  For more control, there are also
[Control Panel](/configs/pc/machines/5150/mda/64kb/debugger/) and [Soft Keyboard](/configs/pc/machines/5150/mda/64kb/softkbd/)
configurations, featuring the built-in PCjs Debugger.  For even greater control, build your own PC. The
[PCjs Documentation](/docs/pcjs/) will help you get started.

The goals of the [JavaScript Machines](/docs/about/) project are to create fast, full-featured simulations of classic
computer hardware, help people understand how these early machines worked, make it easy to experiment with different
machine configurations, and provide a platform for running and analyzing old computer software.

Demos
---
Some pre-configured machines are shown below, ready to run BASIC, DOS, Windows 1.01, and assorted non-DOS software.

![IBM PC running DONKEY.BAS](/configs/pc/machines/5150/cga/64kb/donkey/thumbnail.jpg "link:/configs/pc/machines/5150/cga/64kb/donkey/:200:100")
![IBM PC XT w/CGA, 10Mb Hard Drive](/configs/pc/machines/5160/cga/256kb/demo/thumbnail.jpg "link:/configs/pc/machines/5160/cga/256kb/demo/:200:100")
![IBM PC XT w/CGA, Windows 1.01](/configs/pc/machines/5160/cga/256kb/win101/thumbnail.jpg "link:/configs/pc/machines/5160/cga/256kb/win101/:200:100")
![IBM PC XT w/EGA, Windows 1.01](/configs/pc/machines/5160/ega/640kb/win101/thumbnail.jpg "link:/configs/pc/machines/5160/ega/640kb/win101/:200:100")
![IBM PC w/MDA, CP/M-86](/disks/pc/cpm/thumbnail.jpg "link:/disks/pc/cpm/:200:100")
![IBM PC w/MDA, Microsoft Adventure](/disks/pc/games/microsoft/adventure/thumbnail.jpg "link:/disks/pc/games/microsoft/adventure/:200:100")
![IBM PC w/CGA, Zork I](/disks/pc/games/infocom/zork1/thumbnail.jpg "link:/disks/pc/games/infocom/zork1/:200:100")

Check out the rest of the PCjs [Application](/apps/pc/), [Boot Disk](/disks/pc/) and [Machine](/configs/pc/machines/)
demos, including the [IBM PC XT "Server Array"](/configs/pc/machines/5160/cga/256kb/array/) and
[Windows 1.01 "Server Array"](/configs/pc/machines/5160/ega/640kb/array/) demos of multiple PCs running side-by-side.

C1Pjs
---
Below is the [OSI Challenger C1P](/docs/c1pjs/), another simulation in the JavaScript Machines project.
It simulates Ohio Scientific's 6502-based microcomputer, released in 1978.  More details about this simulation
and the original machine are available in the [C1Pjs Documentation](/docs/c1pjs/).

[[Embedded OSI Challenger C1P]](/configs/c1p/machines/8kb/large/ "C1Pjs:demoC1P")

<!--BEGIN:EXCLUDE-->

Installing PCjs
---
The following instructions were written for OS X users.  However, users of other operating systems should have
no problem following along.

Open Terminal and `cd` to a directory where you'd like to install *pcjs*, and run the following commands:

	git clone git@github.com:jeffpar/pcjs.git pcjs
	cd pcjs
	npm install
	node server.js

Now open a web browser and go to `http://localhost:8088/`.  You're done! 

It's assumed that the OS X Developer Tools (which include Git) have already been installed, as well as
Node and NPM.  Node (which now includes NPM) should be downloaded from [nodejs.org](http://nodejs.org/download/).

The current version of Node ([0.10.32](http://nodejs.org/dist/v0.10.32/node-v0.10.32.pkg) at the time of this
writing) should work fine, but version [0.10.26](http://nodejs.org/dist/v0.10.26/node-v0.10.26.pkg)
is what's been used to develop and test PCjs so far.

Also, [server.js](server.js) was originally written using [Express](http://expressjs.com/) v3.x.  Since then,
Express v4.x has been released, but `npm install` will make sure that v3.x is installed locally.

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
interface to Grunt; you can install that locally as well, but it's recommended that you install it globally, with
the "-g" option:

	sudo npm install grunt-cli -g

Now you can run `grunt` anywhere within the PCjs project to build an updated version.  If no command-line arguments
are specified, `grunt` runs the "default" task defined by [Gruntfile.js](Gruntfile.js); that task runs Google's
[Closure Compiler](https://developers.google.com/closure/compiler/) if any of the target files (eg, pc.js, pc-dbg.js,
etc) are out-of date.

To ensure identical compilation results for everyone, a copy of the Closure Compiler has been checked into the
[bin](bin/) folder.  This version of Closure Compiler, in turn, requires Java v7.x or later.  Use the following
commands to confirm that everything is working properly:

	java -version
	
which should report a version >= 1.7.x; eg:
	
    java version "1.7.0_67"
    Java(TM) SE Runtime Environment (build 1.7.0_67-b01)
    Java HotSpot(TM) 64-Bit Server VM (build 24.65-b04, mixed mode)

Then run:

	java -jar bin/compiler.jar --version
	
which should report:

	Closure Compiler (http://code.google.com/closure/compiler)
	Version: v20140407
	Built on: 2014/04/07 14:04
	
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
template ([common.html](my_modules/shared/templates/common.html)) and generates an "index.html" for that folder.

The contents of the "index.html" will vary depending on the contents of the folder; for example, if the folder
contains a README.md, then that file is converted to HTML and embedded in the "index.html".  Similarly, if the folder
contains a machine XML file, that is embedded as well.

### From The Command-Line

The PCjs client app can also be run from the command-line mode using Node, making it possible to script the application,
run a series of automated tests, etc:

    cd ./my_modules/pcjs-client/bin
    node pcjs

The [pcjs](my_modules/pcjs-client/bin/pcjs) script in [/my_modules/pcjs-client/bin](my_modules/pcjs-client/bin) loads
all the PCjs browser scripts listed in [package.json](/package.json), and then it starts a Node REPL ("read-eval-print loop").
The REPL handles a few special commands (eg, "load", "quit") and passes anything else to the PCjs Debugger component.
If no Debugger component has been created yet, or if the Debugger didn't recognize the command, then it's passed on to *eval()*,
like a good little REPL.

Use the "load" command to load a JSON machine configuration file.  A sample [machine.json](my_modules/pcjs-client/bin/machine.json)
is provided in the *bin* directory, which is a "JSON-ified" version of the [machine.xml](configs/pc/machines/5150/mda/64kb/machine.xml)
displayed on the [pcjs.org](/) home page.

The command-line loader creates all the JSON-defined machine components in the same order that the browser creates
XML-defined components.  You can also issue the "load" command directly from the command-line:

    node pcjs --cmd="load machine.json"

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

To help test/debug changes to PCjs server components (eg, [DiskDump](my_modules/diskdump/), [HTMLOut](my_modules/htmlout/)),
you can start the server with some additional options; eg:

	node server.js --logging --console --debug
	
The `--logging` option will create a [node.log](/logs/node.log) that records all the HTTP requests, `--debug`
will generate additional debug-only messages (which will also be logged if `--logging` is enabled), and `--console`
will replicate any messages to your console as well.

A complete list of command-line options can be found in [server.js](server.js).

### Client Components

A special parameter ("gort") can be appended to the URL to request uncompiled client source files, making problems
much easier to debug:

	http://localhost:8088/?gort=debug

However, the "gort=debug" parameter is unnecessary if the server was started with `--debug`; the server always
serves uncompiled files when running in "debug" mode.

Conversely, if the server is running "debug" mode but you want to test a compiled version of PCjs, use:

	http://localhost:8088/?gort=release

and the server will serve compiled JavaScript files, regardless whether the server is running in "debug" or "release"
mode.

Updating PCjs
---

### Developing

To start developing features for a new version of PCjs, here are the recommended steps:
 
1. Change the version number in [package.json](/package.json)
2. Run the "grunt promote" task to bump the version in all machine XML files
3. Make changes
4. Run "grunt" to build new versions of the apps (eg, "/versions/pcjs/1.xx/pc.js")
 
However, you may want to skip step #2 until you're ready to start testing the new version.  Depending on the nature
of your changes, it may be better to manually edit the version number in only a few machine XML files for testing,
leaving the rest of the XML files pointing to the previous version.  Run "grunt promote" when the new version is much
closer to being released.

### Testing

In the course of testing PCjs, there may be stale "index.html" files that prevent you from seeing application
updates, changes to README.md files, etc.  So, before running Node, you may want to "touch" the default HTML template:

	touch my_modules/shared/templates/common.html
	
The [HTMLOut](/my_modules/htmlout/) module compares the timestamp of that template file to the timestamp of any
"index.html" and will regenerate the latter if it's out-of-date.

There's a TODO to expand that check to include the timestamp of any local README.md file, but there are many other
factors that can contribute to stale "index.html" files, so usually the safest thing to do is "touch" the
[common.html](/my_modules/shared/templates/common.html) template, or delete all existing "index.html" files, either
manually or with the Grunt "clean" task:

	grunt clean
	
<!--END:EXCLUDE-->

More Information
---
Learn more about the [JavaScript Machines](/docs/about/) project and [PCjs](/docs/about/pcjs/).  To
create your own PCjs machines, see the [Documentation](/docs/pcjs/) for details.

If you have questions or run into any problems, you're welcome to [tweet](http://twitter.com/jeffpar) or
[email](mailto:Jeff@pcjs.org).