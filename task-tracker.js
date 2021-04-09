let http = require("http");
let fs = require("fs");
let url = require("url");
let port = 4200;

let addTaskHTML = 
`
<h3>Add a Task</h3>
<form action="/store"  method="get">
    <label>Employee ID:</label>
    <input type="text" name="empID"/><br/>

    <label>Task ID:</label>
    <input type="text" name="taskID"/><br/>

    <label>Task:</label>
    <input type="textbox" name="task"/><br/>

    <label>Dead Line:</label>
    <input type="text" name="deadLine"/><br/>
    
    <input type="submit" value="Submit"/>
    <input type="reset" value="Reset"/>
</form>
`

let delTaskHTML = 
`
<h3>Delete a Task</h3>
<form>
    <label>Task ID:</label>
    <input type ="text" name = "taskID"/><br/>

    <input type = "submit" value = "Submit"/>
    <input type = "reset" value = "Reset"/>
</form>
`

var tasks = new Array();
let server = http.createServer((request, response) => {
    response.setHeader("content-type","text/html");
    var pathInfo = url.parse(request.url,true).pathname;
    
    if(pathInfo != "/favicon.ico"){
        if(pathInfo == "/store"){
            response.end(addTaskHTML);
            var data = url.parse(request.url, true).query;
            var task = {"empID": data.empID, "taskID": data.taskID, "task": data.task, "deadLine": data.deadLine};
            tasks.push(task); 
            let jsonTasks = JSON.stringify(tasks);
            fs.writeFileSync("task-log.json", jsonTasks);
        }

        else if(pathInfo == "/delete"){
            response.end(delTaskHTML);
            let jsonData = fs.readFileSync("task-log.json");
            let data = url.parse(request.url, true).query;
            for(var i = 0; i < tasks.length; i++){
                if(tasks[i].taskID == data.taskID) {
                    tasks.splice(i, 1);
                }
            }
            let jsonTasks = JSON.stringify(tasks);          // rewrite the stars
            fs.writeFileSync("task-log.json", jsonTasks);
        }

        else if(pathInfo == "/display"){
            let jsonData = fs.readFileSync("task-log.json");
            let jsonArray = JSON.parse(jsonData.toString());

            let displayHTML= `
            <h3>Task Table</h3>
            <table border = 2>
                <tr>
                    <th>Employee ID</th>
                    <th>Task ID</th>
                    <th>Task</th>
                    <th>DeadLine</th>
                </tr>
                `
            for(task of jsonArray)
            {
                displayHTML +=
                `
                    <tr>
                        <td>${task.empID}</td>
                        <td>${task.taskID}</td>
                        <td>${task.task}</td>
                        <td>${task.deadLine}</td>
                    </tr>
                `
            }
            displayHTML += `</table>`
            response.end(displayHTML);
        }
        response.end();
    }
});
server.listen(port, () => console.log(`Listening on port ${port}...`));
