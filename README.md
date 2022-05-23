# API to Frontmatter
Dumb node.js script to take an API response and convert to markdown files with frontmatter.
Initially created to take dynamic content from a headless CMS and convert to a markdown based site. 


## Use:
```
node write.js --url=="https://my.url.com" --name=="keyForFileName" --dir=="directory --body=="keyForBodyText" --remove=="key1,key2,key3" ==title==true
```
 ### args

   * url: 'json url/path',
   *  name: 'JSON key for filename',      - key to identify what value should be used for the filename (filename is 'cleaned' for spaces, punctuation, etc.)
   * body: 'key for body text'           - key to identify content that should make up the body (the content below the frontmatter)
   * dir: 'directory to make'
   * remove: 'key1,key2,key3'            - remove specific keys from the object before writing to frontmatter (remove cruft)
   * title: true                         - set frontmatter title from name argument

Note: args use '==' due to potential for urls to contain a single "="


### Dependencies
* js-yaml
* axios
