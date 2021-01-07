# React Component Templates, React Native Component Templates, Express Templates, Node Module Templates and Starters  

## How to use NPM scripts to save time and automate tasks on React and other JS projects like React native, Angular or Express? 

CLI script to create React and React Native component creator tool for creating the component file and other files like CSS module. Also give you the option to quickly edit the template according to your project. But of you can use this in any other JS repos like angular or Node. 

Imagine working on a project with more than 100s of react components. how good we can create components using an npm task inside the project. This way, it will save time and helps to maintain consistency throughout the files. And of course, you can approach this in various ways. Such as

 - Create and template file type on the code editor.
 - Use a plugin that gives snippets for the code editor.

The way I see it is when you work with multiple different teams on different projects, it is always useful to have isolated project standers that can be easily adjustable for the whole team.

See [NPM script to automate tasks in React and other JS Projects](https://roshan.digital/npm-script-to-save-time-react-project/) post for more information.

To Add a new Template 
 1. Create a folder inside templates folder with the repo type ex:react
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


