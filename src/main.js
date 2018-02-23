import "babel-polyfill";
import BugSquasher from './BugSquasher';
import template from './templates/squasher';
let baseUrl = 'http://testdomain727.tk/';

let link = document.createElement('link');
link.rel = 'stylesheet';
link.href = `${baseUrl}css/bundle.css`;
document.head.appendChild(link);

link.onload = function() {
    let div = document.createElement('DIV');
    div.id = 'bgsq-app-810202061';
    div.className = 'bgsq-app-810202061';
    document.body.appendChild(div);
    div.innerHTML = template;
    const bugSquasher = new BugSquasher();
    bugSquasher.init();
}

