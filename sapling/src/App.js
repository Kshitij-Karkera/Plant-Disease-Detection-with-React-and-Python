import './App.css';
import Home from './Pages/Home';
import Details from './Pages/Details';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'

function App() {

  return (
	<Router>
		<div className="container">
			<div className="webname">
				<h1 className="Name"><Link to='/'>Sapling</Link></h1>
			</div>
			<span id="circle1"></span>		
				<div className="display">
					<Routes>
						<Route exact path='/' element={<Home />} />
						<Route exact path='/Details' element={<Details />} />
					</Routes>
				</div>
			<span id="circle2"></span>
		</div>
	</Router>
  )
}

export default App;
