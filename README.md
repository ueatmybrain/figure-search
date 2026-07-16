# This is the source for the Vue App which is built into this browser extension:
https://github.com/ueatmybrain/figure-search-ext

# Figure Search
Tool to assist you in searching anime figures (and other stuff) on various japanese sites.

This is basically just a vue frontend, so no backend required :D

# Core features:

- Multiple search buttons (Google, Mercari Japan, Suruga-ya, Yahoo Auctions Japan (buyee) and a customizable button)
- Save data from myfigurecollection.net in your browser (Requires browser extension found here: https://github.com/ueatmybrain/mfc-extractor-extension)
- Search term builder (using data from MFC as well as keyword dictionary)

# How to run:

Run with 'npm run dev' or in a docker container with the provided Dockerfile.


# How to use:

1. With the extension (https://github.com/ueatmybrain/mfc-extractor-extension), on a myfigurecollection figure/item page, click "Copy JSON".
2. On the Figure Search page, press the "paste new/upgraded figure data" in the top left (smiley JSON button).
3. You can now add things to your searchbar like character name, origin, company etc. in english or japanese by simply clicking on the words in the table.
4. The same goes for the keywords in the dictionary, which can be opened with the menu on the right side of the page.
5. You can add keywords here as well.
