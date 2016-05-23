$(document).ready(function () {

  showTasks();
  $('#submit').on('click', postTask);
  $('#container').on('click', '.status', changeStatus);
  //$('#container').on('click', '.delete', deleteItem);
});

function showTasks() {

    $('#tasks').empty();
    $.ajax({
        type: 'GET',
        url: '/todo',
        success: function(tasks) {
            tasks.forEach(function(task) {
                $container = $('<tr></tr>');
                var taskData = ['task_name', 'description'];
                taskData.forEach(function(prop) {
                    var $el = $('<td>' + task[prop] + '</td>');
                    $container.append($el);
                });
                //console.log(task, taskData);
                //container data prep
                //console.log($container);
                $container.data('taskID', task.id);
                $container.data('name', task.name);
                $container.data('status', task.status);

                if (task.status == 'IN_PROGRESS') {
                    $container.append('<td>In Progress!</td><td><button class="status progress">Complete</button></td>');
                    $container.addClass('incomplete ' + task.id);
                    $container.append('<td><button class="delete">Delete</button></td>');
                    $('#tasks').append($container);

                } else {
                    $container.append('<td>Complete!</td><td><button class="status done" disabled></button></td>');
                    $container.addClass('complete');
                    $container.append('<td><button class="delete">Delete</button></td>');
                    $('#tasks').append($container);

                }
            });
        }
    });
}



//Send Task to the database.
function postTask() {
    event.preventDefault();
    var task = {};

//The info in fields put into an object.
    $.each($('#taskForm').serializeArray(), function(i, field) {
        task[field.name] = field.value;
        console.log(task);
    });

//Ajax call
    $.ajax({
        type: 'POST',
        url: '/todo',
        data: task,
        success: function(data) {
            showTasks();
        }
    });
}


function changeStatus() {
    //event.preventDefault();
    var statusID = {};
    console.log('you clicked me');
      statusID.data().id = $(this).parent().data('taskID');
        //$(this).parent().parent().toggleClass('joke');
      statusID.data().status = $(this).parent().data('COMPLETED');
        //statusID.id = taskID;
        console.log(statusID);
    $.ajax({
        type: 'PUT',
        url: '/todo/status',
        data: statusID,
        success: function() {
            showTasks();
        }
    });
}
