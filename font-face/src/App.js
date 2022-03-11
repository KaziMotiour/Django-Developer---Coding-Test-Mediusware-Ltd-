
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory,
  Redirect,
} from "react-router-dom";
import Login from './authentication/Login/Login'
import Singup from './authentication/Singup/singup'
import CreateProduct from './component/CreateProduct'
import UpdateProduct from './component/UpdateProduct'
import ProductList from './component/ProductList'
import TemporaryDrawer from './component/SideNavber'
import {AuthenticRoute, LogedInRoute} from './PrivateRoute'


function App() {


  return (
    <div className='App'>
      <Router>
        <Switch>
        
          <LogedInRoute exect path='/login' component={Login} exact/>
          <LogedInRoute exect path='/singup' component={Singup} exact/>

          <AuthenticRoute exect path='/updatePorduct/:id' component={UpdateProduct} exact/>
          <AuthenticRoute exect path='/createProduct' component={CreateProduct} exact/>
          <AuthenticRoute exect path='' exact component={ProductList}/>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
