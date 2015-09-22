<?xml version="1.0" encoding="UTF-8"?>
<!-- author="Jeff Parsons (@jeffpar)" website="http://www.pcjs.org/" created="2012-05-05" modified="2014-02-23" license="http://www.gnu.org/licenses/gpl.html" -->
<!DOCTYPE xsl:stylesheet [
	<!ENTITY nbsp "&#160;"> <!ENTITY sect "&#167;"> <!ENTITY copy "&#169;"> <!ENTITY para "&#182;"> <!ENTITY ndash "&#8211;"> <!ENTITY mdash "&#8212;">
	<!ENTITY lsquo "&#8216;"> <!ENTITY rsquo "&#8217;"> <!ENTITY ldquo "&#8220;"> <!ENTITY rdquo "&#8221;"> <!ENTITY dagger "&#8224;"> <!ENTITY Dagger "&#8225;">
]>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

	<xsl:output doctype-system="about:legacy-compat"/>

	<xsl:include href="/versions/c1pjs/1.19.7/common.xsl"/>
	<xsl:include href="/versions/c1pjs/1.19.7/components.xsl"/>

	<xsl:template match="/machine">
		<html lang="en">
			<head>
				<title><xsl:value-of select="$SITEHOST"/></title>
				<xsl:call-template name="commonStyles"/>
				<xsl:call-template name="componentStyles"/>
			</head>
			<body>
				<div class="common">
					<xsl:call-template name="commonTop"/>
					<div class="common-middle">
						<p></p>
						<div id="{@id}" class="machine {@class}js">
							<xsl:call-template name="component">
								<xsl:with-param name="machine" select="@id"/>
								<xsl:with-param name="component" select="'machine'"/>
								<xsl:with-param name="class"><xsl:value-of select="@class"/>js</xsl:with-param>
								<xsl:with-param name="parms"><xsl:if test="@parms">,<xsl:value-of select="@parms"/></xsl:if></xsl:with-param>
							</xsl:call-template>
						</div>
					</div>
					<xsl:call-template name="commonBottom"/>
				</div>
				<xsl:call-template name="componentScripts">
					<xsl:with-param name="component">
						<xsl:choose>
							<xsl:when test="debugger"><xsl:value-of select="@class"/>-dbg</xsl:when>
							<xsl:otherwise><xsl:value-of select="@class"/></xsl:otherwise>
						</xsl:choose>
					</xsl:with-param>
				</xsl:call-template>
			</body>
		</html>
	</xsl:template>

</xsl:stylesheet>
