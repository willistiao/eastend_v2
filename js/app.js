const scrollable = document.querySelector('.scrollable');

let target = 0;
let current = 0;
let ease = 0.075;

// Linear Interpolation function
function lerp(start, end, t) {
    return start * (1 - t) + end * t;
}

function init(){
    document.body.style.height = `${scrollable.getBoundingClientRect().height}px`
}

function smoothScroll(){
    target = window.scrollY;
    current = lerp(current, target, ease);
    scrollable.style.transform = `translate3d(0, ${-current}px, 0)`;
    requestAnimationFrame(smoothScroll)
}

smoothScroll()

init()