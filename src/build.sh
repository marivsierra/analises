#!/bin/bash
# Monta index.html (pré-renderizado) e version.json na raiz do repositório.
set -e
cd "$(dirname "$0")"
P=parts
cat $P/head.html $P/00-gdp.js $P/01-fhc.js $P/02a-lula1.js $P/02b-lula2.js $P/03-dilma.js $P/04-temer.js $P/05-bolsonaro.js $P/06-lula3.js $P/07-extra.js $P/07-extra-fhc.js $P/07-extra-lula1.js $P/07-extra-lula2.js $P/07-extra-dilma.js $P/07-extra-temer.js $P/07-extra-bolsonaro.js $P/07-extra-lula3.js $P/08-scand.js $P/09-pres.js $P/10-amb.js $P/10-amb-fhc.js $P/10-amb-lula1.js $P/10-amb-lula2.js $P/10-amb-dilma.js $P/10-amb-temer.js $P/10-amb-bolsonaro.js $P/10-amb-lula3.js $P/10z-fc.js $P/11-ind.js $P/12-build.js $P/tail.js > /tmp/raw.html
NODE_PATH=$(npm root -g) node prerender.js /tmp/raw.html ../index.html
V=$(grep -o 'v:"[^"]*"' $P/12-build.js | head -1 | sed 's/v:"//;s/"//')
D=$(grep -o 'd:"[^"]*"' $P/12-build.js | head -1 | sed 's/d:"//;s/"//')
printf '{"version":"%s","updated":"%s"}\n' "$V" "$D" > ../version.json
echo "versão $V ($D)"
