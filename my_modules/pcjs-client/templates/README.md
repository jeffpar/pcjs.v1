PCjs Templates
===
Template folders contain a variety of XML and HTML templates and supporting files, including:

- DTD files (Document Type Definitions)
- XSD files (XML schemas -- eventually)
- XSL files (XML stylesheets)
- CSS files (stylesheets that the XSL files rely upon)
- HTML files (HTML fragments used to generate part or all of a web page)

[*components.xsl*](components.xsl) transforms all the elements of a machine XML file into an HTML fragment
that includes a series of **DIV** tags with corresponding *id* and *data-value* attributes that allow our
JavaScript components to bind themselves to visual elements (eg, virtual screen, virtual keyboard, control
panel) on a web page.
