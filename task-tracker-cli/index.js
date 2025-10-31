import { promises as fs } from 'fs';

const args = process.argv.slice(2);
const command = args[0];

async function readTasks() {
  try {
    const data = await fs.readFile("data.json", "utf8");
    if (!data.trim()) return [];
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    if (err.code === "ENOENT") return [];
    throw err;
  }
}

async function writeTasks(tasks) {
  await fs.writeFile("data.json", JSON.stringify(tasks, null, 2), "utf8");
}

async function addTask(description) {
  const tasks = await readTasks();
  const id = tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1;
  const now = new Date();

  const newTask = {
    id,
    description,
    status: "todo",
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };

  tasks.push(newTask);
  await writeTasks(tasks);
  console.log(`Task added successfully (ID: ${id})`);
}

async function updateTask(id, description) {
  const tasks = await readTasks();
  const numId = Number(id);
  let found = false;

  const updatedTasks = tasks.map((task) => {
    if (task.id === numId) {
      found = true;
      return {
        ...task,
        description: description || task.description,
        updatedAt: new Date().toISOString(),
      };
    }
    return task;
  });

  if (!found) return console.log(`Task with ID ${id} not found.`);
  await writeTasks(updatedTasks);
  console.log(`Task ${id} updated successfully.`);
}

async function deleteTask(id) {
  const tasks = await readTasks();
  const numId = Number(id);
  const filteredTasks = tasks.filter((task) => task.id !== numId);
  if (filteredTasks.length === tasks.length)
    return console.log(`Task with ID ${id} not found.`);
  await writeTasks(filteredTasks);
  console.log(`Task ${id} deleted successfully.`);
}

async function markTask(id, status) {
  const tasks = await readTasks();
  let found = false;

  const markedTasks = tasks.map((task) => {
    if (task.id === Number(id)) {
      found = true;
      return {
        ...task,
        status: status || task.status,
        updatedAt: new Date().toISOString(),
      };
    }
    return task;
  });

  if (!found) return console.log(`Task with ID ${id} not found.`);
  await writeTasks(markedTasks);
  console.log(`Task ${id} marked as '${status}'.`);
}

async function listTasks(filterStatus) {
  const tasks = await readTasks();
  if (tasks.length === 0) return console.log(" No tasks found.");

  const filtered = filterStatus
    ? tasks.filter((t) => t.status === filterStatus)
    : tasks;

  console.log("\n Task List:");
  filtered.forEach((t) => {
    console.log(`[${t.id}] ${t.description} - ${t.status}`);
  });
  console.log();
}


if (command === "add") {
  await addTask(args[1]);
} else if (command === "update") {
  await updateTask(args[1], args[2]);
} else if (command === "delete") {
  await deleteTask(args[1]);
} else if (command === "mark") {
  await markTask(args[1], args[2]);
} else if (command === "list") {
  await listTasks(args[1]);
} else {
  console.log("Invalid command. Use: add | update | delete | mark | list");
}