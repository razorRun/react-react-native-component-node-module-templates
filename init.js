const ncp = require('ncp').ncp;
const npmAddScript = require('npm-add-script')

ncp("node_modules/react-react-native-component-node-module-templates/developer-templates","developer-templates")
npmAddScript({key: "gen" , value: "npm explore react-react-native-component-node-module-templates npm run gen" , force: true})