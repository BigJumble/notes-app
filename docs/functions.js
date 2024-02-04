function setCanvasSize()
{
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	// cameraState.x = canvas.width/2;
	// cameraState.y = canvas.height/2;

	drawGrid();
}

function drawGrid()
{
	const cellSize = cameraState.zoom * tileSize;
	// console.log(myColors)
	ctx.fillStyle = myColors.bc;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = myColors.fc;

	const rows = Math.ceil(canvas.height / cellSize) + 1;
	const cols = Math.ceil(canvas.width / cellSize) + 1;

	const dotSize = Math.max(0.9, Math.min(2, cameraState.zoom * 2));

	for (var row = -1; row < rows; row++) {
		for (var col = -1; col < cols; col++) {

			var x = col * cellSize + cameraState.x % cellSize;
			var y = row * cellSize + cameraState.y % cellSize;

			ctx.beginPath();
			ctx.fillRect(x, y, dotSize, dotSize);
			ctx.fill();
		}
	}
}
isDragging = false;
function handleScroll(event)
{
	if (!isDragging) {
		expectedCameraState.zoom += event.deltaY > 0 ? -0.1 : 0.1;
		expectedCameraState.zoom = Math.max(0.3, Math.min(1, expectedCameraState.zoom));
		update();
	}
}

function mousePosition(event)
{
	cursorPosition = {
		x: event.clientX,
		y: event.clientY,
	};
}

function startDrag(e)
{
	if (e.which !== 1) return;
	let startX = e.clientX - cameraState.x;
	let startY = e.clientY - cameraState.y;
	isDragging = true;
	settings.style.display = "none";
	settings2.style.display = "none";

	function dragMove(e2)
	{
		e2.preventDefault();
		let currentX = e2.clientX;
		let currentY = e2.clientY;
		expectedCameraState.x = currentX - startX;
		expectedCameraState.y = currentY - startY;

		update();
	}

	function endDrag(e3)
	{
		e3.preventDefault();
		isDragging = false;
		document.removeEventListener('mousemove', dragMove);
		document.removeEventListener('mouseup', endDrag);
	}

	document.addEventListener('mousemove', dragMove);
	document.addEventListener('mouseup', endDrag);
}
function LoadElements()
{
	const cam = localStorage.getItem("camera");
	if (cam !== null) {
		expectedCameraState = JSON.parse(cam);
		cameraState = JSON.parse(cam);
	}


	const colors = localStorage.getItem("colors");

	if (colors !== null) {
		const cols = JSON.parse(colors);
		colorPicker.value = cols.fc;
		colorPicker2.value = cols.bc;
		colorPicker3.value = cols.tc;
		colorPicker4.value = cols.fc;
		colorPicker5.value = cols.bc;
		colorPicker6.value = cols.tc;
		myColors = cols;
		myColorsFloat = { fc: rgbaToFloat(hexToRgba(myColors.fc)), bc: rgbaToFloat(hexToRgba(myColors.bc)), tc: rgbaToFloat(hexToRgba(myColors.tc)) };
		myColors2 = {...myColors};
		myColorsFloat2  = {...myColorsFloat};
		colorPallet = {...myColors};
		drawGrid();
		themeUpdate();
	}

	elementCount = localStorage.getItem("elementCount");
	if (elementCount === null) {
		elementCount = 0;
		localStorage.setItem("elementCount", 0);
	}
	else {
		elementCount = (Number)(elementCount);
	}

	for (let i = 0; i < elementCount; i++) {
		let retrievedValue = localStorage.getItem(`item-${i}`);
		if (retrievedValue !== null) {

			const data = JSON.parse(retrievedValue);
			_noteGeneration(i, data);
		}
	}


	RedrawElements();

}

function RedrawElements()
{
	themeUpdate();
	for (let i = 0; i < allElements.length; i++) {
		const el = allElements[i];
		repositionElement(el);
		resizeElement(el);
		themeElement(el);

		// textTheme();
	}
}
function themeUpdate()
{
	const rgbBc = hexToRgba(myColors.bc);
	const rgbFc = hexToRgba(myColors.fc);

	themeColor.content = myColors.bc;
	theme2Color.content = myColors.bc;

	styleSheet.cssRules[0].style.color = myColors.tc;

	styleSheet.cssRules[2].style.backgroundColor = `rgb(${rgbBc.r},${rgbBc.g},${rgbBc.b},0.3)`;
	styleSheet.cssRules[2].style.borderColor = myColors.fc;
	styleSheet.cssRules[2].style.boxShadow = `0px 0px 20px -5px ${myColors.fc}`;

	styleSheet.cssRules[3].style.borderColor = myColors.fc;

	styleSheet.cssRules[4].style.backgroundColor = `rgb(${rgbFc.r},${rgbFc.g},${rgbFc.b},0.3)`;


	menuThemeUpdate()
	
}
let colorPallet = true;
function menuThemeUpdate()
{
	const col = colorPallet?myColors:myColors2;
	styleSheet.cssRules[5].style.backgroundColor = col.bc;
	styleSheet.cssRules[5].style.borderColor = col.fc;
	styleSheet.cssRules[5].style.boxShadow = `0px -5px 20px -10px ${col.fc}`;

	styleSheet.cssRules[6].style.backgroundColor = col.bc;
	styleSheet.cssRules[6].style.borderColor = col.fc;
	styleSheet.cssRules[6].style.boxShadow = `0px -5px 20px -10px ${col.fc}`;

	styleSheet.cssRules[8].style.color = col.tc;
}

function repositionElement(el)
{
	const dotSize = Math.max(0.9, Math.min(2, cameraState.zoom * 2)) / 2;

	const newX = cameraState.x + dotSize + (Number)(el.dataset.posX) * cameraState.zoom - 4 * cameraState.zoom; // - 4 to compensate for border
	const newY = cameraState.y + dotSize + (Number)(el.dataset.posY) * cameraState.zoom - 4 * cameraState.zoom;

	el.style.transform = `translate(${newX}px, ${newY}px)`;

	el.style.transform += ` scale(${cameraState.zoom})`;
}

function resizeElement(el)
{
	el.style.width = `${el.dataset.sizeX * tileSize}px`;
	el.style.height = `${el.dataset.sizeY * tileSize}px`;

}

function themeElement(el)
{
	if (!!el.dataset.colors) {
		const colors = JSON.parse(el.dataset.colors);
		el.style.backgroundColor = colors.bc;
		el.style.borderColor = colors.fc;
		el.style.boxShadow = `0px 0px 20px -5px ${colors.fc}`;
		el.firstChild.style.color = colors.tc;

	}
	else {
		el.style.backgroundColor = myColors.bc;
		el.style.borderColor = myColors.fc;
		el.style.boxShadow = `0px 0px 20px -5px ${myColors.fc}`;
	}
}

function popMenu(e)
{
	e.preventDefault();

	if (e.which === 3) {
		if (e.target === menu) return;
		let toHide = settings.getElementsByClassName("clr-field");
		for(let i =0;i<toHide.length;i++)
		{
			toHide[i].style.display = "block"
		}
		menu.style.display = "grid";
		menu.style.left = `${e.clientX}px`;
		menu.style.top = `${e.clientY}px`;
		menu.dataset.posX = e.clientX;
		menu.dataset.posY = e.clientY;
	}
}
function offMenu(e)
{
	// e.preventDefault();
	if (!menu.contains(e.target)) {
		menu.style.display = "none";
		return;
	}
}

function makeNote()
{
	const posX = Math.floor((-cameraState.x + (Number)(menu.dataset.posX)) / cameraState.zoom / tileSize) * tileSize;
	const posY = Math.floor((-cameraState.y + (Number)(menu.dataset.posY)) / cameraState.zoom / tileSize) * tileSize;

	const init = { posX: posX, posY: posY, sizeX: 5, sizeY: 3, text: "Hello, write something!" };

	localStorage.setItem('item-' + elementCount, JSON.stringify(init));
	_noteGeneration(elementCount, init);
	elementCount++;
	localStorage.setItem("elementCount", elementCount);

	RedrawElements();
	menu.style.display = "none";

}
let forceSettingOpen = false;
let lastOpen = null;
function _noteGeneration(id, { posX, posY, sizeX, sizeY, text, colors = null })
{

	let newDiv = document.createElement('div');
	let txt = document.createElement('textarea');

	newDiv.id = 'item-' + id;
	newDiv.className = 'container';
	newDiv.dataset.posX = posX;
	newDiv.dataset.posY = posY;
	newDiv.dataset.sizeX = sizeX;
	newDiv.dataset.sizeY = sizeY;
	newDiv.draggable = false;
	if(!!colors) newDiv.dataset.colors = JSON.stringify(colors);

	newDiv.addEventListener("mouseenter", (e) =>
	{
		if(lastOpen!== e.target)
		{
			Coloris.close();
			lastOpen = e.target;
		}

		// console.log(e.target)
		if (forceSettingOpen) return;
		if (updatingCol2) return;
		if (isDragging) return;
		e.target.style.zIndex = 101;
		e.target.appendChild(settings);
		settings.style.display = "grid";
		settings.style.transform = `translate(${-4}px, ${(-((Number)(e.target.dataset.sizeY)+2) * tileSize-7)}px)`;
		settings.dataset.currentId = e.target.id;

		e.target.appendChild(settings2);
		settings2.style.display = "grid";
		settings2.style.transform = `translate(${(((Number)(e.target.dataset.sizeX)) * tileSize)+6}px, ${2}px)`;
		settings2.dataset.currentId = e.target.id;

		// styleSheet.cssRules[7].style.display = "none";

		let toHide = settings.getElementsByClassName("clr-field");
		for(let i =0;i<toHide.length;i++)
		{
			toHide[i].style.display = "none"
		}

		let el = document.getElementsByClassName("c1");
		for (let i = 0; i < el.length; i++) {
			el[i].style.display = "block";
		}

		if(!!e.target.dataset.colors)
		{
			const colors = JSON.parse(e.target.dataset.colors);
			myColors2 = { ...colors };
			myColorsFloat2 = { fc: rgbaToFloat(hexToRgba(myColors2.fc)), bc: rgbaToFloat(hexToRgba(myColors2.bc)), tc: rgbaToFloat(hexToRgba(myColors2.tc)) };
			expectedColors2 = {...myColors2};

			colorPicker4.value = colors.fc;
			colorPicker5.value = colors.bc;
			colorPicker6.value = colors.tc;
		}
		else
		{
			colorPicker4.value = myColors.fc;
			colorPicker5.value = myColors.bc;
			colorPicker6.value = myColors.tc;
			myColors2 = { ...myColors };
			myColorsFloat2 = { ...myColorsFloat };
			expectedColors2 = {...expectedColors};
		}

		colorPallet = false;
		menuThemeUpdate();
	});
	newDiv.addEventListener("mouseleave", (e) =>
	{
		if(forceSettingOpen) return;
		colorPallet = true;
		menuThemeUpdate();
		e.target.style.zIndex = 100;
		settings.style.display = "none";
		settings2.style.display = "none";


	});

	txt.spellcheck = false;
	txt.textContent = text;
	txt.className = 'text';
	document.body.appendChild(newDiv);
	newDiv.append(txt);
	txt.addEventListener("change", (e) =>
	{
		// console.log(e.target.parentNode.id)
		let data = JSON.parse(localStorage.getItem(e.target.parentNode.id));
		data.text = e.target.value;
		localStorage.setItem(e.target.parentNode.id, JSON.stringify(data));
	});

	allElements.push(newDiv);
}

function changeElementTheme()
{
	if(!settings.dataset.currentId) return;
	let el = document.getElementById(settings.dataset.currentId);
	el.dataset.colors = JSON.stringify(myColors2);
}

function recenter()
{

	expectedCameraState.x = canvas.width / 2;
	expectedCameraState.y = canvas.height / 2;
	expectedCameraState.zoom=0.3;
	update();

	menu.style.display = "none";
}

function deleteElement()
{
	document.body.appendChild(settings);
	localStorage.removeItem(settings.dataset.currentId);

	const index = allElements.indexOf(document.getElementById(settings.dataset.currentId));
	allElements.splice(index, 1);

	document.getElementById(settings.dataset.currentId).remove();

}
function moveElement(e)
{
	e.preventDefault();

	if (e.which !== 1) return;
	let el = document.getElementById(settings.dataset.currentId);

	const translationRegex = /translate\(([\d.-]+)px, ([\d.-]+)px\)/;
	const matches = el.style.transform.match(translationRegex);

	let xTranslation = parseFloat(matches[1]);
	let yTranslation = parseFloat(matches[2]);

	const deltaPos = { x: xTranslation - e.clientX, y: yTranslation - e.clientY };

	let newpos = { x: xTranslation, y: yTranslation };

	el.style.zIndex = 999;
	forceSettingOpen = true;
	function dragMove(e2)
	{
		e2.preventDefault();
		newpos.x = e2.clientX + deltaPos.x;
		newpos.y = e2.clientY + deltaPos.y;
		el.style.transform = `translate(${e2.clientX + deltaPos.x}px, ${e2.clientY + deltaPos.y}px)`;
		el.style.transform += ` scale(${cameraState.zoom})`;
	}

	function endDrag(e3)
	{
		
		e3.preventDefault();
		forceSettingOpen=false;
		el.style.zIndex = 100;
		document.removeEventListener('mousemove', dragMove);
		el.removeEventListener('mouseup', endDrag);

		// snap element pos

		newpos.x = Math.round((-cameraState.x + newpos.x) / cameraState.zoom / tileSize) * tileSize;
		newpos.y = Math.round((-cameraState.y + newpos.y) / cameraState.zoom / tileSize) * tileSize;

		el.dataset.posX = newpos.x;
		el.dataset.posY = newpos.y;

		let data = JSON.parse(localStorage.getItem(settings.dataset.currentId));
		data.posX = newpos.x;
		data.posY = newpos.y;

		localStorage.setItem(settings.dataset.currentId,JSON.stringify(data));

		repositionElement(el);
	}

	document.addEventListener('mousemove', dragMove);
	el.addEventListener('mouseup', endDrag);
}


function changeSizeElement(e)
{
	e.preventDefault();

	if (e.which !== 1) return;
	settings.style.display = "none";
	let el = document.getElementById(settings2.dataset.currentId);

	const translationRegex = /translate\(([\d.-]+)px, ([\d.-]+)px\)/;
	const matches = settings2.style.transform.match(translationRegex);
	

	let xTranslation = parseFloat(matches[1]);
	let yTranslation = parseFloat(matches[2]);

	const deltaPos = { x: xTranslation - e.clientX/cameraState.zoom, y: yTranslation - e.clientY/cameraState.zoom };

	const oldSizeY = (Number)(el.dataset.sizeY);
	let newsize = { x: 0, y: 0 };

	el.style.zIndex = 999;
	forceSettingOpen = true;
	function dragMove(e2)
	{
		e2.preventDefault();
		newsize.x = (e2.clientX/cameraState.zoom + deltaPos.x)/tileSize;
		newsize.y = (e2.clientY/cameraState.zoom + deltaPos.y)/tileSize+oldSizeY;
		
		el.dataset.sizeX = Math.max(3,newsize.x);
		el.dataset.sizeY = Math.max(3,newsize.y);

		settings2.style.transform = `translate(${(e2.clientX/cameraState.zoom + deltaPos.x)}px, ${-(Math.max(3,newsize.y) - newsize.y) * tileSize}px)`;

		resizeElement(el);
	}

	function endDrag(e3)
	{
		e3.preventDefault();
		forceSettingOpen=false;
		el.style.zIndex = 100;


		document.removeEventListener('mousemove', dragMove);
		el.removeEventListener('mouseup', endDrag);

		let data = JSON.parse(localStorage.getItem(settings2.dataset.currentId));
		data.sizeX = Math.round(Math.max(3,newsize.x));
		data.sizeY = Math.round(Math.max(3,newsize.y));

		el.dataset.sizeX =data.sizeX;
		el.dataset.sizeY = data.sizeY;
		localStorage.setItem(settings2.dataset.currentId,JSON.stringify(data));
		settings2.style.display = "none";
		resizeElement(el);
	}

	document.addEventListener('mousemove', dragMove);
	el.addEventListener('mouseup', endDrag);
}

function colorElement(){

	let toHide = settings.getElementsByClassName("clr-field");
	for(let i =0;i<toHide.length;i++)
	{
		toHide[i].style.display = "block"
		toHide[i].style.color = myColors2[Object.keys(myColors2)[i]];

	}

	let el = document.getElementsByClassName("c1");
	for (let i = 0; i < el.length; i++) {
		el[i].style.display = "none";
	}
}

function saveElementState(id)
{
	let dat = JSON.parse(localStorage.getItem(id));
	dat.colors = myColors2;
	localStorage.setItem(id,JSON.stringify(dat));
}