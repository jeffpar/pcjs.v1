---
layout: page
permalink: /
machines:
  - id: ibm5150
    type: pcx86
    resume: 1
    name: "IBM PC (Model 5150) with Monochrome Display"
    config: /devices/pcx86/machine/5150/mda/64kb/machine.xml
  - id: demoC1P
    type: c1p
    config: /devices/c1p/machine/8kb/large/machine.xml
---

PCjs Machines
=============

Welcome to PCjs, home of [PCx86](/pubs/docs/pcx86/), the original IBM PC simulation that runs in your web browser.  It is
one of several JavaScript Machines in the [PCjs Project](https://github.com/jeffpar/pcjs), an open-source project that
includes:

* [PCx86](/pubs/docs/pcx86/), an x86-based emulator of the [IBM PC and PC-compatibles](/devices/pcx86/machine/)
* [PC8080](/modules/pc8080/), an 8080 machine emulator (see [Space Invaders](/devices/pc8080/machine/invaders/) and the [VT100 Terminal](/devices/pc8080/machine/vt100/))
* [C1Pjs](/pubs/docs/c1pjs/), an emulation of the 6502-based [Ohio Scientific Challenger 1P](/devices/c1p/)
* [PDPjs](/pubs/docs/pdpjs/), a set of machine emulation modules supporting the DEC [PDP-10](/devices/pdp10/machine/) and [PDP-11](/devices/pdp11/machine/)
* [PCjs Devices](/modules/devices/), for simple machines like the [TI-57 Calculator](/devices/ti57/), the [Game of Life](/devices/leds/life/), and [Lite-Brite](/devices/leds/litebrite/)

All PCjs machine simulations are written entirely in [JavaScript](/modules/).  No Flash, Java or other plugins are
required.  Supported browsers include modern versions of Chrome, Safari, Firefox, Internet Explorer (v9.0 and up), Edge,
and assorted mobile browsers.

{% include machine.html id="ibm5150" %}

The [JavaScript Machine](/devices/pcx86/machine/5150/mda/64kb/) above uses [PCx86](/pubs/docs/pcx86/) configured with an Intel
8088 running at 4.77Mhz, with 64Kb of RAM and an IBM Monochrome Display Adapter.  For more control, there are also
[Control Panel](/devices/pcx86/machine/5150/mda/64kb/debugger/) and [Soft Keyboard](/devices/pcx86/machine/5150/mda/64kb/softkbd/)
configurations, featuring the built-in PCx86 Debugger.  For even greater control, build your own PC. The
[PCx86 Documentation](/pubs/docs/pcx86/) will help you get started.

PCx86 has steadily evolved to support more classic x86-based machines, including the IBM PC XT, the 80286-based IBM PC AT,
and the 80386-based COMPAQ DeskPro 386.  PCx86 fully supports the original machine ROMs, video cards, etc, and all
machines run at their original speeds.

The goals of the [PCjs Project](/pubs/docs/about/) are to create fast, full-featured simulations of classic
computer hardware, help people understand how these early machines worked, make it easy to experiment with different
machine configurations, and provide a platform for running and analyzing old computer software.

Demos
-----
Some pre-configured machines are shown below, ready to run BASIC, DOS, Windows, OS/2, and other assorted software.

![IBM PC running VisiCalc](/apps/pcx86/1981/visicalc/thumbnail.jpg "link:/apps/pcx86/1981/visicalc/:200:120")
![IBM PC running DONKEY.BAS](/apps/pcx86/1981/donkey/thumbnail.jpg "link:/apps/pcx86/1981/donkey/:200:120")
![IBM PC XT w/EGA, Windows 1.0](/disks/pcx86/windows/1.00/thumbnail.jpg "link:/disks/pcx86/windows/1.00/:200:120")
![IBM PC XT w/CGA, Windows 1.01](/disks/pcx86/windows/1.01/cga/thumbnail.jpg "link:/disks/pcx86/windows/1.01/cga/:200:120")
![IBM PC XT w/EGA, Windows 1.01](/disks/pcx86/windows/1.01/thumbnail.jpg "link:/disks/pcx86/windows/1.01/:200:120")
![IBM PC AT w/EGA, OS/2 1.0](/disks/pcx86/os2/ibm/1.0/thumbnail.jpg "link:/disks/pcx86/os2/ibm/1.0/:200:120")
![COMPAQ DeskPro 386, Windows/386](/disks/pcx86/windows/2.0x/thumbnail.jpg "link:/disks/pcx86/windows/2.0x/:200:120")
![IBM PC AT w/EGA, Windows 3.0](/disks/pcx86/windows/3.00/thumbnail.jpg "link:/disks/pcx86/windows/3.00/:200:120")
![IBM PC AT w/VGA, Windows 3.1](/disks/pcx86/windows/3.10/thumbnail.jpg "link:/disks/pcx86/windows/3.10/:200:120")
![COMPAQ DeskPro 386, Windows 95](/disks/pcx86/windows/win95/4.00.950/thumbnail.jpg "link:/disks/pcx86/windows/win95/4.00.950/:200:120")
![IBM PC w/MDA, CP/M-86](/disks/pcx86/cpm/1.1b/thumbnail.jpg "link:/disks/pcx86/cpm/1.1b/:200:120")
![Microsoft Adventure (1981)](/disks/pcx86/games/microsoft/adventure/thumbnail.jpg "link:/disks/pcx86/games/microsoft/adventure/:200:120")
![Executive Suite (1982)](/apps/pcx86/1982/esuite/thumbnail.jpg "link:/apps/pcx86/1982/esuite/:200:120")
![Zork I (1982)](/disks/pcx86/games/infocom/zork1/thumbnail.jpg "link:/disks/pcx86/games/infocom/zork1/:200:120")
![Adventures in Math (1983)](/apps/pcx86/1983/adventmath/thumbnail.jpg "link:/apps/pcx86/1983/adventmath/:200:120")
![Rogue (1985)](/apps/pcx86/1985/rogue/thumbnail.jpg "link:/apps/pcx86/1985/rogue/:200:120")

There are many more [PCx86 Demos](/devices/pcx86/machine/#ready-to-run-app-demos), including an
[IBM PC with Dual Displays](/devices/pcx86/machine/5150/dual/64kb/) demonstrating early multi-monitor support,
and multiple IBM PC XT machines running side-by-side with [CGA Displays](/devices/pcx86/machine/5160/cga/256kb/array/)
and [EGA Displays](/devices/pcx86/machine/5160/ega/640kb/array/).

C1Pjs
-----
Below is the [OSI Challenger C1P](/pubs/docs/c1pjs/), another simulation in the PCjs Project.
It simulates Ohio Scientific's 6502-based microcomputer, released in 1978.  More details about this simulation
and the original machine are available in the [C1Pjs Documentation](/pubs/docs/c1pjs/).

{% include machine.html id="demoC1P" %}

<!--BEGIN:EXCLUDE-->

---

Developer Notes
---------------

The [PCjs repository](https://github.com/jeffpar/pcjs) on GitHub contains everything needed to run PCjs
computer simulations.  All the PCjs emulators run in any modern web browser, with or without a web server,
and examples are provided for both [local](/apps/pcx86/examples/) and [remote](http://www.pcjs.org/) operation.

The project includes:

- A simple Node-based web server ([server.js](server.js))
- Custom Node modules used by the web server ([HTMLOut](modules/htmlout/), [MarkOut](modules/markout/), [DiskDump](modules/diskdump/), [FileDump](modules/filedump/))
- A variety of IBM PC and C1P configuration and resource files (see [/apps](apps/), [/devices](devices/) and [/disks](disks/))
- The [PCx86](modules/pcx86/), [PC8080](modules/pc8080/), and [C1Pjs](modules/c1pjs/) client applications, along with "compiled" [versions](/versions/)
- A smattering of [PCx86](docs/pcx86/) and [C1Pjs](docs/c1pjs/) documentation, along with [blog posts](_posts/), related [publications](pubs/) and more

The bundled web server is not strictly required.  Any web server (Node, Apache, Nginx, etc) that can serve the necessary
JavaScript files to your browser will work.  However, instructions for doing that are beyond the scope of this introduction.

In fact, you can run PCjs simulations without a web server at all, using the "file:" protocol instead of "http:".
However, most of the machine configurations require additional resource files (ROMs, disk images, etc), which are
included in the project, but unless all the resource files are moved into a single directory (as they are in these
[Examples](/apps/pcx86/examples/)), your browser will probably be unable to load all of them, due to security restrictions.
Using the bundled web server is the preferred solution.

The project includes a large selection of disk images, and a powerful [DiskDump](modules/diskdump/) utility that
runs on both the client and server, featuring a command-line interface (CLI) and web server API.  Originally created to dump
existing disk images as JSON, **DiskDump** has evolved into a full-featured disk image generator, capable of creating PC-compatible
diskette *and* hard disk images from either lists *or* directories of files (including all subdirectories).

### Installing PCjs with Node

The following instructions were originally written for OS X.  However, users of other operating systems should have
no problem following along.  There are some prerequisites:

- Node with NPM (download an installation package for your OS from [nodejs.org](http://nodejs.org/download/))
- Git (included with OS X Developer Tools; separate download required for [Windows](http://git-scm.com/download/win))

Some additional (optional) tools are also recommended:

- Python (included with OS X; separate download required for [Windows](https://www.python.org/downloads/windows/))
- GitHub (useful for getting Git set up on [Windows](https://windows.github.com/); also available for
[OS X](https://mac.github.com/)) 

Once you have the prerequisites, open a command-line window, `cd` to the directory where you'd like to install PCjs,
and type the following commands:

	git clone git@github.com:jeffpar/pcjs.git pcjs
	cd pcjs
	npm install --production
	node server.js

Now open a web browser and go to `http://localhost:8088/`.  You're done!
 
The current version of Node ([0.10.32](http://nodejs.org/dist/v0.10.32/node-v0.10.32.pkg) at the time of this
writing) should work fine, but version [0.10.26](http://nodejs.org/dist/v0.10.26/node-v0.10.26.pkg)
is what's been used to develop and test PCjs so far.

Also, [server.js](server.js) was originally written using [Express](http://expressjs.com/) v3.  Since then,
Express v4 has been released, but the `npm install` command above will make sure that v3 is installed locally.

The plan is to eventually move development to a newer version of Node, and migrate the PCjs server to a newer
version of Express; there's no desire to remain stuck in the past (well, ignoring the fact that PCjs is the
quintessential "stuck in the past" project), but there's also no urgency to update.

### Installing PCjs with Jekyll

PCjs can also be used with [Jekyll](http://jekyllrb.com) and the Ruby WEBrick web server, now that a
*[jekyll](https://github.com/jeffpar/pcjs/tree/jekyll)* branch has been created to work with
[GitHub Pages](https://pages.github.com).  This is how the project is currently set up at [pcjs.org](http://www.pcjs.org/).

This isn't going to be a Jekyll "How To" guide, because that would unnecessarily repeat all the information available
at [GitHub Pages](https://pages.github.com).  But we'll summarize the basic steps, which replace the `npm` and `node`
steps above.

To install Jekyll for use with PCjs:

 1. Install Ruby (on OS X, it should already be installed)
 2. Install Bundler (on OS X, run `sudo gem install bundler`)
 3. Checkout the *jekyll* branch, since only that branch contains all the Jekyll-related files
 4. Create a **Gemfile** containing `gem 'github-pages'` (this is already checked in)
 5. Run `bundle install` (GitHub Pages alternatively suggests: `bundle exec jekyll build --safe`)
 6. Run `bundle exec jekyll serve` to start the web server

Now open a web browser and go to `http://localhost:4000/`.  You're done!

Some useful Jekyll server options include:

	bundle exec jekyll serve --host=0.0.0.0 --config _config.yml,_developer.yml

The *--host* option makes it possible to access the web server from other devices on your local network;
for example, you may want to run PCjs on your iPhone, iPad, or other wireless device.  And by adding **_developer.yml**,
you can override the Jekyll configuration defaults in **_config.yml**.  Using development (non-production) settings in
**_developer.yml** is analogous to running the Node web server with certain development options; see
[Debugging PCjs](#debugging-pcjs).

GitHub Pages says you can run `jekyll serve` instead of `bundle exec jekyll serve`, but with the addition of
more gems to **Gemfile** (eg, "jekyll-sitemap"), running `jekyll serve` may trigger dependency errors on some systems.
`bundle exec jekyll serve` should always work.

Don't see any YML files in the root of your project?  You probably forgot to switch to the
*[jekyll](https://github.com/jeffpar/pcjs/tree/jekyll)* branch:

	git checkout jekyll

Last but not least, run `bundle update` periodically to keep Jekyll up-to-date.

### Building PCjs

Unlike a typical project, where you have to *build* or *configure* or *make* something, PCjs is "ready to run".
That's because both the compiled and uncompiled versions of PCjs emulation modules are checked into the project,
making deployment to a web server easy.

However, in order to build and test PCjs modifications, you'll want to use [gulp](https://gulpjs.com/) and the
gulp tasks defined by [gulpfile.js](gulpfile.js).

Although gulp was installed locally when you ran `npm install`, you'll also want to install the command-line
interface to gulp. You can install that locally as well, but it's recommended you install it globally with *-g*;
OS X users may also need to preface this command with `sudo`:

	npm install gulp-cli -g

Now you can run `gulp` anywhere within the PCjs project to build an updated version.  If no command-line arguments
are specified, `gulp` runs the "default" task defined by the project's [gulpfile](gulpfile.js); that task runs
Google's [Closure Compiler](https://developers.google.com/closure/compiler/) if any of the target files (eg, pcx86.js
in the [versions](/versions/) directory) are out-of date.

### Using the JavaScript-based Closure Compiler

The latest [gulpfile](gulpfile.js) now compiles all PCjs machine modules using
Google's [JavaScript-based Closure Compiler](https://github.com/google/closure-compiler-js).

Here's what I installed to get it all working:

	sudo npm install -g gulp
	npm install --save-dev gulp gulp-newer gulp-concat gulp-rename gulp-replace gulp-header gulp-foreach gulp-wrapper gulp-sourcemaps run-sequence
	npm install --save-dev google-closure-compiler-js

Running `gulp` should build a complete set of machine scripts in the [versions](/versions/) directory.
Individual machines can be compiled as well (eg, `gulp compile/pcx86`).

Using PCjs
----------

### From The Browser

The PCjs Node web server is little more than a file/directory browser for the PCjs project, plus a collection of APIs.

If a URL corresponds to a PCjs project folder and no "index.html" exists in that folder, the Node web server loads
an HTML template ([common.html](modules/shared/templates/common.html)) and generates an "index.html" for that folder.

The contents of the "index.html" will vary depending on the contents of the folder; for example, if the folder
contains a README.md, then that Markdown file is converted to HTML and embedded in the "index.html".  Similarly,
if the folder contains a machine XML file, that is embedded as well.

To work well with both the Node and Jekyll web servers, all Markdown files containing one or more embedded machines
should contain a Jekyll "Front Matter" header that describes the machines.  For example, here's the header from the
pcjs.org home page ([index.md](https://github.com/jeffpar/pcjs/blob/jekyll/index.md)):

	---
	layout: page
	permalink: /
	machines:
	  - id: ibm5150
	    type: pcx86
	    resume: 1
	    name: "IBM PC (Model 5150) with Monochrome Display"
	    config: /devices/pcx86/machine/5150/mda/64kb/machine.xml
	  - id: demoC1P
	    type: c1p
	    config: /devices/c1p/machine/8kb/large/machine.xml
	---

Then the following lines are inserted at the points where the machines should appear:

	{% include machine.html id="ibm5150" %}
	...
	{% include machine.html id="demoC1P" %}

For more information on all the machine options supported in a Markdown file, see the project's Jekyll include file
[machine-engines.html](https://github.com/jeffpar/pcjs/blob/jekyll/_includes/machine-engines.html).

### From The Command-Line

The PCx86 client app can also be run from the command-line mode using Node, making it possible to script the application,
run a series of automated tests, etc:

    cd modules/pcx86/bin
    node pcx86

The [pcx86](modules/pcx86/bin/pcx86) script in [modules/pcx86/bin](modules/pcx86/bin) loads
all the PCx86 browser scripts listed in the root [package.json](/package.json) and then starts a Node REPL
("read-eval-print loop").  The REPL handles a few special commands (eg, "load", "quit") and passes anything else
to the PCx86 Debugger component.  If no Debugger component has been created yet, or if the Debugger didn't recognize
the command, then it's passed on to *eval()*, like a good little REPL.

Use the "load" command to load a JSON machine configuration file.  A sample
[ibm5150.json](modules/pcx86/bin/ibm5150.json) is provided in the *bin* directory, which is a "JSON-ified" version
of the [machine.xml](devices/pcx86/machine/5150/mda/64kb/machine.xml) displayed on the [pcjs.org](http://www.pcjs.org/)
home page.

The command-line loader creates all the JSON-defined machine components in the same order that the browser creates
XML-defined components.  You can also issue the "load" command directly from the command-line:

    node pcx86 --cmd="load ibm5150.json"

In fact, any number of "--cmd" arguments can be included on the command-line.  A batch file syntax will eventually be
added, too.

When a PCjs machine runs in a browser, an XML machine configuration file is transformed into HTML with a set of DIVs
for each component: an "object" DIV whose *data-value* attribute provides the initialization parameters for the
corresponding component, along with a set of optional "control" DIVs that the component can bind to (eg, a **Run** button,
or a visual representation of DIP switches, or whatever).

When a PCjs machine is run from the command-line, there is no XML, HTML, or DIVs involved; this is basically a
"headless" version of the machine, so there is no simple way to view its video display or interact with its keyboard,
mouse, etc.  You have to use Debugger commands to dump the machine's video buffer.

Since I was not inclined to add XML support to my Node environment, this has created some divergence between client
and server operation: PCjs machines on the client supports *only* XML machine configuration files, whereas PCjs machines
on the server supports *only* JSON machine configuration files.

I haven't decided whether I'll add support for JSON configuration files to the client, or add some XML-to-JSON conversion
to the server, or both.

Debugging PCjs
--------------

NOTE: The following information assumes you're running Node as your local web server, not Jekyll.  You can certainly
debug PCjs while running Jekyll (ideally with `--config _config.yml,_developer.yml`), using `http://localhost:4000/`
and your favorite web browser's Developer Tools, but none of the special server or client features discussed below
will be available.

### Server Components

To help test/debug changes to PCjs server components (eg, [DiskDump](modules/diskdump/), [HTMLOut](modules/htmlout/)),
you can start the server with some additional options; eg:

	node server.js --logging --console --debug

The *--logging* option will create a [node.log](/logs/) that records all the HTTP requests, *--debug*
will generate additional debug-only messages (which will also be logged if *--logging* is enabled), and *--console*
will replicate any messages to your console as well.

If you want server.js to use a different port (the default is 8088), set PORT in your environment before starting
the server:

	export PORT=80

or add *--port* to your command-line:

	node server.js --logging --console --debug --port=80

A complete list of command-line options can be found in [server.js](server.js).

### Client Components

A special command parameter ("gort") can be appended to the URL to request uncompiled client source files, making the
PCjs emulators much easier to debug, albeit much slower:

	http://localhost:8088/?gort=debug

The "gort=debug" command is unnecessary if the server is started with *--debug*; the server always serves uncompiled
files when running in debug mode.

Conversely, if the server is in debug mode but you want to test a compiled version of PCx86, use:

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

- *autostart*: set it to "true" to allow all machines to start normally, "false" to prevent all machines from starting, or "no" to prevent all machines from starting *unless* they have no **Run** button; e.g.:

	http://localhost:8088/?gort=debug&autostart=false

- *aspect*: set it to a numeric value >= 0.3 and <= 3.33 to modify the default aspect ratio of a machine's screen on the specified page; e.g.:

	http://localhost:8088/?aspect=2.0

- *resume*: set it to a numeric value (0-3) to override a machine's *resume* setting; e.g.:

	http://localhost:8088/?resume=0

More information about the *resume* attribute is available in the [documentation](/pubs/docs/pcx86/computer/#attributes).

Updating PCjs
-------------

### Developing

To start developing features for a new version of PCjs, here are the recommended steps:

1. Change the version number in the root [package.json](package.json) (and [_config.yml](https://github.com/jeffpar/pcjs/blob/jekyll/_config.yml))
2. Run the "gulp version" task to bump the version in all the machine XML files
3. Make changes
4. Run "gulp" to build new versions of the apps (eg, "/versions/pcx86/1.x.x/pcx86.js")

You might also want to check out the blog post on [PCjs Coding Conventions](http://www.pcjs.org/blog/2014/09/30/).

You may also want to skip step #2 until you're ready to start testing the new version.  Depending on the nature
of your changes, it may be better to manually edit the version number in only a few machine XML files for testing,
leaving the rest of the XML files pointing to the previous version.  Run "gulp version" when the new version is much
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
manually or with the `modules/htmlout/bin/delete_indexes.sh` script.

<!--END:EXCLUDE-->

License
-------

The [PCjs Project](https://github.com/jeffpar/pcjs) is now an open-source project on [GitHub](http://github.com/).
All published portions are free for redistribution and/or modification under the terms of the
[GNU General Public License](/LICENSE) as published by the Free Software Foundation, either version 3 of the License,
or (at your option) any later version.

You are required to include the following copyright notice, with a link to [pcjs.org](http://www.pcjs.org/):

> [PCjs](http://www.pcjs.org/) © 2012-2018 by [Jeff Parsons](mailto:Jeff@pcjs.org) ([@jeffpar](http://twitter.com/jeffpar))

in every source code file of every copy or modified version of this work, and to display that notice on every web page
or computer that runs any version of this software.

See [LICENSE](/LICENSE) for details.

More Information
----------------

Learn more about the [PCjs Project](/pubs/docs/about/) and [PCx86](/pubs/docs/about/pcx86/).  To
create your own PCx86 machines, see the [PCx86 Documentation](/pubs/docs/pcx86/) for details.

If you have questions or run into any problems, feel free to [tweet](http://twitter.com/jeffpar) or
[email](mailto:Jeff@pcjs.org).
