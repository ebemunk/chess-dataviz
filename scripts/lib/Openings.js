'use strict';

let _ = require('lodash');

class Openings {
	constructor() {
		this.data = {
			san: 'start',
			children: []
		};
	}

	update(moves) {
		let ref = this.data.children;

		moves.forEach(move => {
			let child = _.find(ref, {san: move});
			if( child ) {
				child.count++;
			} else {
				child = {
					san: move,
					count: 1,
					children: []
				};

				ref.push(child);
			}

			ref = child.children;
		});
	}
}

module.exports = Openings;