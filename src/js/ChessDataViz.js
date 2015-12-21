import * as util from './util';
import {EvalAndTime} from './EvalAndTime';
import {HeatMap} from './HeatMap';
import {Openings} from './Openings';
import {MovePaths} from './MovePaths';

export var ChessDataViz = {
	EvalAndTime,
	HeatMap,
	Openings,
	MovePaths,
	util
};

window.ChessDataViz = ChessDataViz;