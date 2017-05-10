const readline = require('readline');
const fs = require('fs');
const log4js = require('log4js');
let convert = function(year) {
	const logger = log4js.getLogger();
	// registering csv file as input to readline interface
	const rl = readline.createInterface({
		input: fs.createReadStream('../inputdata/India2011.csv')
	});
	// checking year is a valid number
	if (isNaN(year)) {
		logger.error('Not a number');
		throw new Error('Not a number');
	}
	let final = [];
	let count = 0;
	// fetching line by line and extracting needed data
	rl.on('line', (line) => {
		let arr = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
		if (arr[4] === 'Total' && arr[5] !== 'All ages') {
			let obj = {};
			if (!final[count]) {
				obj['AgeGroup'] = arr[5];
				obj['LiteratePerson'] = parseInt(arr[12], 10);
				final.push(obj);
			} else {
				final[count].LiteratePerson = final[count].LiteratePerson + parseInt(arr[12], 10);
			}
			count = (count + 1) % 28;
		}
	});
	// writing json file on close event
	rl.on('close', () => {
		let finalJson = JSON.stringify(final);
		fs.writeFile('../outputdata/IndiaCensusAmardeep.json', finalJson, function(err) {
			if (err) {
				logger.error('Error in writing output file');
				throw err;
			}
			logger.info('Closing input file after reading');
		});
	});
	return 'JSON written successfully';
};
// convert(2011);
module.exports = convert;
