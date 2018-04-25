// import proxy from 'http-proxy-middleware'
//
// // proxy middleware options
//
// // create the proxy (without context)
// module.exports = {
//     proxy: proxy({
//               target: 'http://127.0.0.1:4900', // target host
//               changeOrigin: true,               // needed for virtual hosted sites
//               ws: true,                         // proxy websockets
//               pathRewrite: {
//                   '^/api' : '/api',     // rewrite path
//                   // '^/api/remove/path' : '/path'           // remove base path
//               },
//               router: {
//                   // when request.headers.host == 'dev.localhost:3000',
//                   // override target 'http://www.example.org' to 'http://localhost:8000'
//                   //'dev.localhost:3000' : 'http://localhost:8000'
//               }
//           })
// }