// write.js

/* 
 * command --url=="https://my.url.com" --name=="keyForFileName" --dir=="directory --body=="keyForBodyText" --remove=="key1,key2,key3" ==title==true
 * args
 * {
 *  url: 'json url/path',
 *  name: 'JSON key for filename',      - key to identify what value should be used for the filename (filename is 'cleaned' for spaces, punctuation, etc.)
 *  body: 'key for body text'           - key to identify content that should make up the body (the content below the frontmatter)
 *  dir: 'directory to make'
 *  remove: 'key1,key2,key3'            - remove specific keys from the object before writing to frontmatter (remove cruft)
 *  title: true                         - set frontmatter title from name argument
 * }
 * 
 * Note: args use '==' due to potential for urls to contain a single "="
 */


const fs = require('fs');
const yaml = require('js-yaml');
const axios = require('axios')
function getArgs () {
    const args = {};
    process.argv
        .slice(2, process.argv.length)
        .forEach( arg => {
        // long arg
        if (arg.slice(0,2) === '--') {
            const longArg = arg.split('==');
            const longArgFlag = longArg[0].slice(2,longArg[0].length);
            const longArgValue = longArg.length > 1 ? longArg[1] : true;
            args[longArgFlag] = longArgValue;
        }
        // flags
        else if (arg[0] === '-') {
            const flags = arg.slice(1,arg.length).split('');
            flags.forEach(flag => {
            args[flag] = true;
            });
        }
    });
    return args;
}

const args = getArgs();

// clean name
function cleanName(name) {
    if(name){
        let newname = name.replace(/[^a-zA-Z0-9]+/g,'-').replace(/[-]+/g,'-').toLowerCase();
        let newername = newname.replace(/\-$/, "");
        return newername;
    } else {
        return false;
    }
}

// make dir
fs.mkdirSync(args.dir, { recursive: true })

// fetch JSON
async function fetchJSON(url) {
    const response = await axios.get(url)
    let results = response.data;
    const removeArray = (args.remove).split(',');

    // if api returns object instead of array of objects when there is only a single result we have to create an array of the single object to use `results.forEach()`
    if(results.length == undefined){
        let tempArray = [];
        tempArray.push(results);
        results = tempArray;
    }
    
    results.forEach(result => {
        let name = result[args.name];
        let cleaned = cleanName(name);
        let body = result[args.body];

        // remove args.remove keys from object
        removeArray.forEach(key =>
            delete result[key]
        );

        // create yaml/frontmatter
        let yamlStr = yaml.dump(result);
        let frontMatter;
        if(args.title == "true"){
            frontMatter = '---\n' + 'title: ' + name + '\n' + yamlStr + '\n---\n' + body;
        } else {
            frontMatter = '---\n' + yamlStr + '\n---\n' + body;
        }
       
        fs.writeFileSync(args.dir + '/' + cleaned + '.md', frontMatter, 'utf8');
        console.log(cleaned + ".md created");
    });
  }

// time to make the YAML
fetchJSON(args.url);


