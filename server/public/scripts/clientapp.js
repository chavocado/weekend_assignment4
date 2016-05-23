$(document).ready(function () {

  showTasks();
  $('#submit').on('click', postTask);
  $('#container').on('click', '.status', changeStatus);
  $('#container').on('click', '.delete', deleteTask);
});

function showTasks() {
    //clear old table on load
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
                $container.data('name', task.task_name);
                $container.data('status', task.status);
                //checking status to change table accordingly
                if (task.status == 'IN_PROGRESS') {
                    $container.append('<td>DO WORK!!!</td><td><button class="status progress">Complete</button></td>');
                    $container.addClass('incomplete ' + task.id);
                    $container.append('<td><button class="delete">Delete</button></td>');
                    $('#tasks').append($container);

                } else {
                    $container.append('<td>YOU DID IT!!</td><td><button class="status done" disabled></button></td>');
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

//change and update status
function changeStatus() {
    event.preventDefault();
    var taskID = {};
    console.log('you clicked me');
        taskID.id = $(this).parent().parent().data('taskID');
        //console.log('you clicked me',taskID);
    $.ajax({
        type: 'PUT',
        url: '/todo/status',
        data: taskID,
        success: function() {
            showTasks();
            var toad = new Audio('../assets/audio/mk64_toad03.wav');
            toad.play();
        }
    });
}
//deleting task function
function deleteTask() {
    event.preventDefault();
    var name = $(this).parent().parent().data('name');
    var taskID = $(this).parent().parent().data('taskID');
    var delTask = confirm('Are you sure you want to delete ' + name + '?');

    if (delTask) {
        $.ajax({
            type: 'DELETE',
            url: '/todo/' + taskID,
            success: function() {
                showTasks();
                var boo = new Audio('../assets/audio/mk64_boo_laugh.wav');
                boo.play();
            }
        });
    }
}
