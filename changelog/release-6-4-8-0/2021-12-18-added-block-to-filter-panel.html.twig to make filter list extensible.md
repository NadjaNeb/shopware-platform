---
title: Added block to `filter-panel.html.twig` to make it possible to easily/robustly add filters to the storefront
issue: NEXT-19351
author: Sven Lauer
author_email: sven@sven-lauer.net
author_github: svlauer
---
# Storefront
*  Added a new block `component_filter_panel_items` to `@Storefront/storefront/component/lists/filter-panel.html.twig` which wraps *only* the filters provided by core. In contrast to the existing blocks, this block can be overwritten-with-`parent()` to add additional filters.
