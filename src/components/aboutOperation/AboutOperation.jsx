import './AboutOperation.scss';

import question from "../../assets/imgs/question.png";
import plug_image from "../../assets/imgs/plug_image.png";
import OutlineButton from '../UI/buttons/outlineButton/OutlineButton';


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
		button1: "Изменение формы и разреза глаз",
		button2: "Устранение нависания века",
		button3: 'Устранение "мешков" под глазами',
	},
	{
		name: 'РИНОПЛАСТИКА',
		face: 'Нос',
		text:
			"Ринопластика – это специальная хирургическая операция, которая совершается для исправления врожденных или приобретенных дефектов носа, а также тотального наращивания недостающих участков носа. Операция ринопластика заключается в том, что хирург изменяет параметры носа, путем вторжения в костно-хрящевой каркас носа.",
		button1: "Коррекция формы носа",
		button2: "Удаление горбинки",
		button3: "Выравнивание перегородки",
	},
	{
		name: 'ХЕЙЛОПЛАСТИКА',
		face: 'Губы',
		text:
			"Хейлопластика —хирургическая операция, в ходе которой восстанавливаются эстетические параметры верхней и нижней губы, изменяются их контуры, объем и размеры, устраняются деформации.",
		button1: "Коррекция объема и формы губ",
		button2: "Приподнятие уголков губ",
		button3: "Омоложение области рта",
	},
	{
		name: 'МАЛЯРПЛАСТИКА',
		face: 'Скулы',
		text:
			"Малярпластика – это пластическая операция на скулах, направленная на изменение их формы, размера, коррекции врожденных или приобретенных дефектов.",
		button1: "Коррекция внешнего вида скул",
		button2: "Реконструктивная пластика скул",
		button3: "Коррекция асимметрии скул",
	},
	{
		name: 'ОТОПЛАСТИКА',
		face: 'Уши',
		text:
			"Отопластика—этохирургическая процедура, направленная на коррекцию формы, размера и положения ушей. Целью этой операции часто является устранение так называемой «лопоухости», когда уши слишком отстоят от головы или имеют необычную форму.",
		button1: "Коррекция лопоухости",
		button2: "Коррекция формы мочки уха",
		button3: "Изменение формы ушей",
	},
	{
		name: 'МЕНТОПЛАСТИКА',
		face: 'Подбородок',
		text:
			"Ментопластика — это пластическая операция, целью которой является устранению дефектов подбородка. Пластика подбородка может быть направлена либо на уменьшение чересчур выступающего подбородка, либо на его увеличение, а также на изменение его контура.",
		button1: "Уменьшение подбородка",
		button2: "Увеличение подбородка",
		button3: "Коррекция формы подбородка",
	},

];
const Not_face = () => {
	return (
		<div className='plug__parents'>
			<div className='plug__head'>ИНТЕРАКТИВНАЯ МОДЕЛЬ</div>
			<div className='plug__text'>Не теряйте время на поиск - просто кликните и получите все, что вам нужно!</div>
			<div className='plug__button1'>Кликните на любую активную часть модели, и вы сразу увидите все доступные услуги, связанные с этой областью.</div>
			<div className='plug__button2'>
				Используйте инструкцию
				<img src={question}></img>
			</div>
			<img className='plug__image' src={plug_image}></img>
		</div>
	)
}

// const Click_on_window = (event) => {
// 	const clickedElement = event.target;
// 	if (clickedElement.tagName === 'svg' || clickedElement.classList.contains('svg-line-path')) {
// 		document.querySelectorAll('.about-operation__parents').forEach(element => {
// 			element.style.display = 'block';
// 		});
// 	}
// 	else {
// 		document.querySelectorAll('.about-operation__parents').forEach(element => {
// 			element.style.display = 'none';
// 		});
// 	}
// }

// document.addEventListener('click', Click_on_window);

const About_operation = ({ activeLine }) => {
	console.log('activeLine',activeLine);
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
		else if (activeLine == 'chin') {
			id = 6;
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
						<OutlineButton className='about-operation__button'>{data[id].button1}</OutlineButton>
						<OutlineButton className='about-operation__button'>{data[id].button2}</OutlineButton>
						<OutlineButton className='about-operation__button'>{data[id].button3}</OutlineButton>
						{/* <button className='about-operation__button'>{data[id].button2}</button>
						<button className='about-operation__button'>{data[id].button3}</button> */}
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