let tournamentSise = 0;
let tournamentPlayersName = [];

function printTournamentLogs() {

    console.log("------ Tournament logs ----------------------------");
    
    console.log("Tournament Sise : " + tournamentSise);
    for(let i = 0; i < tournamentSise; i++) {
        console.log("Player" + i + " : " + tournamentPlayersName[i]);
    }

    console.log("\n");

}