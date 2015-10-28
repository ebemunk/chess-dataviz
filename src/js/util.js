function parseMinutes(move, i) {
	let min = move.time.match(/(\d+)m/);
	min = min ? +min[1] : 0;

	let sec = move.time.match(/(\d+)s/);
	sec = sec ? +sec[1] : 0;

	let minutes = min + sec / 60;

	if( i % 2 ) {
		minutes = -minutes;
	}

	return minutes;
}

function parseScore(move) {
	let score = move.score;

	//mate notation
	if( score.match(/#/g) ) {
		score = score.replace('#', '');
		//just make it a big number
		score = +score * 10;
	} else {
		score = +score;
	}

	return score;
}

export function parseGameNotation(game) {
	let parsedGame = JSON.parse(JSON.stringify(game));

	parsedGame.notation.map((move, i) => move.time = parseMinutes(move, i));
	parsedGame.notation.map((move) => move.score = parseScore(move));

	// let winner = parsedGame.winner == 'draw' ? 'draw' : parsedGame.winner + ' wins';

	return parsedGame;
}

export let pieces = {
	w: {
		k: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDQ4IDIwNDgiPjxwYXRoIGZpbGw9IiMxMDEwMTAiIGQ9Im05NzcgMTc1MHY5NWg5NHYtOTVoMTA3di05NWgtMTA3di0xNTNxLTQ4IDE2LTk0IDB2MTUzaC0xMDd2OTVoMTA3bTQ3LTMxNHEtNDcgMC0xMzYtMTIxLTMxIDM2LTUwIDU1IDkzIDE0MCAxODYgMTQwIDkyIDAgMTg2LTE0MC0yMC0xOS01MC01NS05MCAxMjEtMTM2IDEyMW0tNDQ3LTkwN2wtMjYtMTU2IDE0NSA4NHptNDEwIDIwNnEtMSAxNDctMzYuNSAyNzQuNXQtODAuNSAxOTMuNXEtNDUgODgtMTMxLjUgMTUzdC0xNjguNSA2NXEtMTAzIDAtMjA4LTkzdC0xMDUtMjI5cTAtMTA5IDg2LjUtMjM2dDIwMi41LTIyM3EyMTIgODggNDQxIDk1bTM3LTUzMGgtNTc2bDYxIDM2NXEtMzI1IDI4MC0zMjYgNTM1LTEgMTU5IDEyNSAyNzQuNXQyNjcgMTE1LjVxNzggMCAxNTguNS00N3QxNDIuNS0xMTlxNjEtNzQgOTguNS0xNjQuNXQ0OS41LTE1MC41cTEyIDYwIDQ5IDE1MC41dDk5IDE2NC41cTYxIDcyIDE0MiAxMTl0MTU5IDQ3cTE0MCAwIDI2Ni0xMTUuNXQxMjYtMjc0LjVxLTItMjU1LTMyNi01MzVsNjEtMzY1aC01NzZtMCA3NGg0ODlsLTUwIDI5OHEtMjE2IDg0LTQzOSA4NHQtNDM5LTg0bC01MC0yOThoNDg5bTQ0NyAyNTBsMjYtMTU2LTE0NSA4NHptLTQxMCAyMDZxMjI5LTcgNDQxLTk1IDExNSA5NiAyMDIgMjIzdDg3IDIzNnEwIDEzNi0xMDUuNSAyMjl0LTIwNy41IDkzcS04MyAwLTE2OS41LTY1dC0xMzAuNS0xNTNxLTQ2LTY2LTgxLjUtMTkzLjV0LTM1LjUtMjc0LjVtLTE3Ni0yMzNsMTQxIDg0IDEzNy04Ni0xNDEtODR6IiB0cmFuc2Zvcm09Im1hdHJpeCgxIDAgMC0xIDAgMjA0OCkiLz48ZyBmaWxsPSIjZjlmOWY5Ij48cGF0aCBkPSJtNDY3LjQ3IDEzMjQuNzRjLTEzNC43My0xMzkuMzctMjAwLjQzLTI1OS42NC0yMDEuNzMtMzY5LjI5LTEuMDQ4LTg4LjQ2IDE5Ljk5My0xNDEuMjggODMuMTktMjA4LjgzIDEzOC43Mi0xNDguMjkgMjk2LjgtMTQ4Ljk2IDQzNy42MS0xLjg1OSA2Mi41IDY1LjMgMTA3LjMgMTQyLjg1IDE0Mi40OSAyNDYuNjkgMjcuODI5IDgyLjExIDUxLjQ3IDIwNy40OSA1MS41MyAyNzMuMjMuMDM4IDQ0LjM4LTguMzU5IDUwLjUzLTY5LjM5IDUwLjgyLTU1LjI1LjI2Ni0xODUuMjIgMjYuOTc4LTI3Ny42OSA1Ny4wN2wtOTEuMTIgMjkuNjU1LTc0LjktNzcuNDgiLz48cGF0aCBkPSJtMTAxMi4yNSA5NzYuOThjLTguODg3LTQ0LjQzLTU4LjE5LTE1NC44NC04OS40Mi0yMDAuMjRsLTI5LjY5Mi00My4xNiAzMi4wNi0zOS4xM2M3OC4zLTk1LjU1IDExOS4yOS05NS41NSAxOTcuNTkgMGwzMi4wNiAzOS4xMy0yOS42OTIgNDMuMTZjLTMxLjIzIDQ1LjQtODAuNTMgMTU1LjgxLTg5LjQyIDIwMC4yNC02LjY5NyAzMy40ODMtMTYuNzk3IDMzLjQ4My0yMy40OTQgMCIvPjxwYXRoIGQ9Im00NzAuMzggMTMyNS42OGMtMTQ0LjItMTYwLjg4LTE5Mi42Ni0yNDYuODYtMTk5LjU0LTM1NC4wNC01LjA1LTc4LjcxIDguNzM4LTEzMS43OSA0Ny40LTE4Mi40MyAxNS44ODctMjAuODEzIDI4Ljg4Ni00MS43MTQgMjguODg2LTQ2LjQ1IDAtNC43MzIgNC4zNjYtOC42MDMgOS43MDItOC42MDMgNS4zMzYgMCAyMy43MDctMTIuMjk3IDQwLjgyNC0yNy4zMjYgNzcuMTUtNjcuNzQgMTc0LjIzLTg2LjQ5IDI1OS4xOS01MC4wNyAxNTUuOTUgNjYuODQ4IDI2Ni4wMyAyNDUuMiAzMDkuODIgNTAxLjk3IDIzLjc3NCAxMzkuNCAxNy42MTkgMTU2Ljg0LTU1LjMzIDE1Ni44NC01OC4zMiAwLTE2Mi4wOSAyMC45NzgtMjY0Ljc5IDUzLjUzLTQ3Ljc0MyAxNS4xMy05MS43NSAyOC40NjctOTcuNzkgMjkuNjMzLTYuMDQgMS4xNjYtNDEuMzEtMzEuNzEzLTc4LjM3LTczLjA2Ii8+PHBhdGggZD0ibTE0MTAuMTEgMTM3MS4zMWMtODguNy0yOC45ODYtMjE4LjgxLTU1LjU2LTI3My4yOS01NS44MjYtNjIuNi0uMzAxLTY5LjQyLTUuODI3LTY5LjQyLTU2LjE5IDAtNjcuMzYgMjMuNDQ5LTE4OS44OCA1Mi4wMi0yNzEuOCAzNS4wMy0xMDAuNDYgODAuOTQ5LTE3OC45MiAxNDIuMDQtMjQyLjc0IDE0MC44MS0xNDcuMSAyOTguOS0xNDYuNDMgNDM3LjYxIDEuODU5IDYzLjMxIDY3LjY3IDg0LjMgMTIwLjQ0IDgzLjA3IDIwOC44My0xLjAxNyA3My4xOS0yNi4xNiAxNDAuNDktODUuNTYgMjI5LjAzLTQxLjk3NCA2Mi41Ni0xNjAuNDggMTk1LjU5LTE4NS4zNiAyMDguMDctOS4xNzEgNC42MDEtNDUuMjMtMi45NjktMTAxLjEtMjEuMjMiLz48cGF0aCBkPSJtNTQ0LjEzIDE3MzQuMjljNy43NTktNTAuNDkgMTQuNzkxLTU4LjQyIDkwLjU0LTEwMi4xMWw3MC44ODctNDAuODg3LTQ2Ljg3Ni0yOC40NzZjLTcyLjA4LTQzLjc5LTc3LjkzMi00OS41OTctNzEuOTI4LTcxLjQ0IDYtMjEuODMgODEuNDItNDkuMzcgMjEyLjcyLTc3LjY4IDEwMi4xLTIyLjAxIDM0Ni45OC0yMi4wMSA0NDkuMDggMCAxMzEuMyAyOC4zMSAyMDYuNzIgNTUuODUxIDIxMi43MiA3Ny42OCA2IDIxLjg0NC4xNTYgMjcuNjUyLTcxLjkyOCA3MS40NGwtNDYuODc2IDI4LjQ3NiA3MC44ODcgNDAuODg3Yzc1Ljc1IDQzLjY5IDgyLjc4IDUxLjYyMSA5MC41NCAxMDIuMTFsNSAzMi41NDJoLTQ4NC44Ny00ODQuODdsNS0zMi41NDJtNTUwLjEyLTEzOC43N2MzNy43Ni0yMi42MjkgNjcuNDItNDQuODQxIDY1LjkxNi00OS4zNi0xLjUwNi00LjUyLTMyLjIzLTI2LjcwOC02OC4yOC00OS4zMWwtNjUuNTQtNDEuMDktNjcuNzMgNDAuNjM5Yy0zNy4yNSAyMi4zNTEtNjguODcyIDQ0LjUwNi03MC4yNyA0OS4yMy0yLjAyNyA2LjgzNiAxMjEuOTkgOTEuMDMgMTM0LjA5IDkxLjAzIDEuNzQxIDAgMzQuMDYtMTguNTE1IDcxLjgyLTQxLjE0Ii8+PC9nPjwvc3ZnPg==',
		q: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDQ4IDIwNDgiPjxwYXRoIGZpbGw9IiMxMDEwMTAiIGQ9Im0xMDI0IDI3OWg0NzhxLTUzIDEzMC00MyAyODAtMTAwIDM5LTIxMyA2Ny41dC0yMjIgMjguNXEtMTEwIDAtMjIzLTI4LjV0LTIxMi02Ny41cTktMTUwLTQzLTI4MGg0NzhtMCA0NTBxMTExIDAgMjIzLjUtMjYuNXQyMjAuNS02Ny41cTE3IDEwNSA2MC41IDIxMi41dDEwNS41IDIxMi41bC0yMjAtMTU1LTEyMyA2MDEtMjY3LTU1NS0yNjcgNTU1LTEyMy02MDEtMjIwIDE1NXE2MS0xMDUgMTA0LjUtMjEyLjV0NjEuNS0yMTIuNXExMDggNDEgMjIwLjUgNjcuNXQyMjMuNSAyNi41bTAtNTI0aC01ODNxMTE0IDIzMSA1Ny41IDQ1Ni41dC0yMDIuNSA0NDkuNXEtMTItMi0xOS0yLTU0IDAtOTIuNSAzOC41dC0zOC41IDkyLjUgMzguNSA5Mi41IDkyLjUgMzguNSA5Mi41LTM4LjUgMzguNS05Mi41cTAtMjAtNi0zOC00LTE0LTE1LTMzbDE5Ni0xMzkgMTAwIDQ4NnEtNjQgMzEtNzIgMTAzLTUgNDQgMjkgOTF0ODggNTNxNTQgNSA5Ni0yOXQ0OC04OHE3LTY4LTQ2LTExNGwxOTgtNDEyIDE5OCA0MTJxLTU0IDQ2LTQ2IDExNCA2IDU0IDQ4IDg4dDk2IDI5cTU0LTYgODcuNS01M3QyOS41LTkxcS05LTcyLTcyLTEwM2wxMDAtNDg2IDE5NiAxMzlxLTEyIDE5LTE1IDMzLTYgMTgtNiAzOCAwIDU0IDM4LjUgOTIuNXQ5Mi41IDM4LjUgOTIuNS0zOC41IDM4LjUtOTIuNS0zOC41LTkyLjUtOTIuNS0zOC41cS03IDAtMTkgMi0xNDctMjI0LTIwMy00NDkuNXQ1OC00NTYuNWgtNTgzbS03NDggMTA5N3EtNjIgMC02Mi02MnQ2Mi02MnE2MyAwIDYzIDYydC02MyA2Mm00NjYgMzk0cS02MiAwLTYyLTYydDYyLTYyIDYyIDYyLTYyIDYybS0xNTItMTE2N2wxMTktNzItMTM0LTg2cTE5IDg2IDE1IDE1OG0xMTgyIDc3M3EtNjMgMC02My02MnQ2My02MnE2MiAwIDYyIDYydC02MiA2Mm0tNDY2IDM5NHEtNjIgMC02Mi02MnQ2Mi02MiA2MiA2Mi02MiA2Mm0xNTItMTE2N2wtMTE5LTcyIDEzNC04NnEtMjAgODYtMTUgMTU4bS01NzMtNDdsMTM5IDgzIDEzOS04Ni0xMzktODR6IiB0cmFuc2Zvcm09Im1hdHJpeCgxIDAgMC0xIDAgMjA0OCkiLz48ZyBmaWxsPSIjZjlmOWY5Ij48cGF0aCBkPSJtNTc2Ljc3IDEzNzQuMTZjLTE0LjI2Ny02Ni43NC01Mi4zMy0xNzMuNDQtOTEuODEtMjU3LjM5LTIzLjM3LTQ5LjY4OC00MC44MzQtOTItMzguODEtOTQuMDIgMi4wMjUtMi4wMjUgNDUuODMgMjYuMTggOTcuMzQgNjIuNjdsOTMuNjYgNjYuMzUgNTguNDUtMjg0LjczYzMyLjE1LTE1Ni42IDU5LjYzLTI5MC4zIDYxLjA4LTI5Ny4xMSAxLjQ0OS02LjgwOSA2MC45NDUgMTA5LjM3IDEzMi4yMSAyNTguMTcgNzEuMjcgMTQ4LjggMTMyLjA2IDI3MC41NSAxMzUuMSAyNzAuNTUgMy4wMzkgMCA2My44MzQtMTIxLjc1IDEzNS4xLTI3MC41NSA3MS4yNy0xNDguOCAxMzAuNzYtMjY0Ljk4IDEzMi4yMS0yNTguMTcgMS40NDkgNi44MDkgMjguOTM2IDE0MC41MSA2MS4wOCAyOTcuMTFsNTguNDUgMjg0LjczIDkzLjY2LTY2LjM1YzUxLjUxLTM2LjQ5MiA5NS41NC02NC40NyA5Ny44NC02Mi4xNyAyLjI5NyAyLjI5Ny0xMS45NTcgMzYuMjYtMzEuNjc1IDc1LjQ4LTM4LjQ3NCA3Ni41Mi03OC4zMiAxODQuNC05NS4zMSAyNTguMDktNS43ODEgMjUuMDYtMTMuMDUgNDUuNDktMTYuMTUgNDUuNDEtMy4xMDQtLjA4NC00MS42Ni0xMS41MjEtODUuNjgtMjUuNDE1LTE0Mi41NC00NC45ODctMjEyLjk5LTU2LjM0LTM0OS41Mi01Ni4zNC0xMzYuNTMgMC0yMDYuOTkgMTEuMzU3LTM0OS41MiA1Ni4zNC00NC4wMiAxMy44OTQtODIuNjYgMjUuMzMxLTg1Ljg2IDI1LjQxNS0zLjIuMDg0LTguNTMyLTEyLjUzOC0xMS44NDgtMjguMDUiLz48cGF0aCBkPSJtNTU4LjkzIDE3NDcuMzFjMy4wNTgtMTAuNzM5IDcuNzcxLTI5LjU4OCAxMC40NzQtNDEuODg3IDMuNTc0LTE2LjI2MiAyMy42MDMtMzQuMDIgNzMuNDItNjUuMDggMzcuNjgxLTIzLjQ5OCA2OC41Ny00NS4yIDY4LjY0LTQ4LjI0LjA3MS0zLjAzLTI3LjIxLTIyLjAzLTYwLjYyLTQyLjIyLTMzLjQxLTIwLjE5LTYwLjc0Ni00MS4zNC02MC43NDYtNDcuMDEgMC0xMi43NjggMTQxLjMyLTU5LjgxMiAyNTEuMzYtODMuNjcgMTEwLjk2LTI0LjA2IDI1NC4xMi0yNC4wNiAzNjUuMDggMCAxMTAuMDQgMjMuODYxIDI1MS4zNiA3MC45MDUgMjUxLjM2IDgzLjY3IDAgNS42NjYtMjcuMzM2IDI2LjgxOS02MC43NDYgNDcuMDEtMzMuNDEgMjAuMTktNjAuNjYgMzkuMTgtNjAuNTUgNDIuMjIuMTA1IDMuMDMgMjkuNDI5IDIzLjkwMSA2NS4xNiA0Ni4zOCA2Mi44NDIgMzkuNTIzIDczLjgwNCA1Mi45NTMgODcuMzggMTA3LjA1bDUuMzQ5IDIxLjMxMmgtNDcwLjU2LTQ3MC41Nmw1LjU2LTE5LjUyNW01MzguNTMtMTMyLjk5YzM1Ljk2Ni0yMS44MzUgNjUuMzctNDIuMzQgNjUuMzUtNDUuNTU5LS4wNTQtNy4xNDMtMTI3LjcxLTg4LjMtMTM4LjktODguMy0xNC43MjggMC0xMzkuNjMgNzkuODMtMTM3LjAxIDg3LjU3IDMuNDAyIDEwLjA1IDEyMSA4NC42NSAxMzQuNjIgODUuNDEgNS43OTcuMzIxIDM5Ljk2Ni0xNy4yODEgNzUuOTMyLTM5LjEyIi8+PHBhdGggZD0ibTE3MzguMTkgODU3LjQ0Yy0yNy45MjQtMTcuNzUtMjcuODUzLTgxLjMzLjExMS05OS4xMSAzNS4zNC0yMi40NjggOTIuNzUgOC4yMjcgOTIuNzUgNDkuNTg5IDAgNDEuNDMtNTcuNDEgNzIuMDUtOTIuODYgNDkuNTIiLz48cGF0aCBkPSJtMTI4NC4zNCA0NjcuOThjLTM0LjI4LTEyLjcyNS00Ni42OTMtNjcuNzItMjEuMDgtOTMuMzMgMTcuNTc2LTE3LjU3NiA2Ny45NjQtMTcuNTc2IDg1LjU0IDAgMTYuMzYyIDE2LjM2MiAxNy44MTcgNTUuNjc1IDIuNzg5IDc1LjM1LTEyLjE0OCAxNS45MDMtNDcuNDQgMjUuMzQyLTY3LjI1IDE3Ljk4NyIvPjxwYXRoIGQ9Im03MjAuMjcgNDY3Ljk4Yy0zNC4yOC0xMi43MjUtNDYuNjkzLTY3LjcyLTIxLjA4LTkzLjMzIDE3LjU3Ni0xNy41NzYgNjcuOTY0LTE3LjU3NiA4NS41NCAwIDE2LjM2MiAxNi4zNjIgMTcuODE3IDU1LjY3NSAyLjc4OSA3NS4zNS0xMi4xNDggMTUuOTAzLTQ3LjQ0IDI1LjM0Mi02Ny4yNSAxNy45ODciLz48cGF0aCBkPSJtMjM0LjMxIDg0Ni45N2MtMjIuMTktMjIuMTktMjIuMTktNTUuOTEyIDAtNzguMSAxNy40NDEtMTcuNDQxIDU2LjEtMjIuODAyIDc1LjUtMTAuNDcgMjcuOTI0IDE3Ljc1IDI3Ljg1MyA4MS4zMy0uMTExIDk5LjExLTE5LjI5OSAxMi4yNzEtNTcuOTg4IDYuODYzLTc1LjM5LTEwLjUzOCIvPjwvZz48L3N2Zz4=',
		r: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDQ4IDIwNDgiPjxwYXRoIGZpbGw9IiMxMDEwMTAiIGQ9Im0xMDI0IDU0N2gtMzgxbDUgNzRoMzc2IDM3Nmw1LTc0aC0zODFtMCA2NjFoLTMzMmw1IDc0aDMyNyAzMjdsNS03NGgtMzMybTAtMTAwM2gtNjQxbDI5IDI2NCAxNTkgMTE4IDUwIDY1OS0xNDkgMTA3LTE3IDM0MWgyODl2LTE0N2gxMzd2MTQ3aDE0MyAxNDN2LTE0N2gxMzd2MTQ3aDI4OWwtMTctMzQxLTE0OS0xMDcgNTAtNjU5IDE1OS0xMTggMjktMjY0aC02NDFtMCA3NGg1NTdsLTE1IDE0OS0xNjEgMTE5LTU0IDczNSAxNTIgMTA5IDEzIDIzMGgtMTM4di0xNDhoLTI4NXYxNDhoLTY5LTY5di0xNDhoLTI4NXYxNDhoLTEzOGwxMy0yMzAgMTUyLTEwOS01NC03MzUtMTYxLTExOS0xNS0xNDloNTU3IiB0cmFuc2Zvcm09Im1hdHJpeCgxIDAgMC0xIDAgMjA0OCkiLz48ZyBmaWxsPSIjZjlmOWY5Ij48cGF0aCBkPSJtNjU1LjgzIDEzNzguNDljNS4wMi00OS42ODQgMzguNDEtNTAwLjU3IDM4LjQxLTUxOC43MiAwLTExLjA2IDQ0Ljg2OC0xMi44MDQgMzI5Ljc2LTEyLjgwNCAyODQuODkgMCAzMjkuNzYgMS43NDIgMzI5Ljc2IDEyLjgwNCAwIDE4LjE1IDMzLjM4MiA0NjkuMDQgMzguNDEgNTE4LjcybDQuMTY3IDQxLjIyaC0zNzIuMzMtMzcyLjMzbDQuMTY3LTQxLjIyIi8+PHBhdGggZD0ibTYyNC43OCA3MDcuNjVsLTczLjczLTUyLjU0LTUuNjQ3LTcxLjEyYy0zLjEwNi0zOS4xMi02LjAzLTg5LjY3LTYuNTA4LTExMi4zNGwtLjg2MS00MS4yMmg2NS4wOCA2NS4wOHY3My43NiA3My43NmgxNDcuNTMgMTQ3LjUzdi03My43Ni03My43Nmg2MC43NDYgNjAuNzQ2djczLjc2IDczLjc2aDE0Ny41MyAxNDcuNTN2LTczLjc2LTczLjc2aDY1LjA4IDY1LjA4bC0uODYxIDQxLjIyYy0uNDc0IDIyLjY3MS0zLjQwMiA3My4yMi02LjUwOCAxMTIuMzRsLTUuNjQ4IDcxLjEyLTczLjczIDUyLjU0LTczLjczIDUyLjU0aC0zMjUuNDgtMzI1LjQ4bC03My43My01Mi41NCIvPjxwYXRoIGQ9Im00NzEuNjcgMTc1MS42NWMyLjMyNC04LjM1MyA2Ljc1MS00MS4wNiA5LjgzOC03Mi42OGw1LjYxMi01Ny41IDc5LjMzLTU3LjQ5IDc5LjMzLTU3LjQ5aDM3OC4yMSAzNzguMjFsNzkuMzMgNTcuNDkgNzkuMzMgNTcuNDkgNS42MTIgNTcuNWMzLjA4NiAzMS42MjMgNy41MTQgNjQuMzMgOS44MzggNzIuNjggMy45OTMgMTQuMzQ5LTI2LjQ1MiAxNS4xODYtNTUyLjMzIDE1LjE4Ni01MjUuODggMC01NTYuMzMtLjgzNy01NTIuMzMtMTUuMTg2Ii8+PC9nPjwvc3ZnPg==',
		b: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDQ4IDIwNDgiPjxwYXRoIGZpbGw9IiMxMDEwMTAiIGQ9Im0xMDI0IDE2OTJxNjYgMCA2NCA2NiAxIDU1LTY0IDU1LTY2IDAtNjQtNTUtMy02NiA2NC02Nm0wLTEyMDRxMC0xMTQtMTAxLTE5OC41dC0yMjMtODQuNWgtNDk1cTAgMTE3IDY1IDE3OXQxNDIgNjJoMjUwcTUxIDAgODggN3Q3MSA2MHExMiAyMCAxMCAxNmg3NnEtNy0yMS0zLTEzLTQ1LTEwNS0xMDktMTI0LjV0LTE0Ni0xOS41aC0yNDBxLTUyIDAtODYtNDB0LTM0LTUzaDQyNHE2NiAwIDE1OC41IDY1dDkzLjUgMTg1aC0zNDFxNjcgMTE2IDcyIDIyOS0xMTQgMTE5LTE2MiAyMjMuNXQtNiAyMjMuNXEzMyA5NiAxMTggMTg5LjV0MzEyIDI0Ni41cS0xNyAxMS00NiAzNnQtMjkgNzlxMCA1OCA0MSA5NnQxMDAgMzhxNTggMCA5OS41LTM4dDQxLjUtOTZxMC01NC0yOS41LTc5dC00NS41LTM2cTIyNi0xNTMgMzExLTI0Ni41dDExOS0xODkuNXE0Mi0xMTktNi0yMjMuNXQtMTYyLTIyMy41cTQtMTEzIDcyLTIyOWgtMzQxcTAtMTIwIDkzLTE4NXQxNTktNjVoNDI0cTAgMTMtMzQuNSA1M3QtODUuNSA0MGgtMjQwcS04MyAwLTE0Ni41IDE5LjV0LTEwOC41IDEyNC41cTQtOC0zIDEzaDc2cS0yIDQgMTAtMTYgMzMtNTMgNzAtNjB0ODktN2gyNTBxNzYgMCAxNDEuNS02MnQ2NS41LTE3OWgtNDk1cS0xMjMgMC0yMjMuNSA4NC41dC0xMDAuNSAxOTguNW0wIDExNGgyODNxLTI4IDg0LTI5IDE1NC0xMjAgNDEtMjU0IDM4LTEzNSAzLTI1NC0zOC0yLTcwLTI5LTE1NGgyODNtMCAyNjdxMTU5IDEgMjg1LTQyIDE4OSAxODAgMTQyIDM0Ni02MCAxOTMtNDI3IDQzMS0zNjgtMjM4LTQyNy00MzEtNDgtMTY2IDE0Mi0zNDYgMTI1IDQzIDI4NSA0Mm0tNDcgMzYxdjEwNGg5NHYtMTA0aDk1di04OWgtOTV2LTE2NWgtOTR2MTY1aC05NXY4OWg5NSIgdHJhbnNmb3JtPSJtYXRyaXgoMSAwIDAtMSAwIDIwNDgpIi8+PGcgZmlsbD0iI2Y5ZjlmOSI+PHBhdGggZD0ibTk4MC4xOCAzMzMuMzRjLTIyLjE5LTIyLjE5LTIyLjE5LTU1LjkxMiAwLTc4LjEgMzUuODM4LTM1LjgzOCAxMDQuMTQtMTAuMjI3IDEwNC4xNCAzOS4wNSAwIDI5LjQ1Ny0yOS4wMiA1Ni40MS02MC43NDYgNTYuNDEtMTQuNDYzIDAtMzMuNzQ4LTcuNzE0LTQzLjM5LTE3LjM1NiIvPjxwYXRoIGQ9Im02OTEuNTYgMTE2Mi45MmMtODYuMDItMTAzLjMtMTE4LjQzLTIxNy41MS04NS4yLTMwMC4yMiAyMy40NjEtNTguNCA4Ny42My0xNDUuNDggMTUyLjg1LTIwNy40NCA2Ni42Ni02My4zMiAxOTMuODQtMTYxLjcxIDI0My43OS0xODguNjJsMjcuMzM4LTE0LjcyMiA5MC43OSA2Ni4xN2MyMzAuMzEgMTY3Ljg0IDM0Ny4yMyAzMjMuNDQgMzMzLjE3IDQ0My40MS02LjgwOSA1OC4xMS00Ni4wNCAxMzguMTYtOTguNzIgMjAxLjQzbC00NC4wNSA1Mi45MDItNjMuNzEtMTcuNDYyYy01My4xNy0xNC41NzItOTAuMjgtMTcuNDYyLTIyNC4yNS0xNy40NjItMTMzLjk3IDAtMTcxLjA5IDIuODktMjI0LjI1IDE3LjQ2MmwtNjMuNzEgMTcuNDYyLTQ0LjA1LTUyLjkwMm0zODQuMDgtMTY1Ljcydi04Mi40NGg0Ny43MjkgNDcuNzI5di01Mi4wNy01Mi4wN2gtNDcuNzI5LTQ3LjcyOXYtNTIuMDctNTIuMDdoLTUyLjA3LTUyLjA3djUyLjA3IDUyLjA3aC00Ny43MjktNDcuNzI5djUyLjA3IDUyLjA3aDQ3LjcyOSA0Ny43Mjl2ODIuNDQgODIuNDRoNTIuMDcgNTIuMDd2LTgyLjQ0Ii8+PHBhdGggZD0ibTc0NS45OCAxNDQxLjk1Yy4wNTctMS4xOTMgNS44NjgtMjMuNjQ4IDEyLjkxNC00OS44OTggNy4wNS0yNi4yNSAxMi44NTctNTguMzYgMTIuOTE0LTcxLjM1LjA5Mi0yMS4xNiA1LjMxLTI1LjIzIDUwLTM5LjA1IDcwLjg4OC0yMS45MTkgMzMxLjU4LTIyLjI2MSA0MDEuNzEtLjUyOGw0OC4wOCAxNC45MDEgMTAuMjIzIDU5LjYyYzUuNjIzIDMyLjc5IDEyLjcxNSA2Ni4xMSAxNS43NjEgNzQuMDUgNS4wOTIgMTMuMjctMTYuODU4IDE0LjQzLTI3My4wOSAxNC40My0xNTMuMjQgMC0yNzguNTgtLjk3Ni0yNzguNTItMi4xNjkiLz48cGF0aCBkPSJtMzEyLjIzIDE3MzguODJjMzguMi01My42NTEgNDYuMjItNTUuNTcgMjU1LjMzLTYxLjI0IDEwNS4yNy0yLjg1MSAyMDUuMzMtOS42ODcgMjIyLjQ0LTE1LjE5OCAzOC42MzItMTIuNDQgODcuMzEtNjAuMTQgMTA3Ljg1LTEwNS42OSAxMi43OTQtMjguMzcyIDE5Ljg4Ni0zNC40NzggNDAuMDUtMzQuNDc4IDIyLjkyIDAgMjQuMTYgMS44MTggMTkuMzA3IDI4LjItMTUuNjE3IDg0Ljg0LTU4Ljg2MSAxMzYuNzItMTUzLjkxIDE4NC42NWwtNTkuNzQyIDMwLjEzaC0yMjUuMDUtMjI1LjA1bDE4Ljc4OC0yNi4zODUiLz48cGF0aCBkPSJtMTI0My44NSAxNzM1LjA4Yy05NS41OS00OC4yMS0xMzUuMDktOTQtMTUwLjAyLTE3My45Mi03LjExOS0zOC4xMS02Ljc5Mi0zOC45MjcgMTUuNDcxLTM4LjY3NCAxOC40NC4yMDkgMjguMTcgOS42NTIgNTEuNDIgNDkuODk4IDUzLjg1NSA5My4yNCA5Mi42MSAxMDUuNzkgMzI3LjEyIDEwNS45NiAxODMuNzEuMTMgMjA1IDUuMjE2IDI0NS41MiA1OC42NjZsMjEuMzgzIDI4LjJoLTIyNS41Ny0yMjUuNTdsLTU5Ljc0Mi0zMC4xMyIvPjwvZz48L3N2Zz4=',
		n: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDQ4IDIwNDgiPjxwYXRoIGZpbGw9IiMxMDEwMTAiIGQ9Im0xMDA0IDk1NnEzMS0xNyA1NC00MiAyMSAxNSAzNi41IDEzLjV0MzMuNSAxLjVxNzggMTEgMTI4LjUgODV0NTIuNSAxNjVsLTE5IDY3cS01NS0yMzktMTg4LTI1Ny0yMS0zLTQ1LTUuNXQtNTMtMjcuNW0tMjU4IDQ0OWwtNDYgNjBxNiAzOSAxMTUuNSAxMDcuNXQyMjAuNSAxNDMuNWwxMTUgMTU0IDk2LTIxN3EzNDItMTcyIDQzMi41LTQxNy41dDQ3LjUtNjAzLjVxLTE4LTEyOCA0LjUtMjM2LjV0NTcuNS0xOTAuNWgtMTI0MnEtOSAxNzggMzkgMzAxLjV0MTgzIDIzNy41cTc4IDE2IDExNSA3MXQ1NSA4NXEtMjM2IDQyLTI5Mi02MGwtNTYtMTAyLTIxNyAxMjEgMTE1IDgyLTUxIDUwLTEyMi04Ni0xMiAyOTcgMzk2IDI2M3ExMi0xOCAyMy0zMXQyMy0yOWwtMzY2LTI0MSA0LTEyNSA2NCA0MSAxMzgtMTQ0LTc4LTY1IDQ3LTI4IDM4LjUgNDV0MTA4LjUgNzNxNTQgMTggMTY1IDI3dDE5MS03NHEtNTYtNjMtOTEtMTMyLjV0LTE1Mi0xMDIuNXEtOTItNzktMTQ2LTE3Ni41dC00OC0yMjMuNWgxMDE5cS0zNSAxMzMtMzIgMjM0LjV0MTIuNSAxOTkgOSAyMDUtNDAuNSAyNTIuNXEtNTEgMTI2LTEzNCAyMzR0LTI2MiAxODhsLTU5IDEzMy00OS02OXEtOTktNjItMjA4LTEzMXQtMTMxLTEyMG0yOTItMzBsLTIxMiAyIDExNiAxMDBxMzAgMjUgODAtMzguNXQxNi02My41bS01MzYtMTk1bDM3LTMxLTQ2LTU1LTU3IDI2IDMzIDU2eiIgdHJhbnNmb3JtPSJtYXRyaXgoMSAwIDAtMSAwIDIwNDgpIi8+PHBhdGggZD0ibTYyNy45NSAxNzA2LjMxYzcuMDYtNzYuMDEgMzAuNjU5LTEzOS42OSA3Ni4wMS0yMDUuMTQgNTUuNjEzLTgwLjI2IDk0LjMzLTExNi4xNSAxNTUuMTQtMTQzLjc5IDcxLjMtMzIuNDIxIDc5LjM5LTM5Ljg4MSAxMzQuNTgtMTI0LjIzIDYyLjIxLTk1LjA3IDc2LjM5LTEwOC40NCAxMTUuMjYtMTA4LjY3IDQyLjMxLS4yNSA5NC45MS0yNS4zMjEgMTI5LjM5LTYxLjY2IDU2LjE0LTU5LjE4IDg1LjY1LTE3MCA2My4zLTIzNy43MWwtMTAuOTA3LTMzLjA1LTIzLjY0NiA3MC40N2MtMzQuMTMgMTAxLjcyLTY1LjQ5IDE0Ni41LTEyMy40MiAxNzYuMjEtMTcuNzA4IDkuMDgtNDIuMjQgMTYuNTExLTU0LjUyIDE2LjUxMS0xMi4yNzYgMC0zNi41NDYgNS45NDQtNTMuOTM0IDEzLjIwOS0yOC41OSAxMS45NDUtMzUuNzQ4IDExLjgzNy03NC44MS0xLjEzNy00Ni41ODUtMTUuNDczLTE0NC4wOC0xMi4zNzgtMjIyLjU2IDcuMDctNDIuODIxIDEwLjYwOS0xNTkuNzIgODQuNDgtMTY4LjA1IDEwNi4yLTYuMTE1IDE1LjkzNi0yNC4yMSAxNy41ODMtMzguMzEgMy40ODctNy41NzMtNy41NzMtMS4zMzktMTcuNzIxIDI1LjUzNi00MS41NzFsMzUuNTU1LTMxLjU1Mi02OS42MS03My4zNS02OS42MS03My4zNS0zMC4zMzQgMTQuNDY1LTMwLjMzNCAxNC40NjYtNS40MjgtMzkuNjAyYy0yLjk4NS0yMS43ODEtNS40MjgtNDUuMDItNS40MjgtNTEuNjM5IDAtNi42MiA4Mi4wMy02Ni4zMyAxODIuMjktMTMyLjcgMTAwLjI2LTY2LjM2IDE5My4wMS0xMzMuNjIgMjA2LjEtMTQ5LjQ2IDM2LjI2LTQzLjg2MyA0OC40NS01Mi45NzggMTkwLjcxLTE0Mi41OSA5NS43Ny02MC4zMiAxMzcuNTItOTEuODkgMTUxLjU1LTExNC41OWwxOS4zNjItMzEuMzMgMjkuNTU3IDY2LjA4YzI2LjAyIDU4LjE4IDMzLjgyMyA2OCA2NS4yIDgyLjEyIDE5MC40NCA4NS42OSAzMzMuNTIgMjczLjM3IDM3OS4zOSA0OTcuNjYgMTkuNTUyIDk1LjU5IDE5LjgyMiAxNDkuMTEgMi42MjUgNTIwLjY4LTQuMjI0IDkxLjI3LTIuMyAxMzIuMjIgOC43MTEgMTg1LjM0IDcuNzczIDM3LjUgMTQuMTMgNzEuNjcgMTQuMTMgNzUuOTMyIDAgNC40NTktMjE0LjI2IDcuNzUtNTA0LjU3IDcuNzVoLTUwNC41N2w1LjYyNS02MC41M20tMTAwLjE1LTgyMS45NGMtMjcuMTktMjguOTQxLTU1Ljg3OC0yNS44ODQtNzYuNjQgOC4xNjctMjIuNTU5IDM3LTIyLjEyIDM5LjExIDEwLjk0MyA1My4xIDI2LjkzMyAxMS4zOTYgMjkuNDcxIDEwLjczNyA1Ni4zNi0xNC42NWwyOC4xNi0yNi41ODQtMTguODIzLTIwLjA0bTUyMy41Ny0yMzIuNDVjLTQuNjU4LTI2LjYxOC01Mi41My04Mi4wOS03NS45MDktODcuOTUtMjQuNjU2LTYuMTg4LTQxLjc3NiA0LjE0LTEwNy42NiA2NC45NTVsLTQ3LjcyOSA0NC4wNSAxMTcuMTUtMS45NDdjMTExLjQxLTEuODUyIDExNy4wMS0yLjc4OSAxMTQuMTUtMTkuMTEiIGZpbGw9IiNmOWY5ZjkiLz48L3N2Zz4=',
		p: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDQ4IDIwNDgiPjxwYXRoIGZpbGw9IiMxMDEwMTAiIGQ9Im01MjAgMjc5aDEwMDhxOCA5Ny0xMzIgMTgyLTEzMiAxMDEtMTk2LjUgMjM5LjV0LTc5LjUgMzA4LjVoLTE5MnEtMTUtMTcwLTc5LjUtMzA4LjV0LTE5Ni41LTIzOS41cS0xNDEtODUtMTMyLTE4Mm01MDQtNzRoLTU3OHY3NHEtNCA4MCA0MS41IDEzN3QxMjUuNSAxMDhxMTE3IDkxIDE3MS41IDIxNy41dDc4LjUgMjY3LjVoLTI4N2wyODQgMjM5cS04NiA3NC04NiAxODggMCAxMDMgNzMgMTc3dDE3NyA3NHExMDMgMCAxNzYuNS03NHQ3My41LTE3N3EwLTExNC04Ni0xODhsMjg0LTIzOWgtMjg3cTIzLTE0MSA3OC0yNjcuNXQxNzItMjE3LjVxNzktNTEgMTI0LjUtMTA4dDQyLjUtMTM3di03NGgtNTc4bS0yNjggODY5aDUzNmwtMjI1IDE5MXExMzQgMzEgMTM0IDE3MSAwIDc2LTUyLjUgMTI2LjV0LTEyNC41IDUwLjVxLTczIDAtMTI1LTUwLjV0LTUyLTEyNi41cTAtMTQwIDEzNC0xNzF6IiB0cmFuc2Zvcm09Im1hdHJpeCgxIDAgMC0xIDAgMjA0OCkiLz48ZyBmaWxsPSIjZjlmOWY5Ij48cGF0aCBkPSJtODczLjQ2IDg4MS4zNWM1Ni41NS00Ny45MTIgMTAzLjktOTAuMjMgMTA1LjIzLTk0LjAzIDEuMzI5LTMuODAzLTEzLjU2LTE0LjEyLTMzLjA5LTIyLjkyNC0xNTIuMjUtNjguNjYtMTA4LjA5LTMwMi41NCA2MC45MDEtMzIyLjU1IDM1LjUzNi00LjIwOSA1MS4xNi0xLjA0MyA5MC45NiAxOC40MjkgMTI5LjI4IDYzLjI1IDEzMi4yNiAyNDYuNzEgNC45MzggMzA0LjEyLTE5LjUyNiA4LjgwNS0zNC40MTUgMTkuMTItMzMuMDkgMjIuOTI0IDEuMzI5IDMuODAzIDQ4LjY4MyA0Ni4xMiAxMDUuMjMgOTQuMDNsMTAyLjgxIDg3LjExaC0yNTMuMzYtMjUzLjM2bDEwMi44MS04Ny4xMSIvPjxwYXRoIGQ9Im03ODEuMDIgOTYxLjg3YzAtMy42MjUgNy4wMy0xMC45OCAxNS42Mi0xNi4zNDUgMjEuMi0xMy4yMzcgMTc4LjkzLTE1Mi4wNyAxODIuNDItMTYwLjU2IDEuNTMyLTMuNzI5LTcuMjU0LTkuMjk5LTE5LjUyNS0xMi4zNzktMTIuMjcxLTMuMDgtMjIuMzExLTguNDIyLTIyLjMxMS0xMS44NzEgMC0zLjQ0OS05LjcyNC0xMS40NzUtMjEuNjA4LTE3LjgzNS00OS41NzktMjYuNTM0LTcyLjM1LTEyNy41My00NC4wNC0xOTUuMyA1Ljk4My0xNC4zMiAxMS40ODYtMjguOTY2IDEyLjIyOC0zMi41NDYgMi4yMTItMTAuNjY4IDM1LjM3LTQxLjIyIDQ0LjczOS00MS4yMiA0Ljc3MyAwIDguNjc4LTMuMjM0IDguNjc4LTcuMTg4IDAtMTMuMjAxIDgxLjk0Ny0yNi43ODcgMTE1LjY4LTE5LjE4IDUwLjczNCAxMS40NDIgMTE2Ljc5IDYyLjEzIDEyNi4yMSA5Ni44NCAxOS43MzYgNzIuNzUgMTkuNDMyIDEwMi42NC0xLjQ1NCAxNDIuOTctMTUuOTU1IDMwLjgxMi02Ni4wMiA3Ny40LTkyLjA1IDg1LjY2LTEwLjU0NiAzLjM0Ny0xNy45ODQgOC45NDktMTYuNTI4IDEyLjQ0OSAzLjQxOSA4LjIxOCAxNjEuNzYgMTQ3LjMzIDE4Mi4yOCAxNjAuMTQgOC41OTEgNS4zNjUgMTUuNjIgMTIuNzIgMTUuNjIgMTYuMzQ1IDAgMy42MjUtMTA5LjM0IDYuNTkxLTI0Mi45OCA2LjU5MS0xMzMuNjQgMC0yNDIuOTgtMi45NjYtMjQyLjk4LTYuNTkxIi8+PHBhdGggZD0ibTUyMC42OCAxNzU3Ljg4YzAtMTUuODUxIDI2LjI0LTcyLjMzIDQxLjU1MS04OS40NiA4LjE3MS05LjEzNCA1MC4xMS00NS4wMiA5My4xOS03OS43NiAxNTIuOTQtMTIzLjI5IDIzMy41OS0yNjYuNTEgMjY1Ljk4LTQ3Mi4zNmwxMC45NzMtNjkuNzRoOTEuNjMgOTEuNjNsMTAuOTczIDY5Ljc0YzMxLjA0IDE5Ny4yNyAxMTMuNjggMzQ5LjUzIDI0OC4xMSA0NTcuMTIgMTE1LjA0IDkyLjA4IDEzMy44NCAxMTMuNzMgMTQ3LjIyIDE2OS41NWw1LjcyMiAyMy44NjRoLTUwMy40OWMtMzQwLjMyIDAtNTAzLjQ5LTIuOTAzLTUwMy40OS04Ljk1NyIvPjwvZz48L3N2Zz4='
	},
	b: {
		k: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDQ4IDIwNDgiPjxwYXRoIGZpbGw9IiMxMDEwMTAiIGQ9Im0xMDI0IDI3OWg0ODlsLTEyIDczaC00NzctNDc3bC0xMi03M2g0ODltMCA5MjFxLTI1IDYwLTYyIDExMSAzMSA0OCA2MiA2NSAzMC0xNyA2Mi02NS0zOC01MS02Mi0xMTFtLTk3LTQ1NHEtMTU0LTExLTMwMy01OC0xMjMgMTA4LTIwMCAyMTMuNXQtNzcgMjAxLjVxMCA4OSA3My41IDE1OXQxNDguNSA3MHE2NyAwIDEzNC41LTYyLjV0MTAyLjUtMTMwLjVxMzAtNTQgNzUtMTc1dDQ2LTIxOG0tMzUwLTIxN2wtMjYtMTU2IDE0NSA4NHptNDQ3IDkwN3EtNDcgMC0xMzYtMTIxLTMxIDM2LTUwIDU1IDkzIDE0MCAxODYgMTQwIDkyIDAgMTg2LTE0MC0yMC0xOS01MC01NS05MCAxMjEtMTM2IDEyMW0wLTc3NXEtMSAxMjYtNDIgMjY3LjV0LTg0IDIyNi41cS04IDE0LTE0IDI3dC0xMiAyM3EtMjggNDMtNDggNjktNTEgNjMtMTIwIDEwNXQtMTM0IDQycS0xMDMgMC0yMDgtOTN0LTEwNS0yMjlxMC0xMjAgOTktMjU0LjV0MjQ5LTI1OS41cTIwMSA3NCA0MTkgNzZtMC00NTZoLTU3Nmw2MSAzNjVxLTMyNSAyODAtMzI2IDUzNS0xIDE1OSAxMjUgMjc0LjV0MjY3IDExNS41cTc4IDAgMTU4LjUtNDd0MTQyLjUtMTE5cTYxLTc0IDk4LjUtMTY0LjV0NDkuNS0xNTAuNXExMiA2MCA0OSAxNTAuNXQ5OSAxNjQuNXE2MSA3MiAxNDIgMTE5dDE1OSA0N3ExNDAgMCAyNjYtMTE1LjV0MTI2LTI3NC41cS0yLTI1NS0zMjYtNTM1bDYxLTM2NWgtNTc2bTk3IDU0MXEwIDk3IDQ1IDIxOHQ3NiAxNzVxMzQgNjggMTAxLjUgMTMwLjV0MTM1LjUgNjIuNXE3NCAwIDE0Ny41LTcwdDc0LjUtMTU5cTAtOTYtNzctMjAxLjV0LTIwMC0yMTMuNXEtMTUwIDQ3LTMwMyA1OG0zNTAtMjE3bC0xMTktNzIgMTQ1LTg0em0tNDQ3IDEzMnEyMTctMiA0MTktNzYgMTUwIDEyNSAyNDkgMjU5LjV0OTkgMjU0LjVxMCAxMzYtMTA1LjUgMjI5dC0yMDcuNSA5M3EtNjYgMC0xMzUtNDJ0LTExOS0xMDVxLTIxLTI2LTQ4LTY5LTYtMTAtMTIuNS0yM2wtMTMuNS0yN3EtNDQtODUtODUtMjI2LjV0LTQxLTI2Ny41bS0xMzktMTU5bDEzOS04NiAxMzkgODQtMTM5IDg2em05MiAxMjQ4djk1aDk0di05NWgxMDd2LTk1aC0xMDd2LTE1M3EtNDggMTYtOTQgMHYxNTNoLTEwN3Y5NWgxMDciIHRyYW5zZm9ybT0ibWF0cml4KDEgMCAwLTEgMCAyMDQ4KSIvPjxnIGZpbGw9IiNlY2VjZWMiPjxwYXRoIGQ9Im0xNDAxLjQ5IDE0NDUuMDJjLTc4Ljg2Ni0yNy45NzItMjgwLjg1LTYzLjQ5LTM2MS4wNi02My40OS0xMy41NzMgMC04LjM3LTkyLjk0IDkuOTMyLTE3Ny40MSA0Ni41NDEtMjE0LjgxIDEzNC40Ny0zOTcuNjYgMjMxLjQ4LTQ4MS4zNCAxMDQuMjktODkuOTYgMjAyLjQzLTExMC4yOSAzMDEuODgtNjIuNTUgMTAxLjcxIDQ4LjgyMyAxNjguODYgMTI2LjQ4IDE5Mi42MSAyMjIuNzQgMTEuOTUyIDQ4LjQzIDEyLjUwNyA2NS44MzUgMy42MzMgMTEzLjk5LTIwLjA1IDEwOC44LTgxLjM4IDIwNS4zNi0yMjEuMjQgMzQ4LjMtMTEwIDExMi40My0xMTQuMTMgMTE1LjA1LTE1Ny4yNCA5OS43NW0xMjIuODItMTc5LjY2YzEzNC43Ni0xNDEuNDYgMTc1LjQ4LTIxNC40NiAxNzYuMTktMzE1Ljg0LjQ2OC02Ny4wNC0xMy40MzMtMTAxLjg0LTYxLjUyLTE1NC4wMS0xNDMuNDEtMTU1LjU4LTMxNS4xLTgzLjQ1LTQzNC40IDE4Mi40OS00Mi42MjEgOTUuMDEtNzYuNDkgMjA2LjEtODIuNTIgMjcwLjY1LTUuNzA2IDYxLjExLTEwLjIzMSA1Ny40OSA4NC44IDY3Ljc2NSAyNi41OTcgMi44NzUgODMuMjIgMTQuMzc2IDEyNS44MyAyNS41NTcgNDIuNjEgMTEuMTgxIDgxLjk3NCAyMC43NDkgODcuNDggMjEuMjYzIDUuNTAyLjUxMyA1Mi4zNi00My41MzMgMTA0LjE0LTk3Ljg4Ii8+PHBhdGggZD0ibTUyMi42OSAxMzc4Ljc2Yy0yMzkuODQtMjMwLjkzLTMwOC4xMS00MDIuNjYtMjI1LjY5LTU2Ny42OSAxMC43MDQtMjEuNDMzIDQxLTU4LjY3MSA2Ny4zMy04Mi43NSAxMDMuMzktOTQuNTYgMjA5LjE3LTExNy41NyAzMDguOTktNjcuMjQgMTA0Ljk0IDUyLjkxOSAxNzcuMzUgMTM3LjIzIDIzNy45MyAyNzcuMDIgNTguNTMgMTM1LjA3IDEwNC4wNyAzMTAuMTYgMTA0LjA3IDQwMC4xdjQxLjkzNmwtNTguNTggNS4zMzljLTEwNC4wMSA5LjQ4LTIxNC43OCAyOS41ODctMjgzLjg2IDUxLjUybC02Ny40NSAyMS40MTgtODIuNzQtNzkuNjdtMTg2LjM4LTM1Ljg3NGM0Ni43MjctMTEuNzA5IDEwNi40NC0yMy42NiAxMzIuNjktMjYuNTU4IDk1LjAyLTEwLjQ5MiA4OS45MS02LjIwNiA4My45Mi03MC40LTYuNjE3LTcwLjg1OS01Ni40Ni0yMTguODMtMTA2LjQ1LTMxNi4wNS04OC4zNS0xNzEuOC0yMTAuMDctMjQ5LjAxLTMyMC4wOC0yMDMuMDUtNDQuMTYgMTguNDUxLTExNi40NCA4Ny40OS0xMzUuNzUgMTI5LjY4LTE5LjA1IDQxLjYwNy0yMC45ODcgMTMyLjE4LTMuODUyIDE4MC4yMSAyMi42NTUgNjMuNDkgNzEuMDggMTMwLjk0IDE2NC4xNSAyMjguNjQgNTEuNzcyIDU0LjM1IDk1LjU1IDk4LjgxIDk3LjI4IDk4LjgxIDEuNzMxIDAgNDEuMzgtOS41OCA4OC4xMS0yMS4yODgiLz48cGF0aCBkPSJtMTAwMy4zNyA5NDkuNzRjLTE2LjUyMi01MC41NTctNzIuMDUtMTY0LjItOTcuMzEtMTk5LjE0LTEzLjM1Mi0xOC40NzItMTEuOTAxLTIxLjEyIDQxLjU3OS03NS45MzIgMzgtMzguOTUgNjEuOTk0LTU2Ljc5MiA3Ni4zNi01Ni43OTIgMTQuMzY3IDAgMzguMzYgMTcuODQyIDc2LjM2IDU2Ljc5MiA1My43MTcgNTUuMDUgNTQuOTggNTcuMzggNDEuMjggNzUuOTMyLTI0LjAyIDMyLjUzMi05OS43NCAxOTEuMTMtMTA1LjQ3IDIyMC45LTIuOTgzIDE1LjUxMi03LjkxOSAyOC4xOC0xMC45NjcgMjguMTQtMy4wNDgtLjAzNS0xMi44NzItMjIuNDg5LTIxLjgyOS00OS44OThtNTYuNjY3LTE1Ny42OGwzMS43MDItNTkuODE4LTI4LjUzNC0zMS4xNWMtMTUuNjk0LTE3LjEzLTMzLjM0LTMxLjE1LTM5LjIxLTMxLjE1LTUuODcyIDAtMjMuNTE2IDE0LjAyLTM5LjIxIDMxLjE1bC0yOC41MzQgMzEuMTUgMzEuNzAyIDU5LjgxOGMxNy40MzYgMzIuOSAzMy42NTUgNTkuODE4IDM2LjA0IDU5LjgxOCAyLjM4NiAwIDE4LjYwNS0yNi45MTggMzYuMDQtNTkuODE4Ii8+PHBhdGggZD0ibTk2MS4wOCAxNTg3LjU2Yy0zMi4yMi0yMC4xNC01OC41NC0zOC42MDctNTguNS00MS4wNS4wNDEtMi40MzkgMjcuMDctMjEuMDkgNjAuMDYtNDEuNDRsNTkuOTgzLTM3IDYxLjQzIDM2Ljk1OGMzMy43ODkgMjAuMzI3IDYxLjQzIDM5LjQ2MiA2MS40MyA0Mi41MjIgMCA0LjkxNS0xMTUuODQgNzcuMjMtMTIzLjAxIDc2Ljc5LTEuNTUyLS4wOTYtMjkuMTgtMTYuNjQ5LTYxLjQtMzYuNzg1Ii8+PHBhdGggZD0ibTU1OC43OCAxNjUyLjMyYzIuMzY2LTguMTMzIDYuOTYzLTM0LjMxIDEwLjIxNS01OC4xOCA4Ljk5NC02NiAxMS4wNC02Ny4xOSA2Mi4zMy0zNi4yOSAyNS4wNiAxNS4xIDQ1LjU1OSAyOS45MTEgNDUuNTU5IDMyLjkxNyAwIDMuMDEtMjcuNTQyIDIxLjQxLTYxLjIgNDAuODk5LTQ1LjEyIDI2LjEyLTYwLjA3IDMxLjU0OC01Ni45MDEgMjAuNjQ4Ii8+PHBhdGggZD0ibTE0MzEuODYgMTYzMS43MmMtMzEuMDItMTguMzA0LTU3LjM5LTM2LjIzLTU4LjYtMzkuODM0LTIuNDQ4LTcuMzIyIDg2Ljk1LTYzLjQxIDkyLjM5LTU3Ljk2NyAzLjQxNyAzLjQxNyAyNi40NjQgMTI4Ljk3IDIzLjkyOCAxMzAuMzYtLjcyMi4zOTUtMjYuNjk1LTE0LjI1OC01Ny43MTktMzIuNTYyIi8+PHBhdGggZD0ibTU0NS4wNiAxNzMyLjk5bDMuNTQ2LTMwLjM3M2g0NzUuMzkgNDc1LjM5bDMuNTQ2IDMwLjM3MyAzLjU0NiAzMC4zNzNoLTQ4Mi40OC00ODIuNDhsMy41NDYtMzAuMzczIi8+PC9nPjwvc3ZnPg==',
		q: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDQ4IDIwNDgiPjxwYXRoIGZpbGw9IiMxMDEwMTAiIGQ9Im01OTAgNTI5cTQtNzItMTUtMTU4bDEzNCA4NnptNDM0LTMyNGgtNTgzcTExNCAyMzEgNTcuNSA0NTYuNXQtMjAyLjUgNDQ5LjVxLTEyLTItMTktMi01NCAwLTkyLjUgMzguNXQtMzguNSA5Mi41IDM4LjUgOTIuNSA5Mi41IDM4LjUgOTIuNS0zOC41IDM4LjUtOTIuNXEwLTIwLTYtMzgtNC0xNC0xNS0zM2wxOTYtMTM5IDEwMCA0ODZxLTY0IDMxLTcyIDEwMy01IDQ0IDI5IDkxdDg4IDUzcTU0IDUgOTYtMjl0NDgtODhxNy02OC00Ni0xMTRsMTk4LTQxMiAxOTggNDEycS01NCA0Ni00NiAxMTQgNiA1NCA0OCA4OHQ5NiAyOXE1NC02IDg3LjUtNTN0MjkuNS05MXEtOS03Mi03Mi0xMDNsMTAwLTQ4NiAxOTYgMTM5cS0xMiAxOS0xNSAzMy02IDE4LTYgMzggMCA1NCAzOC41IDkyLjV0OTIuNSAzOC41IDkyLjUtMzguNSAzOC41LTkyLjUtMzguNS05Mi41LTkyLjUtMzguNXEtNyAwLTE5IDItMTQ3LTIyNC0yMDMtNDQ5LjV0NTgtNDU2LjVoLTU4M20wIDQ1MHExMDkgMCAyMjItMjguNXQyMTMtNjcuNXEyIDQxIDExIDg5LTEwOCA0Mi0yMjEuNSA2OHQtMjI0LjUgMjYtMjI1LTI2LTIyMS02OHE4LTQ4IDExLTg5IDk5IDM5IDIxMiA2Ny41dDIyMyAyOC41bTAtMzc2aDQ3OHEtMTUgMzQtMjQgNzNoLTQ1NC00NTRxLTEwLTM5LTI0LTczaDQ3OG00MzQgMjUwbC0xMTktNzIgMTM0LTg2cS0yMCA4Ni0xNSAxNThtLTU3My00N2wxMzktODcgMTM5IDg0LTEzOSA4NnoiIHRyYW5zZm9ybT0ibWF0cml4KDEgMCAwLTEgMCAyMDQ4KSIvPjxnIGZpbGw9IiNlY2VjZWMiPjxwYXRoIGQ9Im01NTUuMzkgMTc1OC41OGMwLTEuNjc0IDQuMjg3LTE1LjM0MiA5LjUyNy0zMC4zNzNsOS41MjctMjcuMzI5aDQ0OS41NiA0NDkuNTZsOS41MjcgMjcuMzI5YzUuMjQgMTUuMDMgOS41MjcgMjguNjk5IDkuNTI3IDMwLjM3MyAwIDEuNjc0LTIxMC44NyAzLjA0NC00NjguNjEgMy4wNDQtMjU3Ljc0IDAtNDY4LjYxLTEuMzctNDY4LjYxLTMuMDQ0Ii8+PHBhdGggZD0ibTk1Mi4zNiAxNjAyLjQzbC01OC42Mi0zNy4yNSA2NS4xNC0zNy4yNyA2NS4xNC0zNy4yNyA2MC43MzcgMzYuMDhjMzMuNDA2IDE5Ljg0NiA2MC42NjIgMzguODM4IDYwLjU3IDQyLjItLjIzMSA4LjUxLTEwOC44OSA3MS4yNi0xMjIuOTEgNzAuOTgtNi4yODctLjEyNC0zNy44MS0xNi45ODktNzAuMDUtMzcuNDc4Ii8+PHBhdGggZD0ibTE0MTIuOTIgMTYzMi42N2MtMjcuMTItMTcuMzcxLTQ5LjM5LTM1LjQ4OC00OS40Ny00MC4yNi0uMDg2LTQuNzczIDIwLjE1LTIxLjUwNyA0NC45NzUtMzcuMTlsNDUuMTMtMjguNTA4IDUuMjAzIDY3LjU2YzIuODYxIDM3LjE2IDQuODE0IDY4LjEgNC4zMzkgNjguNzY5LS40NzUuNjY2LTIzLjA1LTEzLTUwLjE4LTMwLjM3MyIvPjxwYXRoIGQ9Im01ODguOCAxNDUyLjUzYy0uNzE2LTE2LjE0LTEuNjkyLTMzLjY0MS0yLjE2OS0zOC44OTMtMi4wOTUtMjMuMDUgMjAzLjkyLTgwLjc5IDM0My43Ny05Ni4zNCA3Mi4wMi04LjAxIDExNC42OS04LjA5IDE4NC4wOC0uMzMxIDE0MC41NyAxNS43MDkgMzQ4Ljk3IDczLjc4IDM0Ni44OSA5Ni42Ny0uNDc3IDUuMjUyLTEuNDU0IDIyLjc1My0yLjE2OSAzOC44OTNsLTEuMzAyIDI5LjM0NC0xMDEuOTctMzIuNTkyYy0xMzMuOTItNDIuODA1LTIxMC44MS01NS43MDktMzMxLjkzLTU1LjcwOS0xMjEuMTMgMC0xOTguMDIgMTIuOTA1LTMzMS45MyA1NS43MDlsLTEwMS45NyAzMi41OTItMS4zMDItMjkuMzQ1Ii8+PHBhdGggZD0ibTU4Ny42NSAxNjAyLjc2YzIuMTExLTM0LjMzIDQuNTI0LTY1LjQxIDUuMzYxLTY5LjA3LjgzNy0zLjY1NyAyNC4yNSA3LjU2OCA1Mi4wMyAyNC45NDQgMjcuNzc5IDE3LjM3NiA0Ny4yOCAzNC41OTQgNDMuMzQgMzguMjYtMy45NDEgMy42NjgtMjkuMDggMjAuNTMxLTU1Ljg2OSAzNy40NzRsLTQ4LjcwNCAzMC44MDYgMy44MzgtNjIuNDIiLz48L2c+PC9zdmc+',
		r: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDQ4IDIwNDgiPjxwYXRoIGZpbGw9IiMxMDEwMTAiIGQ9Im0xMDI0IDIwNWgtNjQxbDI5IDI2NCAxNTkgMTE4IDUwIDY1OS0xNDkgMTA3LTE3IDM0MWgyODl2LTE0N2gxMzd2MTQ3aDE0MyAxNDN2LTE0N2gxMzd2MTQ3aDI4OWwtMTctMzQxLTE0OS0xMDcgNTAtNjU5IDE1OS0xMTggMjktMjY0aC02NDFtMCA5ODloMzMzbC02IDg4aC0zMjctMzI3bC02LTg4aDMzM20wLTY0N2gzODFsLTYgODdoLTM3NS0zNzVsLTYtODdoMzgxIiB0cmFuc2Zvcm09Im1hdHJpeCgxIDAgMC0xIDAgMjA0OCkiLz48ZyBmaWxsPSIjZWNlY2VjIj48cGF0aCBkPSJtNjUwLjg1IDE0NTcuMDN2LTM5LjA1aDM3My4xNSAzNzMuMTV2MzkuMDUgMzkuMDVoLTM3My4xNS0zNzMuMTV2LTM5LjA1Ii8+PHBhdGggZD0ibTY5NC4yNCA4MzcuNjRjMC04Ljk0OSAyLjQ0MS0yOC40NzUgNS40MjQtNDMuMzlsNS40MjQtMjcuMTJoMzE4LjkyIDMxOC45Mmw1LjQyNCAyNy4xMmMxMy4wNyA2NS4zMyA0My44OCA1OS42NjEtMzI0LjM0IDU5LjY2MS0zMTYuNjUgMC0zMjkuNzYtLjY0Ny0zMjkuNzYtMTYuMjcxIi8+PC9nPjwvc3ZnPg==',
		b: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDQ4IDIwNDgiPjxwYXRoIGZpbGw9IiMxMDEwMTAiIGQ9Im03NjggNjgzcS01LTM5LTI2LTgyaDU2NHEtMTggMzYtMjYgODJoLTUxMm00OTUgNzNsNDYgNzNxLTE0MiA0OS0yODUgNDctMTQ0IDItMjg1LTQ3bDQ2LTczcTExOCA0MCAyMzkgMzggMTIwIDIgMjM5LTM4bS00MzItMjI3aC0yMDdxNjcgMTE2IDcyIDIyOS0xMTQgMTE5LTE2MiAyMjMuNXQtNiAyMjMuNXEzMyA5NiAxMTggMTg5LjV0MzEyIDI0Ni41cS0xNyAxMS00NiAzNnQtMjkgNzlxMCA1OCA0MSA5NnQxMDAgMzhxNTggMCA5OS41LTM4dDQxLjUtOTZxMC01NC0yOS41LTc5dC00NS41LTM2cTIyNi0xNTMgMzExLTI0Ni41dDExOS0xODkuNXE0Mi0xMTktNi0yMjMuNXQtMTYyLTIyMy41cTQtMTEzIDcyLTIyOWgtMjA3cS0yIDQgMTAtMTYgMzMtNTMgNzAtNjB0ODktN2gyNTBxNzYgMCAxNDEuNS02MnQ2NS41LTE3OWgtNDk1cS0xMjMgMC0yMjMuNSA4NC41dC0xMDAuNSAxOTguNXEwLTExNC0xMDEtMTk4LjV0LTIyMy04NC41aC00OTVxMCAxMTcgNjUgMTc5dDE0MiA2MmgyNTBxNTEgMCA4OCA3dDcxIDYwcTEyIDIwIDEwIDE2bTE0NiA3MDFoLTk1di04OWg5NXYtMTY1aDk0djE2NWg5NXY4OWgtOTV2MTA0aC05NHYtMTA0IiB0cmFuc2Zvcm09Im1hdHJpeCgxIDAgMC0xIDAgMjA0OCkiLz48ZyBmaWxsPSIjZWNlY2VjIj48cGF0aCBkPSJtNzYxLjU0IDE0MDYuN2wxMi44NTYtMzkuMDVoMjQ5LjYgMjQ5LjZsMTIuODU2IDM5LjA1IDEyLjg1NiAzOS4wNWgtMjc1LjMyLTI3NS4zMmwxMi44NTYtMzkuMDUiLz48cGF0aCBkPSJtNzY1LjA4IDEyNTAuOTVsLTE3LjY1My0yOS45MiA0NC45OTktMTMuMDdjODQuNjctMjQuNTg3IDE3Mi40MS0zMy41OTUgMjc0Ljk3LTI4LjIzIDU0Ljg4OCAyLjg3MSAxMTMuNDYgOC45NzkgMTMwLjE3IDEzLjU3MyAxNi43MDUgNC41OTQgNDYuNzc5IDEyLjYwNiA2Ni44MzEgMTcuODA2bDM2LjQ1OCA5LjQ1NC0xNy43OSAzMC4xNWMtMjAuMzI3IDM0LjQ1Mi0yMy4zMTEgMzQuOTkyLTkxLjU4IDE2LjU4Ni02OC43Mi0xOC41MjctMjY2LjIzLTE4LjUyNy0zMzQuOTUgMC02OC4yMyAxOC4zOTUtNzEuMjcgMTcuODUyLTkxLjQ1LTE2LjM1MyIvPjxwYXRoIGQ9Im05ODAuNjEgOTgxLjQ4di04Mi40NGgtNDcuNzI5LTQ3LjcyOXYtMzkuMDUtMzkuMDVoNDcuNzI5IDQ3LjcyOXYtNTIuMDctNTIuMDdoNDMuMzkgNDMuMzl2NTIuMDcgNTIuMDdoNDcuNzI5IDQ3LjcyOXYzOS4wNSAzOS4wNWgtNDcuNzI5LTQ3LjcyOXY4Mi40NCA4Mi40NGgtNDMuMzktNDMuMzl2LTgyLjQ0Ii8+PC9nPjwvc3ZnPg==',
		n: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDQ4IDIwNDgiPjxwYXRoIGZpbGw9IiMxMDEwMTAiIGQ9Im01MDIgMTE4MGwtNTItMS0yNi02NCA2OS0yMSA0NiA1NXptNTM2IDE4N3EzNC0xLTE2IDY4dC04MCA0MmwtMTE2LTEwOXptLTMzOCA5OHE2IDM5IDExNS41IDEwNy41dDIyMC41IDE0My41bDExNSAxNTQgOTYtMjE3cTM0Mi0xNzIgNDMyLjUtNDE3LjV0NDcuNS02MDMuNXEtMTgtMTI4IDQuNS0yMzZ0NTcuNS0xOTBsLTEyNDItMXEtOSAxNzggMzkgMzAxLjV0MTgzIDIzNy41cTUwIDExIDgyLjUgMzkuNXQ1My41IDU4LjVsNjIuNSAxdDEzOCAyOSAxMzkgOTcgNjYuNSAyMDdxMCAxNy04LjUgMzR0LTExLjUgMzdxLTYyLTIyOC0xNjEtMjg4LjV0LTE5MS01OC41cS0yMzYgNDItMjkyLTYwbC01Ni0xMDItMjE3IDEyMSAxMTUgODItNTEgNTAtMTIyLTg2LTEyIDI5N3ptOTgxLTExOTJxLTEwMiAxMzAtODUgMzA4LjV0MjcgMzYyLjUtNTAgMzUxLjUtMzE2IDI3NS41cTIyMC0xNjQgMjUyLjUtMzQydDE2LjUtMzUwLjUtMTItMzI5IDE2Ny0yNzYuNSIgdHJhbnNmb3JtPSJtYXRyaXgoMSAwIDAtMSAwIDIwNDgpIi8+PGcgZmlsbD0iI2VjZWNlYyI+PHBhdGggZD0ibTE2MDEuMzEgMTY5My4wNGMtODEuMDgtODkuNzUtOTEuNTgtMTU2LjU0LTc0LjIzLTQ3Mi4wNSAyMC4zNzktMzcwLjQ1LTguNzUxLTQ5NS4xMi0xNTAuNTYtNjQ0LjM0LTI4LjM0OC0yOS44MzEtNDcuODE0LTU0LjI0LTQzLjI2LTU0LjI0IDE3LjAyIDAgMTAwLjExIDU4LjQzIDE0NC42NSAxMDEuNzMgNTcuMDUgNTUuNDUgODYuMTQgMTA3Ljg5IDEwOS42NCAxOTcuNjYgMzQuOTk0IDEzMy42OSAzNy41NDQgMjAxLjk0IDE3LjMyOCA0NjMuODItMTkuOTkxIDI1OC45Ni0xNy41NDIgMzEyLjYyIDE4LjA2IDM5NS42NyA5LjY5OCAyMi42MjYgMTYuMTMgNDIuNjQgMTQuMjkzIDQ0LjQ4LTEuODM3IDEuODM3LTE4LTEyLjg5MS0zNS45MjctMzIuNzI5Ii8+PHBhdGggZD0ibTg5Ni43IDYyMS4zM2M1NS42ODMtNTMuMjcgNjAuNDItNTUuOTYxIDc4LjEtNDQuMzggMjYuMDcgMTcuMDggNzYuNCA4NC4wNyA3MC40MyA5My43My0yLjY5NyA0LjM2NC01MC41NTggNy44MDUtMTA2LjM2IDcuNjQ2bC0xMDEuNDUtLjI4OSA1OS4yOC01Ni43MSIvPjxwYXRoIGQ9Im00NjQuMjcgOTQxLjQ1Yy0yNy40NDEtNi42MDEtMzEuMjctMTQuNjg0LTIwLjk2LTQ0LjI2IDcuNjgyLTIyLjA0IDE0LjQ4My0yNy42NTYgMzMuNDgxLTI3LjY1NiAxMy4xMSAwIDMwLjM2MyA3LjIwNyAzOC4zMyAxNi4wMiAxMy41OTIgMTUuMDIgMTMuMzY3IDE3LjQ1MS0zLjYyNCAzOS4wNS05Ljk2NSAxMi42NjktMjAuNzY0IDIyLjU4MS0yMy45OTcgMjIuMDMtMy4yMzMtLjU1NC0xMy42ODktMi44ODUtMjMuMjMtNS4xODEiLz48L2c+PC9zdmc+',
		p: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDQ4IDIwNDgiPjxwYXRoIGZpbGw9IiMxMDEwMTAiIGQ9Im0xMDI0IDIwNWgtNTc4djc0cS00IDgwIDQxLjUgMTM3dDEyNS41IDEwOHExMTcgOTEgMTcxLjUgMjE3LjV0NzguNSAyNjcuNWgtMjg3bDI4NCAyMzlxLTg2IDc0LTg2IDE4OCAwIDEwMyA3MyAxNzd0MTc3IDc0cTEwMyAwIDE3Ni41LTc0dDczLjUtMTc3cTAtMTE0LTg2LTE4OGwyODQtMjM5aC0yODdxMjMtMTQxIDc4LTI2Ny41dDE3Mi0yMTcuNXE3OS01MSAxMjQuNS0xMDh0NDIuNS0xMzd2LTc0aC01NzgiIHRyYW5zZm9ybT0ibWF0cml4KDEgMCAwLTEgMCAyMDQ4KSIvPjwvc3ZnPg=='
	},
	all: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPjxzdmcgdmVyc2lvbj0nMS4xJyB2aWV3Qm94PSctNDAgLTQwIDQ1MCA0NTAnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc+PHBhdGggZD0iTTQ4LjU1OCw5NS43MzZjNjYuODk1LDMxLjk5MywyMjQuNzc2LDE1Mi4zNTQsMjU2LjQyNywxODUuMDc5YzMxLjY1LDMyLjcyMy01NC43MTksODIuNjEzLTczLjQ5NCw1OS4wMUMyMTIuNzEzLDMxNi4yMjEsMTMxLjE3Miw2OC4zNzYsMTMzLjMxOCwyNy4wN2MyLjE0Ni00MS4zMDgsOTYuNTU5LTMyLjcyNCw5NS40ODksOC4wNDdjLTEuMDcyLDQwLjc3MS04MS4wMDQsMjc3LjM0OC05OC4xNzEsMzAzLjYzNWMtMTcuMTY3LDI2LjI4NS05MC42NjEtMzQuODcxLTc5LjkzMi01Mi41NzRTMjc2LjAxNiwxMDMuNzgzLDMxNy4zMjIsOTQuNjY0YzQxLjMwOS05LjEyLDY2LjUyMSw3OC44NTgsMjYuODI0LDkxLjczM2MtMzkuNjk5LDEyLjg3NS0yOTEuODMzLDEyLjM0LTMyOS45MjItMC41MzVTMjMuODgxLDgzLjkzNCw0OC41NTgsOTUuNzM2eiIvPjwvc3ZnPg=='
};