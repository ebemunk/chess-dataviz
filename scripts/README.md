## Helper scripts
This is a collection of helper scripts to aid in getting/parsing data required for the visualizations. You don't need to use them, and the scripts are certainly far from refined. I just made them so it's easier to parse PGN files & scrape some data online.

### stats.js
This is a PGN parser that will extract some statistics to use in Heatmap, Move Path and Opening graphs. It can handle big (huge) PGN files. I've tried it with millionbase database and it took around 40 minutes, but completed no problem.

#### Usage
To improve performance, there is no chess logic in the program. Hence, regular PGNs with SAN moves won't work, as parsing them requires the program to know about the rules of chess. A workaround is to use the brilliant [pgn-extract](https://www.cs.kent.ac.uk/people/staff/djb/pgn-extract/) command line tool to convert the notation into Extended Long Algebraic notation with:

`pgn-extract -Wxlalg -C -N -V -D -s`

* -C no comments
* -N no NAGs
* -V no variations
* -D no duplicate games

After which the script can be used on the generated PGN.

Example: `node stats.js -f myfile.pgn`

### scraper.js
This script will fetch data formatted in the style that Evaluation and Time Graph expects, from chess24.com tournaments website. It will also download player images.

#### Usage
The behavior is determined by command line arguments:
* `-t, --tournament` Tournament id in chess24.com [shamkir-gashimov-memorial-2015]
* `-r, --rounds` Number of rounds to fetch [9]
* `-m, --matches` Number of matches per round [1]
* `-g, --games` Number of games per match [5]
* `-c, --concurrency` Number of concurrent phantomjs instances to create [5]
* `-w, --wait` ms to wait before scraping [15000]

Example:
`node scraper.js -t london-chess-classic-2015 -r 9`