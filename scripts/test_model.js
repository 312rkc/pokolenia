const fs=require('fs');
global.SERIES=JSON.parse(fs.readFileSync(__dirname+'/../src/series.js','utf8').replace(/^[^{]*/,'').replace(/;\s*$/,''));


const {profile,rankAmongCohorts}=require(__dirname+"/../src/model.js");
function row(by,r,s,x){const p=profile(by,r,s,x);const c=p.comps;return [by,r,s,x,p.index.toFixed(1),...Object.values(c).map(v=>v.toFixed(0)),(p.p*100).toFixed(1)+'%',p.g.toFixed(2),p.e0.toFixed(1),p.burden.toFixed(2)].join('\t');}
console.log('by\treg\tset\tsex\tIDX\tE\tM\tG\tD\tB\tZ\tW\ttert\tg\te0\tburden');
for (const by of [1900,1910,1920,1930,1935,1940,1950,1960,1970,1975,1980,1990,2000,2010]) console.log(row(by,'lub','wies','m'));
console.log('--');
for (const by of [1900,1920,1940,1960,1980,2000]) console.log(row(by,'maz','duze','k'));
console.log('--');
for (const r of ['maz','lod','kie','lub','pdl','wlk','pom','sla','mlp','pkr','kre']) console.log(row(1915,r,'wies','m'));
console.log('--');
for (const r of ['maz','wlk','sla','dls','wmz']) console.log(row(1985,r,'male','k'));
const p=profile(1950,'lub','wies','m'); console.log(rankAmongCohorts(p));
// national avg tertiary consistency: weighted sum by settle shares 1950
