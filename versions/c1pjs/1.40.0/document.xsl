<?xml version="1.0" encoding="UTF-8"?>
<!-- author="Jeff Parsons (@jeffpar)" website="http://www.pcjs.org/" created="2012-05-05" modified="2014-02-23" license="http://www.gnu.org/licenses/gpl.html" -->
<!DOCTYPE xsl:stylesheet [
	<!ENTITY nbsp "&#160;"> <!ENTITY ne "&#8800;"> <!ENTITY le "&#8804;"> <!ENTITY ge "&#8805;">
	<!ENTITY times "&#215;"> <!ENTITY sdot "&#8901;"> <!ENTITY divide "&#247;">
	<!ENTITY copy "&#169;"> <!ENTITY Sigma "&#931;"> <!ENTITY sigma "&#963;"> <!ENTITY sum "&#8721;"> <!ENTITY lbrace "&#123;">
]>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

	<xsl:output method="html"/>

	<xsl:template name="documentStyles">
		<link rel="stylesheet" type="text/css" href="/versions/c1pjs/1.40.0/document.css"/>
	</xsl:template>

	<xsl:template match="title">
		<h1><xsl:apply-templates/></h1>
	</xsl:template>

	<xsl:template name="p">
		<xsl:if test="@id">
			<a name="{@id}"></a>
		</xsl:if>
		<xsl:choose>
			<xsl:when test="not(@class)">
				<p><xsl:apply-templates/></p>
			</xsl:when>
			<xsl:otherwise>
				<p class="{@class}"><xsl:apply-templates/></p>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

	<xsl:template match="p">
		<xsl:call-template name="p"/>
	</xsl:template>

	<xsl:template match="br">
		<br/>
	</xsl:template>

	<xsl:template match="p[@number]">
		<div class="pnumber">
			<xsl:choose>
				<xsl:when test="not(@number) or @number = ''">&nbsp;</xsl:when>
				<xsl:otherwise><xsl:value-of select="@number"/></xsl:otherwise>
			</xsl:choose>
		</div>
		<div class="pitem">
			<xsl:call-template name="p"/>
		</div>
	</xsl:template>

	<xsl:template match="span">
		<xsl:choose>
			<xsl:when test="not(@class)">
				<span><xsl:apply-templates/></span>
			</xsl:when>
			<xsl:when test="@class = 'italics'">
				<em><xsl:apply-templates/></em>
			</xsl:when>
			<xsl:otherwise>
				<span class="{@class}"><xsl:apply-templates/></span>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

	<xsl:template match="h2">
		<h2><xsl:apply-templates/></h2>
	</xsl:template>

	<xsl:template match="h3">
		<h3><xsl:apply-templates/></h3>
	</xsl:template>

	<xsl:template match="h4">
		<h4><xsl:apply-templates/></h4>
	</xsl:template>

	<xsl:template match="h5">
		<h5><xsl:apply-templates/></h5>
	</xsl:template>

	<xsl:template match="h6">
		<h6><xsl:apply-templates/></h6>
	</xsl:template>

	<xsl:template match="em">
		<em><xsl:apply-templates/></em>
	</xsl:template>

	<xsl:template match="strong">
		<strong><xsl:apply-templates/></strong>
	</xsl:template>

	<xsl:template match="a">
		<a href="{@href}" target="{@target}"><xsl:apply-templates/></a>
	</xsl:template>

	<xsl:template match="ol">
		<blockquote><ol><xsl:apply-templates/></ol></blockquote>
	</xsl:template>

	<xsl:template match="ul">
		<blockquote><ul><xsl:apply-templates/></ul></blockquote>
	</xsl:template>

	<xsl:template match="li">
		<li><xsl:apply-templates/></li>
	</xsl:template>

	<xsl:template match="img">
		<div><img src="{@src}" alt="image"/></div>
	</xsl:template>

	<xsl:template match="pre">
		<pre><xsl:apply-templates/></pre>
	</xsl:template>

	<xsl:template match="figure">
		<xsl:choose>
			<xsl:when test="@pos">
				<div class="{@pos}"><img src="{@ref}" alt="{.}"/><br/><xsl:value-of select="."/></div>
			</xsl:when>
			<xsl:otherwise>
				<div><img src="{@ref}" alt="{.}"/><br/><xsl:value-of select="."/></div>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

	<xsl:template match="sub">
		<sub><xsl:apply-templates/></sub>
	</xsl:template>

	<xsl:template match="sup">
		<sup><xsl:apply-templates/></sup>
	</xsl:template>

	<xsl:template match="lt">&lt;</xsl:template>
	<xsl:template match="gt">&gt;</xsl:template>
	<xsl:template match="ne">&ne;</xsl:template>
	<xsl:template match="le">&le;</xsl:template>
	<xsl:template match="ge">&ge;</xsl:template>
	<xsl:template match="times">&times;</xsl:template>
	<xsl:template match="dot">&sdot;</xsl:template>
	<xsl:template match="divide">&divide;</xsl:template>
	<xsl:template match="sigma">&sigma;</xsl:template>

	<xsl:template match="summation">
		<span class="summation">
			<span class="summation-upper"><xsl:value-of select="@upper"/></span>
			<span class="summation-symbol">&sum;</span>
			<span class="summation-lower"><xsl:value-of select="@lower"/></span>
		</span>
		<xsl:apply-templates/>
	</xsl:template>

	<xsl:template match="bracelist">
		<span class="bracelist-symbol">&lbrace;</span>
		<span class="bracelist">
			<xsl:for-each select="item">
				<span class="bracelist-item"><xsl:apply-templates/></span>
			</xsl:for-each>
		</span>
	</xsl:template>

	<xsl:template match="footlink">
		<xsl:variable name="docID" select="/document/@id"/>
		<a class="footlink" id="fn{$docID}_ref{@n}" href="#fn{$docID}_{@n}"><sup><xsl:if test="@quoted"><xsl:text>[</xsl:text></xsl:if><xsl:value-of select="@n"/><xsl:if test="@quoted"><xsl:text>]</xsl:text></xsl:if></sup></a>
	</xsl:template>

	<xsl:template match="footnote">
		<xsl:variable name="docID" select="/document/@id"/>
		<div class="footnote"><a id="fn{$docID}_{@n}" href="#fn{$docID}_ref{@n}"><sup><xsl:value-of select="@n"/></sup></a><xsl:text> </xsl:text>
			<xsl:apply-templates/>
		</div>
	</xsl:template>

	<xsl:template name="authors">
		<xsl:for-each select="author"><xsl:if test="position() != 1"><xsl:text>, </xsl:text></xsl:if><xsl:if test="position() != 1 and position() = last()"><xsl:text>and </xsl:text></xsl:if><xsl:value-of select="."/></xsl:for-each>
	</xsl:template>

	<xsl:template name="formatDate">
		<xsl:param name="date"/>
		<xsl:param name="format">MDY</xsl:param>
		<xsl:variable name="year">
			<xsl:value-of select="substring-before($date,'-')"/>
		</xsl:variable>
		<xsl:variable name="mon-day">
			<xsl:value-of select="substring-after($date,'-')"/>
		</xsl:variable>
		<xsl:variable name="mon">
			<xsl:value-of select="substring-before($mon-day,'-')"/>
		</xsl:variable>
		<xsl:variable name="full-day">
			<xsl:value-of select="substring-after($mon-day,'-')"/>
		</xsl:variable>
		<xsl:variable name="day">
			<xsl:choose>
				<xsl:when test="substring($full-day,1,1) = '0'"><xsl:value-of select="substring($full-day,2)"/></xsl:when>
				<xsl:otherwise><xsl:value-of select="$full-day"/></xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		<xsl:choose>
			<xsl:when test="$mon = '01'">January </xsl:when>
			<xsl:when test="$mon = '02'">February </xsl:when>
			<xsl:when test="$mon = '03'">March </xsl:when>
			<xsl:when test="$mon = '04'">April </xsl:when>
			<xsl:when test="$mon = '05'">May </xsl:when>
			<xsl:when test="$mon = '06'">June </xsl:when>
			<xsl:when test="$mon = '07'">July </xsl:when>
			<xsl:when test="$mon = '08'">August </xsl:when>
			<xsl:when test="$mon = '09'">September </xsl:when>
			<xsl:when test="$mon = '10'">October </xsl:when>
			<xsl:when test="$mon = '11'">November </xsl:when>
			<xsl:when test="$mon = '12'">December </xsl:when>
			<xsl:when test="$mon = '00'"/>		</xsl:choose>
		<xsl:if test="$day != '0' and $format = 'MDY'">
			<xsl:value-of select="$day"/><xsl:text>, </xsl:text>
		</xsl:if>
		<xsl:value-of select="$year"/>
	</xsl:template>

	<xsl:template match="gallery">
		<h2><xsl:value-of select="description"/></h2>
		<div class="gallery">
			<xsl:apply-templates select="item" mode="gallery"/>
		</div>
		<div style="clear:both;"></div>
	</xsl:template>

	<xsl:template match="item" mode="gallery">
		<div class="galleryitem">
			<a href="{@ref}"><img src="/versions/images/current/pdf-192.jpg" alt="{.}"/></a><br/>
			<div style="font-size:small; text-align:center;"><xsl:value-of select="."/></div>
		</div>
	</xsl:template>

	<xsl:template match="list[@type = 'timeline']">
		<xsl:if test="not(description)">
			<h2>Timeline</h2>
		</xsl:if>
		<xsl:if test="description">
			<h2><xsl:value-of select="description"/></h2>
		</xsl:if>
		<blockquote>
			<xsl:apply-templates select="item" mode="timeline"/>
		</blockquote>
	</xsl:template>

	<xsl:template match="item" mode="timeline">
		<xsl:if test="@ref">
			<xsl:variable name="documentFile"><xsl:value-of select="$rootDir"/><xsl:value-of select="@ref"/></xsl:variable>
			<xsl:apply-templates select="document($documentFile)/document" mode="withDate">
				<xsl:with-param name="itemRef" select="@ref"/>
			</xsl:apply-templates>
		</xsl:if>
		<xsl:if test="not(@ref)">
			<h3><xsl:call-template name="formatDate"><xsl:with-param name="date" select="@date"/></xsl:call-template></h3>
			<blockquote>
				<xsl:value-of select="."/>
			</blockquote>
		</xsl:if>
	</xsl:template>

	<xsl:template match="list[@type = 'people']">
		<xsl:if test="not(description)">
			<h2>People</h2>
		</xsl:if>
		<xsl:if test="description">
			<h2><xsl:value-of select="description"/></h2>
		</xsl:if>
		<blockquote>
			<xsl:apply-templates select="item" mode="people"/>
		</blockquote>
	</xsl:template>

	<xsl:template match="item" mode="people">
		<h3><xsl:value-of select="name"/></h3>
		<xsl:apply-templates select="list"/>
	</xsl:template>

	<xsl:template match="list[@type = 'documents']">
		<xsl:if test="description"><h2><xsl:value-of select="description"/></h2></xsl:if>
		<ul>
			<xsl:apply-templates select="item" mode="document"/>
		</ul>
	</xsl:template>

	<xsl:template match="item" mode="document">
		<xsl:variable name="documentFile"><xsl:value-of select="$rootDir"/><xsl:value-of select="@ref"/></xsl:variable>
		<xsl:apply-templates select="document($documentFile)/document">
			<xsl:with-param name="itemRef" select="@ref"/>
		</xsl:apply-templates>
	</xsl:template>

	<xsl:template match="document">
		<xsl:param name="itemRef"/>
		<li>
			<xsl:call-template name="documentSummary"><xsl:with-param name="itemRef" select="$itemRef"/></xsl:call-template>
		</li>
	</xsl:template>

	<xsl:template match="document" mode="withDate">
		<xsl:param name="itemRef"/>
		<h3><xsl:call-template name="formatDate"><xsl:with-param name="date" select="date"/><xsl:with-param name="format" select="MY"/></xsl:call-template></h3>
		<blockquote>
			<p>
				<xsl:call-template name="documentSummary"><xsl:with-param name="itemRef" select="$itemRef"/><xsl:with-param name="multiLine" select="'true'"/></xsl:call-template>
			</p>
		</blockquote>
	</xsl:template>

	<xsl:template name="documentSummary">
		<xsl:param name="itemRef"/>
		<xsl:param name="multiLine">false</xsl:param>
		<xsl:choose>
			<xsl:when test="content|include">
				<a href="{$itemRef}"><xsl:value-of select="title"/></a>
				<xsl:if test="@ref">
					<span class="small">
						<xsl:text> [</xsl:text><a href="{@ref}">Original</a><xsl:text>]</xsl:text>
					</span>
				</xsl:if>
			</xsl:when>
			<xsl:otherwise>
				<a href="{$itemRef}"><xsl:value-of select="title"/></a>
			</xsl:otherwise>
		</xsl:choose>
		<xsl:if test="copy">
			<span class="small">
				<xsl:text> [</xsl:text><a href="{copy/@ref}"><xsl:value-of select="copy"/></a><xsl:text>]</xsl:text>
			</span>
		</xsl:if>
		<xsl:if test="author"><xsl:if test="$multiLine = 'true'"><br/></xsl:if><span class="medium"><xsl:text> by </xsl:text><xsl:call-template name="authors"/></span></xsl:if>
		<xsl:if test="source">
			<span class="small">
				<br/>
				<xsl:text>[Source: </xsl:text>
				<xsl:if test="site">
					<a href="{site/@url}"><xsl:value-of select="site"/></a>
				</xsl:if>
				<xsl:if test="not(site)">
					<a href="{source/@url}"><xsl:value-of select="source"/></a>
				</xsl:if>
				<xsl:text>]</xsl:text>
			</span>
		</xsl:if>
	</xsl:template>

	<xsl:template match="list[@type = 'resources']">
		<xsl:if test="not(description)">
			<h2>Resources</h2>
		</xsl:if>
		<xsl:if test="description">
			<h2><xsl:value-of select="description"/></h2>
		</xsl:if>
		<blockquote>
			<xsl:apply-templates select="item" mode="resources"/>
		</blockquote>
	</xsl:template>

	<xsl:template match="item" mode="resources">
		<h3><xsl:value-of select="description"/></h3>
		<xsl:apply-templates select="list"/>
	</xsl:template>

	<xsl:template match="list[@type = 'links']">
		<xsl:if test="description">
			<h4><xsl:value-of select="description"/></h4>
		</xsl:if>
		<ul>
			<xsl:apply-templates select="item" mode="links"/>
		</ul>
	</xsl:template>

	<xsl:template match="item" mode="links">
		<li><a href="{@ref}"><xsl:value-of select="."/></a></li>
	</xsl:template>

	<xsl:template match="list[not(@type)]">
		<xsl:if test="description">
			<h2><xsl:value-of select="description"/></h2>
		</xsl:if>
		<blockquote>
			<xsl:apply-templates select="item|tag" mode="outer"/>
		</blockquote>
	</xsl:template>

	<xsl:template match="item" mode="outer">
		<xsl:if test="description">
			<h3><xsl:value-of select="description"/></h3>
		</xsl:if>
		<xsl:apply-templates select="list|item|tag" mode="inner"/>
	</xsl:template>

	<xsl:template match="list" mode="inner">
		<xsl:if test="description">
			<h4><xsl:value-of select="description"/></h4>
		</xsl:if>
		<ul>
			<xsl:apply-templates select="list|item|para|tag" mode="inner"/>
		</ul>
	</xsl:template>

	<xsl:template name="innerlist">
		<xsl:if test="description">
			<xsl:value-of select="description"/>
		</xsl:if>
		<ul>
			<xsl:apply-templates select="list|item|para|tag" mode="inner"/>
		</ul>
	</xsl:template>

	<xsl:template match="item" mode="inner">
		<xsl:choose>
			<xsl:when test="@ref">
				<li><a href="{@ref}"><xsl:apply-templates/></a></li>
			</xsl:when>
			<xsl:when test="description">
				<li><xsl:call-template name="innerlist"/></li>
			</xsl:when>
			<xsl:otherwise>
				<li><xsl:apply-templates/></li>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

	<xsl:template match="para" mode="inner">
		<li class="para"><xsl:apply-templates/></li>
	</xsl:template>

	<xsl:template match="tag" mode="outer">
		<xsl:call-template name="tag"/>
	</xsl:template>

	<xsl:template match="tag" mode="inner">
		<xsl:call-template name="tag"/>
	</xsl:template>

	<xsl:template name="tag">
		<blockquote class="tag">
			<xsl:text>&lt;</xsl:text><xsl:if test="@href"><a href="{@href}"><xsl:value-of select="@name"/></a></xsl:if><xsl:if test="not(@href)"><xsl:value-of select="@name"/></xsl:if><xsl:for-each select="attr"><xsl:text> </xsl:text><xsl:value-of select="@name"/><xsl:text>="</xsl:text><xsl:value-of select="@value"/><xsl:text>"</xsl:text></xsl:for-each>
			<xsl:choose>
				<xsl:when test="tag"><xsl:text>&gt;</xsl:text><xsl:apply-templates mode="inner"/><xsl:text>&lt;/</xsl:text><xsl:value-of select="@name"/><xsl:text>&gt;</xsl:text></xsl:when>
				<xsl:when test="normalize-space(.) != ''"><xsl:text>&gt;</xsl:text><xsl:value-of select="."/><xsl:text>&lt;/</xsl:text><xsl:value-of select="@name"/><xsl:text>&gt;</xsl:text></xsl:when>
				<xsl:otherwise><xsl:text>/&gt;</xsl:text></xsl:otherwise>
			</xsl:choose>
		</blockquote>
	</xsl:template>

</xsl:stylesheet>
