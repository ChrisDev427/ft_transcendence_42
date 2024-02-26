function sendMessage() {

}

function showMainChat() {
    
    const mainChat = document.getElementById('mainChat');
    if (mainChat.classList.contains('unvisible')) {
        mainChat.classList.remove('unvisible');
        document.getElementById('mainChatBtn').classList.add('text-secondary');
    } else {
        mainChat.classList.add('unvisible');
        document.getElementById('mainChatBtn').classList.remove('text-secondary');

    }
}

function chatProfile_createContent(username) {

    console.log(username);

}