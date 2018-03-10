import './index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import restaurants from  './Liste-restaurants_lafourchette';
var accents = require('remove-accents');
//import 'bootstrap/dist/css/bootstrap.min.css';

function IsOfferMichelin(props){
	const michelin_offer = props.value[0];
	if(michelin_offer && michelin_offer.description !== ""){
		 return <b>Offre(s) Michelin :</b>;
	}
	return null;
}

function IsOfferLaFourchette(props){
	const offerLafourchette = props.value[0];
	if(offerLafourchette && offerLafourchette.title !== ""){
		 return <b>Offre(s) La-Fourchette :</b>;
	}
	return null;
}

function OneStar(restaurant){
	const star=restaurant.stars;
	if(star==="1 etoile")
		return true;
	return false;
}

function TwoStars(restaurant){
	const star=restaurant.stars;
	if(star==="2 etoiles")
		return true;
	return false;
}

function ThreeStars(restaurant){
	const star=restaurant.stars;
	if(star==="3 etoiles")
		return true;
	return false;
}

function getRestaurantByStars(one,two,three){
	var tab= [];
	restaurants.map((restaurant)=>{
		var onestar=OneStar(restaurant);
		var twostar=TwoStars(restaurant);
		var threestar=ThreeStars(restaurant);
		if(one === true &&  onestar === true){
			tab.push(restaurant);
		}
		if(two === true &&  twostar === true){
			tab.push(restaurant);
		}
		if(three === true &&  threestar === true){
			tab.push(restaurant);
		}
	})
	if(tab.length<=null){
		tab=restaurants;
	}
	return tab;

}

class Checkbox extends React.Component {
  constructor(props) {
	    super(props);
	    this.state = {checked: false, checked2: false,checked3: false};
	    this.handleChange = this.handleChange.bind(this);
	    this.handleChange2 = this.handleChange2.bind(this);
	    this.handleChange3 = this.handleChange3.bind(this);
	    this.handleSubmit = this.handleSubmit.bind(this);
	  }  

	  handleChange(event) {
	    this.setState({
	        checked: !this.state.checked     
	    	})
		}

	  handleChange2(event) {
	    this.setState({
	        checked2: !this.state.checked2     
	    	})
		 }

	  handleChange3(event) {
	    this.setState({
	        checked3: !this.state.checked3    
	    	})
		 }
		handleSubmit(event){
			 ReactDOM.render(
			    <Restaurants value={getRestaurantByStars(this.state.checked,this.state.checked2,this.state.checked3)}/>,
				  document.getElementById('root')
				);
			 event.preventDefault();
		}
	  render() {
	    const togglecheck1 = !this.state.checked ? 'hidden-check1' : '';
	    const togglecheck2 = !this.state.checked2 ? 'hidden-check2' : '';
	    const togglecheck3 = !this.state.checked3 ? 'hidden-check3' : '';

	    return(
	    	<form onSubmit={this.handleSubmit}>
		        <div>
			        <label>1 Star</label>
			        <input type="checkbox" id="chk1"className="chk11" checked={ this.state.checked } onChange={ this.handleChange } />
			        <label>2 Stars</label>
			        <input type="checkbox" id="chk2" className="chk22" checked={ this.state.checked2 } onChange={ this.handleChange2 } />
			        <label>3 Stars</label>
			        <input type="checkbox" id="chk3" className="chk33" checked={ this.state.checked3 } onChange={ this.handleChange3 } />
	        		<input type="submit" value="Search" />
		      	</div>
	        </form>
	    );
	  }
}

function getRestaurantByName(name){
	var tab=[];
	restaurants.map((restaurant)=>{
		if(aContainsB(accents.remove(restaurant.title).toLowerCase(),accents.remove(name).toLowerCase()))
			tab.push(restaurant);
		return null;
	})
	return tab;
}

function aContainsB (a, b) {
    return a.indexOf(b) >= 0;
}
class DealLaFourchette extends React.Component{
	render() {
		return(
			<ul>{this.props.value.title}<br/>{this.props.value.description}</ul>
		)
	}	
}
class MichelinOffers extends React.Component{
	render() {
		return(
			<div>
				<ul>{this.props.value.description}<br/>{this.props.value.validity}</ul>
			</div>
		)
	}	
}

class Restaurantsaddress extends React.Component{
	render() {
		return(
			<div class="address">
				{this.props.value.street_block}<br/>
				{this.props.value.postal_code}<br/>
				{this.props.value.locality}
			</div>
		)
	}
}

class SearchBar extends React.Component {
	constructor(props) {
	  	super(props);

	    this.state = {value: ''};
	    this.handleChange = this.handleChange.bind(this);
	  }

	handleChange(event) {
	    this.setState({value: event.target.value});
	    ReactDOM.render(
		  <Restaurants value={getRestaurantByName(this.state.value)}/>,
		  document.getElementById('root')
		);

 	}
  render(){
  	return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Restaurant name : 
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        
      </form>
    );
  }
}

class Restaurants extends React.Component{
	render() {
		return(
			<div>
				<h1>Restaurants Etoilés - Promos Michelin - Promos La Fourchette</h1>
				<Checkbox/>
				<SearchBar/>
				{this.props.value.map((restaurant)=>{
					return <Restaurant value ={restaurant}/>
					})
				}
			</div>
		)
	}
}

class Restaurant extends React.Component {
	render() {
		return (
			<div class="infos">
				<h2>{this.props.value.title}</h2>
				<div>
					<b>Type de cuisine :</b> {this.props.value.cuisine}<br/>
					<b>Prix :</b> {this.props.value.price}<br/>
					<b>Nombre d'étoiles :</b> {this.props.value.stars}<br/>
					<b>Nom du chef :</b> {this.props.value.chief_name}<br/>
					<div class="divmichelin"> 
						<IsOfferMichelin value={this.props.value.offers}/>
						{this.props.value.offers.map((offer)=>{
							return <MichelinOffers value={offer}/> 
						})
					}
					</div>
					<div class="dealfourchette">
							<IsOfferLaFourchette value={this.props.value.deals_lafourchette}/>
							{this.props.value.deals_lafourchette.map((deal)=>{
								return <DealLaFourchette value ={deal}/>
							})
						}
					</div>
					<div class="address" >
						<b>Adresse :</b>
							<Restaurantsaddress value = {this.props.value.address}/><br/>		
					</div>
				</div>
			</div>
		)
	}
}

ReactDOM.render(
  <Restaurants value={restaurants}/>,
  document.getElementById('root')
);