//la fn scrapingProfile si se ejecuta en el contexto del navegador
/**todo lo demás (el addeventlistener del boton)
 * se ejecuta en la "pagina" de la extension, popup --> index.html
 */




const scrapingProfile = async () => {

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
        'fullName': '.text-heading-xlarge',
        'botonContacto': ".pb2 > span.pv-text-details__separator > a.ember-view",
        'linkEmail': ".ci-email > div.pv-contact-info__ci-container > a.pv-contact-info__contact-link",
        'birthday': '.ci-birthday > .pv-contact-info__ci-container > .pv-contact-info__contact-item',
        'twitter_link': '.ci-twitter > ul > li.pv-contact-info__ci-container > a.pv-contact-info__contact-link',
        'experienceItems': '#experience-section > ul > li',
        'educationsItems': '#education-section > ul > li',
        'country': 'div.pb2.pv-text-details__left-panel > .text-body-small',
        'urlLinkedin': '.ci-vanity-url > .pv-contact-info__ci-container > a.pv-contact-info__contact-link'
    }

    let profile = {
        experiences: [

        ],
        educations: []
    };

    const getInfo = async () => {
        const { fullName, botonContacto, linkEmail, birthday, experienceItems, educationsItems, twitter_link, country, urlLinkedin } = selectorProfile;

        profile.fullName = document.querySelector(fullName).textContent;
        profile.location = (document.querySelector(country).textContent).replace("\\n", "").trim();

        const items_experiencie = document.querySelectorAll(experienceItems);
        const items_education = document.querySelectorAll(educationsItems);

        let num_exp = 0;
        let num_edu = 0;

        //sacando info del boton de contacto
        if (document.querySelector(botonContacto)) {
            document.querySelector(botonContacto).click();

            await sleep(2);

            (document.querySelector(birthday)) ? profile.birthday = document.querySelector(birthday).innerText : null;
            (document.querySelector(linkEmail)) ? profile.email = document.querySelector(linkEmail).href : null;
            (document.querySelector(twitter_link)) ? profile.twitter_link = document.querySelector(twitter_link).href : null;
            (document.querySelector(urlLinkedin)) ? profile.urlLinkedin = document.querySelector(urlLinkedin).href : null
        }

        await autoscrollToElement("body")
        await sleep(4);
        for (let item of items_experiencie) {

            await sleep(1);
            if (item) {
                //alert('esta el item');
            } else {
                alert('no esta no se k pasa');
            }

            profile.experiences.push({})

            item.getElementsByTagName('h3').length > 0 ? profile.experiences[num_exp].jobPosition = item.getElementsByTagName('h3')[0].innerText : null
            item.getElementsByClassName('pv-entity__secondary-title').length > 0 ? profile.experiences[num_exp].companyName = item.getElementsByClassName('pv-entity__secondary-title')[0].innerText : null
            item.getElementsByClassName("pv-entity__bullet-item-v2").length > 0 ? profile.experiences[num_exp].duration = item.getElementsByClassName("pv-entity__bullet-item-v2")[0].innerText : null
            item.getElementsByClassName("pv-entity__description").length > 0 ? profile.experiences[num_exp].description = item.getElementsByClassName("pv-entity__description")[0].textContent : null

            num_exp++;
            // console.log('profile a envitar', profile);
        }

        for (let edu_item of items_education) {
            await sleep(1);
            if (edu_item) {

            } else {
                alert('no education');
            }

            profile.educations.push({});

            edu_item.getElementsByClassName("pv-entity__school-name") ? profile.educations[num_edu].institutionName = edu_item.getElementsByClassName("pv-entity__school-name")[0].innerText : null;
            if (edu_item.getElementsByClassName("pv-entity__comma-item").length > 0) {
                edu_item.getElementsByClassName("pv-entity__comma-item").length > 1 ? profile.educations[num_edu].carreer = `${edu_item.getElementsByClassName("pv-entity__comma-item")[0].innerText} ${edu_item.getElementsByClassName("pv-entity__comma-item")[1].innerText}` : profile.educations[num_edu].carreer = `${edu_item.getElementsByClassName("pv-entity__comma-item")[0].innerText}`

            }

            num_edu++;
        }
        // console.log('profile a envitar', profile);




        return profile;

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

            await sleep(0.05)

            let newScrollTop = Math.min(currentScrollTop + 20, maxScrollTop);
            window.scrollTo(0, newScrollTop)


        }

        console.log('finish autoscroll to element %s', cssSelector);

    };


    //habria que crear un pop-up para que se "pinten" los datos scrapeados
    /**
     * solucion temporal a experiencies == 0, mandar a ejecutar de nuevo
     */
    return await getInfo();

    // console.log("===========OBJETO CHROME=========", chrome);


};


const sendData = async (url, document) => {
    try {
        const fetchOptions = {
            method: "POST",
            body: document,
            headers: {
                "Content-Type": "application/json",
            },
            mode: "cors",
        };
        const response = await fetch(url, fetchOptions);

        const { data = {}, success } = await response.json();
        console.log(data);
        console.log("si llego hasta aca debe ir bastante bien");
        if (success) return data;
    } catch (error) {
        console.log(
            "🚀 ~ file: index.html ~ line 22 ~ sendData ~ error",
            error
        );
        throw error;
    }
};

async function processData(finalProfile) {
    try {


        const Data = [];
        Data.push(finalProfile);

        const stringData = JSON.stringify(Data);

        const urlHost =
            "http://localhost:8080/api/v1/profiles/addMultipleProfiles";

        const responseMessage = await sendData(urlHost, stringData);
        return responseMessage;
    } catch (error) {
        console.log(
            "🚀 ~ file: index.html ~ line 102 ~ processData ~ error",
            error
        );
        throw error;
    }
}



(function () {
    try {
        chrome.runtime.onConnect.addListener(function (port) {
            port.onMessage.addListener(async (message) => {
                const { action } = message;
                if (action == 'scrapingProfile') {
                    const finalProfile = await scrapingProfile()
                    console.log(finalProfile);
                    //enviar perfil al backend
                    const sending = await processData(finalProfile);
                    console.log(sending);



                }
            })
        })
    } catch (error) {
        console.log(error);
    }

})()