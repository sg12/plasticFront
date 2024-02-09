import './About_operation.scss';
import NOT_FOUND from "../../assets/imgs/not-found.png";


const data = [
    {
        name: 'ФРОНТОПЛАСТИКА',
        face: 'Лоб',
        text:
            'Фронтопластика — комплекс методов пластической хирургии, направленных на изменение формы и устранение косметических дефектов в области лба и надбровных дуг. Операция позволяет исправить асимметрию, увеличить проекцию лобных бугров, уменьшить высокий лоб.',
        button1: "Подтяжка бровей и лба",
        button2: "Устранение птоза мягких тканей",
        button3: "Лифтинг лба и височной области",
        hint1: 'Перемещение линии брови и/или мягких тканей лба и их фиксация в более высоком положении',
        hint2: 'Разрез в волосистой части голов, натяжение происходит именно за счёт мышц, а не кожи',
        hint3: 'разрез в линии роста волос, отслаивание кожно-жировой прослойки, натяжение и фиксация тканей скуловой и височной зон',
    },
    {
        name: 'БЛЕФАРПЛАСТИКА',
        face: 'Глаза',
        text:
            "Блефаропластика или пластика век — это операция, которая помогает восстановить красоту и молодость век, изменить форму глаз. Целью этого вида вмешательства является устранение нависающей кожи, а при необходимости можно приподнять угол глаза.",
        button1: "Первая кнопка",
        button2: "Вторая кнопка",
        button3: "Третья кнопка",
    },
    {
        name: 'РИНОПЛАСТИКА',
        face: 'Нос',
        text:
            "Ринопластика – это специальная хирургическая операция, которая совершается для исправления врожденных или приобретенных дефектов носа, а также тотального наращивания недостающих участков носа. Операция ринопластика заключается в том, что хирург изменяет параметры носа, путем вторжения в костно-хрящевой каркас носа.",
        button1: "Первая кнопка",
        button2: "Вторая кнопка",
        button3: "Третья кнопка",
    },
    {
        name: 'ХЕЙЛОПЛАСТИКА',
        face: 'Губы',
        text:
            "Хейлопластика —хирургическая операция, в ходе которой восстанавливаются эстетические параметры верхней и нижней губы, изменяются их контуры, объем и размеры, устраняются деформации.",
        button1: "Первая кнопка",
        button2: "Вторая кнопка",
        button3: "Третья кнопка",
    },
    {
        name: 'МАЛЯРПЛАСТИКА',
        face: 'Скулы',
        text:
            "Малярпластика – это пластическая операция на скулах, направленная на изменение их формы, размера, коррекции врожденных или приобретенных дефектов.",
        button1: "Первая кнопка",
        button2: "Вторая кнопка",
        button3: "Третья кнопка",
    },
    // {
    //     name: 'ОТОПЛАСТИКА',
    //     face: 'Уши',
    //     text:
    //         "Отопластика—этохирургическая процедура, направленная на коррекцию формы, размера и положения ушей. Целью этой операции часто является устранение так называемой «лопоухости», когда уши слишком отстоят от головы или имеют необычную форму.",
    //     button1: "Первая кнопка",
    //     button2: "Вторая кнопка",  
    //     button3: "Третья кнопка",
    // },           
];
const Not_face = () => {
    return (
        <div className='dev2'>
            <div className='about-operation__parents2'>
                <div className='about-operation__head2'>Выберите область на лице</div>
                <img className='about-operation__not_face_img' src={NOT_FOUND}></img>
            </div>
        </div>
    )
}

const Click_on_window = (event) => {
    const clickedElement = event.target;
    if (clickedElement.tagName === 'svg' || clickedElement.classList.contains('svg-line-path')) {
        document.querySelectorAll('.dev').forEach(element => {
            element.style.display = 'none';
        });
        document.querySelectorAll('.about-operation__parents').forEach(element => {
            element.style.display = 'block';
        });
    }
    else {
        document.querySelectorAll('.about-operation__parents').forEach(element => {
            element.style.display = 'none';
        });
        document.querySelectorAll('.dev').forEach(element => {
            element.style.display = 'block';
        });
    }
}

document.addEventListener('click', Click_on_window);

const About_operation = ({ activeLine}) => {
    if (activeLine) {
        let id;
        if (activeLine == 'forehead') {
            id = 0;
        }
        else if (activeLine == 'eyes') {
            id = 1;
        }
        else if (activeLine == 'nose') {
            id = 2;
        }
        else if (activeLine == 'lips') {
            id = 3;
        }
        else if (activeLine == 'cheekbones') {
            id = 4;
        }
        else if (activeLine == 'ears') {
            id = 5;
        }
        if (data[id] == null) {
            console.log('Таких данных нет')
            return (
                <>
                    <Not_face />
                </>
            )
        }
        return (
            <>
                {/* <div className='dev'>
                    <div className='about-operation__parents2'>
                        <div className='about-operation__head2'>Выберите область на лице</div>
                        <img className='about-operation__not_face_img' src={NOT_FOUND}></img>
                    </div>
                </div> */}
                <div className='about-operation__parents'>
                    <div className='about-operation__header'>
                        <div className='about-operation__head'>
                            {data[id].name}
                        </div>
                        <div className='about-operation__face'>
                            {data[id].face}
                        </div>

                    </div>
                    <p className='about-operation__text'>
                        {data[id].text}
                    </p>
                    <p className='about-operation__text2'>УСЛУГИ ПО ВЫБРАННОЙ ОБЛАСТИ</p>
                    <div className='about-operation__parents-buttons'>
                        <button className='about-operation__button'>{data[id].button1}</button>
                        {/* <img  className='about-operation__hint' src={HINT}>Подсказка 1</img> */}
                        <button className='about-operation__button'>{data[id].button2}</button>
                        {/* <img src={HINT} className='about-operation__hint'>Подсказка 2</img> */}
                        <button className='about-operation__button'>{data[id].button3}</button>
                        {/* <img src={HINT} className='about-operation__hint'>Подсказка 3</img> */}
                    </div>
                </div>
                
            </>
        );
    }
    else {
        return (
            <>
                <Not_face />
            </>
        );
    }

};

export default About_operation;