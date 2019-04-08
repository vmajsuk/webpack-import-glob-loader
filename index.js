const glob = require("glob");
const path = require("path");

const regex = /.?import + ?((\w+) +from )?([\'\"])(.*?);?\3/gm;

module.exports = function(source) {
  this.cacheable && this.cacheable(true);

  const resourceDir = path.dirname(this.resourcePath);

  return source.replace(regex, (match, fromStatement, obj, quote, filename) =>
    replacer({ match, obj, filename, resourceDir })
  );
};

const getRelativePath = fname => fname.match(/!?([^!]*)$/)[1];

const replacer = ({ match, obj, filename, resourceDir }) => {
  if (!filename.match(/\*/)) return match;

  const globRelativePath = getRelativePath(filename);
  const prefix = filename.replace(globRelativePath, "");
  const files = glob.sync(globRelativePath, { cwd: resourceDir });

  return `
  ${files.map((file, i) => `import ${obj + i} from '${prefix + file}'\n`)}

  const ${obj} = [${files.map(
    (file, i) => `{ file: ${file}, data: ${obj}${i} }`
  )}]
  `;
};
