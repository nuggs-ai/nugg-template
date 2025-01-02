import Counter from "@/nugg/Template";

const nuggConfig = require('../nugg.config.js');

console.log(nuggConfig);

function App() {
	return (
		<div>
			<h1>Template nugg</h1>
			<div id="nugg-wrapper">
				<Counter initialCount={0} />
			</div>
		</div>
	);
}

export default App;
