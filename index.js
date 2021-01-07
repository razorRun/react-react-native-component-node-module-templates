const fs = require('fs');
const prompts = require('prompts');
const ncp = require('ncp').ncp;
const changeCase = require('change-case');
const shell = require('shelljs');
const replaceInFiles = require('replace-in-files');

ncp.limit = 16;

let destinationPath = "";
const REPLACEMENT_OPTIONS = ["FILE_NAME","FOLDER_NAME","FILE_VALUES"]
const CASE_TYPES = ["camelCase","snakeCase","paramCase","pascalCase","constantCase"]

// get list of available folders in a path
const getFolderList = (path) => {
    return fs.readdirSync(path, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => ({title:dirent.name}));
}

// recursively pick the path to project package.json
const  locationSelector = async (path)=>{
    let cPath= path ? path:__dirname;
    let folderList = getFolderList(cPath);
    folderList.push({title:"ADD_HERE"},{title:"GO_BACK"});
    const response = await prompts({
        type: 'autocomplete',
        name: 'fileSelector',
        message: 'Select the location you want your file in',
        choices: folderList.reverse()
    });
    if (response.fileSelector == "ADD_HERE"){
        destinationPath = cPath;
        return cPath;
    }
    else if (response.fileSelector == "GO_BACK"){
        await locationSelector();
    }
    else {
        await locationSelector(cPath+"/"+response.fileSelector);
    }
}

//prompt user to select tech stack and save it to a config file
const stackTypeSelector = async (path)=> {
    path= path ? path:__dirname+"/developer-templates";
    let techStack = ""
    try {
        return JSON.parse(fs.readFileSync("developer-templates/input.json")).techStack;
    }catch (e) {
        let folderList = getFolderList(path);
        const response = await prompts({
            type: 'autocomplete',
            name: 'techStack',
            message: 'Select your Project stack',
            choices: folderList
        });
        fs.writeFile ("developer-templates/input.json", JSON.stringify(response), function(err) {
                if (err) throw err;
                console.log('Response was saved to /developer-templates/config.json. Delete this file if you want to change it later.');
            }
        );
        return response.techStack;
    }
}

//prompt user to select template type and return the template path
const templateSelector = async (path)=> {
    const techStack = await stackTypeSelector();
    console.log ("Available templates for " +techStack);
    path = path ? path:__dirname+"/developer-templates/"+techStack;
    let folderList = getFolderList(path);
    const response = await prompts({
        type: 'autocomplete',
        name: 'templateType',
        message: 'Select a template',
        choices: folderList
    });
    const selectedPath = __dirname+"/developer-templates/"+techStack+"/"+response.templateType;
    const templateName = getFolderList(selectedPath)[0].title;
    return [selectedPath,selectedPath+"/"+templateName,templateName];
}

// Take user inputs
const replacePrompt = async (userInputRequests) =>{
    //console.log(userInputRequest);
    const promptList = userInputRequests.map((userInputRequest)=>{
        return ({
            type: 'text',
            name: userInputRequest.label,
            message: 'What should we rename '+userInputRequest.label+' to?',
        })
    })
    const responses = await (async () => {
        return await prompts(promptList);
    })();

    return responses;
}

//generate a list of tasks as an array to perform
const generateTaskList = (userInputRequests,responses) => {
    const fullTaskList = userInputRequests.map((userInputRequest)=>{
        const taskListPerRequest = userInputRequest.replacements.map((rv)=>{
            const casedInput = changeCase[CASE_TYPES[rv.replacingCaseTypes-1]](responses[userInputRequest.label]);
            return rv.replacingLocations.map((rl)=>{
                return {
                    replacementOption : REPLACEMENT_OPTIONS[rl-1],
                    originalValue : rv.replacingText,
                    newValue: casedInput
                }
            });
        });
        return taskListPerRequest.reduce((a,b)=>{ return a.concat(b) }, []);
    });
    return fullTaskList.reduce((a,b)=>{ return a.concat(b) }, []);
}

const folderNameReplaceHandler = (originalValue,newValue,path) =>{
    console.log("Folder Names => ",originalValue," to", newValue);
    shell.exec('cd '+path+' && pwd &&'+__dirname+'/node_modules/.bin/renamer --find /'+originalValue+'/i --replace "'+newValue+'" "**/"');
}

const fileNameReplaceHandler = (originalValue,newValue,path) =>{
    console.log("File Names => ",originalValue," to", newValue);
    shell.exec('cd '+path+' && pwd &&'+__dirname+'/node_modules/.bin/renamer --find /'+originalValue+'/i --replace "'+newValue+'" "**"');
}

const fileContentReplaceHandler = async (originalValue,newValue,path) =>{
    console.log("File Content => ",originalValue," to", newValue);
    const data = replaceInFiles({
        files: path+'/**',
        from: new RegExp(originalValue,"g"),
        to: newValue,
    });
    return data;
}

// handle replacement process after analysing the user-input-map.json
const replaceHandler = async (templatePath,destinationRootPath,template) => {
    try {
        const userInputRequests = JSON.parse(fs.readFileSync(
            templatePath.substring(0,templatePath.lastIndexOf("/"))+"/user-input-map.json"));
        const taskList = generateTaskList(userInputRequests,await replacePrompt(userInputRequests));
        let destinationFolderName = taskList.find((task)=>{
            // Destination parent will take the first Name available for a FOLDER_NAME else template name
            if (task.replacementOption === "FOLDER_NAME"){
                return task;
            }
        });
        destinationFolderName = destinationFolderName? destinationFolderName.newValue:template;
        const destinationFolderPath = destinationRootPath+"/"+destinationFolderName
        ncp(templatePath,destinationFolderPath,(err)=>{
            taskList.map(async (task)=>{
                if (task.replacementOption === "FILE_NAME"){
                    fileNameReplaceHandler(task.originalValue,task.newValue,destinationFolderPath)
                }
                else if (task.replacementOption === "FOLDER_NAME"){
                    folderNameReplaceHandler(task.originalValue,task.newValue,destinationFolderPath)
                }
                else if (task.replacementOption === "FILE_VALUES"){
                    await fileContentReplaceHandler(task.originalValue,task.newValue,destinationFolderPath)
                }
            })
        }) // Copy the folder from template to the destination
    }
    catch (e){
        console.log(e);
    }
}

const run = async () =>{
    let templateInfo = await templateSelector()
    await locationSelector()
    await replaceHandler(templateInfo[1],destinationPath,templateInfo[2]);
}

run();
