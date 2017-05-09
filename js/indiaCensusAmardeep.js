const readline = require('readline');
const fs = require('fs');
let convert = function(year) {
	const rl = readline.createInterface({
		input: fs.createReadStream('../inputdata/India2011.csv')
	});
	if (isNaN(year)) {
		throw new Error('Not a number');
	}
	let final = [];
	let count = 0;
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
	rl.on('close', () => {
		let finalJson = JSON.stringify(final);
		fs.writeFile('../outputdata/IndiaCensusAmardeep.json', finalJson, function(err) {
			if (err) {
				throw err;
			}
		});
	});
	return 'JSON written successfully';
};
// convert(2011);
module.exports = convert;
