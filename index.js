
try {
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
        if (tab !== null) {
            //para pasar parametros en chrome.scripting se usa el indice args:[]
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                function: scrapingProfile,
                //en este caso, le estoy pasando a la ventana "principal" datos de tab
                //que vendria a ser ella misma
                //por eso los datos de tab son de la ventana desde la que se llamo la extension
                // args: [tab, tab.id]
            });
        }


    });


    const scrapingProfile = () => {
        //console.log('tab', tab);
        //console.log('tab-id', id_tab);
        //console.log('chrome', chrome);


        //funcion para trabajar con titulos de yt
        const resolveYT = () => {
            console.log('===========IMPRIMIENDO SCRAPING DE YOUTUBE=======');
            const videos = document.querySelectorAll('#video-title');
            const arreglo = [];
            for (let video of videos) {
                arreglo.push(video.textContent);
            }

            Object.values(arreglo).forEach(titulo => {
                console.log(titulo);
            })
        }

        const sleep = function (seconds) {
            return new Promise(function (resolve) {
                setTimeout(function () {
                    resolve();
                }, seconds * 1000);
            }
            );
        }

        const selectorProfile = {
            'name': '.text-heading-xlarge',
            'botonContacto': ".pb2 > span.pv-text-details__separator > a.ember-view",
            'linkEmail': ".ci-email > div.pv-contact-info__ci-container > a.pv-contact-info__contact-link",
            'birthday': '.ci-birthday > .pv-contact-info__ci-container > .pv-contact-info__contact-item',
            'experienceItems': '#experience-section > ul > li'
        }

        let profile = {
            experiences: [

            ]
        };



        const getInfo = async () => {
            const { name, botonContacto, linkEmail, birthday, experienceItems } = selectorProfile;

            profile.name = document.querySelector(name).textContent;

            const items_experiencia = document.querySelectorAll(experienceItems);

            let num_exp = 0;

            //sacando info del boton de contacto
            if (document.querySelector(botonContacto)) {
                document.querySelector(botonContacto).click();

                //await sleep(1.5);

                (document.querySelector(birthday)) ? profile.birthday = document.querySelector(birthday).innerText : null;
                (document.querySelector(linkEmail)) ? profile.email = document.querySelector(linkEmail).innerText : null;

            }

            await autoscrollToElement("body").then(async () => {

                await sleep(4);

                for (let index = 0; index < 10; index++) {
                    console.log(index);

                }

                for (let item of items_experiencia) {

                    if (item) {
                        //alert('esta el item');
                    } else {
                        alert('no esta no se k pasa');
                    }

                    profile.experiences.push({})

                    item.getElementsByTagName('h3').length > 0 ? profile.experiences[num_exp].titulo = item.getElementsByTagName('h3')[0].innerText : null
                    item.getElementsByClassName('pv-entity__secondary-title').length > 0 ? profile.experiences[num_exp].empresa = item.getElementsByClassName('pv-entity__secondary-title')[0].innerText : null
                    item.getElementsByClassName("pv-entity__bullet-item-v2").length > 0 ? profile.experiences[num_exp].duracion = item.getElementsByClassName("pv-entity__bullet-item-v2")[0].innerText : null
                    item.getElementsByClassName("pv-entity__description").length > 0 ? profile.experiences[num_exp].descripcion = item.getElementsByClassName("pv-entity__description")[0].textContent : null

                    num_exp++;
                    // console.log('profile a envitar', profile);
                }
                // console.log('profile a envitar', profile);
            })



            return new Promise((res, rej) => {

                /**
                 * espera a hacer click para obtener elemento con el mail
                 * esto debido a que no se presenta en el DOM de lo contrario
                 */
                res(profile);
                rej('ha habido un error')
                // setTimeout(() => {
                //     res(profile);
                //     rej('ha habido un error')
                // }, 2000)

            })

        }


        const autoscrollToElement = async function (cssSelector) {

            var exists = document.querySelector(cssSelector);

            while (exists) {
                //
                let maxScrollTop = document.body.clientHeight - window.innerHeight;
                let elementScrollTop = document.querySelector(cssSelector).offsetHeight
                let currentScrollTop = window.scrollY


                if (maxScrollTop == currentScrollTop || elementScrollTop <= currentScrollTop)
                    break;

                await sleep(0.01)

                let newScrollTop = Math.min(currentScrollTop + 20, maxScrollTop);
                window.scrollTo(0, newScrollTop)


            }

            console.log('finish autoscroll to element %s', cssSelector);

            return new Promise(function (resolve) {
                resolve();
            });
        };


        getInfo().then(data => { console.log(data) })



        // console.log("===========OBJETO CHROME=========", chrome);




    };

} catch (error) {
    alert(`el error dice ${error}`)
}


