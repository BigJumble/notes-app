let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

let colorPicker = document.getElementById('colorPicker');
let colorPicker2 = document.getElementById('colorPicker2');
let colorPicker3 = document.getElementById('colorPicker3');

const styleSheet = document.styleSheets[0];

let menu = document.getElementById("menu");
let settings = document.getElementById("settings");
let settings2 = document.getElementById("settings2");

let themeColor = document.getElementById("themeColor");
let theme2Color = document.getElementById("theme2Color");

let expectedCameraState = { x: 0.0, y: 0.0, zoom: 1.0 };
let cameraState = { x: 0.0, y: 0.0, zoom: 1.0 };


let myColors = { fc: colorPicker.value, bc: colorPicker2.value, tc: colorPicker3.value };
let myColorsFloat = { fc: rgbToFloat(hexToRgb(myColors.fc)), bc: rgbToFloat(hexToRgb(myColors.bc)), tc: rgbToFloat(hexToRgb(myColors.tc)) };
let expectedColors;

let myColors2 = { ...myColors };
let myColorsFloat2 = { ...myColorsFloat };
let expectedColors2;

let cursorPosition = { x: 0, y: 0 };
let elementCount = 0;
let allElements = [];
const tileSize = 50;

let updating = false;
let updatingCol2 = false;


function update()
{
	expectedColors = { fc: colorPicker.value, bc: colorPicker2.value, tc: colorPicker3.value };
	expectedColors2 = { fc: colorPicker4.value, bc: colorPicker5.value, tc: colorPicker6.value };

	if (!(myColors2.bc === expectedColors2.bc &&
		myColors2.fc === expectedColors2.fc &&
		myColors2.tc === expectedColors2.tc)) {
		updatingCol2 = true;
	}

	// console.log(expectedColors2)
	if (updating) return;

	updating = true;
	lastTimestamp = performance.now();
	requestAnimationFrame(_smoothUpdate);
}

let lastTimestamp;
function _smoothUpdate(timestamp)
{

	const deltaTime = timestamp - lastTimestamp;

	//check if update finished
	if (
		cameraState.x === expectedCameraState.x &&
		cameraState.y === expectedCameraState.y &&
		cameraState.zoom === expectedCameraState.zoom &&
		myColors.bc === expectedColors.bc &&
		myColors.fc === expectedColors.fc &&
		myColors.tc === expectedColors.tc &&
		myColors2.bc === expectedColors2.bc &&
		myColors2.fc === expectedColors2.fc &&
		myColors2.tc === expectedColors2.tc
	) {
		localStorage.setItem("colors", JSON.stringify(expectedColors));
		localStorage.setItem("camera", JSON.stringify(cameraState));
		if(updatingCol2) saveElementState(settings.dataset.currentId);

		updating = false;
		updatingCol2 = false;
		return;
	}

	// lerp camera -----------

	const lerpFactor = 0.02 * deltaTime;

	const previousCamZoom = cameraState.zoom;

	cameraState.zoom = lerp(cameraState.zoom, expectedCameraState.zoom, lerpFactor * 1.3);
	const nowCamZoom = cameraState.zoom;

	const deltaZoom = nowCamZoom - previousCamZoom;

	const globalCursorCoors = {
		x: expectedCameraState.x - cursorPosition.x,
		y: expectedCameraState.y - cursorPosition.y,
	};

	expectedCameraState.x += globalCursorCoors.x / previousCamZoom * deltaZoom;
	expectedCameraState.y += globalCursorCoors.y / previousCamZoom * deltaZoom;

	cameraState.x += globalCursorCoors.x / previousCamZoom * deltaZoom;
	cameraState.y += globalCursorCoors.y / previousCamZoom * deltaZoom;

	cameraState.x = lerp(cameraState.x, expectedCameraState.x, lerpFactor);
	cameraState.y = lerp(cameraState.y, expectedCameraState.y, lerpFactor);

	myColors.fc = lerpColor(myColorsFloat.fc, expectedColors.fc, lerpFactor * 0.3, "fc");
	myColors.bc = lerpColor(myColorsFloat.bc, expectedColors.bc, lerpFactor * 0.3, "bc");
	myColors.tc = lerpColor(myColorsFloat.tc, expectedColors.tc, lerpFactor * 0.3, "tc");

	myColors2.fc = lerpColor(myColorsFloat2.fc, expectedColors2.fc, lerpFactor * 0.4, "fc", 2);
	myColors2.bc = lerpColor(myColorsFloat2.bc, expectedColors2.bc, lerpFactor * 0.4, "bc", 2);
	myColors2.tc = lerpColor(myColorsFloat2.tc, expectedColors2.tc, lerpFactor * 0.4, "tc", 2);

	if (Math.abs(cameraState.x - expectedCameraState.x) < 2) cameraState.x = expectedCameraState.x;
	if (Math.abs(cameraState.y - expectedCameraState.y) < 2) cameraState.y = expectedCameraState.y;
	if (Math.abs(cameraState.zoom - expectedCameraState.zoom) < 0.0005) cameraState.zoom = expectedCameraState.zoom;


	//draw here---------------
	if (updatingCol2) changeElementTheme();
	RedrawElements();
	drawGrid();
	//------------------------

	lastTimestamp = timestamp;
	requestAnimationFrame(_smoothUpdate);
}

function lerp(start, end, t)
{
	return start * (1 - t) + end * t;
}

function hexToRgb(hex)
{
	hex = hex.replace(/^#/, '');

	const bigint = parseInt(hex, 16);
	const r = (bigint >> 16) & 255;
	const g = (bigint >> 8) & 255;
	const b = bigint & 255;

	return { r, g, b };
}

function rgbToFloat(rgb)
{
	return { r: rgb.r / 255, g: rgb.g / 255, b: rgb.b / 255 };
}
function lerpColor(color1, color2, t, a, first = 1)
{
	const float1 = color1;
	const float2 = rgbToFloat(hexToRgb(color2));

	const lerped = {
		r: float1.r + t * (float2.r - float1.r),
		g: float1.g + t * (float2.g - float1.g),
		b: float1.b + t * (float2.b - float1.b),
	};

	const lerpedRgb = {
		r: Math.round(lerped.r * 255),
		g: Math.round(lerped.g * 255),
		b: Math.round(lerped.b * 255),
	};
	if (first === 1)
		myColorsFloat[a] = lerped;
	if (first === 2)
		myColorsFloat2[a] = lerped;

	const lerpedHex = `#${(1 << 24 | lerpedRgb.r << 16 | lerpedRgb.g << 8 | lerpedRgb.b).toString(16).slice(1)}`;

	return lerpedHex;
}
