var baseURL = `http://localhost:3000`
var signedIn = true
var editTodoId
var signedInviaGoogle = false

function showSuccessMessage(text) {
  $('#message').css('color','rgb(0, 75, 187)').text(text)
  $('#message').fadeIn(300).delay(3000).fadeOut(1000)
}
function showFailedMessage(text) {
  $('#message').css('color','#FF0000').text(text)
  $('#message').fadeIn(300).delay(3000).fadeOut(1000)
}
function dontRefresh(){
  if($('#filterByStatus').val()){
    searchTodos()
  }
  else getAllTodos()
}
function emptyLogReg(){
  $('#nameregister').val('')
  $('#emailregister').val('')
  $('#passwordregister').val('')
  $('#emaillogin').val('')
  $('#passwordlogin').val('')
}
function emptyNewTodo(){
  $('#newTitle').val('')
  $('#newDesc').val('')
  $('#newDuedate').val('')
}
function register() {
  event.preventDefault()
  let name = $('#nameregister').val()
  let email = $('#emailregister').val()
  let password = $('#passwordregister').val()
  emptyLogReg()
  $.ajax({
    url: `${baseURL}/users/register`,
    method: 'POST',
    data: {
      name,
      email,
      password
    },
    statusCode: {
      400: function() {
        alert('400 status code! user error');
      },
      500: function() {
        window.location = './http-500.html'
      }
    }
  })
    .done((data) => {
      localStorage.setItem('token', data.token)
      showSuccessMessage(`Hai ${data.name}, kamu berhasil login`)
      console.log("success register", data)
      getAllTodos()
      $("#TodoLists").show()
      $("#login-register-form").hide()
    })
    .fail((err) => {
      console.log(err)
      showFailedMessage(err.responseJSON.message)
    })
}

function login() {
  event.preventDefault()
  let email = $('#emaillogin').val()
  let password = $('#passwordlogin').val()
  emptyLogReg()
  $.ajax({
    url: `${baseURL}/users/login`,
    method: 'POST',
    data: {
      email,
      password
    },
    statusCode: {
      400: function() {
        alert('400 status code! user error');
      },
      500: function() {
        window.location = './http-500.html'
      }
    }
  })
    .done((data) => {
      localStorage.setItem('token', data.token)
      showSuccessMessage(`Hai ${data.name}, kamu berhasil login`)
      console.log("success login", data)
      // $('#namaUser').text(data.name)
      getAllTodos()
      $("#TodoLists").show()
      $("#login-register-form").hide()
    })
    .fail((err) => {
      console.log(err)
      showFailedMessage(err.responseJSON.message)
    })
}

function onSignIn(googleUser) {
  event.preventDefault()
  emptyLogReg()
  let profile = googleUser.getBasicProfile();
  console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log('Name: ' + profile.getName());
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
  let id_token = googleUser.getAuthResponse().id_token;
  $.ajax({
    url: `${baseURL}/users/signinGoogle`,
    type: 'POST',
    data: {
      id_token
    },
    statusCode: {
      400: function() {
        alert('400 status code! user error');
      },
      500: function() {
        window.location = './http-500.html'
      }
    }
  })
    .done((data) => {
      console.log(data)
      let msg = ''
      if(data.passRandom) {
        msg = 'Hurry up change your password now, your password is ' + data.passRandom + '\n'
      }
      signedInviaGoogle = true
      localStorage.setItem('token', data.token)
      showSuccessMessage(`${msg}Hai ${data.name}, kamu berhasil login`)
      getAllTodos()
      $("#TodoLists").show()
      $("#login-register-form").hide()
    })
    .fail((err) => {
      showFailedMessage(err.responseJSON.message)
    })
}

function logout(){
  event.preventDefault()
  localStorage.removeItem('token')
  $("#TodoLists").hide()
  $("#login-register-form").show()
  if(signedInviaGoogle){
    let auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    signedInviaGoogle = false
    console.log('User signed out.');
  })
  .catch(err =>{
    console.log(err)
  })
  }
}

function addNewTodo() {
  event.preventDefault()
  let newduedate = new Date($('#newDuedate').val())

  let today = new Date()

  if (newduedate < today) {
    showFailedMessage("Due date cant be the past!!!")
  }
  else {
    $.ajax({
      url: `${baseURL}/todos/create`,
      method: 'POST',
      // crossDomain: true, // kalau error HTTP 405 Method not Allowed
      headers: {token: localStorage.getItem('token')},
      data: {
        title: $('#newTitle').val(),
        description: $('#newDesc').val(),
        duedate: newduedate
      },
      statusCode: {
        400: function() {
          alert('400 status code! user error');
        },
        500: function() {
          window.location = './http-500.html'
        }
      }
    })
      .done(function (response) {
        console.log(response)
        $("#TodoLists").show()
        $("#createTodo").hide()
        emptyNewTodo()
        getAllTodos()
      })
      .fail(function (jqXHR, textStatus) {
        showFailedMessage('response failed : ' + textStatus)
      })
  }
}
function getAllTodos() {
  $.ajax({
    url: `${baseURL}/todos/read`,
    method: 'GET',
    headers: {token: localStorage.getItem('token')},
    statusCode: {
      400: function() {
        alert('400 status code! user error');
      },
      500: function() {
        window.location = './http-500.html'
      }
    }
  })
  .done(todos => {
    $('#results').empty()
    for(let todo of todos) {
        $('#results').append(`
        <div class="card m-2">
          <div class="card-body">
            <p>${todo.title}</p>
            <p>${todo.description}</p>
            <p>${todo.status}</p>
            <p>${todo.duedate.slice(0,10)}</p>
            <div class="row justify-content-between mx-2">
              <a onclick=editTodo('${todo._id.toString()}')  class="btn btn-success" href="">EDIT</a>
              <a onclick=deleteTodo('${todo._id.toString()}') class="btn btn-danger" href="">DELETE</a>
            </div>
          </div>
        </div>`)
      }
    })
    .fail((err) => {
      console.log(err)
      showFailedMessage(err.responseJSON.message)
    })
}
function searchTodos() {
  let selected = $('#filterByStatus').val()
  let query = ""
  if(selected != "all status") query = `/search?status=${selected}`
  $.ajax({
    url: `${baseURL}/todos/read${query}`,
    method: 'GET',
    headers: {token: localStorage.getItem('token')},
    statusCode: {
      400: function() {
        alert('400 status code! user error');
      },
      500: function() {
        window.location = './http-500.html'
      }
    }
  })
  .done(todos => {
    $('#results').empty()
    for(let todo of todos) {
        $('#results').append(`
        <div class="card m-2">
          <div class="card-body">
            <p>${todo.title}</p>
            <p>${todo.description}</p>
            <p>${todo.status}</p>
            <p>${todo.duedate.slice(0,10)}</p>
            <div class="row justify-content-between mx-2">
              <a onclick=editTodo('${todo._id.toString()}') class="btn btn-success" href="">EDIT</a>
              <a onclick=deleteTodo('${todo._id.toString()}') class="btn btn-danger" href="">DELETE</a>
            </div>
          </div>
        </div>`)
      }
    })
    .fail((err) => {
      console.log(err)
      showFailedMessage(err.responseJSON.message)
    })
}

function editTodo(todoId) {
  event.preventDefault()
  console.log(todoId,typeof todoId)
  $.ajax({
    url: `${baseURL}/todos/read/${todoId}`,
    method: 'GET',
    headers: {token: localStorage.getItem('token')},
    statusCode: {
      400: function() {
        alert('400 status code! user error');
      },
      500: function() {
        window.location = './http-500.html'
      }
    }
  })
    .done(todo => {
      $('#editTodoForm').show()
      $('#selectedTitle').val(todo.title)
      $('#selectedDescription').val(todo.description)
      $('#selectedStatus').val(todo.status)
      todo.duedate = todo.duedate.slice(0,10)
      $('#selectedDueDate').val(todo.duedate)
      $('#editTodoForm').attr("onsubmit",`javascript:updateTodo('${todoId}')`)
    })
    .fail((err) => {
      console.log(err)
      showFailedMessage(err.responseJSON.message)
    })
}

function updateTodo(todoId) {
  event.preventDefault()
  console.log(todoId,typeof todoId)
  if(todoId){
    $.ajax({
      url: `${baseURL}/todos/update/${todoId}`,
      method: 'PUT',
      headers: {token: localStorage.getItem('token')},
      data: {
        title: $('#selectedTitle').val(),
        description: $('#selectedDescription').val(),
        status: $('#selectedStatus').val(),
        duedate: new Date($('#selectedDueDate').val()),
      },
      statusCode: {
        400: function() {
          alert('400 status code! user error');
        },
        500: function() {
          window.location = './http-500.html'
        }
      }
    })
      .done(todo => {
        showSuccessMessage(`Update ${todo.title} Berhasil`)
        dontRefresh()
        $('#editTodoForm').attr("onsubmit",null).hide()
      })
      .fail((err) => {
        console.log(err)
        showFailedMessage(err.responseJSON.message)
      })
  }
}

function deleteTodo(todoId) {
  event.preventDefault()
  $.ajax({
    url: `${baseURL}/todos/delete/${todoId}`,
    method: 'DELETE',
    headers: {token: localStorage.getItem('token')},
    statusCode: {
      400: function() {
        alert('400 status code! user error');
      },
      500: function() {
        window.location = './http-500.html'
      }
    }
  })
    .done(result => {
      showSuccessMessage(`Delete Todo Berhasil`)
      dontRefresh()
    })
    .fail((err) => {
      console.log(err)
      showFailedMessage(err.responseJSON.message)
    })
}

// $("#createTodo").hide()
// $("#TodoLists").hide()
// $("#login-register-form").hide()
$(document).ready(() => {
  $('#pills-register').submit(register)
  $('#pills-login').submit(login)
  $('#createTodoForm').submit(addNewTodo)
  $('#editTodoForm').submit(updateTodo)
  $('#createNewTodo').on('click', function () {
    event.preventDefault()
    $("#TodoLists").hide()
    $("#createTodo").show()
  })
  $('#cancel').on('click', function () {
    event.preventDefault()
    $("#TodoLists").show()
    $("#createTodo").hide()
  })
  $('#filterByStatus').on('change', searchTodos);
  if (localStorage.hasOwnProperty('token')) {
    $("#TodoLists").show()
    getAllTodos()
    // $("#login-register-form").hide()
  }
  else {
    // $("#TodoLists").hide()
    $("#login-register-form").show()
  }
})