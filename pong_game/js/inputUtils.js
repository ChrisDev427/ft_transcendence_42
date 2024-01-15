function checkDblName(input, callBack) {
    console.log(input.value);
    for(let i = 0; i < tournamentPlayers.length; i++) {
        if (tournamentPlayers[i].name === input.value) {
            tournamentPlayers = [];
            alert_message(callBack, 'Two players cannot have the same name !');
            return true;
        }
    }
    return false;
}

function emptyInput(input, callBack) {
    if(input.value === "") {
        alert_message(callBack, 'Player(s) missing');
        return true;
    }
    return false;
}

function shorteredName(input) {
    if(input.value.length > 10) {
        const shotered = input.value.substring(0, 10) + '.';
        return shotered;
    }
    return input.value;
}