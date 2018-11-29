'use strict';

const sessions = require(`./${process.argv[2]}`);

sessions.forEach((session,i,a) => {
    console.log(`## ${session.title}`);
    if (process.argv[3]) {
        const abstractJa = require(`./${process.argv[3]}`);
        console.log(abstractJa[i]);
    } else {
        console.log(session.abstract);
    }
    session.media.forEach((e,i,a) => {
        console.log(`### ${e.type}`);
        console.log(`${e.url}`);
    });
    console.log(`### Session Detail`);
    console.log(`<a href="${session.sessionUrl}" target="_blank">${session.sessionUrl}</a>`)
    console.log();
});
