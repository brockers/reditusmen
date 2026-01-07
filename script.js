const today = new Date();
// Enter Easter and calculate backwards 
// MUST BE IN MM/DD/YYYY format to account for timezone issues
const Easter = new Date('04/05/2026'); 
const year = Easter.getFullYear();
// Get our Easter date and set start to 90 days earlier
const start = new Date(Easter);
start.setDate(start.getDate() -90);
console.log("Start Date of Exodus 90 is: " + start.toDateString());
const jan1 = new Date(year, 0, 1);
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const dayNames = ["Sunday", "Monday", "Tueday", "Wednesday", "Thusday", "Friday", "Saturday"];
// Default everything to unchecked for all days
const results = {
	"sl" : false, "cs" : false, "ex" : false,
	"pc" : false, "tv" : false, "al" : false,
	"sn" : false, "mu" : false, "pu" : false,
	"fa" : false, "hh" : false, "mo" : false,
	"ne" : false, "re" : false, "ci" : false
};
// Setup our primary localstorage data structure
const ninetyDays = Array(90).fill(start.getTime()).map( (v,k) => {
	const newDay = new Date(v + (k * (60 * 60 * 24 * 1000)));
	const weekOfYear = getWeekOfYear(jan1, newDay);
	return {
		"date" : newDay.getTime(),
		"week" : "week" + weekOfYear,
		"results" : JSON.parse(JSON.stringify(results))
	}
});
// Default Configuration for all 90 days
const config = {
	"curIndex" : 0,
	"startDate" : start.getTime(),
	"days" : ninetyDays,
}

// Readings
const books = {
	"Matthew" : 28,
	"Mark" : 16,
	"Luke" : 24,
	"John" : 21
}
const readings = Object.entries(books).flatMap( (b) => {
	const chapters = [];
	for(var i = 1; i<=b[1]; i++){
		chapters.push(b[0] + " Chapter " + i);
	};
	return chapters;
});

// Storage
const DB = {
	"DBName" : year + "reditusmen",
	"saveConfig" : function(c){
		localStorage.setItem(this.DBName, JSON.stringify(c));
	},
	"loadConfig" : function(c){
		const saved = JSON.parse(localStorage.getItem(this.DBName));
		if(!saved){
			console.log("No existing saved values from localStorage... using defaults.");
		} else {
			Object.assign(c,saved);
			Object.keys(results).forEach( (k) => {
				if( ! c.days[0].results.hasOwnProperty(k) ) {
					console.log( "Key " + k + " is missing from config... adding.");
					c.days.forEach( d => { d.results[k] = false; });
				}
			});
			// Ealier bug means I need to reset any days in the future to false... even on saved data
			c.days.forEach( d => {
				if (d.date > today.getTime() ) {
					console.log( "Resetting future date " + d.date + " back to default." );
					d.results =JSON.parse(JSON.stringify(results));
				}
			});
		}
	}
}

// intialize our heatmap
const cal = new CalHeatmap();

// Need to know the week number for workout calculations
function getWeekOfYear(januaryFirst, currentDate) {
		const daysToNextMonday = (januaryFirst.getDay() === 1) ? 0 : (7 - januaryFirst.getDay()) % 7;
		const nextMonday = new Date(januaryFirst.getFullYear(), 0, januaryFirst.getDate() + daysToNextMonday);
		return (currentDate < nextMonday) ? 52 : (currentDate > nextMonday ? Math.ceil((currentDate - nextMonday) / (24 * 3600 * 1000) / 7) : 1);
}

function setResults(c){
	Object.entries(c.days[c.curIndex].results).forEach( ([n,v]) => {
		const element = document.getElementById(n);
		if(v){
			element.classList.add("checked");
		} else {
			element.classList.remove("checked");
		}
	});
	const displayDay = new Date(c.days[c.curIndex].date);
	const fa = document.getElementById("fa");
	if(displayDay.getDay() === 3 || displayDay.getDay() === 5){
		fa.style.display = "block";
	} else {
		fa.style.display = "none";
	}
	// Get weekly workout totals
	const workoutDays = c.days.filter( (obj) => { return obj.results.ex })
		.map( (v) => v.week )
		.reduce((acc, curr) => { acc[curr] = (acc[curr] || 0) +1; return acc;}, {});;
	const exTotal = workoutDays[c.days[c.curIndex].week] || "0";
	const ex = document.getElementById("exDays");
	// Set weekly workout totals
	ex.innerText = exTotal;
	if( exTotal < 3 ) {
		ex.classList.add("warning");
		ex.classList.remove("success");
	} else {
		ex.classList.add("success");
		ex.classList.remove("warning");
	}
	const re = document.getElementById("reading");
	re.innerText = readings[c.curIndex];
}

function getClosestToToday(c){
	const timeless = new Date( today.getFullYear(), today.getMonth(), today.getDate() );
	return getValidDateAndSetIndex(c, timeless.getTime());
}

function getValidDateAndSetIndex(conf, day){
	if (day <= conf.days[0].date) {
		conf.curIndex = 0;
	} else if (day >= conf.days[conf.days.length -1].date) {
		conf.curIndex = conf.days[conf.days.length -1];
	} else {
		conf.days.forEach( (val, ind) => {
			if (val.date === day || (val.date - 3600000) === day){
				conf.curIndex = ind;
			}
		});
	}
	DB.saveConfig(conf);
}

function setTitle(conf){
	// console.log(dayInd);
	const checklistInput = document.getElementById("checklistInput");
	const daycount = document.getElementById("daycount");
	const pageLogo = document.getElementById("pageLogo")

	if( checklistInput.classList.contains("inActive") ) {
		daycount.innerText = "Observance Report";
		pageLogo.src = "images/report.png";
	} else {
		daycount.innerText = "Day " + (conf.curIndex + 1) + " Checklist";
		pageLogo.src = "images/checklist.png";
	}
};

function setHeatMap(conf){

	const maxResults = Object.entries(results).length;
	const dataResults = conf.days.map( (d) => {
		var count = 0;
		Object.entries(d.results).forEach( (n,v) => {
			if( n[1] === true ) {
				// console.log(n[0]);
				// console.log(d);
				count++
			};
		});
		return { date: d.date, value: count };
	});
	// Draw our heatmap
	cal.paint({
		verticalOrientation: true,
		range: 4,
		domain: {
			type: 'month',
			padding: [10, 0, 0, 0],
			label: { position: 'top' }
		},
		subDomain: {
			type: 'xDay',
			radius: 2,
			width: 25,
			height: 25,
			label: 'D'
		},
		date: {start: start},
		highlight: [ new Date() ],
		theme: 'light',
		data: {
			source: dataResults,
			type: 'json',
			x: 'date',
			y: 'value',
			groupY: 'sum'
		},
		scale: {
			color: {
				type: 'linear',
				range: [ '#e8fff0', '#0b3b0b'],
				domain: [0, Object.keys(results).length]
			}
		},
	},[
		[
			Tooltip, {
				text: (d,v,djs) => {
					const total = () => {
						if (djs.day() === 0) { return maxResults - 2; }
						else if ((djs.day() === 3) || (djs.day() === 5)) { return maxResults; }
						else { return maxResults -1; }
					};
					return ( v + " of " + total() + " on " + djs.format('MMM D') );
				}
			}
		]
	]);
}

DB.loadConfig(config);
const listContainer = document.getElementById("list-container");

listContainer.addEventListener("click", (e) => {
	if( config.days[config.curIndex].results.hasOwnProperty(e.target.id) ){
		config.days[config.curIndex].results[e.target.id] = config.days[config.curIndex].results[e.target.id] ? false : true;
		DB.saveConfig(config);
		setResults(config);
	}
});

const reportToggle = document.getElementById("reportOn");
const calendarReport = document.getElementById("calendarReport");
const checklistInput = document.getElementById("checklistInput");
const ch_containers = document.getElementsByClassName("ch-container");

reportToggle.addEventListener("change", () => {
		setHeatMap(config);
		checklistInput.classList.toggle("inActive");
		calendarReport.classList.toggle("active");
		for( var i = 0; i < ch_containers.length; i++) {
			ch_containers[i].classList.toggle("inActive");
		}
		setTitle(config);
});

const flatpickr = document.getElementById("view-date").flatpickr({
	enableTime: false,
	dateFormat: "l M j, Y",
	minDate: ninetyDays[0].date,
	maxDate: ninetyDays[89].date,
	onChange: (date, dString, inst) => {
		getValidDateAndSetIndex(config, date[0].getTime());
		setTitle(config);
		setResults(config);
	},
});

const goToTodayBtn = document.getElementById("goToToday");
goToTodayBtn.addEventListener("click", (e) => {
	getClosestToToday(config);
	flatpickr.setDate(config.days[config.curIndex].date);
	// setDateForm(config);
	setTitle(config);
	setResults(config);
});

// Setup Initial Screen view
getClosestToToday(config);
flatpickr.setDate(today);
setTitle(config);
setResults(config);

