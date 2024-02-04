let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

let colorPicker = document.getElementById('colorPicker');
let colorPicker2 = document.getElementById('colorPicker2');
let colorPicker3 = document.getElementById('colorPicker3');

const styleSheet = document.styleSheets[1];

let menu = document.getElementById("menu");
let settings = document.getElementById("settings");
let settings2 = document.getElementById("settings2");

let themeColor = document.getElementById("themeColor");
let theme2Color = document.getElementById("theme2Color");

let expectedCameraState = { x: 0.0, y: 0.0, zoom: 1.0 };
let cameraState = { x: 0.0, y: 0.0, zoom: 1.0 };


let myColors = { fc: colorPicker.value, bc: colorPicker2.value, tc: colorPicker3.value };
let myColorsFloat = { fc: rgbaToFloat(hexToRgba(myColors.fc)), bc: rgbaToFloat(hexToRgba(myColors.bc)), tc: rgbaToFloat(hexToRgba(myColors.tc)) };
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
	// console.log(expectedColors)
	if (!(myColors2.bc.includes( expectedColors2.bc) &&
		myColors2.fc.includes( expectedColors2.fc) &&
		myColors2.tc.includes( expectedColors2.tc))) {
		updatingCol2 = true;
	}

	// console.log(colorPicker.value)
	// colorPicker.value = "#ffffffff"
	if (updating) return;

	updating = true;
	lastTimestamp = performance.now();
	requestAnimationFrame(_smoothUpdate);
}

let lastTimestamp;
function _smoothUpdate(timestamp)
{

	const deltaTime = timestamp - lastTimestamp;
	// console.log(myColors,expectedColors)
	//check if update finished
	if (
		cameraState.x === expectedCameraState.x &&
		cameraState.y === expectedCameraState.y &&
		cameraState.zoom === expectedCameraState.zoom &&
		myColors.bc.includes( expectedColors.bc) &&
		myColors.fc.includes( expectedColors.fc) &&
		myColors.tc.includes( expectedColors.tc) &&
		myColors2.bc.includes( expectedColors2.bc) &&
		myColors2.fc.includes( expectedColors2.fc) &&
		myColors2.tc.includes( expectedColors2.tc)
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

	myColors.fc = lerpColor(myColorsFloat.fc, rgbaToFloat(hexToRgba(expectedColors.fc)), lerpFactor * 0.3, "fc");
	myColors.bc = lerpColor(myColorsFloat.bc, rgbaToFloat(hexToRgba(expectedColors.bc)), lerpFactor * 0.3, "bc");
	myColors.tc = lerpColor(myColorsFloat.tc, rgbaToFloat(hexToRgba(expectedColors.tc)), lerpFactor * 0.3, "tc");

	myColors2.fc = lerpColor(myColorsFloat2.fc, rgbaToFloat(hexToRgba(expectedColors2.fc)), lerpFactor * 0.4, "fc", 2);
	myColors2.bc = lerpColor(myColorsFloat2.bc, rgbaToFloat(hexToRgba(expectedColors2.bc)), lerpFactor * 0.4, "bc", 2);
	myColors2.tc = lerpColor(myColorsFloat2.tc, rgbaToFloat(hexToRgba(expectedColors2.tc)), lerpFactor * 0.4, "tc", 2);

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

function hexToRgba(hex) {
    hex = hex.replace(/^#/, '');

    let bigint = parseInt(hex, 16);
    if (hex.length === 8) {
		let r = (bigint >> 24) & 255;
		let g = (bigint >> 16) & 255;
		let b = (bigint >> 8) & 255;
		let a = (bigint & 255) / 255;
		return { r, g, b, a };
    }
	else
	{
		let r = (bigint >> 16) & 255;
		let g = (bigint >> 8) & 255;
		let b = bigint & 255;
		let a = 1;
		return { r, g, b, a };
	}

    
}
function rgbaToFloat(rgba) {
    return { r: rgba.r / 255, g: rgba.g / 255, b: rgba.b / 255, a: rgba.a };
}

function lerpColor(color1, color2, t, a, first = 1) {
    const float1 = color1;
    const float2 = color2;

    const lerped = {
        r: float1.r + t * (float2.r - float1.r),
        g: float1.g + t * (float2.g - float1.g),
        b: float1.b + t * (float2.b - float1.b),
        a: float1.a + t * (float2.a - float1.a),
    };

    const lerpedRgb = {
        r: Math.round(lerped.r * 255),
        g: Math.round(lerped.g * 255),
        b: Math.round(lerped.b * 255),
        a: lerped.a,
    };

    if (first === 1)
        myColorsFloat[a] = lerped;
    if (first === 2)
        myColorsFloat2[a] = lerped;

    const lerpedHex = rgbaToHex(lerpedRgb);// `rgba(${lerpedRgb.r}, ${lerpedRgb.g}, ${lerpedRgb.b}, ${lerpedRgb.a})`;

    return lerpedHex;
}

function rgbaToHex(rgba) {
    // Ensure the rgba values are within the valid range (0-255)
    const clamp = (value) => Math.round(Math.min(255, Math.max(0, value)));

    // Extract the individual RGBA components
    const r = clamp(rgba.r);
    const g = clamp(rgba.g);
    const b = clamp(rgba.b);
    const a = Math.round(rgba.a * 255); // Alpha channel needs to be in the range 0-255

    // Convert each component to its hex representation
    const componentToHex = (c) => {
        const hex = c.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };

    // Combine components into the hex color string
    const hex = `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}${componentToHex(a)}`;

    return hex;
}