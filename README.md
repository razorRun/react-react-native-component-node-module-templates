# React Component Templates, React Native Component Templates, Express Templates, Node Module Templates and Starters 

NPM package to easily create modules and components using your templates(several pre-loaded) for any js project. Also, give you the option to edit the template according to your project quickly.

Imagine working on a project with more than 100s of react components. How good if we can create components using an npm task inside the project. This way, it will save time and helps to maintain consistency throughout the project. And of course, you can approach this in various ways. Such as

 - Create and template file type on the code editor.
 - Use a plugin that gives snippets for the code editor.

The way I see it is when you work with multiple different teams on different projects, it is always useful to have isolated project standards that can be easily adjustable for the whole team.

Example: 

let's say on a react project whenever we create a functional component we do following steps.

1. create a folder with component name - Login
2. create three files inside this folder - Login.tsx,  Login.module.css, Login.test.ts
3. create basic code structures on each of those files with relevant class names and module names. 

What this tool does is automate this whole process. You and your team can create a template you like, and this tool will create files with the name you input and replace the content in your template files whenever you create a new module. 

![demo](https://github.com/razorRun/react-react-native-component-node-module-templates/blob/main/demo.gif?raw=true)

#### Install

`npm i react-react-native-component-node-module-templates --save-dev`

#### Setup on first time

 run `node node_modules/react-react-native-component-node-module-templates/init.js`

You will notice this will create an entry called `gen` in your package.json and copy a folder to your project root called 
`developer-templates`. Fell free to edit them as you see needed. 

#### To run the generator 

`npm run gen`

See [NPM script to automate tasks in React and other JS Projects](https://roshan.digital/npm-script-to-save-time-react-project/) post for more information.

To add a new Template 
 1. Create a folder inside `developer-templates` folder with the repo type ex:react
 2. Create child folder with the template files type ex: component,module 
 3. Create user-input-map.json file indicating what are the values user should input and how they should get replaced.
 
 `
[
  {
    "label":"UserInput1",
    "replacements":[
      {
        "replacingText" : "ModuleName",
        "replacingCaseTypes": 1 ,
        "replacingLocations": [1,2,3]
      }
    ]
  },
  {
    "label":"UserInput2",
    "replacements":[
      {
        "replacingText" : "ModuleName",
        "replacingCaseTypes": 1 ,
        "replacingLocations": [1,3]
      }
    ]
  }
]
 `
 
Supported `replacingCaseTypes`
1. camelCase 
2. snake_case 
3. kebab-case
4. PascalCase
5. UPPER_CASE_SNAKE_CASE

Supported `replacingLocations`

1. file names  
2. folder names
3. inside files 

Also, feel free contribute to save time. :innocent: Happy Coding :heart: :muscle:


