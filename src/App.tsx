import Counter from "@/nugg/Template";

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
