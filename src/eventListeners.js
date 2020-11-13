import $ from 'jquery';
import index from './index';
import store from './store'; 
import api from './api';


function startUpPage(){
  return $('main').html(`    
  <h1>Flag on the Book</h1>
  <section id="beginning" class="beginning"> 
    
    <h2 id="adding" class="newBtn">&nbsp;+ New &#9873;&nbsp;</h2>
    <section class="bookmarkNum">
      <select id="filter" class="rating-order" id="filter">
        <option value="">Rating:</option>
        <option value="5">5&#9733;</option>
        <option value="4">4&#9733;</option>
        <option value="3">3&#9733;</option>
        <option value="2">2&#9733;</option>
        <option value="1">1&#9733;</option>
      </select>
    </section>  
  </section>  
    <section id="formContainer" class="formContainer">
        
      </section>
      <section id="listContainer" class="listContainer">
          <ul id="bookmarkList" class="listDisplay">
            <p class="emptyMarks"><b>Throw the flag</b></p>
          </ul>
      </section>
      </section>`);
}

function generateForm(){
  return `<h2 class="newBm">New Bookmark</h2>
  <section id="formUp">
    <section id="listContainer" class="listContainer listDisplay">
      <section>
        <form class="addingNew">
          <fieldset class='deviceScaling'>
            <legend><strong>New Bookmark<strong></legend>
            <label for="siteName">Site Name:</label>
            <input id="siteName" class="boxed" type="text" name="site" required placeholder="Name"><br><br>
            <label for="siteURL">Site:</label>
            <input id="siteURL" class="boxed" type="url" pattern="https?://.+" name="siteURL" required placeholder="https://"><br><br>
            <label for="description">Description:</label><br>
            <textarea name="description" class="boxed" id="description" cols="30" rows="10" placeholder="Site Description"></textarea><br><br>
            <section id="rating" class="rating">
              <input type="radio" name="rating" id="str1" value="1" checked="checked"><label for="str1">1&#9733;</label>
              <input type="radio" name="rating" id="str2" value="2" checked="checked"><label for="str2">2&#9733;</label>
              <input type="radio" name="rating" id="str3" value="3" checked="checked"><label for="str3">3&#9733;</label>
              <input type="radio" name="rating" id="str4" value="4" checked="checked"><label for="str4">4&#9733;</label>
              <input type="radio" name="rating" id="str5" value="5" checked="checked" required><label for="str5">5&#9733;</label>
            </section>
          </fieldset>
          <br>

          <section class="linkRemove"> 
            <button class="cancel"><a href="/" class="cancel">Cancel</a></button>
            <button border="0" id="addBookmark">Add</button>
          </section>
        </form>
  </section>`;
}


function addToList(){
  let list = store.store.bookmarks;
  for(let i = 0; i < list.length; i++){  
    $('#bookmarkList').append(`
    <ul>
      <li>
        <section id="${list[i].id}" class="listItems">
          <span class="nameTitle collapse" contenteditable="false"><b>&darr;&nbsp;&nbsp;${list[i].title}</b></span>
          <span class="stars" contenteditable="false"><b>&nbsp;${list[i].rating}&#9733;</b></span>
          <br>
          <br>
          <section class="moveRight">
            <button class="edit">Edit</button>
            <button class="delButton">Delete</button>
            <button border="0" class="hidden save">Save</button>
          </section>
          <section class="editing">
            <p class="hidden description" contenteditable="false">${list[i].desc}<br>
            <button class="visit-site"><a href=${list[i].url} target="_blank" class="visit-site">Visit</a></button></p>
          </section>
        </section>
      </li>
    </ul>
    <br>
    <br>
    `)};
}



function newBookmarkEvent(){
  $('body').on('click', '#adding', function (event){
    event.preventDefault();
    store.store.adding = true;
    render();
  });
}


function bookmarkFormSubmit(){
  $('body').on('submit','.addingNew', function(event){
    event.preventDefault();
    $('#formContainer').toggleClass('hidden');
    api.saveBookmark()
    .then(function (){
      $('#beginning').toggleClass('hidden');
      store.store.adding = false;
      render()
    })
  });
}

function cancelForm() {
  $('body').on('click', '#cancel', function() {
    $('.listContainer').toggleClass('hidden');
    $('#formContainer').toggleClass('hidden');
    $('.beginning').show();
    store.store.adding = false;
    render();
  })
}


function deleteBookmark() {
  $('body').on('click', '.delButton', function(event) {
    let id = $(event.target).closest('.listItems').attr('id');
    api.deleteBookmarks(id)
    .then(function () {
      api.showBookmarks()
        .then(function () {
          render()
        })
    })
  })
}


function showDescription(){
  $('body').on('click', '.nameTitle', function (event) {
    let item = $(event.target).closest('.listItems').find('p');
    item.toggleClass('hidden');
  })
}


function editBookmark() {
  $('body').on('click', '.edit', function() {
    $(this).siblings('.save').show();
    $(this).parent().siblings('.nameTitle').attr('contenteditable', 'true').toggleClass('boxed');
    $(this).parent().siblings('.stars').attr('contenteditable', 'true').toggleClass('boxed');
    $(this).parent().siblings('.editing').find('.description').attr('contenteditable', 'true').toggleClass('boxed');

  })
}


function saveEditBookmark() {
  $('body').on('click', '.save', function() {
    $(this).hide();

    let name = $(this).parent().siblings('.nameTitle').toggleClass('boxed');
    let rating = $(this).parent().siblings('.stars').toggleClass('boxed');
    let description = $(this).parent().siblings('.editing').find('.description').toggleClass('boxed');
    let id = $(this).parents('.listItems').attr('id');

    name.attr('contenteditable', 'false');
    rating.attr('contenteditable', 'false');
    description.attr('contenteditable', 'false');

  api.editBookmarks(id, name.text(), rating.text(), description.text());
  })
}



function sortBy(){
  $('body').on('change', '.rating-order', function() {
    let rating = $(this).val();
    let sorted = store.store.bookmarks.filter( function (item) {
      return item.rating >= rating;
    })
    displaySorted(sorted);
  })
}


function displaySorted(store){
  let list = store;
  let html = '';
  for(let i = 0; i < list.length; i++){  
    html += `
    <section id="${list[i].id}" class="listItems">
      <span class="nameTitle collapse" contenteditable="false"><b>${list[i].title}</b></span>
      <span class="stars" contenteditable="false"><b>${list[i].rating}</b></span>
      <section class="moveRight">
        <button class="edit">Edit</button>
        <button class="delButton">Delete</button>
        <br>
        <br>
        <button border="0" class="hidden save">Save</button>
      </section>
      <section class="editing">
        <p class="hidden description" contenteditable="false">${list[i].desc}<br>
        <button class="visit-site"><a href=${list[i].url} target="_blank">Visit</a></button></p>
      </section>
    </section>`};

    $('#bookmarkList').html(html);
}


function bookmarkList(){
  api.showBookmarks()
  .then(function () {
    render();
  })
  }



function ratings(){
  $(".rating input:radio").attr("checked", false);
  $('.rating input').on('click', function () {
      $(".rating span").removeClass('checked');
      $(this).parent().addClass('checked');
  });
};



function render(){

  if(store.store.adding) {
    $('#formContainer').html(generateForm());
    $('#formContainer').toggleClass('hidden');
  }
  else{
    startUpPage();
    addToList();
    $('#filter').prop('selectedIndex',0);
  }

  $('#listContainer').addClass('testing')

  if(store.store.bookmarks.length > 0) {
    $('.listContainer .emptyMarks').addClass('hidden')
  } 
  else {
    $('.listContainer .emptyMarks').removeClass('hidden')
  }
}



function bindEventListeners(){ 
  newBookmarkEvent();
  bookmarkFormSubmit();
  deleteBookmark();
  ratings();
  showDescription();
  editBookmark();
  saveEditBookmark();
  sortBy();
  cancelForm();
}



export default { 
  generateForm, 
  bindEventListeners,
  bookmarkList,
  startUpPage
}