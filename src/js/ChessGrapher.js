import * as util from './util';
import {EvalAndTime} from './EvalAndTime';
import {HeatMap} from './HeatMap';
import {Openings} from './Openings';

export var ChessGrapher = {
	EvalAndTime,
	HeatMap,
	Openings,
	util
};

window.CG = ChessGrapher;