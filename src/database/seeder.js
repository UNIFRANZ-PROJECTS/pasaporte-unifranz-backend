require('dotenv').config();
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const {
    CarreraSchema,
    PermisionSchema,
    RoleSchema,
    TypeUserSchema,
    UsuarioSchema,
    CategoriaSchema,
    GuestSchema,
    EventoSchema,
} = require('./../models');
const { response } = require('express');

// Conecta a la base de datos
mongoose.connect(process.env.DB_CNN, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false // Agrega esta opción
});

// Establece la conexión antes de borrar la base de datos y las colecciones
mongoose.connection.on('connected', () => {
    // Borra todas las colecciones
    mongoose.connection.db.dropDatabase()
        .then(async () => {
            console.log('Base de datos borrada correctamente.');
            //creando CARRERAs
            const listCareers = await CarreraSchema.insertMany(careers);
            const idCarrers = listCareers.map(e => e._id);
            //creando PERMISOS
            const listPermisions = await PermisionSchema.insertMany(permisions);
            const idPermisions = listPermisions.map(e => e._id);
            // creando ROL
            const rol = RoleSchema({
                name: 'Desarrollador',
                permisionIds: idPermisions,
                user: null,
                state: true,
            });
            const rolCreated = await rol.save();
            // creando TIPO DE USUARIO
            const TypeUser = new TypeUserSchema({
                name: 'Desarrollador',
                user: null,
                state: true
            });
            const typeUserCreated = await TypeUser.save();
            // creando USUARIO
            const user = new UsuarioSchema({
                name: 'moises',
                email: 'moisic.mo@gmail.com',
                password: 'moisic.mo@gmail.com',
                img: `http://161.35.138.32:8001/image/businessman.png`,
                type_user: typeUserCreated._id,
                rol: rolCreated._id,
                careerIds: idCarrers,
                valid: true,
                state: true,
                isSuperUser: true
            });
            const userCreated = await user.save();
            // editando ROL
            const updateRolObj = { user: userCreated._id };
            await RoleSchema.findByIdAndUpdate(rolCreated._id, updateRolObj, { new: true });
            //editando TIPO DE USUARIO
            const updateTypeUserObj = { user: userCreated._id };
            await TypeUserSchema.findByIdAndUpdate(typeUserCreated._id, updateTypeUserObj, { new: true });
            //editando USUARIO
            const salt = bcrypt.genSaltSync();
            const updateUserObj = { responsible: userCreated._id, password: bcrypt.hashSync(userCreated.email, salt) };

            await UsuarioSchema.findByIdAndUpdate(userCreated._id, updateUserObj, { new: true });
            //creando CATEGORIAS
            const listCategories = await CategoriaSchema.insertMany(categories(userCreated._id));
            //creando EXPOSITORES
            const listGuests = await GuestSchema.insertMany(guests(userCreated._id));
            //creando EVENTOS
            const listEvents = await EventoSchema.insertMany(events(userCreated._id, listCategories, listGuests, listCareers))

        })
        .catch(err => console.error(err))
        .finally(() => {
            // Cierra la conexión a la base de datos al finalizar
            mongoose.connection.close();
        });
});

function randomList(arrayOriginal) {
    // Crear una copia del array original
    const arrayCopia = [...arrayOriginal];
    // Crear un array vacío para almacenar los elementos seleccionados
    const resultado = [];
    // Generar un número aleatorio entre 1 y el tamaño del array original
    const cantidadElementos = Math.floor(Math.random() * arrayOriginal.length) + 1
    // Seleccionar elementos aleatorios del array original
    for (let i = 0; i < cantidadElementos; i++) {
        // Generar un índice aleatorio dentro del rango del array copia
        const indiceAleatorio = Math.floor(Math.random() * arrayCopia.length);
        // Agregar el elemento al resultado
        resultado.push(arrayCopia[indiceAleatorio]);
        // Eliminar el elemento seleccionado del array copia
        arrayCopia.splice(indiceAleatorio, 1);
    }
    return resultado
}
function randomDate() {
    const fechaActual = new Date();
    const fechaEnUnAnio = new Date();
    // Obtener el año actual y sumarle 1
    const anioActual = fechaActual.getFullYear();
    const anioEnUnAnio = anioActual + 1;
    // Establecer la fecha dentro de un año
    fechaEnUnAnio.setFullYear(anioEnUnAnio);
    return new Date(Math.random() * (fechaEnUnAnio.getTime() - fechaActual.getTime()) + fechaActual.getTime());
}
//lista de EVENTOS
function events(userID, listCategories, listGuests, listCareers) {

    let list = [
        //negocios
        {
            title: 'ExpoNegocios',
            description: 'La ExpoNegocios es un evento anual que reúne a empresas de todos los tamaños para mostrar sus productos y servicios a un público amplio y diverso. Durante tres días, los asistentes pueden asistir a conferencias y talleres sobre temas relacionados con el mundo empresarial y hacer contactos valiosos en el mundo de los negocios.',
            categoryIds: randomList([...listCategories.map(e => e._id)]),
            start: randomDate(),
            end: randomDate(),
            image: `http://161.35.138.32:8001/image/events/ExpoNegocios2023.png`,
            activitieIds: [],
            careerIds: randomList([...listCareers.map(e => e._id)]),
            user: userID,
            guestIds: randomList([...listGuests.map(e => e._id)]),
            studentIds: [],
            modality: 'presencial',
            urlEvent: null,
            stateEvent: 'proximo',
            state: true
        },
        {
            title: 'Conferencia de liderazgo',
            description: 'La Conferencia de Liderazgo es un evento diseñado para empresarios y líderes de equipo que buscan mejorar sus habilidades de liderazgo y gestión. Durante el evento, se presentan conferencias y talleres a cargo de expertos en liderazgo y se ofrecen oportunidades de networking con otros asistentes y ponentes.',
            categoryIds: randomList([...listCategories.map(e => e._id)]),
            start: randomDate(),
            end: randomDate(),
            image: `http://161.35.138.32:8001/image/events/liderazgo2023.png`,
            activitieIds: [],
            careerIds: randomList([...listCareers.map(e => e._id)]),
            user: userID,
            guestIds: randomList([...listGuests.map(e => e._id)]),
            studentIds: [],
            modality: 'presencial',
            urlEvent: null,
            stateEvent: 'proximo',
            state: true
        },
        {
            title: 'Foro Empresarial',
            description: 'El Foro Empresarial es un evento que reúne a líderes empresariales y políticos para discutir temas relevantes para el mundo empresarial. Durante el foro, se presentan conferencias y paneles de discusión sobre temas como la economía, la política empresarial y las tendencias del mercado. Además, los asistentes tienen la oportunidad de hacer contactos y establecer relaciones valiosas en el mundo empresarial.',
            categoryIds: randomList([...listCategories.map(e => e._id)]),
            start: randomDate(),
            end: randomDate(),
            image: `http://161.35.138.32:8001/image/events/ForoEmpresarial2023.png`,
            activitieIds: [],
            careerIds: randomList([...listCareers.map(e => e._id)]),
            user: userID,
            guestIds: randomList([...listGuests.map(e => e._id)]),
            studentIds: [],
            modality: 'presencial',
            urlEvent: null,
            stateEvent: 'proximo',
            state: true
        },
        {
            title: 'Cumbre de Innovación',
            description: 'La Cumbre de Innovación es un evento anual que reúne a líderes empresariales y expertos en tecnología para discutir las últimas tendencias en innovación y tecnología. Durante la cumbre, se presentan conferencias y talleres sobre temas como la inteligencia artificial, la realidad virtual y aumentada, y la ciberseguridad. Los asistentes también tienen la oportunidad de hacer contactos y establecer relaciones valiosas en el mundo de la tecnología y los negocios.',
            categoryIds: randomList([...listCategories.map(e => e._id)]),
            start: randomDate(),
            end: randomDate(),
            image: `http://161.35.138.32:8001/image/events/CumbredeInnovación2023.png`,
            activitieIds: [],
            careerIds: randomList([...listCareers.map(e => e._id)]),
            user: userID,
            guestIds: randomList([...listGuests.map(e => e._id)]),
            studentIds: [],
            modality: 'presencial',
            urlEvent: null,
            stateEvent: 'proximo',
            state: true
        },
        {
            title: 'Conferencia de Marketing',
            description: 'La Conferencia de Marketing es un evento anual que reúne a expertos en marketing digital y empresarios para discutir las últimas tendencias y estrategias en el mundo del marketing. Durante la conferencia, se presentan talleres y paneles de discusión sobre temas como el SEO, las redes sociales, la publicidad en línea y la analítica web. Los asistentes también tienen la oportunidad de hacer contactos y establecer relaciones valiosas en el mundo del marketing y los negocios.',
            categoryIds: randomList([...listCategories.map(e => e._id)]),
            start: randomDate(),
            end: randomDate(),
            image: `http://161.35.138.32:8001/image/events/Marketing2023.png`,
            activitieIds: [],
            careerIds: randomList([...listCareers.map(e => e._id)]),
            user: userID,
            guestIds: randomList([...listGuests.map(e => e._id)]),
            studentIds: [],
            modality: 'presencial',
            urlEvent: null,
            stateEvent: 'proximo',
            state: true
        },
        //Música,Arte,Tecnología
        {
            title: 'Artista en Residencia Digital',
            description: 'Una exposición en línea que presenta el trabajo de artistas contemporáneos que utilizan tecnologías digitales y multimedia para crear obras de arte únicas.',
            categoryIds: randomList([...listCategories.map(e => e._id)]),
            start: randomDate(),
            end: randomDate(),
            image: `http://161.35.138.32:8001/image/events/portadadeeventoResidenciaDigital2023.png`,
            activitieIds: [],
            careerIds: randomList([...listCareers.map(e => e._id)]),
            user: userID,
            guestIds: randomList([...listGuests.map(e => e._id)]),
            studentIds: [],
            modality: 'presencial',
            urlEvent: null,
            stateEvent: 'proximo',
            state: true
        },
        {
            title: 'Concierto Holográfico',
            description: 'Un espectáculo de música en vivo que utiliza tecnología de hologramas para crear una experiencia inmersiva para el público. Los músicos son representados por avatares holográficos que tocan junto con una banda en vivo.',
            categoryIds: randomList([...listCategories.map(e => e._id)]),
            start: randomDate(),
            end: randomDate(),
            image: `http://161.35.138.32:8001/image/events/ConciertoHolográfico2023.png`,
            activitieIds: [],
            careerIds: randomList([...listCareers.map(e => e._id)]),
            user: userID,
            guestIds: randomList([...listGuests.map(e => e._id)]),
            studentIds: [],
            modality: 'presencial',
            urlEvent: null,
            stateEvent: 'proximo',
            state: true
        },
        {
            title: 'Festival de Arte y Tecnología',
            description: 'Un evento que combina exposiciones de arte, charlas, talleres y demostraciones de tecnología. Los asistentes pueden experimentar con tecnologías innovadoras mientras disfrutan de obras de arte interactivas creadas por artistas locales y de todo el mundo.',
            categoryIds: randomList([...listCategories.map(e => e._id)]),
            start: randomDate(),
            end: randomDate(),
            image: `http://161.35.138.32:8001/image/events/FestivaldeArteyTecnología.png`,
            activitieIds: [],
            careerIds: randomList([...listCareers.map(e => e._id)]),
            user: userID,
            guestIds: randomList([...listGuests.map(e => e._id)]),
            studentIds: [],
            modality: 'presencial',
            urlEvent: null,
            stateEvent: 'proximo',
            state: true
        },
        {
            title: 'Instalación de Arte Digital Interactivo',
            description: 'Una instalación de arte que utiliza tecnología de realidad virtual y aumentada para crear una experiencia inmersiva para el público. Los visitantes pueden interactuar con la obra de arte utilizando dispositivos móviles y auriculares de realidad virtual.',
            categoryIds: randomList([...listCategories.map(e => e._id)]),
            start: randomDate(),
            end: randomDate(),
            image: `http://161.35.138.32:8001/image/events/InstalacióndeArteDigitalInteractivo.jpeg`,
            activitieIds: [],
            careerIds: randomList([...listCareers.map(e => e._id)]),
            user: userID,
            guestIds: randomList([...listGuests.map(e => e._id)]),
            studentIds: [],
            modality: 'presencial',
            urlEvent: null,
            stateEvent: 'proximo',
            state: true
        },
        {
            title: 'Conferencia sobre Música y Tecnología',
            description: 'Una conferencia que explora cómo la tecnología está transformando la industria musical. Los ponentes incluyen artistas, ingenieros de sonido, productores y otros expertos en la intersección entre música y tecnología.',
            categoryIds: randomList([...listCategories.map(e => e._id)]),
            start: randomDate(),
            end: randomDate(),
            image: `http://161.35.138.32:8001/image/events/ConferenciasobreMúsicayTecnología2023.png`,
            activitieIds: [],
            careerIds: randomList([...listCareers.map(e => e._id)]),
            user: userID,
            guestIds: randomList([...listGuests.map(e => e._id)]),
            studentIds: [],
            modality: 'presencial',
            urlEvent: null,
            stateEvent: 'proximo',
            state: true
        },
        //Moda,Comida,Cine
        {
            title: 'Fashion Film Festival',
            description: 'Un evento que combina moda y cine en una experiencia única. Se presentan cortometrajes y documentales relacionados con la moda, mientras los asistentes disfrutan de comida gourmet y bebidas en un ambiente exclusivo.',
            categoryIds: randomList([...listCategories.map(e => e._id)]),
            start: randomDate(),
            end: randomDate(),
            image: `http://161.35.138.32:8001/image/events/FashionFilmFestival2023.png`,
            activitieIds: [],
            careerIds: randomList([...listCareers.map(e => e._id)]),
            user: userID,
            guestIds: randomList([...listGuests.map(e => e._id)]),
            studentIds: [],
            modality: 'presencial',
            urlEvent: null,
            stateEvent: 'proximo',
            state: true
        },
        {
            title: 'Cine y Cena a Ciegas',
            description: 'Una experiencia única para los amantes del cine, la comida y la aventura. Los asistentes son vendados y llevados a una cena secreta en un lugar sorpresa, donde luego se proyecta una película relacionada con la comida o la gastronomía.',
            categoryIds: randomList([...listCategories.map(e => e._id)]),
            start: randomDate(),
            end: randomDate(),
            image: `http://161.35.138.32:8001/image/events/CineyCenaaciegas2023.png`,
            activitieIds: [],
            careerIds: randomList([...listCareers.map(e => e._id)]),
            user: userID,
            guestIds: randomList([...listGuests.map(e => e._id)]),
            studentIds: [],
            modality: 'presencial',
            urlEvent: null,
            stateEvent: 'proximo',
            state: true
        },
        {
            title: 'Fashion Week Food Tour',
            description: 'Un tour gastronómico por los mejores restaurantes de la ciudad durante la semana de la moda. Los participantes disfrutan de los mejores platillos de la ciudad, mientras observan la última moda en las calles.',
            categoryIds: randomList([...listCategories.map(e => e._id)]),
            start: randomDate(),
            end: randomDate(),
            image: `http://161.35.138.32:8001/image/events/FashionWeekFoodTour2023.png`,
            activitieIds: [],
            careerIds: randomList([...listCareers.map(e => e._id)]),
            user: userID,
            guestIds: randomList([...listGuests.map(e => e._id)]),
            studentIds: [],
            modality: 'presencial',
            urlEvent: null,
            stateEvent: 'proximo',
            state: true
        },
        {
            title: 'Festival de Cine Gastronómico',
            description: 'Un evento que combina lo mejor del cine y la gastronomía. Se presentan películas relacionadas con la comida, mientras se ofrecen degustaciones de platos típicos de diferentes regiones del mundo.',
            categoryIds: randomList([...listCategories.map(e => e._id)]),
            start: randomDate(),
            end: randomDate(),
            image: `http://161.35.138.32:8001/image/events/FestivaldeCineGastronómico2023.png`,
            activitieIds: [],
            careerIds: randomList([...listCareers.map(e => e._id)]),
            user: userID,
            guestIds: randomList([...listGuests.map(e => e._id)]),
            studentIds: [],
            modality: 'presencial',
            urlEvent: null,
            stateEvent: 'proximo',
            state: true
        },
        {
            title: 'Desfile de Moda Gourmet',
            description: 'Un evento exclusivo que combina moda y comida en una experiencia única. Los asistentes disfrutan de un desfile de moda mientras degustan platillos gourmet de la mano de reconocidos chefs de la ciudad.',
            categoryIds: randomList([...listCategories.map(e => e._id)]),
            start: randomDate(),
            end: randomDate(),
            image: `http://161.35.138.32:8001/image/events/DesfiledeModaGourmet2023.png`,
            activitieIds: [],
            careerIds: randomList([...listCareers.map(e => e._id)]),
            user: userID,
            guestIds: randomList([...listGuests.map(e => e._id)]),
            studentIds: [],
            modality: 'presencial',
            urlEvent: null,
            stateEvent: 'proximo',
            state: true
        },
        //Ciencia y Viajes
        {
            title: 'Expedición a la Antártida',
            description: 'Únase a un equipo de científicos en una expedición de investigación a la Antártida. Descubra los secretos de uno de los ecosistemas más extremos del mundo y ayude a recopilar datos valiosos para la ciencia.',
            categoryIds: randomList([...listCategories.map(e => e._id)]),
            start: randomDate(),
            end: randomDate(),
            image: `http://161.35.138.32:8001/image/events/ExpediciónalaAntártida.png`,
            activitieIds: [],
            careerIds: randomList([...listCareers.map(e => e._id)]),
            user: userID,
            guestIds: randomList([...listGuests.map(e => e._id)]),
            studentIds: [],
            modality: 'presencial',
            urlEvent: null,
            stateEvent: 'proximo',
            state: true
        },
        {
            title: 'Turismo espacial',
            description: 'Embárquese en un viaje increíble al espacio y experimente la ingravidez mientras observa la Tierra desde arriba. Aprenda sobre las últimas tecnologías espaciales y cómo están transformando la exploración del universo.',
            categoryIds: randomList([...listCategories.map(e => e._id)]),
            start: randomDate(),
            end: randomDate(),
            image: `http://161.35.138.32:8001/image/events/Turismoespacial.png`,
            activitieIds: [],
            careerIds: randomList([...listCareers.map(e => e._id)]),
            user: userID,
            guestIds: randomList([...listGuests.map(e => e._id)]),
            studentIds: [],
            modality: 'presencial',
            urlEvent: null,
            stateEvent: 'proximo',
            state: true
        },
        {
            title: 'Aventura de ecoturismo en la selva amazónica',
            description: 'Explore la biodiversidad única de la selva amazónica con un equipo de científicos y expertos en ecoturismo. Descubra nuevas especies y aprenda sobre la importancia de proteger este frágil ecosistema.',
            categoryIds: randomList([...listCategories.map(e => e._id)]),
            start: randomDate(),
            end: randomDate(),
            image: `http://161.35.138.32:8001/image/events/Aventuradeecoturismoenlaselvaamazónica.png`,
            activitieIds: [],
            careerIds: randomList([...listCareers.map(e => e._id)]),
            user: userID,
            guestIds: randomList([...listGuests.map(e => e._id)]),
            studentIds: [],
            modality: 'presencial',
            urlEvent: null,
            stateEvent: 'proximo',
            state: true
        },
        {
            title: 'Visita a la Estación Espacial Internacional',
            description: 'Únase a un equipo de astronautas en una visita a la Estación Espacial Internacional y experimente cómo es vivir en el espacio. Aprenda sobre la investigación que se realiza en la estación y cómo está ayudando a la ciencia a comprender mejor nuestro universo.',
            categoryIds: randomList([...listCategories.map(e => e._id)]),
            start: randomDate(),
            end: randomDate(),
            image: `http://161.35.138.32:8001/image/events/EstaciónEspacialInternacional.png`,
            activitieIds: [],
            careerIds: randomList([...listCareers.map(e => e._id)]),
            user: userID,
            guestIds: randomList([...listGuests.map(e => e._id)]),
            studentIds: [],
            modality: 'presencial',
            urlEvent: null,
            stateEvent: 'proximo',
            state: true
        },
        {
            title: 'Viaje de investigación científica a la Gran Barrera de Coral',
            description: 'Únase a un equipo de biólogos marinos en una expedición de investigación a la Gran Barrera de Coral en Australia. Aprenda sobre los ecosistemas de arrecifes de coral y la importancia de protegerlos frente al cambio climático y la contaminación.',
            categoryIds: randomList([...listCategories.map(e => e._id)]),
            start: randomDate(),
            end: randomDate(),
            image: `http://161.35.138.32:8001/image/events/ViajedeinvestigacióncientíficaalaGranBarreradeCoral.png`,
            activitieIds: [],
            careerIds: randomList([...listCareers.map(e => e._id)]),
            user: userID,
            guestIds: randomList([...listGuests.map(e => e._id)]),
            studentIds: [],
            modality: 'presencial',
            urlEvent: null,
            stateEvent: 'proximo',
            state: true
        },
        //Literatura,Danza,Fotografía
        {
            title: 'Festival de Literatura Internacional',
            description: 'Este festival reúne a autores de todo el mundo para hablar sobre sus obras y experiencias en la industria literaria. Los asistentes pueden disfrutar de paneles, charlas y lecturas de libros en una variedad de géneros.',
            categoryIds: randomList([...listCategories.map(e => e._id)]),
            start: randomDate(),
            end: randomDate(),
            image: `http://161.35.138.32:8001/image/events/FestivaldeLiteraturaInternacional.png`,
            activitieIds: [],
            careerIds: randomList([...listCareers.map(e => e._id)]),
            user: userID,
            guestIds: randomList([...listGuests.map(e => e._id)]),
            studentIds: [],
            modality: 'presencial',
            urlEvent: null,
            stateEvent: 'proximo',
            state: true
        },
        {
            title: 'Espectáculo de danza contemporánea',
            description: 'Un grupo de bailarines y coreógrafos de renombre internacional presentan una serie de actuaciones de danza contemporánea en un teatro local. La fusión de la música, el movimiento y la expresión artística crean una experiencia única e impactante.',
            categoryIds: randomList([...listCategories.map(e => e._id)]),
            start: randomDate(),
            end: randomDate(),
            image: `http://161.35.138.32:8001/image/events/Espectáculodedanzacontemporánea.png`,
            activitieIds: [],
            careerIds: randomList([...listCareers.map(e => e._id)]),
            user: userID,
            guestIds: randomList([...listGuests.map(e => e._id)]),
            studentIds: [],
            modality: 'presencial',
            urlEvent: null,
            stateEvent: 'proximo',
            state: true
        },
        {
            title: 'Exposición de fotografía de paisajes naturales',
            description: 'Esta exposición presenta una colección de fotografías de paisajes naturales capturados por fotógrafos de todo el mundo. Las imágenes exhibidas van desde montañas majestuosas hasta océanos inmensos y bosques exuberantes.',
            categoryIds: randomList([...listCategories.map(e => e._id)]),
            start: randomDate(),
            end: randomDate(),
            image: `http://161.35.138.32:8001/image/events/Exposicióndefotografíadepaisajesnaturales.png`,
            activitieIds: [],
            careerIds: randomList([...listCareers.map(e => e._id)]),
            user: userID,
            guestIds: randomList([...listGuests.map(e => e._id)]),
            studentIds: [],
            modality: 'presencial',
            urlEvent: null,
            stateEvent: 'proximo',
            state: true
        },
        {
            title: 'Feria de libros de fotografía',
            description: 'Los amantes de la fotografía pueden disfrutar de una feria de libros especializada en fotografía de artistas de todo el mundo. Los libros presentados incluyen técnicas de fotografía, historia de la fotografía y colecciones de fotos de una variedad de géneros.',
            categoryIds: randomList([...listCategories.map(e => e._id)]),
            start: randomDate(),
            end: randomDate(),
            image: `http://161.35.138.32:8001/image/events/Feriadelibrosdefotografía.png`,
            activitieIds: [],
            careerIds: randomList([...listCareers.map(e => e._id)]),
            user: userID,
            guestIds: randomList([...listGuests.map(e => e._id)]),
            studentIds: [],
            modality: 'presencial',
            urlEvent: null,
            stateEvent: 'proximo',
            state: true
        },
        {
            title: 'Charla de ciencia sobre la exploración del espacio',
            description: 'Un científico de renombre da una charla sobre los últimos descubrimientos y desarrollos en la exploración espacial. La charla incluirá temas como la colonización de Marte, la búsqueda de vida extraterrestre y los viajes interestelares.',
            categoryIds: randomList([...listCategories.map(e => e._id)]),
            start: randomDate(),
            end: randomDate(),
            image: `http://161.35.138.32:8001/image/events/Charladecienciasobrelaexploracióndelespacio.png`,
            activitieIds: [],
            careerIds: randomList([...listCareers.map(e => e._id)]),
            user: userID,
            guestIds: randomList([...listGuests.map(e => e._id)]),
            studentIds: [],
            modality: 'presencial',
            urlEvent: null,
            stateEvent: 'proximo',
            state: true
        },
        //Espectáculo, Feria e Historia
        {
            title: 'Feria de la Historia',
            description: 'Una feria que combina la diversión de un carnaval con la educación de la historia. Con juegos y atracciones que enseñan sobre diferentes épocas y eventos históricos.',
            categoryIds: randomList([...listCategories.map(e => e._id)]),
            start: randomDate(),
            end: randomDate(),
            image: `http://161.35.138.32:8001/image/events/FeriadelaHistoria.png`,
            activitieIds: [],
            careerIds: randomList([...listCareers.map(e => e._id)]),
            user: userID,
            guestIds: randomList([...listGuests.map(e => e._id)]),
            studentIds: [],
            modality: 'presencial',
            urlEvent: null,
            stateEvent: 'proximo',
            state: true
        },
        {
            title: 'Espectáculo de la Antigüedad',
            description: 'Un espectáculo de teatro y danza que lleva a los espectadores a través del tiempo a la antigüedad. Con trajes y escenarios que recrean el ambiente histórico, este espectáculo es una experiencia única.',
            categoryIds: randomList([...listCategories.map(e => e._id)]),
            start: randomDate(),
            end: randomDate(),
            image: `http://161.35.138.32:8001/image/events/EspectáculodelaAntigüedad.png`,
            activitieIds: [],
            careerIds: randomList([...listCareers.map(e => e._id)]),
            user: userID,
            guestIds: randomList([...listGuests.map(e => e._id)]),
            studentIds: [],
            modality: 'presencial',
            urlEvent: null,
            stateEvent: 'proximo',
            state: true
        },
        {
            title: 'Feria Medieval',
            description: 'Una feria que transporta a los visitantes a la época medieval. Con espectáculos de música y danza, además de tiendas que venden artesanías y comida típicas de la época, esta feria es una forma divertida de aprender sobre la historia.',
            categoryIds: randomList([...listCategories.map(e => e._id)]),
            start: randomDate(),
            end: randomDate(),
            image: `http://161.35.138.32:8001/image/events/FeriaMedieval.png`,
            activitieIds: [],
            careerIds: randomList([...listCareers.map(e => e._id)]),
            user: userID,
            guestIds: randomList([...listGuests.map(e => e._id)]),
            studentIds: [],
            modality: 'presencial',
            urlEvent: null,
            stateEvent: 'proximo',
            state: true
        },
        {
            title: 'Espectáculo de la Revolución',
            description: 'Un espectáculo que cuenta la historia de la Revolución a través de la música y el baile. Con coreografías que recrean los eventos históricos y música que evoca la época, este espectáculo es una forma emocionante de aprender sobre la historia.',
            categoryIds: randomList([...listCategories.map(e => e._id)]),
            start: randomDate(),
            end: randomDate(),
            image: `http://161.35.138.32:8001/image/events/EspectáculodelaRevolución.png`,
            activitieIds: [],
            careerIds: randomList([...listCareers.map(e => e._id)]),
            user: userID,
            guestIds: randomList([...listGuests.map(e => e._id)]),
            studentIds: [],
            modality: 'presencial',
            urlEvent: null,
            stateEvent: 'proximo',
            state: true
        },
        {
            title: 'Feria del Renacimiento',
            description: 'Una feria que celebra el renacimiento, una época de gran creatividad y avances culturales. Con espectáculos de música y teatro que recrean la época, además de actividades como talleres de arte y demos de esgrima, esta feria es una experiencia educativa y divertida para toda la familia.',
            categoryIds: randomList([...listCategories.map(e => e._id)]),
            start: randomDate(),
            end: randomDate(),
            image: `http://161.35.138.32:8001/image/events/FeriadelRenacimiento.png`,
            activitieIds: [],
            careerIds: randomList([...listCareers.map(e => e._id)]),
            user: userID,
            guestIds: randomList([...listGuests.map(e => e._id)]),
            studentIds: [],
            modality: 'presencial',
            urlEvent: null,
            stateEvent: 'proximo',
            state: true
        },
        //deportes
        {
            title: "Torneo universitario de fútbol masculino",
            description: "El torneo universitario de fútbol masculino es un evento deportivo que reúne a los equipos de fútbol de varias universidades de la región. El torneo se llevará a cabo en el campo de fútbol de la universidad local durante una semana en el mes de noviembre. Los equipos competirán en un formato de eliminación directa para determinar al campeón universitario de fútbol masculino.",
            categoryIds: randomList([...listCategories.map(e => e._id)]),
            start: randomDate(),
            end: randomDate(),
            image: `http://161.35.138.32:8001/image/events/Torneouniversitariodefútbolmasculino.png`,
            activitieIds: [],
            careerIds: randomList([...listCareers.map(e => e._id)]),
            user: userID,
            guestIds: randomList([...listGuests.map(e => e._id)]),
            studentIds: [],
            modality: 'presencial',
            urlEvent: null,
            stateEvent: 'proximo',
            state: true
        },
        {
            title: "Torneo universitario de baloncesto femenino",
            description: "El torneo universitario de baloncesto femenino es un evento deportivo que reúne a los equipos de baloncesto femenino de varias universidades de la región. El torneo se llevará a cabo en el gimnasio de la universidad local durante una semana en el mes de marzo. Los equipos competirán en un formato de eliminación directa para determinar a la campeona universitaria de baloncesto femenino.",
            categoryIds: randomList([...listCategories.map(e => e._id)]),
            start: randomDate(),
            end: randomDate(),
            image: `http://161.35.138.32:8001/image/events/Torneouniversitariodebaloncestofemenino.png`,
            activitieIds: [],
            careerIds: randomList([...listCareers.map(e => e._id)]),
            user: userID,
            guestIds: randomList([...listGuests.map(e => e._id)]),
            studentIds: [],
            modality: 'presencial',
            urlEvent: null,
            stateEvent: 'proximo',
            state: true
        },
        {
            title: "Competencia universitaria de natación",
            description: "La competencia universitaria de natación es un evento deportivo que reúne a los nadadores de varias universidades de la región. La competencia se llevará a cabo en la piscina olímpica de la universidad local durante un fin de semana en el mes de abril. Los nadadores competirán en diferentes estilos y distancias para determinar al campeón universitario de natación.",
            categoryIds: randomList([...listCategories.map(e => e._id)]),
            start: randomDate(),
            end: randomDate(),
            image: `http://161.35.138.32:8001/image/events/Competenciauniversitariadenatación.png`,
            activitieIds: [],
            careerIds: randomList([...listCareers.map(e => e._id)]),
            user: userID,
            guestIds: randomList([...listGuests.map(e => e._id)]),
            studentIds: [],
            modality: 'presencial',
            urlEvent: null,
            stateEvent: 'proximo',
            state: true
        },
        {
            title: "Partido de exhibición de voleibol masculino",
            description: "El partido de exhibición de voleibol masculino es un evento deportivo que reúne a los equipos de voleibol masculino de dos universidades locales. El partido se llevará a cabo en el gimnasio de la universidad local en el mes de febrero. Los equipos jugarán un partido de exhibición para promover el deporte y la amistad entre las universidades.",
            categoryIds: randomList([...listCategories.map(e => e._id)]),
            start: randomDate(),
            end: randomDate(),
            image: `http://161.35.138.32:8001/image/events/Partidodeexhibicióndevoleibolmasculino.png`,
            activitieIds: [],
            careerIds: randomList([...listCareers.map(e => e._id)]),
            user: userID,
            guestIds: randomList([...listGuests.map(e => e._id)]),
            studentIds: [],
            modality: 'presencial',
            urlEvent: null,
            stateEvent: 'proximo',
            state: true
        },
        {
            title: "Carrera universitaria de campo traviesa",
            description: "La carrera universitaria de campo traviesa es un evento deportivo que reúne a los corredores de varias universidades de la región. La carrera se llevará a cabo en los senderos del parque cercano a la universidad local durante un fin de semana en el mes de octubre. Los corredores competirán en diferentes categorías para determinar al campeón universitario de campo traviesa.",
            categoryIds: randomList([...listCategories.map(e => e._id)]),
            start: randomDate(),
            end: randomDate(),
            image: `http://161.35.138.32:8001/image/events/Carrerauniversitariadecampotraviesa.png`,
            activitieIds: [],
            careerIds: randomList([...listCareers.map(e => e._id)]),
            user: userID,
            guestIds: randomList([...listGuests.map(e => e._id)]),
            studentIds: [],
            modality: 'presencial',
            urlEvent: null,
            stateEvent: 'proximo',
            state: true
        },
        //emprendimiento
        {
            title: "Startup Weekend",
            description: "Evento de fin de semana para emprendedores, desarrolladores y diseñadores que trabajan juntos en la creación de nuevas empresas y proyectos.",
            categoryIds: randomList([...listCategories.map(e => e._id)]),
            start: randomDate(),
            end: randomDate(),
            image: `http://161.35.138.32:8001/image/events/StartupWeekend.png`,
            activitieIds: [],
            careerIds: randomList([...listCareers.map(e => e._id)]),
            user: userID,
            guestIds: randomList([...listGuests.map(e => e._id)]),
            studentIds: [],
            modality: 'presencial',
            urlEvent: null,
            stateEvent: 'proximo',
            state: true
        },
        {
            title: "Conferencia de Emprendimiento Global",
            description: "Evento anual que reúne a emprendedores, inversores y líderes empresariales de todo el mundo para discutir las últimas tendencias y oportunidades en el mundo del emprendimiento.",
            categoryIds: randomList([...listCategories.map(e => e._id)]),
            start: randomDate(),
            end: randomDate(),
            image: `http://161.35.138.32:8001/image/events/ConferenciadeEmprendimientoGlobal.png`,
            activitieIds: [],
            careerIds: randomList([...listCareers.map(e => e._id)]),
            user: userID,
            guestIds: randomList([...listGuests.map(e => e._id)]),
            studentIds: [],
            modality: 'presencial',
            urlEvent: null,
            stateEvent: 'proximo',
            state: true
        },
        {
            title: "Charla de Emprendimiento Juvenil",
            description: "Evento diseñado para inspirar a los jóvenes a explorar el mundo del emprendimiento y a considerar la posibilidad de convertirse en emprendedores exitosos.",
            categoryIds: randomList([...listCategories.map(e => e._id)]),
            start: randomDate(),
            end: randomDate(),
            image: `http://161.35.138.32:8001/image/events/CharladeEmprendimientoJuvenil.png`,
            activitieIds: [],
            careerIds: randomList([...listCareers.map(e => e._id)]),
            user: userID,
            guestIds: randomList([...listGuests.map(e => e._id)]),
            studentIds: [],
            modality: 'presencial',
            urlEvent: null,
            stateEvent: 'proximo',
            state: true
        },
        {
            title: "Concurso de Emprendimiento Universitario",
            description: "Evento anual que ofrece a los estudiantes universitarios la oportunidad de presentar sus ideas empresariales a un panel de expertos y ganar premios en efectivo para ayudar a financiar sus proyectos.",
            categoryIds: randomList([...listCategories.map(e => e._id)]),
            start: randomDate(),
            end: randomDate(),
            image: `http://161.35.138.32:8001/image/events/ConcursodeEmprendimientoUniversitario.png`,
            activitieIds: [],
            careerIds: randomList([...listCareers.map(e => e._id)]),
            user: userID,
            guestIds: randomList([...listGuests.map(e => e._id)]),
            studentIds: [],
            modality: 'presencial',
            urlEvent: null,
            stateEvent: 'proximo',
            state: true
        },
        {
            title: "Foro de Inversión de Emprendimiento",
            description: "Evento que reúne a emprendedores y a inversores en busca de oportunidades de inversión para discutir y presentar sus ideas empresariales.",
            categoryIds: randomList([...listCategories.map(e => e._id)]),
            start: randomDate(),
            end: randomDate(),
            image: `http://161.35.138.32:8001/image/events/ForodeInversióndeEmprendimiento.png`,
            activitieIds: [],
            careerIds: randomList([...listCareers.map(e => e._id)]),
            user: userID,
            guestIds: randomList([...listGuests.map(e => e._id)]),
            studentIds: [],
            modality: 'presencial',
            urlEvent: null,
            stateEvent: 'proximo',
            state: true
        },
        //Religión,Social,Medio ambiente
        {
            title: 'Conferencia sobre sostenibilidad y religión',
            description: 'Un panel de expertos hablará sobre cómo la religión y la sostenibilidad se relacionan y cómo podemos trabajar juntos para crear un futuro más sostenible.',
            categoryIds: randomList([...listCategories.map(e => e._id)]),
            start: randomDate(),
            end: randomDate(),
            image: `http://161.35.138.32:8001/image/events/portadaeventoConferenciasobresostenibilidadyreligión.png`,
            activitieIds: [],
            careerIds: randomList([...listCareers.map(e => e._id)]),
            user: userID,
            guestIds: randomList([...listGuests.map(e => e._id)]),
            studentIds: [],
            modality: 'presencial',
            urlEvent: null,
            stateEvent: 'proximo',
            state: true
        },
        {
            title: 'Día de limpieza comunitaria',
            description: 'Únete a nosotros para limpiar el parque local y hacer una diferencia en nuestra comunidad.',
            categoryIds: randomList([...listCategories.map(e => e._id)]),
            start: randomDate(),
            end: randomDate(),
            image: `http://161.35.138.32:8001/image/events/portadaeventoDíadelimpiezacomunitaria.png`,
            activitieIds: [],
            careerIds: randomList([...listCareers.map(e => e._id)]),
            user: userID,
            guestIds: randomList([...listGuests.map(e => e._id)]),
            studentIds: [],
            modality: 'presencial',
            urlEvent: null,
            stateEvent: 'proximo',
            state: true
        },
        {
            title: 'Foro de discusión sobre la pobreza',
            description: 'Escucha a líderes de opinión y expertos en el campo de la lucha contra la pobreza mientras discuten las soluciones y los desafíos actuales.',
            categoryIds: randomList([...listCategories.map(e => e._id)]),
            start: randomDate(),
            end: randomDate(),
            image: `http://161.35.138.32:8001/image/events/Forodediscusiónsobrelapobreza.png`,
            activitieIds: [],
            careerIds: randomList([...listCareers.map(e => e._id)]),
            user: userID,
            guestIds: randomList([...listGuests.map(e => e._id)]),
            studentIds: [],
            modality: 'presencial',
            urlEvent: null,
            stateEvent: 'proximo',
            state: true
        },
        {
            title: 'Taller de compostaje',
            description: 'Aprende cómo reducir tu huella de carbono y hacer tu parte para ayudar al medio ambiente mediante el compostaje.',
            categoryIds: randomList([...listCategories.map(e => e._id)]),
            start: randomDate(),
            end: randomDate(),
            image: `http://161.35.138.32:8001/image/events/Tallerdecompostaje.png`,
            activitieIds: [],
            careerIds: randomList([...listCareers.map(e => e._id)]),
            user: userID,
            guestIds: randomList([...listGuests.map(e => e._id)]),
            studentIds: [],
            modality: 'presencial',
            urlEvent: null,
            stateEvent: 'proximo',
            state: true
        },
        {
            title: 'Charla sobre la diversidad cultural',
            description: 'Únete a nosotros para escuchar a personas de diferentes culturas y aprender sobre la importancia de la diversidad en nuestra sociedad.',
            categoryIds: randomList([...listCategories.map(e => e._id)]),
            start: randomDate(),
            end: randomDate(),
            image: `http://161.35.138.32:8001/image/events/Charlasobreladiversidadcultural.png`,
            activitieIds: [],
            careerIds: randomList([...listCareers.map(e => e._id)]),
            user: userID,
            guestIds: randomList([...listGuests.map(e => e._id)]),
            studentIds: [],
            modality: 'presencial',
            urlEvent: null,
            stateEvent: 'proximo',
            state: true
        },
        //Danza,Fotografía,Conferencia,
        {
            title: "Exposición de fotografía",
            description: "Muestra fotográfica que combina elementos de la danza con un enfoque artístico, acompañada por una conferencia del fotógrafo sobre su proceso creativo.",
            categoryIds: randomList([...listCategories.map(e => e._id)]),
            start: randomDate(),
            end: randomDate(),
            image: `http://161.35.138.32:8001/image/events/Exposicióndefotografía.jpeg`,
            activitieIds: [],
            careerIds: randomList([...listCareers.map(e => e._id)]),
            user: userID,
            guestIds: randomList([...listGuests.map(e => e._id)]),
            studentIds: [],
            modality: 'presencial',
            urlEvent: null,
            stateEvent: 'proximo',
            state: true
        },
        {
            title: "Conferencia sobre danza y fotografía",
            description: "Charla impartida por un reconocido fotógrafo y coreógrafo que explora la relación entre estas dos disciplinas artísticas y cómo han evolucionado juntas a lo largo del tiempo.",
            categoryIds: randomList([...listCategories.map(e => e._id)]),
            start: randomDate(),
            end: randomDate(),
            image: `http://161.35.138.32:8001/image/events/Conferenciasobredanzayfotografía.jpg`,
            activitieIds: [],
            careerIds: randomList([...listCareers.map(e => e._id)]),
            user: userID,
            guestIds: randomList([...listGuests.map(e => e._id)]),
            studentIds: [],
            modality: 'presencial',
            urlEvent: null,
            stateEvent: 'proximo',
            state: true
        },
        {
            title: "Taller de fotografía de danza",
            description: "Taller práctico en el que los participantes aprenderán a capturar el movimiento y la expresión de los bailarines a través de la fotografía, impartido por un fotógrafo especializado en danza.",
            categoryIds: randomList([...listCategories.map(e => e._id)]),
            start: randomDate(),
            end: randomDate(),
            image: `http://161.35.138.32:8001/image/events/Tallerdefotografíadedanza.jpeg`,
            activitieIds: [],
            careerIds: randomList([...listCareers.map(e => e._id)]),
            user: userID,
            guestIds: randomList([...listGuests.map(e => e._id)]),
            studentIds: [],
            modality: 'presencial',
            urlEvent: null,
            stateEvent: 'proximo',
            state: true
        },
        {
            title: "Presentación de danza fotográfica",
            description: "Espectáculo en el que la danza y la fotografía se combinan para crear una experiencia visual única que explora la relación entre estas dos disciplinas artísticas.",
            categoryIds: randomList([...listCategories.map(e => e._id)]),
            start: randomDate(),
            end: randomDate(),
            image: `http://161.35.138.32:8001/image/events/Presentacióndedanzafotográfica.jpeg`,
            activitieIds: [],
            careerIds: randomList([...listCareers.map(e => e._id)]),
            user: userID,
            guestIds: randomList([...listGuests.map(e => e._id)]),
            studentIds: [],
            modality: 'presencial',
            urlEvent: null,
            stateEvent: 'proximo',
            state: true
        },
        {
            title: "Conferencia de fotógrafos de danza",
            description: "Conferencia impartida por varios fotógrafos especializados en danza que presentarán su trabajo y discutirán sobre los desafíos y oportunidades que enfrentan al capturar imágenes en este campo de la fotografía.",
            categoryIds: randomList([...listCategories.map(e => e._id)]),
            start: randomDate(),
            end: randomDate(),
            image: `http://161.35.138.32:8001/image/events/Conferenciadefotógrafosdedanza.jpg`,
            activitieIds: [],
            careerIds: randomList([...listCareers.map(e => e._id)]),
            user: userID,
            guestIds: randomList([...listGuests.map(e => e._id)]),
            studentIds: [],
            modality: 'presencial',
            urlEvent: null,
            stateEvent: 'proximo',
            state: true
        },
        //Cine, Educación y Política
        {
            title: 'Cinefórum de educación política',
            description: 'Proyección de documental sobre la educación política en América Latina, seguido de un debate con expertos en el tema.',
            categoryIds: randomList([...listCategories.map(e => e._id)]),
            start: randomDate(),
            end: randomDate(),
            image: `http://161.35.138.32:8001/image/events/Cinefórumdeeducaciónpolítica.jpg`,
            activitieIds: [],
            careerIds: randomList([...listCareers.map(e => e._id)]),
            user: userID,
            guestIds: randomList([...listGuests.map(e => e._id)]),
            studentIds: [],
            modality: 'presencial',
            urlEvent: null,
            stateEvent: 'proximo',
            state: true
        },
        {
            title: 'Encuentro de cineastas políticos',
            description: 'Charlas y proyecciones de películas relacionadas con la política y la educación en el cine.',
            categoryIds: randomList([...listCategories.map(e => e._id)]),
            start: randomDate(),
            end: randomDate(),
            image: `http://161.35.138.32:8001/image/events/Encuentrodecineastaspolíticos.jpg`,
            activitieIds: [],
            careerIds: randomList([...listCareers.map(e => e._id)]),
            user: userID,
            guestIds: randomList([...listGuests.map(e => e._id)]),
            studentIds: [],
            modality: 'presencial',
            urlEvent: null,
            stateEvent: 'proximo',
            state: true
        },
        {
            title: 'Conferencia sobre el papel del cine en la educación política',
            description: 'Expertos en cine y política discuten cómo el cine puede ser utilizado como herramienta para la educación política.',
            categoryIds: randomList([...listCategories.map(e => e._id)]),
            start: randomDate(),
            end: randomDate(),
            image: `http://161.35.138.32:8001/image/events/Conferenciasobreelpapeldelcineenlaeducaciónpolítica.jpg`,
            activitieIds: [],
            careerIds: randomList([...listCareers.map(e => e._id)]),
            user: userID,
            guestIds: randomList([...listGuests.map(e => e._id)]),
            studentIds: [],
            modality: 'presencial',
            urlEvent: null,
            stateEvent: 'proximo',
            state: true
        },
        {
            title: 'Festival de cine político y educativo',
            description: 'Proyecciones de películas relacionadas con la política y la educación, seguidas de mesas redondas y debates con expertos en el tema.',
            categoryIds: randomList([...listCategories.map(e => e._id)]),
            start: randomDate(),
            end: randomDate(),
            image: `http://161.35.138.32:8001/image/events/Festivaldecinepolíticoyeducativo.jpg`,
            activitieIds: [],
            careerIds: randomList([...listCareers.map(e => e._id)]),
            user: userID,
            guestIds: randomList([...listGuests.map(e => e._id)]),
            studentIds: [],
            modality: 'presencial',
            urlEvent: null,
            stateEvent: 'proximo',
            state: true
        },
        {
            title: 'Foro educativo sobre el cine político',
            description: 'Discusión sobre el papel del cine en la educación política, con expertos en cine, política y educación.',
            categoryIds: randomList([...listCategories.map(e => e._id)]),
            start: randomDate(),
            end: randomDate(),
            image: `http://161.35.138.32:8001/image/events/Foroeducativosobreelcinepolítico.png`,
            activitieIds: [],
            careerIds: randomList([...listCareers.map(e => e._id)]),
            user: userID,
            guestIds: randomList([...listGuests.map(e => e._id)]),
            studentIds: [],
            modality: 'presencial',
            urlEvent: null,
            stateEvent: 'proximo',
            state: true
        },
        //Tecnología
        {
            title: "Web Summit",
            description: "La conferencia de tecnología más grande de Europa, en la que se reúnen líderes mundiales de tecnología, emprendedores y expertos en negocios para hablar sobre la última tecnología, la innovación y las tendencias de la industria.",
            categoryIds: randomList([...listCategories.map(e => e._id)]),
            start: randomDate(),
            end: randomDate(),
            image: `http://161.35.138.32:8001/image/events/WebSummit.jpg`,
            activitieIds: [],
            careerIds: randomList([...listCareers.map(e => e._id)]),
            user: userID,
            guestIds: randomList([...listGuests.map(e => e._id)]),
            studentIds: [],
            modality: 'presencial',
            urlEvent: null,
            stateEvent: 'proximo',
            state: true
        },
        {
            title: "CES",
            description: "La feria de tecnología más grande del mundo, en la que se presentan los últimos productos y servicios de tecnología, desde dispositivos electrónicos hasta software de última generación y todo lo demás.",
            categoryIds: randomList([...listCategories.map(e => e._id)]),
            start: randomDate(),
            end: randomDate(),
            image: `http://161.35.138.32:8001/image/events/CES.jpg`,
            activitieIds: [],
            careerIds: randomList([...listCareers.map(e => e._id)]),
            user: userID,
            guestIds: randomList([...listGuests.map(e => e._id)]),
            studentIds: [],
            modality: 'presencial',
            urlEvent: null,
            stateEvent: 'proximo',
            state: true
        },
        {
            title: "Google I/O",
            description: "La conferencia anual de desarrolladores de Google, en la que la compañía presenta las últimas novedades en software, hardware y tecnologías emergentes, y ofrece talleres y charlas para los desarrolladores interesados.",
            categoryIds: randomList([...listCategories.map(e => e._id)]),
            start: randomDate(),
            end: randomDate(),
            image: `http://161.35.138.32:8001/image/events/GoogleI:O.png`,
            activitieIds: [],
            careerIds: randomList([...listCareers.map(e => e._id)]),
            user: userID,
            guestIds: randomList([...listGuests.map(e => e._id)]),
            studentIds: [],
            modality: 'presencial',
            urlEvent: null,
            stateEvent: 'proximo',
            state: true
        },
        {
            title: "WWDC",
            description: "La conferencia anual de desarrolladores de Apple, en la que la compañía presenta sus nuevos productos y servicios, incluyendo actualizaciones de software y hardware, así como avances en su plataforma de desarrollo.",
            categoryIds: randomList([...listCategories.map(e => e._id)]),
            start: randomDate(),
            end: randomDate(),
            image: `http://161.35.138.32:8001/image/events/WWDC.jpg`,
            activitieIds: [],
            careerIds: randomList([...listCareers.map(e => e._id)]),
            user: userID,
            guestIds: randomList([...listGuests.map(e => e._id)]),
            studentIds: [],
            modality: 'presencial',
            urlEvent: null,
            stateEvent: 'proximo',
            state: true
        },
        {
            title: "TechCrunch Disrupt",
            description: "Una conferencia que reúne a emprendedores, inversores y líderes de la industria de la tecnología para compartir ideas y discutir las últimas tendencias en tecnología, startups y negocios.",
            categoryIds: randomList([...listCategories.map(e => e._id)]),
            start: randomDate(),
            end: randomDate(),
            image: `http://161.35.138.32:8001/image/events/TechCrunchDisrupt.png`,
            activitieIds: [],
            careerIds: randomList([...listCareers.map(e => e._id)]),
            user: userID,
            guestIds: randomList([...listGuests.map(e => e._id)]),
            studentIds: [],
            modality: 'presencial',
            urlEvent: null,
            stateEvent: 'proximo',
            state: true
        },
        //Religión, Social, Medio ambiente, Espectáculo, Feria, y Historia
        {
            title: 'Feria religiosa de la comunidad',
            description: 'Feria de artesanías y alimentos con temática religiosa y enfoque en la preservación del medio ambiente.',
            categoryIds: randomList([...listCategories.map(e => e._id)]),
            start: randomDate(),
            end: randomDate(),
            image: `http://161.35.138.32:8001/image/events/Feriareligiosadelacomunidad.jpg`,
            activitieIds: [],
            careerIds: randomList([...listCareers.map(e => e._id)]),
            user: userID,
            guestIds: randomList([...listGuests.map(e => e._id)]),
            studentIds: [],
            modality: 'presencial',
            urlEvent: null,
            stateEvent: 'proximo',
            state: true
        },
        {
            title: 'Exposición sobre la historia religiosa de la ciudad',
            description: 'Exposición que combina la historia religiosa de la ciudad con la preservación del medio ambiente, con elementos espectaculares que atraen a la comunidad y a los visitantes.',
            categoryIds: randomList([...listCategories.map(e => e._id)]),
            start: randomDate(),
            end: randomDate(),
            image: `http://161.35.138.32:8001/image/events/Exposiciónsobrelahistoriareligiosadelaciudad.png`,
            activitieIds: [],
            careerIds: randomList([...listCareers.map(e => e._id)]),
            user: userID,
            guestIds: randomList([...listGuests.map(e => e._id)]),
            studentIds: [],
            modality: 'presencial',
            urlEvent: null,
            stateEvent: 'proximo',
            state: true
        },
        {
            title: 'Concierto benéfico por la justicia social',
            description: 'Concierto que busca recaudar fondos para organizaciones benéficas que luchan por la justicia social y que también promueve prácticas sostenibles y amigables con el medio ambiente.',
            categoryIds: randomList([...listCategories.map(e => e._id)]),
            start: randomDate(),
            end: randomDate(),
            image: `http://161.35.138.32:8001/image/events/conciertobeneficoporlajusticiasocial.png`,
            activitieIds: [],
            careerIds: randomList([...listCareers.map(e => e._id)]),
            user: userID,
            guestIds: randomList([...listGuests.map(e => e._id)]),
            studentIds: [],
            modality: 'presencial',
            urlEvent: null,
            stateEvent: 'proximo',
            state: true
        },
        {
            title: 'Feria de arte y cultura',
            description: 'Feria que celebra la diversidad cultural de la ciudad y que incluye presentaciones de música, danza y teatro, además de exhibiciones de arte, todo en un ambiente social y amigable con el medio ambiente.',
            categoryIds: randomList([...listCategories.map(e => e._id)]),
            start: randomDate(),
            end: randomDate(),
            image: `http://161.35.138.32:8001/image/events/Feriadearteycultura.jpg`,
            activitieIds: [],
            careerIds: randomList([...listCareers.map(e => e._id)]),
            user: userID,
            guestIds: randomList([...listGuests.map(e => e._id)]),
            studentIds: [],
            modality: 'presencial',
            urlEvent: null,
            stateEvent: 'proximo',
            state: true
        },
        {
            title: 'Visita guiada a sitios históricos naturales',
            description: 'Visita guiada que explora la rica historia natural de la ciudad, haciendo hincapié en la importancia de preservar estos sitios y en la conexión entre la historia natural y la historia humana.',
            categoryIds: randomList([...listCategories.map(e => e._id)]),
            start: randomDate(),
            end: randomDate(),
            image: `http://161.35.138.32:8001/image/events/Visitaguiadaasitioshistóricosnaturales.png`,
            activitieIds: [],
            careerIds: randomList([...listCareers.map(e => e._id)]),
            user: userID,
            guestIds: randomList([...listGuests.map(e => e._id)]),
            studentIds: [],
            modality: 'presencial',
            urlEvent: null,
            stateEvent: 'proximo',
            state: true
        }
    ];
    return list;
}
//lista de EXPOSITORES
function guests(userID) {
    let list = [
        {
            first_name: 'John',
            last_name: 'Doe',
            description: 'John Doe es un experto en marketing digital y fundador de una agencia de publicidad con más de 10 años de experiencia en el sector. Ha trabajado con empresas de todos los tamaños para desarrollar estrategias de marketing efectivas y ha ayudado a sus clientes a alcanzar el éxito en línea.',
            specialty: 'Marketing digital',
            image: `http://161.35.138.32:8001/image/guests/JohnDoe.jpg`,
            user: userID,
            state: true,
        },
        {
            first_name: 'Jane',
            last_name: 'Smith',
            description: 'Jane Smith es la CEO de una empresa de tecnología enfocada en inteligencia artificial. Con más de 15 años de experiencia en la industria, es una experta en su campo y ha liderado su empresa hacia el éxito en un mercado cada vez más competitivo.',
            specialty: 'Inteligencia artificial',
            image: `http://161.35.138.32:8001/image/guests/JaneSmith.jpeg`,
            user: userID,
            state: true,
        },
        {
            first_name: 'Bob',
            last_name: 'Johnson',
            description: 'Bob Johnson es un conferencista motivacional y autor de varios libros sobre liderazgo. Su experiencia en el mundo empresarial le ha permitido desarrollar una perspectiva única sobre lo que se necesita para liderar equipos y alcanzar el éxito.',
            specialty: 'Liderazgo',
            image: `http://161.35.138.32:8001/image/guests/BobJhonson.jpg`,
            user: userID,
            state: true,
        },
        {
            first_name: 'Maria',
            last_name: 'Perez',
            description: 'Maria Perez es una científica de datos y líder de equipo en una empresa de análisis de datos. Con más de 8 años de experiencia en el campo de la ciencia de datos, ha trabajado en proyectos para empresas de todo el mundo y ha ayudado a sus clientes a tomar decisiones informadas basadas en datos.',
            specialty: 'Ciencia de datos',
            image: `http://161.35.138.32:8001/image/guests/MariaPerez.jpg`,
            user: userID,
            state: true,
        },
        {
            first_name: 'Carlos',
            last_name: 'Martinez',
            description: 'Carlos Martinez es un emprendedor y fundador de una exitosa startup en el sector de la salud. Su experiencia en el mundo empresarial le ha permitido desarrollar habilidades para liderar equipos y llevar sus ideas desde la concepción hasta la implementación.',
            specialty: 'Emprendimiento',
            image: `http://161.35.138.32:8001/image/guests/CarlosMartinez.jpg`,
            user: userID,
            state: true,
        },
        {
            first_name: 'Susan',
            last_name: 'Wong',
            description: 'Susan Wong es una experta en finanzas y consultora en inversiones internacionales. Con más de 20 años de experiencia en el mundo financiero, ha asesorado a clientes de todo el mundo y ha ayudado a sus clientes a tomar decisiones informadas sobre sus inversiones.',
            specialty: 'Finanzas',
            image: `http://161.35.138.32:8001/image/guests/SusanWong.jpeg`,
            user: userID,
            state: true,
        },
        {
            first_name: 'Mark',
            last_name: 'Davis',
            description: 'Mark Davis es el CEO de una empresa de consultoría en recursos humanos y experto en gestión de talento. Con más de 15 años de experiencia en la industria, ha trabajado con empresas de todos los tamaños para ayudarles a desarrollar sus estrategias de gestión de talento y a encontrar y retener a los mejores empleados.',
            specialty: 'Recursos humanos',
            image: `http://161.35.138.32:8001/image/guests/MarkDavis.jpg`,
            user: userID,
            state: true,
        },
        {
            first_name: 'Laura',
            last_name: 'Garcia',
            description: 'Laura Garcia es una diseñadora de experiencia de usuario y fundadora de una agencia de diseño web. Con más de 10 años de experiencia en el campo del diseño, ha ayudado a sus clientes a crear experiencias en línea únicas y efectivas que mejoran la interacción con sus usuarios.',
            specialty: 'Diseño UX/UI',
            image: `http://161.35.138.32:8001/image/guests/LauraGarcia.jpeg`,
            user: userID,
            state: true,
        }
    ];


    return list;
}
//lista de CATEGORIAS
function categories(userID) {
    let list = [
        {
            title: 'Negocios',
            icon: `http://161.35.138.32:8001/image/icons/briefcase-solid.svg`,
            user: userID,
            state: true
        },
        {
            title: 'Deportes',
            icon: `http://161.35.138.32:8001/image/icons/volleyball-solid.svg`,
            user: userID,
            state: true
        },
        {
            title: 'Música',
            icon: `http://161.35.138.32:8001/image/icons/music-solid.svg`,
            user: userID,
            state: true
        },
        {
            title: 'Arte',
            icon: `http://161.35.138.32:8001/image/icons/palette-solid.svg`,
            user: userID,
            state: true
        },
        {
            title: 'Tecnología',
            icon: `http://161.35.138.32:8001/image/icons/microchip-solid.svg`,
            user: userID,
            state: true
        },
        {
            title: 'Moda',
            icon: `http://161.35.138.32:8001/image/icons/shirt-solid.svg`,
            user: userID,
            state: true
        },
        {
            title: 'Comida',
            icon: `http://161.35.138.32:8001/image/icons/pizza-slice-solid.svg`,
            user: userID,
            state: true
        },
        {
            title: 'Educación',
            icon: `http://161.35.138.32:8001/image/icons/school-solid.svg`,
            user: userID,
            state: true
        },
        {
            title: 'Política',
            icon: `http://161.35.138.32:8001/image/icons/scale-balanced-solid.svg`,
            user: userID,
            state: true
        },
        {
            title: 'Teatro y Cine',
            icon: `http://161.35.138.32:8001/image/icons/masks-theater-solid.svg`,
            user: userID,
            state: true
        },
        {
            title: 'Salud',
            icon: `http://161.35.138.32:8001/image/icons/heart-pulse-solid.svg`,
            user: userID,
            state: true
        },
        {
            title: 'Ciencia',
            icon: `http://161.35.138.32:8001/image/icons/flask-vial-solid.svg`,
            user: userID,
            state: true
        },
        {
            title: 'Viajes',
            icon: `http://161.35.138.32:8001/image/icons/mountain-sun-solid.svg`,
            user: userID,
            state: true
        },
        {
            title: 'Literatura',
            icon: `http://161.35.138.32:8001/image/icons/book-solid.svg`,
            user: userID,
            state: true
        },
        {
            title: 'Danza',
            icon: `http://161.35.138.32:8001/image/icons/dancing-motion-svgrepo-com.svg`,
            user: userID,
            state: true
        },
        {
            title: 'Fotografía',
            icon: `http://161.35.138.32:8001/image/icons/camera-solid.svg`,
            user: userID,
            state: true
        },
        {
            title: 'Conferencia',
            icon: `http://161.35.138.32:8001/image/icons/microphone-solid.svg`,
            user: userID,
            state: true
        },
        {
            title: 'Emprendimiento',
            icon: `http://161.35.138.32:8001/image/icons/lightbulb-solid.svg`,
            user: userID,
            state: true
        },
        {
            title: 'Finanzas',
            icon: `http://161.35.138.32:8001/image/icons/coins-solid.svg`,
            user: userID,
            state: true
        },
        {
            title: 'Medio ambiente',
            icon: `http://161.35.138.32:8001/image/icons/seedling-solid.svg`,
            user: userID,
            state: true
        },
        {
            title: 'Arquitectura',
            icon: `http://161.35.138.32:8001/image/icons/building-regular.svg`,
            user: userID,
            state: true
        },
        {
            title: 'Juegos',
            icon: `http://161.35.138.32:8001/image/icons/gamepad-solid.svg`,
            user: userID,
            state: true
        },
        {
            title: 'Animales',
            icon: `http://161.35.138.32:8001/image/icons/cat-solid.svg`,
            user: userID,
            state: true
        },
    ];
    return list;
}
//lista de CARRERAS
const careers = [
    {

        "state": true,
        "name": "INGENIERÍA DE SISTEMAS",
        "abbreviation": "SIS",
        "campus": "La Paz",
        "faculty": "Ingeniería",
    },
    {
        "state": true,
        "name": "INGENIERÍA DE SISTEMAS",
        "abbreviation": "SIS",
        "campus": "El Alto",
        "faculty": "Ingeniería",
    },
    {
        "state": true,
        "name": "INGENIERÍA DE SISTEMAS",
        "abbreviation": "SIS",
        "campus": "Cochabamba",
        "faculty": "Ingeniería",
    },
    {
        "state": true,
        "name": "INGENIERÍA DE SISTEMAS",
        "abbreviation": "SIS",
        "campus": "Santa Cruz",
        "faculty": "Ingeniería",
    },
    {
        "state": true,
        "name": "INGENIERÍA COMERCIAL",
        "abbreviation": "ICO",
        "campus": "Cochabamba",
        "faculty": "Ciencias Económicas y Empresariales",
    },
    {
        "state": true,
        "name": "INGENIERÍA COMERCIAL",
        "abbreviation": "ICO",
        "campus": "La Paz",
        "faculty": "Ciencias Económicas y Empresariales",
    },
    {
        "state": true,
        "name": "INGENIERÍA COMERCIAL",
        "abbreviation": "ICO",
        "campus": "El Alto",
        "faculty": "Ciencias Económicas y Empresariales",
    },
    {
        "state": true,
        "name": "INGENIERÍA COMERCIAL",
        "abbreviation": "ICO",
        "campus": "Santa Cruz",
        "faculty": "Ciencias Económicas y Empresariales",
    },
    {
        "state": true,
        "name": "INGENIERÍA ECONÓMICA",
        "abbreviation": "IEC",
        "campus": "La Paz",
        "faculty": "Ciencias Económicas y Empresariales",
    },
    {
        "state": true,
        "name": "ADMINISTRACIÓN DE HOTELERÍA Y TURISMO",
        "abbreviation": "AHT",
        "campus": "La Paz",
        "faculty": "Ciencias Económicas y Empresariales",
    },
    {
        "state": true,
        "name": "ADMINISTRACIÓN DE HOTELERÍA Y TURISMO",
        "abbreviation": "AHT",
        "campus": "El Alto",
        "faculty": "Ciencias Económicas y Empresariales",
    },
    {
        "state": true,
        "name": "ADMINISTRACIÓN DE HOTELERÍA Y TURISMO",
        "abbreviation": "AHT",
        "campus": "Santa Cruz",
        "faculty": "Ciencias Económicas y Empresariales",
    },
    {
        "state": true,
        "name": "INGENIERÍA ECONÓMICA Y FINANCIERA",
        "abbreviation": "IEF",
        "campus": "Cochabamba",
        "faculty": "Ciencias Económicas y Empresariales",
    },
    {
        "state": true,
        "name": "CONTADURÍA PÚBLICA",
        "abbreviation": "CPU",
        "campus": "La Paz",
        "faculty": "Ciencias Económicas y Empresariales",
    },
    {
        "state": true,
        "name": "CONTADURÍA PÚBLICA",
        "abbreviation": "CPU",
        "campus": "El Alto",
        "faculty": "Ciencias Económicas y Empresariales",
    },
    {
        "state": true,
        "name": "CONTADURÍA PÚBLICA",
        "abbreviation": "CPU",
        "campus": "Santa Cruz",
        "faculty": "Ciencias Económicas y Empresariales",
    },
    {
        "state": true,
        "name": "ADMINISTRACIÓN DE EMPRESAS",
        "abbreviation": "ADM",
        "campus": "La Paz",
        "faculty": "Ciencias Económicas y Empresariales",
    },
    {
        "state": true,
        "name": "ADMINISTRACIÓN DE EMPRESAS",
        "abbreviation": "ADM",
        "campus": "El Alto",
        "faculty": "Ciencias Económicas y Empresariales",
    },
    {
        "state": true,
        "name": "ADMINISTRACIÓN DE EMPRESAS",
        "abbreviation": "ADM",
        "campus": "Cochabamba",
        "faculty": "Ciencias Económicas y Empresariales",
    },
    {
        "state": true,
        "name": "ADMINISTRACIÓN DE EMPRESAS",
        "abbreviation": "ADM",
        "campus": "Santa Cruz",
        "faculty": "Ciencias Económicas y Empresariales",
    },
    {
        "state": true,
        "name": "ENFERMERÍA",
        "abbreviation": "ENF",
        "campus": "Santa Cruz",
        "faculty": "Ciencas de la Salud",
    },
    {
        "state": true,
        "name": "ENFERMERÍA",
        "abbreviation": "ENF",
        "campus": "El Alto",
        "faculty": "Ciencas de la Salud",
    },
    {
        "state": true,
        "name": "BIOQUÍMICA Y FARMACIA",
        "abbreviation": "BYF",
        "campus": "El Alto",
        "faculty": "Ciencas de la Salud",
    },
    {
        "state": true,
        "name": "BIOQUÍMICA Y FARMACIA",
        "abbreviation": "BYF",
        "campus": "La Paz",
        "faculty": "Ciencas de la Salud",
    },
    {
        "state": true,
        "name": "BIOQUÍMICA Y FARMACIA",
        "abbreviation": "BYF",
        "campus": "Cochabamba",
        "faculty": "Ciencas de la Salud",
    },
    {
        "state": true,
        "name": "BIOQUÍMICA Y FARMACIA",
        "abbreviation": "BYF",
        "campus": "Santa Cruz",
        "faculty": "Ciencas de la Salud",
    },
    {
        "state": true,
        "name": "ODONTOLOGÍA",
        "abbreviation": "ODO",
        "campus": "El Alto",
        "faculty": "Ciencas de la Salud",
    },
    {
        "state": true,
        "name": "ODONTOLOGÍA",
        "abbreviation": "ODO",
        "campus": "La Paz",
        "faculty": "Ciencas de la Salud",
    },
    {
        "state": true,
        "name": "ODONTOLOGÍA",
        "abbreviation": "ODO",
        "campus": "Cochabamba",
        "faculty": "Ciencas de la Salud",
    },
    {
        "state": true,
        "name": "ODONTOLOGÍA",
        "abbreviation": "ODO",
        "campus": "Santa Cruz",
        "faculty": "Ciencas de la Salud",
    },
    {
        "state": true,
        "name": "MEDICINA",
        "abbreviation": "MED",
        "campus": "El Alto",
        "faculty": "Ciencas de la Salud",
    },
    {
        "state": true,
        "name": "MEDICINA",
        "abbreviation": "MED",
        "campus": "La Paz",
        "faculty": "Ciencas de la Salud",
    },
    {
        "state": true,
        "name": "MEDICINA",
        "abbreviation": "MED",
        "campus": "Cochabamba",
        "faculty": "Ciencas de la Salud",
    },
    {
        "state": true,
        "name": "MEDICINA",
        "abbreviation": "MED",
        "campus": "Santa Cruz",
        "faculty": "Ciencas de la Salud",
    },
    {
        "state": true,
        "name": "DERECHO",
        "abbreviation": "DER",
        "campus": "El Alto",
        "faculty": "Ciencias Jurídicas y Sociales",
    },
    {
        "state": true,
        "name": "DERECHO",
        "abbreviation": "DER",
        "campus": "La Paz",
        "faculty": "Ciencias Jurídicas y Sociales",
    },
    {
        "state": true,
        "name": "DERECHO",
        "abbreviation": "DER",
        "campus": "Cochabamba",
        "faculty": "Ciencias Jurídicas y Sociales",
    },
    {
        "state": true,
        "name": "DERECHO",
        "abbreviation": "DER",
        "campus": "Santa Cruz",
        "faculty": "Ciencias Jurídicas y Sociales",
    },
    {
        "state": true,
        "name": "PERIODISMO",
        "abbreviation": "PER",
        "campus": "La Paz",
        "faculty": "Ciencias Jurídicas y Sociales",
    },
    {
        "state": true,
        "name": "PERIODISMO",
        "abbreviation": "PER",
        "campus": "Santa Cruz",
        "faculty": "Ciencias Jurídicas y Sociales",
    },
    {
        "state": true,
        "name": "PSICOLOGÍA",
        "abbreviation": "PSI",
        "campus": "El Alto",
        "faculty": "Ciencias Jurídicas y Sociales",
    },
    {
        "state": true,
        "name": "PSICOLOGÍA",
        "abbreviation": "PSI",
        "campus": "La Paz",
        "faculty": "Ciencias Jurídicas y Sociales",
    },
    {
        "state": true,
        "name": "PSICOLOGÍA",
        "abbreviation": "PSI",
        "campus": "Cochabamba",
        "faculty": "Ciencias Jurídicas y Sociales",
    },
    {
        "state": true,
        "name": "PSICOLOGÍA",
        "abbreviation": "PSI",
        "campus": "Santa Cruz",
        "faculty": "Ciencias Jurídicas y Sociales",
    },
    {
        "state": true,
        "name": "ARQUITECTURA",
        "abbreviation": "ARQ",
        "campus": "Santa Cruz",
        "faculty": "Diseño y Tecnologías Crossmedia",
    },
    {
        "state": true,
        "name": "DISEÑO GRÁFICO Y PRODUCCIÓN CROSSMEDIA",
        "abbreviation": "DGP",
        "campus": "El Alto",
        "faculty": "Diseño y Tecnologías Crossmedia",
    },
    {
        "state": true,
        "name": "DISEÑO GRÁFICO Y PRODUCCIÓN CROSSMEDIA",
        "abbreviation": "DGP",
        "campus": "La Paz",
        "faculty": "Diseño y Tecnologías Crossmedia",
    },
    {
        "state": true,
        "name": "DISEÑO GRÁFICO Y PRODUCCIÓN CROSSMEDIA",
        "abbreviation": "DGP",
        "campus": "Cochabamba",
        "faculty": "Diseño y Tecnologías Crossmedia",
    },
    {
        "state": true,
        "name": "DISEÑO GRÁFICO Y PRODUCCIÓN CROSSMEDIA",
        "abbreviation": "DGP",
        "campus": "Santa Cruz",
        "faculty": "Diseño y Tecnologías Crossmedia",
    },
    {
        "state": true,
        "name": "PUBLICIDAD Y MARKETING",
        "abbreviation": "PYM",
        "campus": "La Paz",
        "faculty": "Diseño y Tecnologías Crossmedia",
    },
    {
        "state": true,
        "name": "PUBLICIDAD Y MARKETING",
        "abbreviation": "PYM",
        "campus": "Cochabamba",
        "faculty": "Diseño y Tecnologías Crossmedia",
    },
    {
        "state": true,
        "name": "PUBLICIDAD Y MARKETING",
        "abbreviation": "PYM",
        "campus": "Santa Cruz",
        "faculty": "Diseño y Tecnologías Crossmedia",
    }
];
//lista de PERMISOS
const permisions = [
    //CATEGORIAS
    {
        name: 'Ver categorias',
        category: 'Categorias',
        state: true,
    },
    {
        name: 'Crear categorias',
        category: 'Categorias',
        state: true,
    },
    {
        name: 'Editar categorias',
        category: 'Categorias',
        state: true,
    },
    {
        name: 'Eliminar categorias',
        category: 'Categorias',
        state: true,
    },
    //EXPOSITORES
    {
        name: 'Ver expositores',
        category: 'Expositores',
        state: true,
    },
    {
        name: 'Crear expositores',
        category: 'Expositores',
        state: true,
    },
    {
        name: 'Editar expositores',
        category: 'Expositores',
        state: true,
    },
    {
        name: 'Eliminar expositores',
        category: 'Expositores',
        state: true,
    },
    //EVENTOS
    {
        name: 'Ver eventos',
        category: 'Eventos',
        state: true,
    },
    {
        name: 'Crear eventos',
        category: 'Eventos',
        state: true,
    },
    {
        name: 'Ver reportes de eventos',
        category: 'Eventos',
        state: true,
    },
    {
        name: 'Editar eventos',
        category: 'Eventos',
        state: true,
    },
    {
        name: 'Eliminar eventos',
        category: 'Eventos',
        state: true,
    },
    //USUARIOS
    {
        name: 'Ver usuarios',
        category: 'Usuarios',
        state: true,
    },
    {
        name: 'Crear usuarios',
        category: 'Usuarios',
        state: true,
    },
    {
        name: 'Editar usuarios',
        category: 'Usuarios',
        state: true,
    },
    {
        name: 'Eliminar usuarios',
        category: 'Usuarios',
        state: true,
    },
    //TIPOS DE USUARIO
    {
        name: 'Ver tipos de usuario',
        category: 'Tipos de usuario',
        state: true,
    },
    {
        name: 'Crear tipos de usuario',
        category: 'Tipos de usuario',
        state: true,
    },
    {
        name: 'Editar tipos de usuario',
        category: 'Tipos de usuario',
        state: true,
    },
    {
        name: 'Eliminar tipos de usuario',
        category: 'Tipos de usuario',
        state: true,
    },
    //ROLES
    {
        name: 'Ver roles',
        category: 'Roles',
        state: true,
    },
    {
        name: 'Crear roles',
        category: 'Roles',
        state: true,
    },
    {
        name: 'Editar roles',
        category: 'Roles',
        state: true,
    },
    {
        name: 'Eliminar roles',
        category: 'Roles',
        state: true,
    },
    //PERMISOS
    {
        name: 'Ver permisos',
        category: 'Permisos',
        state: true,
    },
    //REPORTES
    {
        name: 'Ver reportes',
        category: 'Reportes',
        state: true,
    },
    //ESTUDIANTES
    {
        name: 'Ver estudiantes',
        category: 'Estudiantes',
        state: true,
    },
    {
        name: 'Agregar estudiantes',
        category: 'Estudiantes',
        state: true,
    },
    // {
    //     name: 'Ver estudiantes',
    //     category: 'Estudiantes',
    //     state: true,
    // },

];