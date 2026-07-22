# Mariner Publishing

Mariner Publishing is the language for publisher-authored website content and the collection from which the site presents it.

## Language

**Story**:
A publisher-authored content entry representing a Page, Destination, Yacht, navigation, or site settings.
_Avoid_: Storyblok record, CMS response

**Story Content Catalog**:
The authoritative collection of Stories available to the website, independent of how they are retrieved or presented.
_Avoid_: Storyblok API, content service

**Site Settings**:
Publisher-authored website-wide navigation and footer content.
_Avoid_: global settings, site configuration

**Page Chrome**:
The presentation surrounding a Page's published content: breadcrumb placement and the initial relationship between that content and the navbar.
_Avoid_: page layout, navbar scroll state

**Yacht Summary**:
The concise presentation of a Yacht Story used wherever the fleet is listed or featured.
_Avoid_: yacht card data, fleet item

**Destination Summary**:
The concise presentation of a Destination Story used wherever destinations are listed, featured, or placed on the map.
_Avoid_: destination card data, map destination
