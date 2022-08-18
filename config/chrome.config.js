const path = require('path');
const resolve = (dir) => path.join(__dirname, dir);
module.exports={
    mode: "production",
    resolve: {
        extensions: ['.js', '.ts', '.tsx']
    },
    entry:{
        'background':'./src/chrome/background/index.ts',
    },
    output:{
        filename:'[name].js',
        path: resolve('../extension')
    },
    module:{
        rules:[
             {
                test:/\.(ts|tsx)$/,
                use:{
                    loader:'ts-loader'
                }
             }
        ]
    }
}