import $ from 'jquery';
import './style.css';
import events from './eventListeners';


function main(){
   events.bindEventListeners();
   events.bookmarkList();
}

$(main);