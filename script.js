// ==========================================
// APP NAVIGATION
// ==========================================
const navTerminal = document.getElementById('nav-terminal');
const navGui = document.getElementById('nav-gui');
const moduleTerminal = document.getElementById('module-terminal');
const moduleGui = document.getElementById('module-gui');
const sidebarTerminal = document.getElementById('sidebar-terminal');
const sidebarGui = document.getElementById('sidebar-gui');

navTerminal.addEventListener('click', () => {
    navTerminal.classList.add('active'); navGui.classList.remove('active');
    moduleTerminal.style.display = 'block'; moduleGui.style.display = 'none';
    sidebarTerminal.style.display = 'block'; sidebarGui.style.display = 'none';
    document.getElementById('terminal-input').focus();
});
navGui.addEventListener('click', () => {
    navGui.classList.add('active'); navTerminal.classList.remove('active');
    moduleGui.style.display = 'block'; moduleTerminal.style.display = 'none';
    sidebarGui.style.display = 'block'; sidebarTerminal.style.display = 'none';
});

// ==========================================
// TERMINAL SIMULATION (Advanced CLI)
// ==========================================
const levels = [
    {
        title: "1. git init",
        text: "Let's build a repository for a Python Machine Learning project. First, initialize the repo.<br><br><strong>Task:</strong> Type <code>git init</code>",
        expectedCmd: "git init",
        successMsg: "Initialized empty Git repository in ~/ml_project/.git/"
    },
    {
        title: "2. git status",
        text: "You created a new file called <code>model.py</code>. Let's check the state of the repository.<br><br><strong>Task:</strong> Type <code>git status</code>",
        expectedCmd: "git status",
        successMsg: "On branch main\nUntracked files:\n  (use \"git add <file>...\" to include in what will be committed)\n\tmodel.py"
    },
    {
        title: "3. git add",
        text: "Tell Git to track your new Python file.<br><br><strong>Task:</strong> Type <code>git add .</code> (or <code>git add model.py</code>)",
        expectedCmd: ["git add .", "git add model.py"],
        successMsg: "Changes to be committed:\n  new file:   model.py"
    },
    {
        title: "4. git commit",
        text: "Save this initial snapshot to your history.<br><br><strong>Task:</strong> Type <code>git commit -m \"Add initial ML model\"</code>",
        expectedCmd: ["git commit -m \"Add initial ML model\"", "git commit -m 'Add initial ML model'"],
        successMsg: "[main (root-commit) a1b2c3d] Add initial ML model\n 1 file changed, 50 insertions(+)"
    },
    {
        title: "5. git branch",
        text: "Never code new features directly on <code>main</code>! Let's create a branch to test a new algorithm without breaking the stable code.<br><br><strong>Task:</strong> Type <code>git branch experiment</code>",
        expectedCmd: "git branch experiment",
        successMsg: "Branch 'experiment' created."
    },
    {
        title: "6. git checkout",
        text: "You created the branch, but you are still on 'main'. Switch to your new branch.<br><br><strong>Task:</strong> Type <code>git checkout experiment</code>",
        expectedCmd: ["git checkout experiment", "git switch experiment"],
        successMsg: "Switched to branch 'experiment'",
        promptChange: "user@gitlearn:~/ml_project (experiment)$"
    },
    {
        title: "7. Commit changes",
        text: "You edited <code>model.py</code> to add linear regression. Stage and commit it in one step using the <code>-am</code> flag.<br><br><strong>Task:</strong> Type <code>git commit -am \"Add linear regression\"</code>",
        expectedCmd: ["git commit -am \"Add linear regression\"", "git commit -am 'Add linear regression'"],
        successMsg: "[experiment d4e5f6g] Add linear regression\n 1 file changed, 15 insertions(+)"
    },
    {
        title: "8. git checkout main",
        text: "The experiment works! Now switch back to your stable branch so we can pull the changes in.<br><br><strong>Task:</strong> Type <code>git checkout main</code>",
        expectedCmd: ["git checkout main", "git switch main"],
        successMsg: "Switched to branch 'main'",
        promptChange: "user@gitlearn:~/ml_project$ "
    },
    {
        title: "9. git merge",
        text: "Bring the code from 'experiment' into 'main'.<br><br><strong>Task:</strong> Type <code>git merge experiment</code>",
        expectedCmd: "git merge experiment",
        successMsg: "Updating a1b2c3d..d4e5f6g\nFast-forward\n model.py | 15 +++++++++++++++\n 1 file changed, 15 insertions(+)"
    },
    {
        title: "10. git log",
        text: "View the history of your repository to ensure the merge was successful.<br><br><strong>Task:</strong> Type <code>git log --oneline</code>",
        expectedCmd: ["git log --oneline", "git log"],
        successMsg: "d4e5f6g (HEAD -> main, experiment) Add linear regression\na1b2c3d Add initial ML model"
    },
    {
        title: "11. git remote",
        text: "Link your local code to a GitHub repository.<br><br><strong>Task:</strong> Type <code>git remote add origin https://github.com/it-student/ml_project.git</code>",
        expectedCmd: "git remote add origin https://github.com/it-student/ml_project.git",
        successMsg: "Remote 'origin' added."
    },
    {
        title: "12. git push & pull",
        text: "Push your code to GitHub so others can collaborate.<br><br><strong>Task:</strong> Type <code>git push -u origin main</code>",
        expectedCmd: "git push -u origin main",
        successMsg: "Enumerating objects: 6, done.\nWriting objects: 100% (6/6), 845 bytes | 845.00 KiB/s, done.\nTo https://github.com/it-student/ml_project.git\n * [new branch]      main -> main\nBranch 'main' set up to track remote branch 'main' from 'origin'.\n\n🎉 ALL TERMINAL LEVELS COMPLETE!"
    }
];

let currentLevel = 0;
const titleEl = document.getElementById('lesson-title');
const textEl = document.getElementById('lesson-text');
const inputEl = document.getElementById('terminal-input');
const outputEl = document.getElementById('terminal-output');
const progressList = document.getElementById('progress-list');
const promptEl = document.getElementById('term-prompt');

function loadLevel() {
    const level = levels[currentLevel];
    titleEl.innerHTML = level.title;
    textEl.innerHTML = level.text;
    updateSidebar();
}

function updateSidebar() {
    progressList.innerHTML = '';
    levels.forEach((lvl, index) => {
        const li = document.createElement('li');
        li.innerText = lvl.title;
        if (index < currentLevel) li.classList.add('completed');
        else if (index === currentLevel) li.classList.add('active');
        progressList.appendChild(li);
    });
}

function printToTerminal(text, className = '') {
    const div = document.createElement('div');
    div.className = `output-line ${className}`;
    div.innerText = text;
    outputEl.appendChild(div);
    outputEl.scrollTop = outputEl.scrollHeight;
}

inputEl.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const cmd = inputEl.value.trim();
        if (!cmd) return;

        printToTerminal(`${promptEl.innerText} ${cmd}`);
        inputEl.value = '';

        const level = levels[currentLevel];
        const isCorrect = Array.isArray(level.expectedCmd) ? level.expectedCmd.includes(cmd) : cmd === level.expectedCmd;

        if (isCorrect) {
            printToTerminal(level.successMsg, 'success');
            if (level.promptChange) promptEl.innerText = level.promptChange;

            if (currentLevel < levels.length - 1) {
                currentLevel++;
                setTimeout(() => {
                    printToTerminal("---", "success");
                    loadLevel();
                }, 800);
            } else {
                updateSidebar();
            }
        } else {
            printToTerminal(`bash: command incorrect. Try reading the instructions again.`, 'error');
        }
    }
});
loadLevel();

// ==========================================
// GITHUB GUI SIMULATION (Pull Requests & Licensing)
// ==========================================
const missionEl = document.getElementById('mission-instructions');
const screens = document.querySelectorAll('.screen');
const fileList = document.getElementById('file-list');

// Repository State
let files = [
    { name: 'README.md', msg: 'Initial commit', date: 'Just now' }
];

function showScreen(screenId) {
    screens.forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

function renderFileList() {
    fileList.innerHTML = '<div class="file-row" style="background: var(--terminal-bg); font-weight:bold;"><span>File</span><span>Commit message</span></div>';
    files.forEach(f => {
        fileList.innerHTML += `<div class="file-row"><span>📄 ${f.name}</span><span class="text-muted">${f.msg}</span></div>`;
    });
}

// 1. Dashboard -> Create Repo
missionEl.innerHTML = "<strong>Task:</strong> IT Projects need a home. Click <strong>New Repository</strong>.";
document.getElementById('btn-new-repo').addEventListener('click', () => {
    showScreen('screen-create-repo');
    missionEl.innerHTML = "<strong>Task:</strong> Name the repository <code>mobile-app-dev</code> and click <strong>Create repository</strong>.";
});

// 2. Create Repo -> Repo View
document.getElementById('repo-name-input').addEventListener('input', (e) => {
    document.getElementById('btn-create-repo').disabled = (e.target.value !== 'mobile-app-dev');
});
document.getElementById('btn-create-repo').addEventListener('click', () => {
    showScreen('screen-repo-view');
    renderFileList();
    missionEl.innerHTML = "<strong>Task:</strong> Open source projects need a license. Click <strong>Add file ▾</strong> and select to create a new file.";
});

// 

// 3. Repo View -> Add File
document.getElementById('btn-add-file').addEventListener('click', () => {
    showScreen('screen-add-file');
    missionEl.innerHTML = "<strong>Task:</strong> Type <code>LICENSE</code> in the file name box. <br><br>Notice the radio buttons below. Select <strong>'Create a new branch'</strong>, then click <strong>Commit new file</strong>.";
});

document.getElementById('new-file-name').addEventListener('input', (e) => {
    if (e.target.value.toUpperCase() === 'LICENSE') {
        document.getElementById('new-file-content').value = "MIT License\n\nCopyright (c) 2026 IT Student\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files...";
    }
});

// 4. Add File -> Open Pull Request
document.getElementById('btn-commit-new-file').addEventListener('click', () => {
    if (!document.getElementById('commit-new').checked) {
        alert("For this simulation, please select 'Create a new branch' to practice Pull Requests!");
        return;
    }
    showScreen('screen-pr');
    missionEl.innerHTML = "<strong>Task:</strong> You created a branch! Now, propose merging it into the main project by clicking <strong>Create pull request</strong>.";
});

// 5. Open PR -> Merge PR
document.getElementById('btn-create-pr').addEventListener('click', () => {
    showScreen('screen-merge-pr');
    document.getElementById('tab-pr').innerHTML = `⑂ Pull requests <span class="badge" style="background:var(--accent-color); color:#fff">1</span>`;
    missionEl.innerHTML = "<strong>Task:</strong> Code review looks good. No conflicts. Click <strong>Merge pull request</strong> to finalize adding the License to the main branch.";
});

// 6. Complete Merge
document.getElementById('btn-merge-pr').addEventListener('click', () => {
    files.push({ name: 'LICENSE', msg: 'Add MIT License (#1)', date: 'Just now' });
    document.getElementById('tab-pr').innerHTML = `⑂ Pull requests <span class="badge">0</span>`;
    showScreen('screen-repo-view');
    renderFileList();
    missionEl.innerHTML = "🎉 <strong>Mission Accomplished!</strong><br><br>You successfully created a repository, branched to add a License file, opened a Pull Request, and merged it back into the main codebase. You are ready for real-world collaboration!";
});