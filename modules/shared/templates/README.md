Shared Templates
===
Template folders contain a variety of XML and HTML templates and supporting files, including:

- DTD files (Document Type Definitions)
- XSD files (XML schemas -- eventually)
- XSL files (XML stylesheets)
- CSS files (stylesheets that the XSL files rely upon)
- HTML files (HTML fragments used to generate part or all of a web page)

[*common.html*](common.html) is the HTML template file used by the [HTMLOut](/modules/htmlout/) module
to generate a default HTML file ("index.html") for any folder that only has a "README.md", or a "machine.xml",
or none of the above.

[*common.xsl*](common.xsl) is a collection of XSL templates used by *machine.xsl* (and deprecated *outline.xsl*)
files.

[*components.xsl*](components.xsl) transforms all the elements of a machine XML file into an HTML fragment
that includes a series of **DIV** tags with corresponding *id* and *data-value* attributes that allow our
JavaScript components to bind themselves to visual elements (eg, virtual screen, virtual keyboard, control
panel) on a web page.

[*machine.xsl*](machine.xsl) is an XML stylesheet that takes things a step further and transforms a machine XML
into a stand-alone HTML document, which also includes all necessary compiled scripts (eg, c1p.js, c1p-dbg.js,
pc.js or pc-dbg.js).  Most machine XML files explicitly link to this stylesheet, so that simply loading the XML
file in your web browser creates a working virtual machine.

[*manifest.xsl*](manifest.xsl) is an XML stylesheet that renders a software manifest XML file into a standalone
document; it may even contain a reference to a machine XML file.

[*document.xsl*](document.xsl) is a collection of XSL templates used exclusively by [*outline.xsl*](outline.xsl),
which is a more grandiose version of [*machine.xsl*](machine.xsl), designed to support XML-based documentation
that could also contain embedded machine XML files.  However, I've since moved away from that approach, in favor
of simple README.md files that are more flexible and work nicely with GitHub.  Also, by rendering them with our own
minimalistic Markdown converter, [MarkOut](/modules/markout/), it's also very easy to embed virtual machines
in a README.md document.

Since the XML document syntax that [*outline.xsl*](outline.xsl) supports was never very well documented, I'm tempted
to deprecate it and port any XML documents that still rely on it (mostly the older IAS Electronic Computer Project
documents) to Markdown files.
