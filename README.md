FreeCodeCamp API Basejump: Image Search Abstraction Layer
========================================================
## User stories:
1. I can get the image URLs, alt text and page urls for a set of images relating to a given search string.
2. I can paginate through the responses by adding a ?offset=2 parameter to the URL.
3. I can get a list of the most recently submitted search strings.

Example search:
---------------------------
https://image-search-gmojo.glitch.me/api/imagesearch/dogs?offset=10

https://image-search-gmojo.glitch.me/api/latest/imagesearch/

Example output
-------------------------------
    {
      url: "http://i.imgur.com/pw8kFsw.gif",
      snippit: "We love dogs",
      context: "https://imgur.com/pw8kFsw"
    }


    {
      term: "lolcats funny",
      when: "2017-08-29T13:59:29.307Z"
    }
