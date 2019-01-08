import fs from 'fs';
import glob from 'glob';
import path from 'path';
import yaml from 'js-yaml';

const [dllrcName] = glob.sync('.dllrc.@(js|json|yaml|yml)', { dot: true });
const dllrcPath = path.resolve(__dirname, `../${dllrcName}`);

export default (() => {
	switch (path.extname(dllrcName)) {
		case '.js':
		case '.json':
			// eslint-disable-next-line global-require, import/no-dynamic-require
			return require(`./${dllrcName}`);
		case '.yml':
		case '.yaml':
			// eslint-disable-next-line no-sync
			return yaml.safeLoad(fs.readFileSync(dllrcPath));
		default:
			return {};
	}
})();
