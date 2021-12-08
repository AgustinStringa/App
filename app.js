//la fn scrapingProfile si se ejecuta en el contexto del navegador
/**todo lo demás (el addeventlistener del boton)
 * se ejecuta en la "pagina" de la extension, popup --> index.html
 */
alert('codigo inyectado')


// (function () {
//     chrome.runtime.onConnect.addListener(function (port) {
//         port.onMessage.addListener(async (message) => {
//             const { action } = message;
//             if (action == 'scrapingProfile') {
//                 await scrapingProfile()
//             }
//         })
//     })
// })()