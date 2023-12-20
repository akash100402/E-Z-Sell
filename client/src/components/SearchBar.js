import React, { Component } from 'react';

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: ''
    };
  }

  handleSearchInputChange = (event) => {
    this.setState({ searchTerm: event.target.value });
  };

  handleSearch = () => {
    // You can perform your search logic here, for example, make an API request.
    // In this example, we'll just log the search term to the console.
    console.log("Searching for: " + this.state.searchTerm);
  };

  render() {
    return (
      <div style={{ display: 'flex', width:'500px' }}>
        <input
            id='head-search'
          type="text"
          placeholder="Search Products here..."
          value={this.state.searchTerm}
          onChange={this.handleSearchInputChange}
          style={{ flex: 1 }} // Use flex to make the input take up all available space
        />
        <button id='head-search-button' onClick={this.handleSearch} style={{ marginLeft: '10px' }}><i class="ri-search-line"></i></button>
      </div>
    );
  }
}

export default SearchBar;
