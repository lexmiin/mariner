# Make Page Chrome the authoritative Page presentation seam

Page routes render Page Stories through a Page Chrome module that owns breadcrumb placement and rendering, lead-block presentation capabilities, navbar overlap, and initial navbar tone. Routes continue to own breadcrumb construction and document metadata, while runtime navbar tone changes and Destination and Yacht detail presentation remain outside this seam; this concentrates correlated Page presentation policy without turning Page Chrome into the entire site shell.
