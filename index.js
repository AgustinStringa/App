
// import scrapingProfile from "./app";

const btnScrap = document.getElementById('scrap-profile');

btnScrap.addEventListener('click', async () => {

    // retorna una promesa => console.log(chrome.tabs.query({ active: true, currentWindow: true }));
    //"pide" por la tab que este activa y sea la que se visualiza. (o sea la que llama a la extension)
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    const port = chrome.tabs.connect(tab.id);
    port.postMessage({ action: 'scrapingProfile' })





    //tabletas me devuelve un array de todas las pestañas en la ventana
    const tabletas = await chrome.tabs.query({});
    console.log(tabletas);
    //TAB HACE REFERENCIA A LA VENTANA DESDE LA QUE SE LLAMA LA EXTENSION
    //NO LA DE LA EXTENSION
    //SON DOS DISTINTAS
    //tab se genera luego del await y la conexion
    //por eso no es accesible en este contexto

    // if (tab !== null) {
    //     //para pasar parametros en chrome.scripting se usa el indice args:[]
    //     chrome.scripting.executeScript({
    //         target: { tabId: tab.id },
    //         function: scrapingProfile,
    //         //en este caso, le estoy pasando a la ventana "principal" datos de tab
    //         //que vendria a ser ella misma
    //         //por eso los datos de tab son de la ventana desde la que se llamo la extension
    //         // args: [tab, tab.id]
    //     });
    // }


});





