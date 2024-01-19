let connectedFrom_mobile = false;
let connectedFrom_desktop = false;

if ('ontouchstart' in window || navigator.maxTouchPoints) {
    console.log("The user is connecting from a mobile phone.");
    connectedFrom_mobile = true;
    const ctrlLeft = document.getElementById('mobileCtrlLeft');
    ctrlLeft.classList.remove('hidden-element');
    const ctrlRight = document.getElementById('mobileCtrlRight');
    ctrlRight.classList.remove('hidden-element');
} else {
    console.log("The user is connecting from a desktop.");
    connectedFrom_desktop = true;
}